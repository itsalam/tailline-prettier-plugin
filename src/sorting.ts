import { Doc, doc } from "prettier";
import {
  ETC_INDEX,
  PropRanking,
  RULE_INDEX,
  getGlobalRank,
  getPropertyDetails
} from "./groupedClasses.js";
import { Node, StringLiteral, TailwindAst, TransformerEnv } from "./types.js";
import { DefaultMap } from "./utils.js";

const { line, hardline, join, group, indent, lineSuffix, fill, ifBreak, trim } =
  doc.builders;

type SortOptions = {
  env: TransformerEnv;
  quoteChar?: string;
  delimiter?: string;
};

export function sortClasses(
  node: Node,
  { env, delimiter = ", ", quoteChar }: SortOptions,
  mapFunc?: (node: Node) => string
) {
  const classStr = mapFunc ? mapFunc(node) : (node as StringLiteral).value;

  quoteChar = (quoteChar ?? env.options.singleQuote ? `'` : `"`) as string;
  if (typeof classStr !== "string" || classStr === "") {
    return classStr;
  }
  // Ignore class attributes containing `{{`, to match Prettier behaviour:
  // https://github.com/prettier/prettier/blob/main/src/language-html/embed.js#L83-L88
  if (classStr.includes("{{")) {
    return classStr;
  }

  let result: Doc = ``;
  let parts = classStr.split(/([\t\r\f\n ]+)/);
  let classes = parts.filter((_, i) => i % 2 === 0).filter(Boolean);

  if (classes[classes.length - 1] === "") {
    classes.pop();
  }
  const needsLineBreak =
    (node.loc.start.column || 0) + classStr.length > env.options.printWidth;
  if (needsLineBreak) {
    result = createMultilineClassString(classes, node.loc.start.column, { env, delimiter, quoteChar });
  } else {
    result = group(
      [
        `${quoteChar}`,
        join(
          " ",
          [...Object.values(sortClassList(classes, { env }))].flatMap((c) => c)
        ),
        `${quoteChar}`,
      ],
      { shouldBreak: true }
    );
  }
  return result;
}

function formatGroupString(str) {
  return str
    .replace(/-/g, " ") // replace dashes with spaces
    .replace(/(^|[^a-zA-Z])([a-z])/g, (match, p1, p2) => p1 + p2.toUpperCase());
}

const createMultilineClassString = (
  classes: string[],
  lineStart: number,
  { env, delimiter = ", ", quoteChar }: SortOptions
): Doc => {
  const sortedClasses = [...Object.entries(sortClassList(classes, { env }))];
  let result: Doc[] = [];
  const currClassNames: string[] = [...sortedClasses[0]?.[1]].filter(Boolean);
  const currGroups: string[] = [sortedClasses[0][0]].filter(Boolean);
  const commentStr = (currGroups: string[]) =>
    lineSuffix(` // ${currGroups.filter(Boolean).join(", ")}`);
  const printClasses = (classes: string[]) => [quoteChar,
    fill(
      join(
        ifBreak(
          [trim, `${quoteChar}${delimiter}`, line, `${quoteChar}`],
          " ",

        ),
        classes.flatMap((str) => str)
      )
    ),
    trim,
    quoteChar]
  // console.log(sortedClasses)
  let currFormattedString = doc.printer.printDocToString(
    [
      ...currClassNames,
      commentStr(currGroups).contents.toString(),
      sortedClasses[0][0],
    ].join(" ")
  , env.options).formatted
  for (let i = 1; i < sortedClasses.length; i++) {

    // If current string exceeds print width, break it up
    if ((currFormattedString.length + lineStart) > env.options.printWidth 
    ) {
      currGroups.length &&
        result.push(commentStr(currGroups.map(formatGroupString)));
      const remainder = printClasses(currClassNames)
      result.push(remainder);
      result.push(delimiter);
      result.push(hardline);
      currGroups.splice(0, currGroups.length);
      currClassNames.splice(0, currClassNames.length);
    }
    // write the current group to the result
    const groupClassNames = sortedClasses[i][1];
    currFormattedString = doc.printer.printDocToString(
      [
        ...currClassNames,
        ...groupClassNames,
        commentStr(currGroups).contents.toString(),
        sortedClasses[i][0],
      ].join(" ")
    , env.options).formatted

    currClassNames.push(...groupClassNames);
    sortedClasses[i][0].length &&
      currGroups.push(formatGroupString(sortedClasses[i][0]));

    // Check if it's the last iteration to append the remaining classes and groups
  }
  if (currClassNames.length) {
    currGroups.length &&
      result.push(commentStr(currGroups.map(formatGroupString)));
    const remainder = printClasses(currClassNames);
    result.push(remainder);
  }
  return group(result);
};

type ClassNameWithOrder = {
  className: string;
  props: PropRanking;
};

const extractProps = (className: string, env: TransformerEnv) => {
  const getNodes = (className: string, env: TransformerEnv) => {
    const candidates = env.context.parseCandidate(className);
    const candidateNodes = candidates.flatMap((candidate) => env.context.utilities.get(candidate.kind === "arbitrary" ? candidate.property : candidate.root).flatMap((util) => util?.compileFn(candidate)));
    return candidateNodes.filter(Boolean);
  }
  
  const getNodesPolyfill = (className: string, env: TransformerEnv) => {
   return env.context.generateRules(new Set([className]), env.context)?.[0]?.[1].nodes ?? [];
  }

  const getProperty = (node) => {
    return (env.context.parseCandidate? node.property : node.prop) ?? node.value;
  }
        // console.log(classCache.get("bg-zinc-50")[0][1]) .nodes[].prop has the same value?
        let property;
        let nodes: TailwindAst[] =  env.context.parseCandidate ? getNodes(className, env) : getNodesPolyfill(className, env);
        let propRank;
        let node;

        // const nodes = env.context.classCache.filter(Boolean);
        const flattenNodesValues = (node: TailwindAst): TailwindAst[] =>
          "nodes" in node ? node.nodes.flatMap(flattenNodesValues) : [node];
        // console.log({ className, candidateNodes, candidates, nodes, })
        if (nodes.length) {
          nodes = nodes
          .flatMap(flattenNodesValues)
          .filter(getProperty);
          const nodeRanking = nodes.reduce((res, node) => {
            const rank = getGlobalRank(getProperty(node));
            if (rank && res.lowestRank > rank) {
              res.lowestRank = rank;
              res.node = node;
            }
            return res;
          }, { node: null, lowestRank: Infinity });
          node = nodeRanking.node;
          property = node ? getProperty(node) : null;
          propRank = getPropertyDetails(property);
        }
      
        return { property, propRank, node };
}

export function sortClassList(
  classList,
  { env }: SortOptions
): Record<string, string[]> {
  let classNamesWithOrder = env.context.getClassOrder(classList);

  const groups = new DefaultMap<number, ClassNameWithOrder[]>(() => []);
  classNamesWithOrder.forEach(([className]) => {
    try {
      const { property, propRank, node } = extractProps(className, env)

      if (!property || !propRank) {
        const currGroup = groups.get(ETC_INDEX);
        groups.set(
          ETC_INDEX,
          currGroup.concat({
            props: {
              globalRank: ETC_INDEX,
              label: "Etc.",
              subIndex: currGroup.length,
            },
            className,
          })
        );
      } else {
        if (propRank) {
          const currGroup = groups.get(propRank.globalRank);
          groups.set(
            propRank.globalRank,
            currGroup.concat({ props: propRank, className })
          );
        } else if (node?.kind === "rule") {
          const currGroup = groups.get(RULE_INDEX);
          groups.set(
            RULE_INDEX,
            currGroup.concat({
              props: {
                globalRank: RULE_INDEX,
                label: "rules",
                subIndex: currGroup.length,
              },
              className,
            })
          );
        }
      }
    } catch (error) {
      console.info(error);
      const currGroup = groups.get(ETC_INDEX);
      groups.set(
        ETC_INDEX,
        currGroup.concat({
          props: {
            globalRank: ETC_INDEX,
            label: "",
            subIndex: currGroup.length,
          },
          className,
        })
      );
    }
  });

  return [...groups.entries()]
    .sort((a, b) => a[0] - b[0])
    .reduce((acc, [_, classGroup]) => {
      const sortedClasses = classGroup
        .sort((a, b) => a.props.subIndex - b.props.subIndex)
        .map((item) => item.className);

      const label = classGroup[0].props.label;
      acc[label] = sortedClasses;

      return acc;
    }, {});
}
