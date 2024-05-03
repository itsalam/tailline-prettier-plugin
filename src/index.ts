import { Plugin, Printer } from "prettier";
import { TypescriptPlugin } from "./plugin.js";

const plugin = new TypescriptPlugin("typescript", "estree");

const printers: Record<string, Printer> = {
  estree: plugin.printer,
};

const parsers = {
  typescript: plugin.parser,
};

export default {
  parsers,
  printers,
} as Plugin;
