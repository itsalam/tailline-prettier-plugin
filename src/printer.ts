import { TSESTree } from "@typescript-eslint/types";
import { AstPath, ParserOptions, Plugin, Printer, doc } from "prettier";
import { getTailwindConfig } from "./config.js";
import { sortClasses } from "./sorting.js";
import { Node, TemplateLiteral, TransformerEnv } from "./types.js";
import { binaryExpToLiteralExp, isClassNameFunction } from "./utils.js";

const { line, join, group, indent, softline } = doc.builders;

export class CustomPrinter implements Printer<Node> {
  printerFormat: string;
  _defaultPrinter: Printer;
  _defaultPrinterPromise: Promise<Printer> | null = null;
  _context: TransformerEnv["context"];

  constructor(printerFormat: string) {
    this.printerFormat = printerFormat;
    this.preprocess = this.preprocess.bind(this);
    this.getContext = this.getContext.bind(this);
    this.getDefaultPrinter = this.getDefaultPrinter.bind(this);
    this.initializeDefaultPrinter = this.initializeDefaultPrinter.bind(this);
    this.print = this.print.bind(this);
  }

  async initializeDefaultPrinter(options: ParserOptions): Promise<Printer> {
    if (this._defaultPrinter) {
      return this._defaultPrinter;
    }
    if (!this._defaultPrinterPromise) {
      this._defaultPrinterPromise = (async () => {
        const plugin = options?.plugins?.[0] as Plugin | undefined;
        const printerCandidate = plugin?.printers?.[this.printerFormat] as
          | Printer
          | (() => Promise<Printer>);
        const defaultPrinter =
          typeof printerCandidate === "function"
            ? await printerCandidate()
            : printerCandidate;
        if (!defaultPrinter) {
          throw new Error(
            `Default printer for ${this.printerFormat} not found.`
          );
        }

        this._defaultPrinter = defaultPrinter;
        for (const key in this._defaultPrinter) {
          if (
            typeof this._defaultPrinter[key] === "function" &&
            !(key in this)
          ) {
            Object.defineProperty(this, key, {
              value: this._defaultPrinter[key].bind(this),
              writable: true,
              configurable: true,
            });
          }
        }
        return this._defaultPrinter;
      })();
    }
    return await this._defaultPrinterPromise;
  }

  getDefaultPrinter(options?: ParserOptions) {
    if (this._defaultPrinter) {
      return this._defaultPrinter;
    } else if (!options) {
      throw new Error("Printer not intialized");
    }
    const plugin = options?.plugins?.[0] as Plugin | undefined;
    const defaultPrinter = plugin?.printers?.[this.printerFormat] as
      | Printer
      | undefined;
    if (!defaultPrinter) {
      throw new Error(
        `Default printer for ${this.printerFormat} not found, available printers: ${plugin?.printers}`
      );
    }
    this._defaultPrinter = defaultPrinter;
    return this._defaultPrinter;
  }

  async getContext(options: ParserOptions<any>) {
    if (this._context) {
      return this._context;
    }
    const context = await getTailwindConfig(options);
    this._context = context;
    return this._context;
  }

  async preprocess(ast: Node, options: ParserOptions) {
    await this.getContext(options);
    await this.initializeDefaultPrinter(options);
    return ast;
  }

  print(path: AstPath, options: ParserOptions, _print) {
    const ast = path.getNode();
    const delimiter = ",";
    if (isClassNameFunction(path, ast)) {
      const stringArgs = ast.arguments.filter((arg) => arg.type === "Literal");

      let binaryArgs = [];
      const templateArgs = ast.arguments.filter((arg) => arg.type === "TemplateLiteral" && arg.expressions.length === 0);
      
      try {
        // try to concat all to a pure string literal exp
        binaryArgs = ast.arguments
          .filter((arg) => arg.type === "BinaryExpression")
          .map((arg: TSESTree.BinaryExpression) => binaryExpToLiteralExp(arg));
        
          
      } catch (e) {}
      const literalValues = stringArgs
        .concat(binaryArgs)
        .map((arg: TSESTree.Literal) => arg.value)
        .join(" ");
      const templateValues = templateArgs.map((temp) => (temp as TemplateLiteral).quasis.map((q) => q.value.raw).join(" ")).join(" ");
      return group([
        (ast.callee as TSESTree.Identifier).name,
        "(",
        indent([
          softline,
          join(
            [",", line],
            [
              sortClasses(
                {
                  ...ast,
                  type: "Literal",
                  value: literalValues,
                  raw: `"${literalValues}"`,
                } as TSESTree.Literal,
                {
                  env: { context: this._context, options },
                  delimiter,
                }
              ),
              
                sortClasses(
                  {
                    ...ast,
                    type: "Literal",
                    value: templateValues,
                    raw: `\`${templateValues}\``,
                  } as TSESTree.Literal,
                  {
                    env: { context: this._context, options },
                    delimiter,
                    quoteChar: "`",
                  }
                ),
              ...path
                .map((argPath: AstPath<TSESTree.CallExpressionArgument>) => {
                  const argAst = argPath.getNode();
                  if (
                    !(
                      argAst.type === "Literal" ||
                      argAst.type === "BinaryExpression" || 
                      argAst.type === "TemplateLiteral"
                    )
                  ) {
                    return this.getDefaultPrinter(options).print(
                      argPath,
                      options,
                      _print
                    );
                  }
                }, "arguments")
                .filter(Boolean),
            ].filter(Boolean)
          ),
        ]),
        softline,
        ")",
      ]);
    }
    return this.getDefaultPrinter(options).print(path, options, _print);
  }
}
