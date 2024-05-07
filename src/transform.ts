import { TSESTree } from "@typescript-eslint/types";
import { CLASS_NAME_ATTRS } from "./config.js";
import { GROUP_KEYS } from "./grouped-classes.js";
import { Node, StringLiteral, TransformerContext } from "./types.js";
import { isClassNameFunctionNode, isRangeWithin } from "./utils.js";

export function visit(
  ast: Node,
  callbackMap: Function | Record<string, Function>
) {
  function _visit(
    node: Node,
    parent?: Node,
    key?: string,
    index?: number,
    meta = {}
  ) {
    if (typeof callbackMap === "function") {
      if (callbackMap(node, parent, key, index, meta) === false) {
        return;
      }
    } else if (node.type in callbackMap) {
      if (callbackMap[node.type](node, parent, key, index, meta) === false) {
        return;
      }
    }

    const keys = Object.keys(node);
    for (let i = 0; i < keys.length; i++) {
      const child = node[keys[i]];
      if (Array.isArray(child)) {
        for (let j = 0; j < child.length; j++) {
          if (child[j] !== null) {
            _visit(child[j], node, keys[i], j, { ...meta });
          }
        }
      } else if (typeof child?.type === "string") {
        _visit(child, node, keys[i], i, { ...meta });
      }
    }
  }
  _visit(ast);
}

export function transformJavaScript(ast: Node, { env }: TransformerContext) {
  let programNode;
  let callExpressions: TSESTree.CallExpression[] = [];
  visit(ast, {
    // CallExpression(node: TSESTree.CallExpression, parent, key, index, meta) {
    //   console.log({ node, parent, key, index, meta });
    //   console.log(node.arguments);
    //   if (isClassNameFunctionNode(node)) {
    //     const stringArgs = node.arguments.filter(
    //       (arg) => arg.type === "Literal"
    //     );
    //     const nonStringArgs = node.arguments.filter(
    //       (arg) => arg.type !== "Literal"
    //     );
    //     const value = stringArgs
    //       .map((arg: TSESTree.Literal) => arg.value)
    //       .join(" ");
    //     node.arguments = [
    //       { type: "Literal", value, raw: `"${value}"` },
    //       ...nonStringArgs,
    //     ] as TSESTree.Literal[];
    //   }
    // },
    Program(node: TSESTree.Program) {
      programNode = node;
      return node;
    },
    CallExpression(node: TSESTree.CallExpression) {
      if (isClassNameFunctionNode(node)) {
        callExpressions.push(node);
      }
      return node;
    },
    JSXAttribute(node: TSESTree.JSXAttribute) {
      if (
        !(
          typeof node.name.name === "string" &&
          CLASS_NAME_ATTRS.includes(node.name.name) &&
          (node.value.type as string) === "Literal" &&
          node.loc.end.column >= env.options.printWidth
        )
      ) {
        return node;
      }
      const literalValue = node.value as StringLiteral;
      const jsxExpressionContainer = {
        type: "JSXExpressionContainer",
        expression: {
          type: "Literal",
          value: literalValue.value,
          loc: literalValue.loc, // Preserve original location info
          range: literalValue.range, // Preserve original range info
        } as StringLiteral,
        loc: literalValue.loc, // Optionally adjust if needed
        range: literalValue.range, // Optionally adjust if needed
      } as TSESTree.JSXExpressionContainer;
      node.value = jsxExpressionContainer;
      return jsxExpressionContainer;
    },
  });

  const comments = programNode.comments.filter(
    ({ value, range }) =>
      !(
        value
          .trim()
          .split(/,\s*/)
          .every((group) => GROUP_KEYS.includes(group.trim())) &&
        callExpressions.find(({ range: ceRange }) =>
          isRangeWithin(ceRange, range)
        )
      )
  );
  programNode.comments = comments;
  return programNode;
}
