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

    parse(formattedWithPlugin, tsParserOptions);
    expect(formattedWithPlugin).toBe(formatted);
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
      expect(formattedWithPlugin).not.toBe(formatted);
    });

    test("all elements in both arrays should be equal", async () => {
      const rawResults = parse(formatted, tsParserOptions);
      const rawLiterals = collectStringLiterals(rawResults).flatMap((literal) =>
        literal.split(" ")
      );
      const pluginResults = parse(formattedWithPlugin, tsParserOptions);
      const pluginClassGroups = collectStringLiterals(pluginResults);
      const pluginLiterals = pluginClassGroups.flatMap((literal) =>
        literal.split(" ")
      );
      expect(rawLiterals).toEqual(pluginLiterals);
    });

    test("# of grouped classes should be greater than 1", async () => {
      const pluginResults = parse(formattedWithPlugin, tsParserOptions);
      const pluginClassGroups = collectStringLiterals(pluginResults);
      expect(pluginClassGroups.length).toBeGreaterThan(1);
    });

    test("plugin classNames should convert from literal to expression", async () => {
      const rawResults = parse(formatted, tsParserOptions);
      const pluginResults = parse(formattedWithPlugin, tsParserOptions);
      const pluginClassNamesNode = findJSXAttribute(pluginResults, "className");
      const rawClassNamesNode = findJSXAttribute(rawResults, "className");
      expect(pluginClassNamesNode.value.type).not.toEqual(
        rawClassNamesNode.value.type
      );
    });
  });

  test("className attribute unsorted and OOBs", async () => {
    const code = `<div className="rounded-xl bg-black dark:bg-white py-2 mx-4 text-xs font-bold dark:text-black text-white"/>`;
    const formatted = await prettier.format(code, {
      parser: "typescript",
    });
    const formattedWithPlugin = await prettier.format(code, {
      parser: "typescript",
      plugins: [TypescriptPlugin],
    });

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
  });

  test("multiline className attribute with className utility function", async () => {
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

    const rawResults = parse(formatted, tsParserOptions);
    const rawLiterals = collectStringLiterals(rawResults).flatMap((literal) =>
      literal.split(" ")
    );
    const pluginResults = parse(formattedWithPlugin, tsParserOptions);
    const pluginClassGroups = collectStringLiterals(pluginResults);
    const pluginLiterals = pluginClassGroups.flatMap((literal) =>
      literal.split(" ")
    );
    expect((formattedWithPlugin.match(/,/g) || []).length).toBeGreaterThan(
      (formatted.match(/,/g) || []).length
    );
    expect(formattedWithPlugin).not.toBe(formatted);
    expect(rawLiterals).not.toEqual(pluginLiterals);
    expect(new Set(rawLiterals)).toEqual(new Set(pluginLiterals));
    expect(pluginClassGroups.length).toBeGreaterThan(1);
  });

  test("multiline className attribute with variants", async () => {
    const code = `<HoverCardPrimitive.Content
    ref={ref}
    align={align}
    sideOffset={sideOffset}
    className={"z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"}
    {...props}
  />`;
    const formatted = await prettier.format(code, {
      parser: "typescript",
    });
    const formattedWithPlugin = await prettier.format(code, {
      parser: "typescript",
      plugins: [TypescriptPlugin],
    });

    const rawResults = parse(formatted, tsParserOptions);
    const rawLiterals = collectStringLiterals(rawResults).flatMap((literal) =>
      literal.split(" ")
    );
    const pluginResults = parse(formattedWithPlugin, tsParserOptions);
    const pluginClassGroups = collectStringLiterals(pluginResults);
    const pluginLiterals = pluginClassGroups.flatMap((literal) =>
      literal.split(" ")
    );

    expect(formatted).not.toContain("+");
    expect(formattedWithPlugin).toContain("+");
    expect(formattedWithPlugin).not.toBe(formatted);
    expect(rawLiterals).not.toEqual(pluginLiterals);
    expect(new Set(rawLiterals)).toEqual(new Set(pluginLiterals));
    expect(pluginClassGroups.length).toBeGreaterThan(1);
  });

  describe("classNames updated with plugin", () => {
    const codeWithClassNameInsert = (
      classNames
    ) => `export function ThreeDCardDemo() {
      return (
        <input
          type={type}
          // reads cn and creates a list of strings
          className={cn(
            "shadow-input file:border-0",
            "dark:placeholder-text-neutral-600 focus-visible:ring-[2px]",
            "dark:shadow-[0px_0px_1px_1px_var(--neutral-700)]",
            "group-hover/input:shadow-none",
            "h-10 w-full disabled:cursor-not-allowed", // sizing, interactions
            "rounded-md bg-gray-50 dark:bg-zinc-800 file:bg-transparent", // border, background
            "py-2 px-3", // padding
            "text-sm file:text-sm file:font-medium text-black dark:text-white", // textStyles
            "placeholder:text-neutral-400",
            "disabled:opacity-50", // transparency
            "focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600", // outlineEffects
            "focus-visible:outline-none",
            "transition duration-400${classNames}", // transitionsAnimations
            className,
          )}
          ref={ref}
          {...props}
        />
      );
    }`;

    test("classNames with no updates", async () => {
      const formatted = await prettier.format(codeWithClassNameInsert(""), {
        parser: "typescript",
      });
      const formattedWithPlugin = await prettier.format(
        codeWithClassNameInsert(""),
        {
          parser: "typescript",
          plugins: [TypescriptPlugin],
        }
      );
      const rawResults = parse(formatted, tsParserOptions);
      const rawLiterals = collectStringLiterals(rawResults).flatMap((literal) =>
        literal.split(" ")
      );
      const pluginResults = parse(formattedWithPlugin, tsParserOptions);
      const pluginClassGroups = collectStringLiterals(pluginResults);
      const pluginLiterals = pluginClassGroups.flatMap((literal) =>
        literal.split(" ")
      );

      expect(new Set(rawLiterals)).toEqual(new Set(pluginLiterals));
    });

    test("classNames with with updates", async () => {
      const formatted = await prettier.format(
        codeWithClassNameInsert(" flex"),
        {
          parser: "typescript",
        }
      );
      const formattedWithPlugin = await prettier.format(
        codeWithClassNameInsert(" flex"),
        {
          parser: "typescript",
          plugins: [TypescriptPlugin],
        }
      );

      const rawResults = parse(formatted, tsParserOptions);

      const rawRes = collectStringLiterals(rawResults);
      const rawLiterals = rawRes.flatMap((literal) => literal.split(" "));
      const pluginResults = parse(formattedWithPlugin, tsParserOptions);
      const pluginClassGroups = collectStringLiterals(pluginResults);
      const pluginLiterals = pluginClassGroups.flatMap((literal) =>
        literal.split(" ")
      );
      expect(formatted).not.toEqual(formattedWithPlugin);
      expect(rawLiterals).not.toEqual(pluginLiterals);
      expect(new Set(rawLiterals)).toEqual(new Set(pluginLiterals));
      expect(rawLiterals).not.toEqual(pluginLiterals);
    });
  });

  describe("stringLiteral updated with plugin", () => {
    const codeWithClassNameInsert = (
      classNames
    ) => `export function ThreeDCardDemo() {
      return (
        <input
          type={type}
          className={
            "h-10 w-full disabled:cursor-not-allowed" + // sizing, interactions
            "rounded-md bg-gray-50 dark:bg-zinc-800 file:bg-transparent" + // border, background
            "py-2 px-3" + // padding
            "transition duration-400${classNames}" // transitionsAnimations
          }
          ref={ref}
          {...props}
        />
      );
    }`;

    test("classNames with no updates", async () => {
      const formatted = await prettier.format(codeWithClassNameInsert(""), {
        parser: "typescript",
      });
      const formattedWithPlugin = await prettier.format(
        codeWithClassNameInsert(""),
        {
          parser: "typescript",
          plugins: [TypescriptPlugin],
        }
      );
      const rawResults = parse(formatted, tsParserOptions);
      const rawLiterals = collectStringLiterals(rawResults).flatMap((literal) =>
        literal.split(" ")
      );
      const pluginResults = parse(formattedWithPlugin, tsParserOptions);
      const pluginClassGroups = collectStringLiterals(pluginResults);
      const pluginLiterals = pluginClassGroups.flatMap((literal) =>
        literal.split(" ")
      );

      expect(new Set(rawLiterals)).toEqual(new Set(pluginLiterals));
    });

    test("classNames with with updates", async () => {
      const formatted = await prettier.format(
        codeWithClassNameInsert(" flex"),
        {
          parser: "typescript",
        }
      );
      const formattedWithPlugin = await prettier.format(
        codeWithClassNameInsert(" flex"),
        {
          parser: "typescript",
          plugins: [TypescriptPlugin],
        }
      );

      const rawResults = parse(formatted, tsParserOptions);

      const rawRes = collectStringLiterals(rawResults);
      const rawLiterals = rawRes.flatMap((literal) => literal.split(" "));
      const pluginResults = parse(formattedWithPlugin, tsParserOptions);
      const pluginClassGroups = collectStringLiterals(pluginResults);
      const pluginLiterals = pluginClassGroups.flatMap((literal) =>
        literal.split(" ")
      );
      expect(formatted).not.toEqual(formattedWithPlugin);
      expect(rawLiterals).not.toEqual(pluginLiterals);
      expect(new Set(rawLiterals)).toEqual(new Set(pluginLiterals));
      expect(rawLiterals).not.toEqual(pluginLiterals);
    });
  });

  describe("classNames with object argument", () => {
    const codeWithClassNameInsert = (
      classNames = []
    ) => `export function ThreeDCardDemo() {
      return (
        <input
          type={type}
          className={cn(${[
            `{
            "opacity-25": j !== 0,
            "opacity-100": j === 0,
          }`,
            `classNames`,
            ...classNames,
          ]
            .filter(Boolean)
            .join(", ")})}
          ref={ref}
          {...props}
        />
      );
    }`;

    test("plugin has no updates with no string literals", async () => {
      const formatted = await prettier.format(codeWithClassNameInsert(), {
        parser: "typescript",
      });
      const formattedWithPlugin = await prettier.format(
        codeWithClassNameInsert(),
        {
          parser: "typescript",
          plugins: [TypescriptPlugin],
        }
      );
      expect(formatted.replace(/\s/g, "").length).toBe(
        formattedWithPlugin.replace(/\s/g, "").length + 1
      );
    });

    test("plugin has updates with string literals", async () => {
      const formatted = await prettier.format(
        codeWithClassNameInsert([`"z-50 w-64 rounded-md border"`]),
        {
          parser: "typescript",
        }
      );
      const formattedWithPlugin = await prettier.format(
        codeWithClassNameInsert([`"z-50 w-64 rounded-md border"`]),
        {
          parser: "typescript",
          plugins: [TypescriptPlugin],
        }
      );

      const rawResults = parse(formatted, tsParserOptions);
      const rawRes = collectStringLiterals(rawResults);
      const rawLiterals = rawRes.flatMap((literal) => literal.split(" "));
      const pluginResults = parse(formattedWithPlugin, tsParserOptions);
      const pluginClassGroups = collectStringLiterals(pluginResults);
      const pluginLiterals = pluginClassGroups.flatMap((literal) =>
        literal.split(" ")
      );

      expect(rawLiterals).not.toEqual(pluginLiterals);
      expect(new Set(rawLiterals)).toEqual(new Set(pluginLiterals));
      expect(formatted).not.toEqual(formattedWithPlugin);
    });
  });
});
