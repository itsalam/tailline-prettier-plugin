import { parsers as babelParsers } from "prettier/plugins/babel";
import { parsers as tsParsers } from "prettier/plugins/typescript";

const languages = [];

const parsers = {
  ...tsParsers,
  ...babelParsers,
};

const printers = {};

export default {
  languages,
  parsers,
  printers,
};
