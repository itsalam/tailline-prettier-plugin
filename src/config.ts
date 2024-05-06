import clearModule from "clear-module";
import escalade from "escalade/sync";
import * as fs from "fs/promises";
import { createRequire } from "module";
import path from "path";
import postcss from "postcss";
import postcssImport from "postcss-import";
import prettier from "prettier";
import { __unstable__loadDesignSystem } from "tailwindcss";
import { pathToFileURL } from "url";
import { DesignSystem } from "./types.js";

export const CLASS_NAME_ATTRS = ["className", "class"];
export const CALL_EXPRESSIONS = ["cn", "clsx", "twMerge"];

let localRequire = createRequire(import.meta.url);

let sourceToPathMap = new Map();
let sourceToEntryMap = new Map();
let pathToContextMap = new Map();
const cache = new Map();

async function getPrettierConfigPath(options) {
  if (cache.has(options.configPath)) {
    return cache.get(options.configPath);
  }
  cache.set(
    options.configPath,
    await prettier.resolveConfigFile(options.filepath)
  );
  return cache.get(options.configPath);
}

async function getBaseDir(options) {
  let prettierConfigPath = await getPrettierConfigPath(options);

  return prettierConfigPath
    ? path.dirname(prettierConfigPath)
    : options.filepath
      ? path.dirname(options.filepath)
      : process.cwd();
}

export async function getTailwindConfig(options) {
  let key = `${options.filepath}`;
  let prettierConfigPath = await getPrettierConfigPath(options);
  let baseDir = await getBaseDir(options);

  let twPkgPath = sourceToPathMap.get(key);
  if (twPkgPath === undefined) {
    twPkgPath = await getConfigPath(options, baseDir);
    sourceToPathMap.set(key, twPkgPath);
  }

  let entryPoint = sourceToEntryMap.get(key);
  if (entryPoint === undefined) {
    entryPoint = getConfigFile(options, baseDir, "tailwindEntryPoint");
    sourceToEntryMap.set(key, entryPoint);
  }

  let contextKey = `${twPkgPath}:${entryPoint}`;
  let existing = pathToContextMap.get(contextKey) as DesignSystem;
  if (existing) {
    return existing;
  }

  // By this point we know we need to load the Tailwind config file
  let result = await loadTailwindConfig(baseDir, twPkgPath, entryPoint);

  pathToContextMap.set(contextKey, result);
  return result;
}

function getConfigFile(options, dir, optionsKey) {
  if (options[optionsKey]) {
    return path.resolve(dir, options[optionsKey]);
  }
  return null;
}

async function getConfigPath(options, baseDir) {
  let configPath = getConfigFile(options, baseDir, "tailwindConfig");
  if (configPath) return configPath;
  try {
    const extensions = ["js", "cjs", "mjs", "ts"];
    configPath =
      // @ts-ignore
      (await escalade(baseDir, (_dir, names) => {
        for (let ext of extensions) {
          const fileName = `tailwind.config.${ext}`;
          if (names.includes(fileName)) {
            return fileName; // Return the matching file name to escalade
          }
        }
      })) || null;
  } catch {}
  if (configPath) {
    return configPath;
  }

  return null;
}

async function loadTailwindConfig(
  baseDir,
  tailwindConfigPath,
  entryPoint
): Promise<DesignSystem> {
  let createContext;
  let generateRules;
  let resolveConfig;
  let loadConfig;
  let tailwindConfig = {};

  const getModulePath = (pathStr) =>
    path.dirname(
      localRequire.resolve(pathStr, {
        paths: [baseDir],
      })
    );

  let tw4 = await loadTWV4(
    baseDir,
    getModulePath("tailwindcss/package.json"),
    entryPoint
  );

  if (tw4) {
    return tw4;
  }
  // Load v3
  try {
    resolveConfig = (
      await import(
        path.join(
          getModulePath("tailwindcss/resolveConfig.js"),
          "resolveConfig.js"
        )
      )
    ).default;
    ({ createContext } = (
      await import(
        path.join(getModulePath("tailwindcss"), "lib", "setupContextUtils.js")
      )
    ).default);
    ({ generateRules } = (
      await import(
        path.join(getModulePath("tailwindcss"), "lib", "generateRules.js")
      )
    ).default);

    loadConfig = (
      await import(
        path.join(getModulePath("tailwindcss/loadConfig"), "loadConfig.js")
      )
    ).default;
  } catch {}
  if (tailwindConfigPath) {
    clearModule(tailwindConfigPath);
    const loadedConfig = loadConfig(tailwindConfigPath);
    tailwindConfig = loadedConfig.default ?? loadedConfig;
  }
  // @ts-ignore
  tailwindConfig.content = ["no-op"];
  const parseCandidate = (candidate) => {
    return createContext(resolveConfig(tailwindConfig)).parseCandidate(
      candidate
    );
  };
  let context = {
    ...createContext(resolveConfig(tailwindConfig)),
    generateRules,
  };
  return context as DesignSystem;
}

async function loadTWV4(baseDir, pkgDir, entryPoint) {
  // Import Tailwind — if this is v4 it'll have APIs we can use directly
  let pkgPath = localRequire.resolve("tailwindcss", {
    paths: [baseDir],
  });
  let tw = await import(pathToFileURL(pkgPath).toString());

  // This is not Tailwind v4
  if (!tw.__unstable__loadDesignSystem) {
    return null;
  }

  // If the user doesn't define an entrypoint then we use the default theme
  entryPoint = entryPoint ?? `${pkgDir}/theme.css`;

  // Resolve imports in the entrypoint to a flat CSS tree
  let css = await fs.readFile(entryPoint, "utf-8");
  let resolveImports = postcss([postcssImport()]);
  let result = await resolveImports.process(css, { from: entryPoint });

  // Load the design system and set up a compatible context object that is
  // usable by the rest of the plugin
  let design = tw.__unstable__loadDesignSystem(result.css) as ReturnType<
    typeof __unstable__loadDesignSystem
  >;
  return design;
}
