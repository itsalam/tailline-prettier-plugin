//Taken from: https://github.com/tailwindlabs/tailwindcss/blob/next/packages/tailwindcss/src/property-order.ts

export const GROUPED_PROPS: Record<string, string[]> = {
  Layout: [
    "container-type",
    "aspect-ratio",
    "columns",
    "break-after",
    "break-before",
    "break-inside",
    "box-decoration-break",
    "box-sizing",
    "display",
    "float",
    "clear",
    "isolation",
    "object-fit",
    "object-position",
    "overflow",
    "overscroll-behavior",
    "position",
    "inset",
    "inset-inline",
    "inset-block",
    "inset-inline-start",
    "inset-inline-end",
    "top",
    "right",
    "bottom",
    "left",
    "visibility",
    "z-index",
    "order",
    "grid-column-start",
    "grid-column-end",
    "grid-row-start",
    "grid-row-end"
  ],
  "Flexbox & Grid": [
    "flex-basis",
    "flex-direction",
    "flex-wrap",
    "flex",
    "flex-grow",
    "flex-shrink",
    "order",
    "grid-template-columns",
    "grid-column",
    "grid-template-rows",
    "grid-row",
    "grid-auto-flow",
    "grid-auto-columns",
    "grid-auto-rows",
    "gap",
    "justify-content",
    "justify-items",
    "justify-self",
    "align-content",
    "align-items",
    "align-self",
    "place-content",
    "place-items",
    "place-self"
  ],
  Spacing: ["padding", "margin"],
  Sizing: [
    "width",
    "min-width",
    "max-width",
    "height",
    "min-height",
    "max-height"
  ],
  Typography: [
    "font-family",
    "font-size",
    "font-smoothing",
    "font-style",
    "font-weight",
    "font-stretch",
    "font-variant-numeric",
    "letter-spacing",
    "line-clamp",
    "line-height",
    "list-style-image",
    "list-style-position",
    "list-style-type",
    "text-align",
    "color",
    "text-decoration-line",
    "text-decoration-color",
    "text-decoration-style",
    "text-decoration-thickness",
    "text-underline-offset",
    "text-transform",
    "text-overflow",
    "text-wrap",
    "text-indent",
    "vertical-align",
    "white-space",
    "word-break",
    "overflow-wrap",
    "hyphens",
    "content"
  ],
  Backgrounds: [
    "background-attachment",
    "background-clip",
    "background-color",
    "background-image",
    "background-origin",
    "background-position",
    "background-repeat",
    "background-size"
  ],
  Borders: [
    "border-radius",
    "border-width",
    "border-color",
    "border-style",
    "outline",
    "outline-width",
    "outline-color",
    "outline-style",
    "outline-offset"
  ],
  Effects: [
    "box-shadow",
    "text-shadow",
    "opacity",
    "mix-blend-mode",
    "background-blend-mode",
    "mask-clip",
    "mask-composite",
    "mask-image",
    "mask-mode",
    "mask-origin",
    "mask-position",
    "mask-repeat",
    "mask-size",
    "mask-type"
  ],
  Filters: [
    "filter",
    "blur",
    "brightness",
    "contrast",
    "drop-shadow",
    "grayscale",
    "hue-rotate",
    "invert",
    "saturate",
    "sepia",
    "backdrop-filter",
    "opacity",
    "--tw-backdrop-blur",
    "--tw-backdrop-brightness",
    "--tw-backdrop-contrast",
    "--tw-backdrop-grayscale",
    "--tw-backdrop-hue-rotate"
  ],
  Tables: [
    "border-collapse",
    "border-spacing",
    "table-layout",
    "caption-side"
  ],
  "Transitions & Animation": [
    "transition-property",
    "transition-behavior",
    "transition-duration",
    "transition-timing-function",
    "transition-delay",
    "animation"
  ],
  Transforms: [
    "backface-visibility",
    "perspective",
    "perspective-origin",
    "rotate",
    "scale",
    "skew",
    "transform",
    "transform-origin",
    "transform-style",
    "translate"
  ],
  Interactivity: [
    "accent-color",
    "appearance",
    "caret-color",
    "color-scheme",
    "cursor",
    "field-sizing",
    "pointer-events",
    "resize",
    "scroll-behavior",
    "scroll-margin",
    "scroll-padding",
    "scroll-snap-align",
    "scroll-snap-stop",
    "scroll-snap-type",
    "touch-action",
    "user-select",
    "will-change"
  ],
  SVG: ["fill", "stroke", "stroke-width"],
  Accessibility: ["forced-color-adjust"],
  margin: [
    "margin-inline",
    "margin-block",
    "margin-inline-start",
    "margin-inline-end",
    "margin-top",
    "margin-right",
    "margin-bottom",
    "margin-left"
  ]
};

export const GROUP_KEYS = Object.keys(GROUPED_PROPS);
export const RULE_INDEX = GROUP_KEYS.length + 1;
export const ETC_INDEX = GROUP_KEYS.length + 2;

const FLAT_PROPS: string[] = [
  ...Object.values(GROUPED_PROPS).flatMap((prop) => prop),
];

export type PropRanking = {
  label: string;
  subIndex: number;
  globalRank: number;
};

export function getGlobalRank(cssProperty): number | null {
  const res = FLAT_PROPS.indexOf(cssProperty)
  return res !== -1 ? res : null;
}

export function getPropertyDetails(cssProperty): PropRanking | null {
  const entries = Object.entries(GROUPED_PROPS);
  for (let i = 0; i < entries.length; i++) {
    const [label, properties] = entries[i];
    let subIndex = properties.indexOf(cssProperty);
    if (subIndex !== -1) {
      return {
        label,
        subIndex,
        globalRank: i,
      };
    }
  }
  return null; // Return null if the property is not found
}
