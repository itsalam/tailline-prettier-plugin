import { ParserOptions, parse } from "@typescript-eslint/parser";
import prettier from "prettier";
import TypescriptPlugin from "./index.js";

function collectStringLiterals(node, literals = []) {
  if (node.type === "Literal" && typeof node.value === "string") {
    literals.push(node.value);
  }
  for (const key in node) {
    if (
      node.hasOwnProperty(key) &&
      typeof node[key] === "object" &&
      node[key] !== null
    ) {
      collectStringLiterals(node[key], literals);
    }
  }
  return literals;
}

function findJSXAttribute(node, attributeName) {
  if (node.type === "JSXAttribute" && node.name.name === attributeName) {
    return node;
  }
  for (const key in node) {
    if (
      node.hasOwnProperty(key) &&
      typeof node[key] === "object" &&
      node[key] !== null
    ) {
      const result = findJSXAttribute(node[key], attributeName);
      if (result) {
        return result;
      }
    }
  }
  return null;
}

const tsParserOptions: ParserOptions = {
  ecmaVersion: 2020,
  sourceType: "module",
  ecmaFeatures: {
    jsx: true,
  },
};

const classNameRegex =
  /className\s*=\s*(?:["']([^"']*)["']|\{[\s\S]*?(['"])([\s\S]*?)\2[\s\S]*?\})/;
describe("No changes on..", () => {
  test("className attribute if sorted and in bounds", async () => {
    const code = `<div className="text-xl font-bold text-neutral-600 dark:text-white">
Make things float in air
</div>`;
    const formatted = await prettier.format(code, {
      parser: "typescript",
    });
    const formattedWithPlugin = await prettier.format(code, {
      parser: "typescript",
      plugins: [TypescriptPlugin],
    });

    try {
      parse(formattedWithPlugin, tsParserOptions);
      expect(formattedWithPlugin).toBe(formatted);
    } catch (error) {
      // Fail the test with a specific error message
      expect(error).toBeUndefined();
    }
  });
});

describe("Changes on..", () => {
  test("className attribute in bounds but unsorted", async () => {
    const code = `<div className="w-full mt-4"/>`;
    const formatted = await prettier.format(code, {
      parser: "typescript",
    });
    const formattedWithPlugin = await prettier.format(code, {
      parser: "typescript",
      plugins: [TypescriptPlugin],
    });

    try {
      parse(formattedWithPlugin, tsParserOptions);
      expect(formattedWithPlugin).not.toBe(formatted);
      const classNameRes = classNameRegex.exec(formatted);
      const sortedClassNameRes = classNameRegex.exec(formattedWithPlugin);
      const className = classNameRes?.[1];
      const sortedClassName = sortedClassNameRes?.[1];
      expect(className.split(" ")).toEqual(
        expect.arrayContaining(sortedClassName.split(" "))
      );
      expect(className.split(" ")).not.toEqual(sortedClassName.split(" "));
    } catch (error) {
      // Fail the test with a specific error message
      expect(error).toBeUndefined();
      console.error(error);
    }
  });

  describe("className attribute sorted but OOBs", () => {
    const code = `<div className="rounded-xl bg-black dark:bg-white py-2 px-4 text-xs font-bold dark:text-black text-white"/>`;
    let formatted;
    let formattedWithPlugin;
    beforeAll(async () => {
      formatted = await prettier.format(code, {
        parser: "typescript",
      });
      formattedWithPlugin = await prettier.format(code, {
        parser: "typescript",
        plugins: [TypescriptPlugin],
      });
    });

    test("raw and plugin output should not be the same", async () => {
      try {
        expect(formattedWithPlugin).not.toBe(formatted);
      } catch (error) {
        expect(error).toBeUndefined();
        console.error(error);
      }
    });

    test("all elements in both arrays should be equal", async () => {
      try {
        const rawResults = parse(formatted, tsParserOptions);
        const rawLiterals = collectStringLiterals(rawResults).flatMap(
          (literal) => literal.split(" ")
        );
        const pluginResults = parse(formattedWithPlugin, tsParserOptions);
        const pluginClassGroups = collectStringLiterals(pluginResults);
        const pluginLiterals = pluginClassGroups.flatMap((literal) =>
          literal.split(" ")
        );
        expect(rawLiterals).toEqual(pluginLiterals);
      } catch (error) {
        expect(error).toBeUndefined();
        console.error(error);
      }
    });

    test("# of grouped classes should be greater than 1", async () => {
      try {
        const pluginResults = parse(formattedWithPlugin, tsParserOptions);
        const pluginClassGroups = collectStringLiterals(pluginResults);
        expect(pluginClassGroups.length).toBeGreaterThan(1);
      } catch (error) {
        expect(error).toBeUndefined();
        console.error(error);
      }
    });

    test("plugin classNames should convert from literal to expression", async () => {
      try {
        const rawResults = parse(formatted, tsParserOptions);
        const pluginResults = parse(formattedWithPlugin, tsParserOptions);
        const pluginClassNamesNode = findJSXAttribute(
          pluginResults,
          "className"
        );
        const rawClassNamesNode = findJSXAttribute(rawResults, "className");
        expect(pluginClassNamesNode.value.type).not.toEqual(
          rawClassNamesNode.value.type
        );
      } catch (error) {
        expect(error).toBeUndefined();
        console.error(error);
      }
    });
  });

  test("className attribute unsorted and OOBs", async () => {
    const code = `<div className="rounded-xl bg-black dark:bg-white py-2 px-4 text-xs font-bold dark:text-black text-white"/>`;
    const formatted = await prettier.format(code, {
      parser: "typescript",
    });
    const formattedWithPlugin = await prettier.format(code, {
      parser: "typescript",
      plugins: [TypescriptPlugin],
    });

    try {
      const rawResults = parse(formatted, tsParserOptions);
      const rawLiterals = collectStringLiterals(rawResults).flatMap((literal) =>
        literal.split(" ")
      );
      const pluginResults = parse(formattedWithPlugin, tsParserOptions);
      const pluginClassGroups = collectStringLiterals(pluginResults);
      const pluginLiterals = pluginClassGroups.flatMap((literal) =>
        literal.split(" ")
      );
      expect(formattedWithPlugin).not.toBe(formatted);
      expect(rawLiterals).toEqual(pluginLiterals);
      expect(pluginClassGroups.length).toBeGreaterThan(1);
    } catch (error) {
      // Fail the test with a specific error message
      expect(error).toBeUndefined();
      console.error(error);
    }
  });

  test("className attribute with variants", async () => {
    const code = `<HoverCardPrimitive.Content
    ref={ref}
    align={align}
    sideOffset={sideOffset}
    className={cn("z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",className)}
    {...props}
  />`;
    const formatted = await prettier.format(code, {
      parser: "typescript",
    });
    const formattedWithPlugin = await prettier.format(code, {
      parser: "typescript",
      plugins: [TypescriptPlugin],
    });

    try {
      const rawResults = parse(formatted, tsParserOptions);
      const rawLiterals = collectStringLiterals(rawResults).flatMap((literal) =>
        literal.split(" ")
      );
      const pluginResults = parse(formattedWithPlugin, tsParserOptions);
      const pluginClassGroups = collectStringLiterals(pluginResults);
      const pluginLiterals = pluginClassGroups.flatMap((literal) =>
        literal.split(" ")
      );
      expect(formattedWithPlugin).not.toBe(formatted);
      expect(rawLiterals).not.toEqual(pluginLiterals);
      expect(new Set(rawLiterals)).toEqual(new Set(pluginLiterals));
      expect(pluginClassGroups.length).toBeGreaterThan(1);
    } catch (error) {
      // Fail the test with a specific error message
      expect(error).toBeUndefined();
      console.error(error);
    }
  });
});
