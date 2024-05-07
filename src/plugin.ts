import { Parser, ParserOptions } from "prettier";
import { parsers as babelParsers } from "prettier/plugins/babel";
import { parsers as tsParsers } from "prettier/plugins/typescript";
import { getTailwindConfig } from "./config.js";
import { CustomPrinter } from "./printer.js";
import { transformJavaScript } from "./transform.js";
import { Node } from "./types.js";

const defaultParsers = {
  ...tsParsers,
  ...babelParsers,
};

//TODO: Add in options for newline threshold?
export class TypescriptPlugin {
  parser: Parser<Node>;
  printer: CustomPrinter;

  constructor(parserFormat: string, printerFormat: string) {
    this.createParser = this.createParser.bind(this);
    this.parser = this.createParser(parserFormat);
    this.printer = new CustomPrinter(printerFormat);
  }

  createParser(parserFormat): Parser {
    let original = defaultParsers[parserFormat] as Parser;
    const plugin = this;
    return {
      ...original,
      preprocess(code, options) {
        return original.preprocess ? original.preprocess(code, options) : code;
      },

      async parse(text: string, options: ParserOptions) {
        await plugin.printer.initializeDefaultPrinter(options);
        let ast = await original.parse(text, options);
        const context = await getTailwindConfig(options);
        let changes = [];
        return (
          transformJavaScript(ast, {
            env: { context, options },
            changes,
          }) ?? ast
        );
      },
    };
  }
}
