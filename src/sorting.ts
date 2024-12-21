import { Doc, doc } from "prettier";
import {
  PropRanking,
  RULE_INDEX,
  getPropertyDetails as getPropertyRanks,
} from "./grouped-classes.js";
import { Node, StringLiteral, TransformerEnv } from "./types.js";
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
    (node.loc?.start.column || 0) + classStr.length > env.options.printWidth;
  if (needsLineBreak) {
    result = createMultilineClassString(classes, { env, delimiter, quoteChar });
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

const createMultilineClassString = (
  classes: string[],
  { env, delimiter = ", ", quoteChar }: SortOptions
): Doc => {
  const sortedClasses = [...Object.entries(sortClassList(classes, { env }))];
  let result: Doc[] = [];
  const currClassNames: string[] = [...sortedClasses[0][1]];
  const currGroups: string[] = [sortedClasses[0][0]].filter(Boolean);
  const commentStr = (currGroups: string[]) =>
    lineSuffix(` // ${currGroups.filter(Boolean).join(", ")}`);
  for (let i = 1; i < sortedClasses.length; i++) {
    const groupClassNames = sortedClasses[i][1];
    if (
      indent(
        [
          ...currClassNames,
          ...groupClassNames,
          commentStr(currGroups).contents.toString(),
          sortedClasses[i][0],
        ].join(" ")
      ).contents.toString().length > env.options.printWidth ||
      result.length === 0
    ) {
      currGroups.length && result.push(commentStr(currGroups));
      result.push(
        quoteChar,
        fill(
          join(
            ifBreak(
              [trim, `${quoteChar}${delimiter}`, line, `${quoteChar}`],
              " "
            ),
            currClassNames.flatMap((str) => str)
          )
        ),
        trim,
        quoteChar
      );
      result.push(delimiter);
      result.push(hardline);
      currGroups.splice(0, currGroups.length);
      currClassNames.splice(0, currClassNames.length);
    }
    // write the current group to the result
    currClassNames.push(...groupClassNames);
    sortedClasses[i][0].length && currGroups.push(sortedClasses[i][0]);

    // Check if it's the last iteration to append the remaining classes and groups
  }
  if (currClassNames.length) {
    result.push([`${quoteChar}`, join(" ", currClassNames), `${quoteChar}`]);
    currGroups.length && result.push(commentStr(currGroups));
  }
  return group(result);
};

type ClassNameWithOrder = {
  className: string;
  props: PropRanking;
};

export function sortClassList(
  classList,
  { env }: SortOptions
): Record<string, string[]> {
  let classNamesWithOrder = env.context.getClassOrder(classList);
  const groups = new DefaultMap<number, ClassNameWithOrder[]>(() => []);
  classNamesWithOrder.forEach(([className]) => {
    try {
      let property;
      let res;
      let propRank;
      if (!env.context.parseCandidate) {
        property = env.context
          .generateRules([className], env.context, false)
          // @ts-ignore
          .map((c) => c[1].nodes[0].prop)[0];
        propRank = getPropertyRanks(property);
      } else {
        const candidate = env.context.parseCandidate(className);
        // const variant = env.context.parseVariant(className);
        // Figure out variants, wait for tailwind v4 documentation?
        // if (variant) {
        //   const func = env.context.utilities.get(variant.root);
        // }
        // @ts-ignore
        const func = env.context.utilities.get(candidate?.root);
        res = func?.compileFn?.(candidate);
        property = res?.[0].property ?? null;
        propRank =
          getPropertyRanks(property) ?? getPropertyRanks(res?.[0].value);
      }
      if (!property || !propRank) {
        const currGroup = groups.get(-1);
        groups.set(
          -1,
          currGroup.concat({
            props: { globalRank: -1, label: "", subIndex: currGroup.length },
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
        } else if (res?.kind === "rule") {
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
    } catch (e) {
      console.error(e);
      console.error(className);
      console.error(env.context.parseCandidate(className));
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
