import { Parser, ParserOptions, Printer } from "prettier";
import { parsers as babelParsers } from "prettier/plugins/babel";
import { parsers as tsParsers } from "prettier/plugins/typescript";
import { getTailwindConfig } from "./config.js";
import { CustomPrinter } from "./printer.js";
import { transformJavaScript } from "./transform.js";
import { DesignSystem, Node } from "./types.js";

const defaultParsers = {
  ...tsParsers,
  ...babelParsers,
};

//TODO: Add in options for newline threshold?
export class TailLinePlugin {
  printer: CustomPrinter;
  parser: Parser<Node>;
  printers: Record<string, Printer>;
  parsers: Record<string, Parser<Node>>;
  config?: DesignSystem;

  constructor(parserFormat: string, printerFormat: string) {
    this.createParser = this.createParser.bind(this);
    this.parser = this.createParser(parserFormat);
    this.printer = new CustomPrinter(printerFormat);
    this.printers = {
      [printerFormat]: this.printer,
    };
    
    this.parsers = {
      [parserFormat]: this.parser,
    };
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
        if (!this.config) {
          this.config = await getTailwindConfig(options);
        }

        let changes = [];
        return (
          transformJavaScript(ast, {
            env: { context: this.config, options },
            changes,
          }) ?? ast
        );
      },
    };
  }
}

const TailLinePluginIntsance = new TailLinePlugin("typescript", "estree");
export default TailLinePluginIntsance;
