import { StringLiteral as BabelStringLiteral } from "@babel/types";
import { TSESTree } from "@typescript-eslint/types";
import { ParserOptions, Printer } from "prettier";
import { __unstable__loadDesignSystem } from "tailwindcss";

export type StringLiteral = TSESTree.StringLiteral | BabelStringLiteral;
export type Node = TSESTree.Node;

export interface TransformerMetadata {
  // Default customizations for a given transformer
  staticAttrs?: string[];
  dynamicAttrs?: string[];
  functions?: string[];
}

export interface Customizations {
  functions: Set<string>;
  staticAttrs: Set<string>;
  dynamicAttrs: Set<string>;
}

export interface TransformerContext {
  env: TransformerEnv;
  changes: { text: string; loc: any }[];
}

export type DesignSystem = ReturnType<typeof __unstable__loadDesignSystem> & {
  generateRules?: (
    candidates: string[],
    context: ReturnType<typeof __unstable__loadDesignSystem>,
    isSorting?: boolean
  ) => string[];
};
export interface TransformerEnv {
  context: DesignSystem;
  // customizations?: Customizations;
  // parsers: Parser[];
  options: ParserOptions;
}

export interface ContextContainer {
  context: any;
  generateRules: () => any;
}

export interface InternalOptions {
  printer: Printer<any>;
}
declare module "prettier" {
  interface RequiredOptions extends InternalOptions {}
  interface ParserOptions extends InternalOptions {}
}
