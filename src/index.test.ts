import { ParserOptions, parse } from "@typescript-eslint/parser";
import prettier from "prettier";
import TypescriptPlugin from "./index.js";

function collectStringLiterals(node, literals = []) {
  // console.log(node);
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
      console.log(error);
    }
  });

  test("className attribute sorted but OOBs", async () => {
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
      console.log(error);
    }
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
      console.log(error);
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
      console.log({ formattedWithPlugin });
      expect(formattedWithPlugin).not.toBe(formatted);
      expect(rawLiterals).not.toEqual(pluginLiterals);
      expect(new Set(rawLiterals)).toEqual(new Set(pluginLiterals));
      expect(pluginClassGroups.length).toBeGreaterThan(1);
    } catch (error) {
      // Fail the test with a specific error message
      expect(error).toBeUndefined();
      console.log(error);
    }
  });
});

// ruleTester.run("my-rule", rule, {
//   valid: [
//     // valid tests can be a raw string,

//     // or they can be an object
//     // {
//     //   code: "const y = 2;",
//     //   options: [{ ruleOption: true }],
//     // },

//     // you can enable JSX parsing by passing parserOptions.ecmaFeatures.jsx = true
//     {
//       code: `<div
//         translateZ="50"
//         className="text-xl font-bold text-neutral-600 dark:text-white"
//       />`,
//       parserOptions: {
//         ecmaFeatures: {
//           jsx: true,
//         },
//       },
//     },
//   ],
//   invalid: [
//     // invalid tests must always be an object
//     {
//       // Unsorted
//       code: `<div className="w-full mt-4"/>`,
//       // invalid tests must always specify the expected errors
//       parserOptions: {
//         ecmaFeatures: {
//           jsx: true,
//         },
//       },
//       output: `<div className="mt-4 w-full"/>`,
//       errors: [
//         {
//           messageId: "notSorted",
//           // If applicable - it's recommended that you also assert the data in
//           // addition to the messageId so that you can ensure the correct message
//           // is generated
//           data: {
//             // placeholder1: "a",
//           },
//         },
//       ],
//     },
//     {
//       // Sorted, OOB
//       code: `<div className="rounded-xl bg-black dark:bg-white py-2 px-4 text-xs font-bold dark:text-black text-white"/>`,
//       // invalid tests must always specify the expected errors
//       parserOptions: {
//         ecmaFeatures: {
//           jsx: true,
//         },
//       },
//       output: `<div className={
//           "rounded-xl" + // border
//           "bg-black dark:bg-white py-2 px-4" + // background, padding
//           "text-xs font-bold dark:text-black text-white" // textStyles
//         }/>`,
//       errors: [
//         {
//           messageId: "auto-fix",
//           // If applicable - it's recommended that you also assert the data in
//           // addition to the messageId so that you can ensure the correct message
//           // is generated
//           data: {
//             placeholder1: "a",
//           },
//         },
//       ],
//     },
//     {
//       // Unsorted and OOB
//       code: `<div className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border"/>`,
//       // invalid tests must always specify the expected errors
//       parserOptions: {
//         ecmaFeatures: {
//           jsx: true,
//         },
//       },
//       output: `<div
//         className={
//           "group/card" +
//           "relative h-auto w-auto sm:w-[30rem]" + // basicStyles, sizing
//           "rounded-xl dark:border-white/[0.2] border-black/[0.1]" + // border
//           "bg-gray-50 dark:bg-black p-6" + // background, padding
//           "dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] border" // rules
//         }
//       />`,
//       errors: [
//         {
//           messageId: "auto-fix",
//           // If applicable - it's recommended that you also assert the data in
//           // addition to the messageId so that you can ensure the correct message
//           // is generated
//           // data: {
//           //   placeholder1: "a",
//           // },
//         },
//       ],
//     },

//     // // suggestions can be tested via errors
//     // {
//     //   code: "const d = 1;",
//     //   output: null,
//     //   errors: [
//     //     {
//     //       messageId: "suggestionError",
//     //       suggestions: [
//     //         {
//     //           messageId: "suggestionOne",
//     //           output: "const e = 1;",
//     //         },
//     //       ],
//     //     },
//     //   ],
//     // },
//   ],
// });
