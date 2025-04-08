//Taken from: https://github.com/tailwindlabs/tailwindcss/blob/next/packages/tailwindcss/src/property-order.ts

export const GROUPED_PROPS2: Record<string, string[]> = {
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
    "z-index"
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
  Accessibility: ["forced-color-adjust"]
};



export const GROUPED_PROPS: Record<string, string[]> = {
  Layout: [
 "container-type",  "visibility", "position",
    "inset",
    "inset-inline",
    "inset-block",
    "inset-inline-start",
    "inset-inline-end",
    "top",
    "right",
    "bottom",
    "left",
    "isolation",
    "z-index",
    "order",
    "grid-column",
    "grid-column-start",
    "grid-column-end",
    "grid-row",
    "grid-row-start",
    "grid-row-end",
    "float",
    "clear",
  ],

  margin: [
    "margin",
    "margin-inline",
    "margin-block",
    "margin-inline-start",
    "margin-inline-end",
    "margin-top",
    "margin-right",
    "margin-bottom",
    "margin-left",
  ],

  sizing: [
    "box-sizing",
    "display",
    "aspect-ratio",
    "height",
    "max-height",
    "min-height",
    "width",
    "max-width",
    "min-width",
  ],

  "flex-layout": [
    "flex",
    "flex-shrink",
    "flex-grow",
    "flex-basis",
    "table-layout",
    "caption-side",
    "border-collapse",
  ],

  spacing: ["border-spacing"],

  transforms: [
    "backface-visibility",
    "perspective",
    "perspective-origin",
    "transform-origin",
    "translate",
    "--tw-translate-x",
    "--tw-translate-y",
    "scale",
    "--tw-scale-x",
    "--tw-scale-y",
    "--tw-scale-z",
    "rotate",
    "--tw-rotate-x",
    "--tw-rotate-y",
    "--tw-rotate-z",
    "--tw-skew-x",
    "--tw-skew-y",
    "transform",
  ],

  interactivity: [
    "field-sizing",
    "animation",
    "cursor",
    "pointer-events",
    "touch-action",
    "--tw-pan-x",
    "--tw-pan-y",
    "--tw-pinch-zoom",
    "resize",
    "scroll-snap-type",
    "--tw-scroll-snap-strictness",
    "scroll-snap-align",
    "scroll-snap-stop",
    "scroll-margin",
    "scroll-margin-inline-start",
    "scroll-margin-inline-end",
    "scroll-margin-top",
    "scroll-margin-right",
    "scroll-margin-bottom",
    "scroll-margin-left",
    "scroll-padding",
    "scroll-padding-inline-start",
    "scroll-padding-inline-end",
    "scroll-padding-top",
    "scroll-padding-right",
    "scroll-padding-bottom",
    "scroll-padding-left",
  ],

  "list-layout": ["list-style-position", "list-style-type", "list-style-image"],

  "flex/grid-layout": [
    "appearance",
    "columns",
    "break-before",
    "break-inside",
    "break-after",
    "grid-auto-columns",
    "grid-auto-flow",
    "grid-auto-rows",
    "grid-template-columns",
    "grid-template-rows",
    "flex-direction",
    "flex-wrap",
    "place-content",
    "place-items",
    "align-content",
    "align-items",
    "justify-content",
    "justify-items",
    "gap",
    "column-gap",
    "row-gap",
    "--tw-space-x-reverse",
    "--tw-space-y-reverse",
    "divide-x-width",
    "divide-y-width",
    "--tw-divide-y-reverse",
    "divide-style",
    "divide-color",
    "--tw-divide-opacity",
    "place-self",
    "align-self",
    "justify-self",
  ],

  overflow: [
    "overflow",
    "overflow-x",
    "overflow-y",
    "overscroll-behavior",
    "overscroll-behavior-x",
    "overscroll-behavior-y",
    "scroll-behavior",
  ],

  "text-wrap": [
    "text-overflow",
    "hyphens",
    "white-space",
    "text-wrap",
    "overflow-wrap",
    "work-break",
  ],

  border: [
    "border-radius",
    "border-start-radius", // Not real
    "border-end-radius", // Not real
    "border-top-radius", // Not real
    "border-right-radius", // Not real
    "border-bottom-radius", // Not real
    "border-left-radius", // Not real
    "border-start-start-radius",
    "border-start-end-radius",
    "border-end-end-radius",
    "border-end-start-radius",
    "border-top-left-radius",
    "border-top-right-radius",
    "border-bottom-right-radius",
    "border-bottom-left-radius",

    "border-width",
    "border-inline-width", // Not real
    "border-inline-start-width",
    "border-inline-end-width",
    "border-top-width",
    "border-right-width",
    "border-bottom-width",
    "border-left-width",

    "border-style",
    "border-color",
    "border-x-color", // Not real
    "border-y-color", // Not real
    "border-inline-start-color",
    "border-inline-end-color",
    "border-top-color",
    "border-right-color",
    "border-bottom-color",
    "border-left-color",

    "--tw-border-opacity",
  ],

  background: [
    "background-color",
    "--tw-bg-opacity",

    "background-image",
    "--tw-gradient-stops",
    "--tw-gradient-via-stops",
    "--tw-gradient-from",
    "--tw-gradient-from-position",
    "--tw-gradient-via",
    "--tw-gradient-via-position",
    "--tw-gradient-to",
    "--tw-gradient-to-position",
    "box-decoration-break",
    "background-size",
    "background-attachment",
    "background-clip",
    "background-position",
    "background-repeat",
    "background-origin",
  ],

  svg: ["fill", "stroke", "stroke-width"],

  object: ["object-fit", "object-position"],

  padding: [
    "padding",
    "padding-inline",
    "padding-block",
    "padding-inline-start",
    "padding-inline-end",
    "padding-top",
    "padding-right",
    "padding-bottom",
    "padding-left",
  ],

  "text-style": [
    "text-align",
    "text-indent",
    "vertical-align",
    "font-family",
    "font-size",
    "font-weight",
    "text-transform",
    "font-style",
    "font-stretch",
    "font-variant-numeric",
    "line-height",
    "letter-spacing",
    "color",
    "--tw-text-opacity",
    "text-decoration-line",
    "text-decoration-color",
    "text-decoration-style",
    "text-decoration-thickness",
    "text-underline-offset",
    "-webkit-font-smoothing",
  ],

  "theme-color": [
    "placeholder-color",
    "--tw-placeholder-opacity",
    "caret-color",
    "accent-color",
    'color-scheme',
  ],

  transparency: ["opacity", "background-blend-mode", "mix-blend-mode"],

  "outline-style": [
    "box-shadow",
    "--tw-shadow",
    "--tw-shadow-color",
    "--tw-ring-shadow",
    "--tw-ring-color",
    "--tw-inset-shadow",
    "--tw-inset-shadow-color",
    "--tw-inset-ring-shadow",
    "--tw-inset-ring-color",
    "--tw-ring-opacity",
    "--tw-ring-offset-width",
    "--tw-ring-offset-color",
    "outline",
    "outline-width",
    "outline-offset",
    "outline-color",
  ],

  filters: [
    "--tw-blur",
    "--tw-brightness",
    "--tw-contrast",
    "--tw-drop-shadow",
    "--tw-grayscale",
    "--tw-hue-rotate",
    "--tw-invert",
    "--tw-saturate",
    "--tw-sepia",
    "filter",
    "--tw-backdrop-blur",
    "--tw-backdrop-brightness",
    "--tw-backdrop-contrast",
    "--tw-backdrop-grayscale",
    "--tw-backdrop-hue-rotate",
    "--tw-backdrop-invert",
    "--tw-backdrop-opacity",
    "--tw-backdrop-saturate",
    "--tw-backdrop-sepia",
    "backdrop-filter",
  ],

  "transitions-animations": [
    "transition-property",
    "transition-delay",
    "transition-duration",
    "transition-timing-function",
    "will-change",
    "contain",
    "content",
  ],

  "Accessibility": [
    "forced-color-adjust",
  ]
};

export const GROUP_KEYS = Object.keys(GROUPED_PROPS2);
export const RULE_INDEX = GROUP_KEYS.length + 1;
export const ETC_INDEX = GROUP_KEYS.length + 2;

export const FLAT_PROPS: string[] = [
  ...Object.values(GROUPED_PROPS2).flatMap((prop) => prop),
];

export type PropRanking = {
  label: string;
  subIndex: number;
  globalRank: number;
};

export function getPropertyDetails(cssProperty): PropRanking | null {
  const entries = Object.entries(GROUPED_PROPS2);
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
