import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/types";
import { AstPath } from "prettier";
import { CALL_EXPRESSIONS, CLASS_NAME_ATTRS } from "./config.js";
import { Node } from "./types.js";
export class DefaultMap<T = string, V = any> extends Map<T, V> {
  constructor(private factory: (key: T, self: DefaultMap<T, V>) => V) {
    super();
  }

  get(key: T): V {
    let value = super.get(key);

    if (value === undefined) {
      value = this.factory(key, this);
      this.set(key, value);
    }

    return value;
  }
}

export const isStringLiteral = (node: Node) =>
  (node?.type as string) === "StringLiteral" ||
  (node?.type === "Literal" && typeof node?.value === "string");

export function isClassNameDirectChild(path: AstPath) {
  const jsxIndex = path.stack.findIndex((p) =>
    p.type?.includes("JSXAttribute")
  );
  const objectIndex = path.stack.findIndex((p) =>
    p.type?.includes("ObjectExpression")
  );
  return (
    (!objectIndex || objectIndex < jsxIndex) &&
    CLASS_NAME_ATTRS.includes(path.stack[jsxIndex]?.name?.name)
  );
}

export function isClassNameAttributeLiteral(path: Node) {
  return (
    path.type === "JSXAttribute" &&
    CLASS_NAME_ATTRS.includes(
      (path as TSESTree.JSXAttribute).name.name as string
    ) &&
    path.value.type === "Literal"
  );
}

export function isClassNameFunctionNode(
  node: Node
): node is TSESTree.CallExpression {
  return (
    node.type === "CallExpression" &&
    "name" in node.callee &&
    CALL_EXPRESSIONS.includes((node.callee as any).name)
  );
}

export function isClassNameFunction(
  path: AstPath,
  node?: Node
): node is TSESTree.CallExpression {
  return (
    path.grandparent &&
    path.grandparent.type === "JSXAttribute" &&
    path.grandparent.name.name &&
    CLASS_NAME_ATTRS.includes(path.grandparent.name.name) &&
    isClassNameFunctionNode(node ?? path.getNode())
  );
}

export function isRangeWithin(
  a: [number, number],
  b: [number, number]
): boolean {
  // Check if range b is within range a
  return b[0] >= a[0] && b[1] <= a[1];
}

export function binaryExpToLiteralExp(
  node: TSESTree.BinaryExpression
): TSESTree.StringLiteral {
  const keys: Array<keyof TSESTree.BinaryExpression> = ["left", "right"];
  const values = [];
  for (const dir of keys) {
    if ((node[dir] as TSESTree.Expression).type === "Literal") {
      values.push(`${(node[dir] as TSESTree.Literal).value}`);
    } else if ((node[dir] as TSESTree.Expression).type === "BinaryExpression") {
      values.push(
        binaryExpToLiteralExp(node[dir] as TSESTree.BinaryExpression).value
      );
    }
  }
  const value = values.join(" ");
  return {
    parent: null,
    type: AST_NODE_TYPES.Literal,
    value,
    raw: `'${value}'`,
    range: node.range,
    loc: node.loc,
  };
}
