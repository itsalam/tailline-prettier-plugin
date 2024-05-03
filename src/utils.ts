import { TSESTree } from "@typescript-eslint/types";
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

export function isClassNameAttributeChild(path: AstPath) {
  return CLASS_NAME_ATTRS.includes(
    path.stack.find((p) => p.type?.includes("JSXAttribute"))?.name?.name
  );
}

export function isClassNameAttributeLiteral(path: AstPath) {
  return (
    path.getNode().type === "JSXAttribute" &&
    CLASS_NAME_ATTRS.includes(path.getNode().name.name) &&
    path.getNode().value.type === "Literal"
  );
}

export function isClassUtilityParameter(path: AstPath) {
  const parent = path.parent as TSESTree.CallExpression;
  return (
    parent.type === "CallExpression" &&
    "name" in parent.callee &&
    CALL_EXPRESSIONS.includes((parent.callee as any).name)
  );
}
