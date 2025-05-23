import { StringLiteral as BabelStringLiteral } from "@babel/types";
import { TSESTree } from "@typescript-eslint/types";
import { ParserOptions, Printer } from "prettier";
import { __unstable__loadDesignSystem, compileAst } from "tailwindcss";

export type StringLiteral = TSESTree.StringLiteral | BabelStringLiteral;
export type TemplateLiteral = TSESTree.TemplateLiteral;
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

export type DesignSystem = Awaited<
  ReturnType<typeof __unstable__loadDesignSystem>
> & { 
  generateRules?: (a:Set<string>, b:DesignSystem) => any };

export type TailwindAst = ReturnType<
  Awaited<ReturnType<typeof compileAst>>["build"]
>[number];

export interface TransformerEnv {
  context: DesignSystem;
  // customizations?: Customizations;
  // parsers: Parser[];
  options: ParserOptions;
}

export type Candidate = Parameters<DesignSystem["compileAstNodes"]>[0];
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
