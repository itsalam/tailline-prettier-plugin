import {parsers as $hgUW1$parsers} from "prettier/plugins/babel";
import {parsers as $hgUW1$parsers1} from "prettier/plugins/typescript";
import {cwd as $hgUW1$cwd} from "process";
import {readFile as $hgUW1$readFile} from "fs/promises";
import {createRequire as $hgUW1$createRequire} from "module";
import $hgUW1$path from "path";
import $hgUW1$postcss from "postcss";
import $hgUW1$postcssimport from "postcss-import";
import $hgUW1$prettier, {doc as $hgUW1$doc} from "prettier";
import {pathToFileURL as $hgUW1$pathToFileURL} from "url";
import $hgUW1$escaladesync from "escalade/sync";












const $c04235eee8e32194$export$bf7b0db2bf556aba = [
    "className",
    "class"
];
const $c04235eee8e32194$export$cf2d192d3dce4edd = [
    "cn",
    "clsx",
    "twMerge"
];
let $c04235eee8e32194$var$localRequire = (0, $hgUW1$createRequire)("file:///src/config.ts");
let $c04235eee8e32194$var$sourceToPathMap = new Map();
let $c04235eee8e32194$var$sourceToEntryMap = new Map();
let $c04235eee8e32194$var$pathToContextMap = new Map();
const $c04235eee8e32194$var$cache = new Map();
async function $c04235eee8e32194$var$getPrettierConfigPath(options) {
    if ($c04235eee8e32194$var$cache.has(options.configPath)) return $c04235eee8e32194$var$cache.get(options.configPath);
    $c04235eee8e32194$var$cache.set(options.configPath, await (0, $hgUW1$prettier).resolveConfigFile(options.filepath));
    return $c04235eee8e32194$var$cache.get(options.configPath);
}
async function $c04235eee8e32194$var$getBaseDir(options) {
    let prettierConfigPath = await $c04235eee8e32194$var$getPrettierConfigPath(options);
    return prettierConfigPath ? (0, $hgUW1$path).dirname(prettierConfigPath) : options.filepath ? (0, $hgUW1$path).dirname(options.filepath) : $hgUW1$cwd();
}
async function $c04235eee8e32194$export$4b486f1846f78ca9(options) {
    let key = `${options.filepath}`;
    let prettierConfigPath = await $c04235eee8e32194$var$getPrettierConfigPath(options);
    let baseDir = await $c04235eee8e32194$var$getBaseDir(options);
    let configPath = $c04235eee8e32194$var$sourceToPathMap.get(key);
    if (configPath === undefined) {
        configPath = await $c04235eee8e32194$var$getConfigPath(options, baseDir);
        $c04235eee8e32194$var$sourceToPathMap.set(key, configPath);
    }
    let entryPoint = $c04235eee8e32194$var$sourceToEntryMap.get(key);
    if (entryPoint === undefined) {
        entryPoint = $c04235eee8e32194$var$getConfigFile(options, baseDir, "tailwindEntryPoint");
        $c04235eee8e32194$var$sourceToEntryMap.set(key, entryPoint);
    }
    let contextKey = `${configPath}:${entryPoint}`;
    let existing = $c04235eee8e32194$var$pathToContextMap.get(contextKey);
    if (existing) return existing;
    // By this point we know we need to load the Tailwind config file
    let result = await $c04235eee8e32194$var$loadTailwindConfig(baseDir, configPath, entryPoint);
    $c04235eee8e32194$var$pathToContextMap.set(contextKey, result);
    return result;
}
function $c04235eee8e32194$var$getConfigFile(options, dir, optionsKey) {
    if (options[optionsKey]) return (0, $hgUW1$path).resolve(dir, options[optionsKey]);
    return null;
}
async function $c04235eee8e32194$var$getConfigPath(options, baseDir) {
    let configPath = $c04235eee8e32194$var$getConfigFile(options, baseDir, "tailwindConfig");
    if (configPath) return configPath;
    try {
        const extensions = [
            "js",
            "cjs",
            "mjs",
            "ts"
        ];
        configPath = // @ts-ignore
        await (0, $hgUW1$escaladesync)(baseDir, (_dir, names)=>{
            for (let ext of extensions){
                const fileName = `tailwind.config.${ext}`;
                if (names.includes(fileName)) return fileName; // Return the matching file name to escalade
            }
        }) || null;
    } catch  {}
    if (configPath) return configPath;
    return null;
}
async function $c04235eee8e32194$var$loadTailwindConfig(baseDir, tailwindConfigPath, entryPoint) {
    let pkgFile = $c04235eee8e32194$var$localRequire.resolve("tailwindcss/package.json", {
        paths: [
            baseDir
        ]
    });
    let pkgDir = (0, $hgUW1$path).dirname(pkgFile);
    return await $c04235eee8e32194$var$loadTWV4(baseDir, pkgDir, entryPoint);
}
async function $c04235eee8e32194$var$loadTWV4(baseDir, pkgDir, entryPoint) {
    // Import Tailwind — if this is v4 it'll have APIs we can use directly
    let pkgPath = $c04235eee8e32194$var$localRequire.resolve("tailwindcss", {
        paths: [
            baseDir
        ]
    });
    let tw = await import((0, $hgUW1$pathToFileURL)(pkgPath).toString());
    // This is not Tailwind v4
    if (!tw.__unstable__loadDesignSystem) return null;
    // If the user doesn't define an entrypoint then we use the default theme
    entryPoint = entryPoint ?? `${pkgDir}/theme.css`;
    // Resolve imports in the entrypoint to a flat CSS tree
    let css = await $hgUW1$readFile(entryPoint, "utf-8");
    let resolveImports = (0, $hgUW1$postcss)([
        (0, $hgUW1$postcssimport)()
    ]);
    let result = await resolveImports.process(css, {
        from: entryPoint
    });
    // Load the design system and set up a compatible context object that is
    // usable by the rest of the plugin
    let design = tw.__unstable__loadDesignSystem(result.css);
    return {
        context: {
            ...design
        },
        // Stubs that are not needed for v4
        generateRules: ()=>[]
    };
}




const $b8f2d36a1029902d$export$3dbe52a81e8fac82 = {
    basicStyles: [
        "container-type",
        "pointer-events",
        "visibility",
        "position"
    ],
    positioning: [
        "inset",
        "inset-inline",
        "inset-block",
        "inset-inline-start",
        "inset-inline-end",
        "top",
        "right",
        "bottom",
        "left"
    ],
    layoutControl: [
        "isolation",
        "z-index",
        "order",
        "grid-column",
        "grid-column-start",
        "grid-column-end",
        "grid-row",
        "grid-row-start",
        "grid-row-end",
        "float",
        "clear"
    ],
    marginPadding: [
        "margin",
        "margin-inline",
        "margin-block",
        "margin-inline-start",
        "margin-inline-end",
        "margin-top",
        "margin-right",
        "margin-bottom",
        "margin-left"
    ],
    sizing: [
        "box-sizing",
        "display",
        "aspect-ratio",
        "height",
        "max-height",
        "min-height",
        "width",
        "max-width",
        "min-width"
    ],
    flexboxGrid: [
        "flex",
        "flex-shrink",
        "flex-grow",
        "flex-basis",
        "table-layout",
        "caption-side",
        "border-collapse"
    ],
    spacing: [
        "border-spacing"
    ],
    transforms: [
        "transform-origin",
        "translate",
        "--tw-translate-x",
        "--tw-translate-y",
        "scale",
        "--tw-scale-x",
        "--tw-scale-y",
        "--tw-scale-z",
        "rotate",
        "--tw-rotate-x",
        "--tw-rotate-y",
        "--tw-rotate-z",
        "--tw-skew-x",
        "--tw-skew-y",
        "transform"
    ],
    interactions: [
        "animation",
        "cursor",
        "touch-action",
        "--tw-pan-x",
        "--tw-pan-y",
        "--tw-pinch-zoom",
        "resize"
    ],
    scrollSnap: [
        "scroll-snap-type",
        "--tw-scroll-snap-strictness",
        "scroll-snap-align",
        "scroll-snap-stop",
        "scroll-margin",
        "scroll-margin-inline-start",
        "scroll-margin-inline-end",
        "scroll-margin-top",
        "scroll-margin-right",
        "scroll-margin-bottom",
        "scroll-margin-left",
        "scroll-padding",
        "scroll-padding-inline-start",
        "scroll-padding-inline-end",
        "scroll-padding-top",
        "scroll-padding-right",
        "scroll-padding-bottom",
        "scroll-padding-left"
    ],
    listStyles: [
        "list-style-position",
        "list-style-type",
        "list-style-image"
    ],
    appearanceControl: [
        "appearance",
        "columns",
        "break-before",
        "break-inside",
        "break-after",
        "grid-auto-columns",
        "grid-auto-flow",
        "grid-auto-rows",
        "grid-template-columns",
        "grid-template-rows",
        "flex-direction",
        "flex-wrap",
        "place-content",
        "place-items",
        "align-content",
        "align-items",
        "justify-content",
        "justify-items",
        "gap",
        "column-gap",
        "row-gap",
        "--tw-space-x-reverse",
        "--tw-space-y-reverse",
        "divide-x-width",
        "divide-y-width",
        "--tw-divide-y-reverse",
        "divide-style",
        "divide-color",
        "--tw-divide-opacity",
        "place-self",
        "align-self",
        "justify-self"
    ],
    overflowControl: [
        "overflow",
        "overflow-x",
        "overflow-y",
        "overscroll-behavior",
        "overscroll-behavior-x",
        "overscroll-behavior-y",
        "scroll-behavior"
    ],
    textWrapping: [
        "text-overflow",
        "hyphens",
        "white-space",
        "text-wrap",
        "overflow-wrap",
        "work-break"
    ],
    border: [
        "border-radius",
        "border-start-radius",
        "border-end-radius",
        "border-top-radius",
        "border-right-radius",
        "border-bottom-radius",
        "border-left-radius",
        "border-start-start-radius",
        "border-start-end-radius",
        "border-end-end-radius",
        "border-end-start-radius",
        "border-top-left-radius",
        "border-top-right-radius",
        "border-bottom-right-radius",
        "border-bottom-left-radius",
        "border-width",
        "border-inline-width",
        "border-inline-start-width",
        "border-inline-end-width",
        "border-top-width",
        "border-right-width",
        "border-bottom-width",
        "border-left-width",
        "border-style",
        "border-color",
        "border-x-color",
        "border-y-color",
        "border-inline-start-color",
        "border-inline-end-color",
        "border-top-color",
        "border-right-color",
        "border-bottom-color",
        "border-left-color",
        "--tw-border-opacity"
    ],
    background: [
        "background-color",
        "--tw-bg-opacity",
        "background-image",
        "--tw-gradient-stops",
        "--tw-gradient-via-stops",
        "--tw-gradient-from",
        "--tw-gradient-from-position",
        "--tw-gradient-via",
        "--tw-gradient-via-position",
        "--tw-gradient-to",
        "--tw-gradient-to-position",
        "box-decoration-break",
        "background-size",
        "background-attachment",
        "background-clip",
        "background-position",
        "background-repeat",
        "background-origin"
    ],
    svg: [
        "fill",
        "stroke",
        "stroke-width"
    ],
    object: [
        "object-fit",
        "object-position"
    ],
    padding: [
        "padding",
        "padding-inline",
        "padding-block",
        "padding-inline-start",
        "padding-inline-end",
        "padding-top",
        "padding-right",
        "padding-bottom",
        "padding-left"
    ],
    textStyles: [
        "text-align",
        "text-indent",
        "vertical-align",
        "font-family",
        "font-size",
        "font-weight",
        "text-transform",
        "font-style",
        "font-stretch",
        "font-variant-numeric",
        "line-height",
        "letter-spacing",
        "color",
        "--tw-text-opacity",
        "text-decoration-line",
        "text-decoration-color",
        "text-decoration-style",
        "text-decoration-thickness",
        "text-underline-offset",
        "-webkit-font-smoothing"
    ],
    colorControl: [
        "placeholder-color",
        "--tw-placeholder-opacity",
        "caret-color",
        "accent-color",
        "opacity",
        "background-blend-mode",
        "mix-blend-mode"
    ],
    shadowFilterEffects: [
        "box-shadow",
        "--tw-shadow",
        "--tw-shadow-color",
        "--tw-ring-shadow",
        "--tw-ring-color",
        "--tw-inset-shadow",
        "--tw-inset-shadow-color",
        "--tw-inset-ring-shadow",
        "--tw-inset-ring-color",
        "--tw-ring-opacity",
        "--tw-ring-offset-width",
        "--tw-ring-offset-color",
        "outline",
        "outline-width",
        "outline-offset",
        "outline-color",
        "--tw-blur",
        "--tw-brightness",
        "--tw-contrast",
        "--tw-drop-shadow",
        "--tw-grayscale",
        "--tw-hue-rotate",
        "--tw-invert",
        "--tw-saturate",
        "--tw-sepia",
        "filter",
        "--tw-backdrop-blur",
        "--tw-backdrop-brightness",
        "--tw-backdrop-contrast",
        "--tw-backdrop-grayscale",
        "--tw-backdrop-hue-rotate",
        "--tw-backdrop-invert",
        "--tw-backdrop-opacity",
        "--tw-backdrop-saturate",
        "--tw-backdrop-sepia",
        "backdrop-filter"
    ],
    transitionsAnimations: [
        "transition-property",
        "transition-delay",
        "transition-duration",
        "transition-timing-function",
        "will-change",
        "contain",
        "content",
        "forced-color-adjust"
    ]
};
const $b8f2d36a1029902d$export$7ea734391ad49fb9 = Object.keys($b8f2d36a1029902d$export$3dbe52a81e8fac82).length + 1;
const $b8f2d36a1029902d$export$3a641a98fa46c2c7 = Object.keys($b8f2d36a1029902d$export$3dbe52a81e8fac82).length + 2;
const $b8f2d36a1029902d$export$1ea4961ea548e84b = [
    ...Object.values($b8f2d36a1029902d$export$3dbe52a81e8fac82).flatMap((prop)=>prop)
];
function $b8f2d36a1029902d$export$791ceaddea9b1699(cssProperty) {
    const entries = Object.entries($b8f2d36a1029902d$export$3dbe52a81e8fac82);
    for(let i = 0; i < entries.length; i++){
        const [label, properties] = entries[i];
        let subIndex = properties.indexOf(cssProperty);
        if (subIndex !== -1) return {
            label: label,
            subIndex: subIndex,
            globalRank: i
        };
    }
    return null; // Return null if the property is not found
}



class $fab42eb3dee39b5b$export$674cd7dcb504ac5c extends Map {
    constructor(factory){
        super();
        this.factory = factory;
    }
    get(key) {
        let value = super.get(key);
        if (value === undefined) {
            value = this.factory(key, this);
            this.set(key, value);
        }
        return value;
    }
}
const $fab42eb3dee39b5b$export$e29dae36795cf20c = (node)=>node?.type === "StringLiteral" || node?.type === "Literal" && typeof node?.value === "string";
function $fab42eb3dee39b5b$export$fa5236c3db7a4267(path) {
    return (0, $c04235eee8e32194$export$bf7b0db2bf556aba).includes(path.stack.find((p)=>p.type?.includes("JSXAttribute"))?.name?.name);
}
function $fab42eb3dee39b5b$export$8a4495ad806209c3(path) {
    return path.getNode().type === "JSXAttribute" && (0, $c04235eee8e32194$export$bf7b0db2bf556aba).includes(path.getNode().name.name) && path.getNode().value.type === "Literal";
}
function $fab42eb3dee39b5b$export$282ea9732602798d(path) {
    const parent = path.parent;
    return parent.type === "CallExpression" && "name" in parent.callee && (0, $c04235eee8e32194$export$cf2d192d3dce4edd).includes(parent.callee.name);
}


const { line: $0d389cc1cd7b46e7$var$line, hardline: $0d389cc1cd7b46e7$var$hardline, join: $0d389cc1cd7b46e7$var$join, group: $0d389cc1cd7b46e7$var$group, indent: $0d389cc1cd7b46e7$var$indent, lineSuffix: $0d389cc1cd7b46e7$var$lineSuffix, fill: $0d389cc1cd7b46e7$var$fill, ifBreak: $0d389cc1cd7b46e7$var$ifBreak, trim: $0d389cc1cd7b46e7$var$trim } = (0, $hgUW1$doc).builders;
function $0d389cc1cd7b46e7$export$7064067edd44ffd2(node, { env: env, delimiter: delimiter = " + ", quoteChar: quoteChar }, mapFunc) {
    const classStr = mapFunc ? mapFunc(node) : node.value;
    quoteChar = quoteChar ?? env.options.singleQuote ? `'` : `"`;
    if (typeof classStr !== "string" || classStr === "") return classStr;
    // Ignore class attributes containing `{{`, to match Prettier behaviour:
    // https://github.com/prettier/prettier/blob/main/src/language-html/embed.js#L83-L88
    if (classStr.includes("{{")) return classStr;
    let result = ``;
    let parts = classStr.split(/([\t\r\f\n ]+)/);
    let classes = parts.filter((_, i)=>i % 2 === 0).filter(Boolean);
    if (classes[classes.length - 1] === "") classes.pop();
    const needsLineBreak = Math.max((node.range?.[1] ?? 0) - (node.range?.[0] ?? 0), node.loc?.end.column || 0) > env.options.printWidth;
    if (needsLineBreak) result = $0d389cc1cd7b46e7$var$createMultilineClassString(classes, {
        env: env,
        delimiter: delimiter,
        quoteChar: quoteChar
    });
    else result = $0d389cc1cd7b46e7$var$group([
        `${quoteChar}`,
        $0d389cc1cd7b46e7$var$join(" ", [
            ...Object.values($0d389cc1cd7b46e7$export$eb57be04034bcf31(classes, {
                env: env
            }))
        ].flatMap((c)=>c)),
        `${quoteChar}`
    ], {
        shouldBreak: true
    });
    return result;
}
const $0d389cc1cd7b46e7$var$createMultilineClassString = (classes, { env: env, delimiter: delimiter = " + ", quoteChar: quoteChar })=>{
    const sortedClasses = [
        ...Object.entries($0d389cc1cd7b46e7$export$eb57be04034bcf31(classes, {
            env: env
        }))
    ];
    let result = [];
    const currClassNames = [
        ...sortedClasses[0][1]
    ];
    const currGroups = [
        sortedClasses[0][0]
    ].filter(Boolean);
    const commentStr = (currGroups)=>$0d389cc1cd7b46e7$var$lineSuffix(` // ${currGroups.filter(Boolean).join(", ")}`);
    for(let i = 1; i < sortedClasses.length; i++){
        const groupClassNames = sortedClasses[i][1];
        while($0d389cc1cd7b46e7$var$indent([
            ...currClassNames,
            ...groupClassNames,
            commentStr(currGroups).contents.toString(),
            sortedClasses[i][0]
        ].join(" ")).contents.toString().length > env.options.printWidth || result.length === 0){
            currGroups.length && result.push(commentStr(currGroups));
            result.push(quoteChar, $0d389cc1cd7b46e7$var$fill($0d389cc1cd7b46e7$var$join($0d389cc1cd7b46e7$var$ifBreak([
                $0d389cc1cd7b46e7$var$trim,
                `${quoteChar}${delimiter}`,
                $0d389cc1cd7b46e7$var$hardline,
                `${quoteChar}`
            ], " "), currClassNames.flatMap((str)=>str))), $0d389cc1cd7b46e7$var$trim, quoteChar);
            result.push(delimiter);
            result.push($0d389cc1cd7b46e7$var$line);
            currGroups.splice(0, currGroups.length);
            currClassNames.splice(0, currClassNames.length);
        }
        // write the current group to the result
        currClassNames.push(...groupClassNames);
        sortedClasses[i][0].length && currGroups.push(sortedClasses[i][0]);
    // Check if it's the last iteration to append the remaining classes and groups
    }
    if (currClassNames.length) {
        result.push(`${quoteChar}`, $0d389cc1cd7b46e7$var$join(" ", currClassNames), `${quoteChar}`);
        currGroups.length && result.push(commentStr(currGroups));
    }
    return $0d389cc1cd7b46e7$var$group(result);
};
function $0d389cc1cd7b46e7$export$eb57be04034bcf31(classList, { env: env }) {
    let classNamesWithOrder = env.context.getClassOrder(classList);
    const groups = new (0, $fab42eb3dee39b5b$export$674cd7dcb504ac5c)(()=>[]);
    classNamesWithOrder.forEach(([className])=>{
        try {
            const candidate = env.context.parseCandidate(className);
            const func = env.context.utilities.get(candidate?.root);
            const compileRes = func?.compileFn(candidate);
            if (!compileRes) {
                const currGroup = groups.get(-1);
                groups.set(-1, currGroup.concat({
                    props: {
                        globalRank: -1,
                        label: "",
                        subIndex: currGroup.length
                    },
                    className: className
                }));
            } else {
                const res = compileRes[0];
                const props = (0, $b8f2d36a1029902d$export$791ceaddea9b1699)(res.property);
                if (props) {
                    const currGroup = groups.get(props.globalRank);
                    groups.set(props.globalRank, currGroup.concat({
                        props: props,
                        className: className
                    }));
                } else if (res.kind === "rule") {
                    const currGroup = groups.get((0, $b8f2d36a1029902d$export$7ea734391ad49fb9));
                    groups.set((0, $b8f2d36a1029902d$export$7ea734391ad49fb9), currGroup.concat({
                        props: {
                            globalRank: (0, $b8f2d36a1029902d$export$7ea734391ad49fb9),
                            label: "rules",
                            subIndex: currGroup.length
                        },
                        className: className
                    }));
                } else {
                    const currGroup = groups.get((0, $b8f2d36a1029902d$export$3a641a98fa46c2c7));
                    groups.set((0, $b8f2d36a1029902d$export$3a641a98fa46c2c7), currGroup.concat({
                        props: {
                            globalRank: (0, $b8f2d36a1029902d$export$3a641a98fa46c2c7),
                            label: "unknowns",
                            subIndex: currGroup.length
                        },
                        className: className
                    }));
                }
            }
        } catch (e) {
            console.error(e);
            console.error(className);
            console.error(env.context.parseCandidate(className));
        }
    });
    return [
        ...groups.entries()
    ].sort((a, b)=>a[0] - b[0]).reduce((acc, [_, classGroup])=>{
        const sortedClasses = classGroup.sort((a, b)=>a.props.subIndex - b.props.subIndex).map((item)=>item.className);
        const label = classGroup[0].props.label;
        acc[label] = sortedClasses;
        return acc;
    }, {});
}



class $39a3959740636d51$export$2beb2a62431fd85 {
    constructor(printerFormat){
        this._defaultPrinterPromise = null;
        this.printerFormat = printerFormat;
        this.preprocess = this.preprocess.bind(this);
        this.getContext = this.getContext.bind(this);
        this.getDefaultPrinter = this.getDefaultPrinter.bind(this);
        this.initializeDefaultPrinter = this.initializeDefaultPrinter.bind(this);
        this.print = this.print.bind(this);
    }
    async initializeDefaultPrinter(options) {
        if (this._defaultPrinter) return this._defaultPrinter;
        if (!this._defaultPrinterPromise) this._defaultPrinterPromise = (async ()=>{
            const plugin = options?.plugins?.[0];
            const printerCandidate = plugin?.printers?.[this.printerFormat];
            const defaultPrinter = typeof printerCandidate === "function" ? await printerCandidate() : printerCandidate;
            if (!defaultPrinter) throw new Error(`Default printer for ${this.printerFormat} not found.`);
            this._defaultPrinter = defaultPrinter;
            for(const key in this._defaultPrinter)if (typeof this._defaultPrinter[key] === "function" && !(key in this)) Object.defineProperty(this, key, {
                value: this._defaultPrinter[key].bind(this),
                writable: true,
                configurable: true
            });
            return this._defaultPrinter;
        })();
        return await this._defaultPrinterPromise;
    }
    getDefaultPrinter(options) {
        if (this._defaultPrinter) return this._defaultPrinter;
        else if (!options) throw new Error("Printer not intialized");
        const plugin = options?.plugins?.[0];
        const defaultPrinter = plugin?.printers?.[this.printerFormat];
        if (!defaultPrinter) throw new Error(`Default printer for ${this.printerFormat} not found, available printers: ${plugin?.printers}`);
        this._defaultPrinter = defaultPrinter;
        return this._defaultPrinter;
    }
    async getContext(options) {
        if (this._context) return this._context;
        const { context: context } = await (0, $c04235eee8e32194$export$4b486f1846f78ca9)(options);
        this._context = context;
        return this._context;
    }
    async preprocess(ast, options) {
        await this.getContext(options);
        await this.initializeDefaultPrinter(options);
        return ast;
    }
    print(path, options, _print) {
        const ast = path.getNode();
        if ((0, $fab42eb3dee39b5b$export$8a4495ad806209c3)(path)) return [
            ast.name.name,
            `=`,
            (0, $0d389cc1cd7b46e7$export$7064067edd44ffd2)(ast.value, {
                env: {
                    context: this._context,
                    options: options
                }
            })
        ];
        else if (ast.type === "Literal" && (0, $fab42eb3dee39b5b$export$fa5236c3db7a4267)(path)) {
            const delimiter = (0, $fab42eb3dee39b5b$export$282ea9732602798d)(path) ? "," : " +";
            return [
                (0, $0d389cc1cd7b46e7$export$7064067edd44ffd2)(ast, {
                    env: {
                        context: this._context,
                        options: options
                    },
                    delimiter: delimiter
                })
            ];
        } else if (ast.type === "TemplateLiteral" && (0, $fab42eb3dee39b5b$export$fa5236c3db7a4267)(path)) return (0, $0d389cc1cd7b46e7$export$7064067edd44ffd2)(ast.quasis?.[0], {
            env: {
                context: this._context,
                options: options
            },
            quoteChar: "`"
        }, (node)=>node.value.raw);
        return this.getDefaultPrinter(options).print(path, options, _print);
    }
}



function $84e8e0773362a625$export$bf638b60ea8b89b7(ast, callbackMap) {
    function _visit(node, parent, key, index, meta = {}) {
        if (typeof callbackMap === "function") {
            if (callbackMap(node, parent, key, index, meta) === false) return;
        } else if (node.type in callbackMap) {
            if (callbackMap[node.type](node, parent, key, index, meta) === false) return;
        }
        const keys = Object.keys(node);
        for(let i = 0; i < keys.length; i++){
            const child = node[keys[i]];
            if (Array.isArray(child)) {
                for(let j = 0; j < child.length; j++)if (child[j] !== null) _visit(child[j], node, keys[i], j, {
                    ...meta
                });
            } else if (typeof child?.type === "string") _visit(child, node, keys[i], i, {
                ...meta
            });
        }
    }
    _visit(ast);
}
function $84e8e0773362a625$export$982df6504e59c283(ast, { env: env }) {
    $84e8e0773362a625$export$bf638b60ea8b89b7(ast, {
        JSXAttribute (node) {
            if (!(typeof node.name.name === "string" && (0, $c04235eee8e32194$export$bf7b0db2bf556aba).includes(node.name.name) && node.value.type === "Literal" && node.loc.end.column >= env.options.printWidth)) return node;
            const literalValue = node.value;
            const jsxExpressionContainer = {
                type: "JSXExpressionContainer",
                expression: {
                    type: "Literal",
                    value: literalValue.value,
                    loc: literalValue.loc,
                    range: literalValue.range
                },
                loc: literalValue.loc,
                range: literalValue.range
            };
            node.value = jsxExpressionContainer;
            return jsxExpressionContainer;
        }
    });
}


const $75a6c98f9227ce2e$var$defaultParsers = {
    ...(0, $hgUW1$parsers1),
    ...(0, $hgUW1$parsers)
};
class $75a6c98f9227ce2e$export$6836ffb69b9894bd {
    constructor(parserFormat, printerFormat){
        this.createParser = this.createParser.bind(this);
        this.parser = this.createParser(parserFormat);
        this.printer = new (0, $39a3959740636d51$export$2beb2a62431fd85)(printerFormat);
    }
    createParser(parserFormat) {
        let original = $75a6c98f9227ce2e$var$defaultParsers[parserFormat];
        const plugin = this;
        return {
            ...original,
            preprocess (code, options) {
                return original.preprocess ? original.preprocess(code, options) : code;
            },
            async parse (text, options) {
                await plugin.printer.initializeDefaultPrinter(options);
                let ast = await original.parse(text, options);
                const { context: context } = await (0, $c04235eee8e32194$export$4b486f1846f78ca9)(options);
                let changes = [];
                (0, $84e8e0773362a625$export$982df6504e59c283)(ast, {
                    env: {
                        context: context,
                        options: options
                    },
                    changes: changes
                });
                return ast;
            }
        };
    }
}


const $149c1bd638913645$var$plugin = new (0, $75a6c98f9227ce2e$export$6836ffb69b9894bd)("typescript", "estree");
const $149c1bd638913645$var$printers = {
    estree: $149c1bd638913645$var$plugin.printer
};
const $149c1bd638913645$var$parsers = {
    typescript: $149c1bd638913645$var$plugin.parser
};
var $149c1bd638913645$export$2e2bcd8739ae039 = {
    parsers: $149c1bd638913645$var$parsers,
    printers: $149c1bd638913645$var$printers
};


export {$149c1bd638913645$export$2e2bcd8739ae039 as default};
//# sourceMappingURL=main.js.map
