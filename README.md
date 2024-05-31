# prettier-plugin-tailline

This is a Prettier plugin designed to enhance the formatting of TailwindCSS classes within TypeScript files. It sorts class names into groups and manages newlines to improve readability and maintainability of your Tailwind classes.

> :warning: **Compatibility Notice**: This plugin is compatible only with TailwindCSS versions 3 and 4.
>

## Features

- **Sorting**: Automatically sorts TailwindCSS class names according to best practices.
- **Grouping**: Groups class names to make the template look cleaner and more organized.
- **TypeScript Support**: Fully supports TypeScript, providing error checks and completions that work seamlessly with your development environment.
- Tailwind Merger & ClassName compatability: Supports className-like packages and formats accordingly

## Example

Example taken from [Aceternity's signup form (no offense guys)](https://ui.aceternity.com/components/signup-form)

```tsx
"use client";
...
  <input
    type={type}
    className={cn(
      `flex h-10 w-full border-none bg-gray-50 dark:bg-zinc-800 text-black dark:text-white shadow-input rounded-md px-3 py-2 text-sm  file:border-0 file:bg-transparent 
    file:text-sm file:font-medium placeholder:text-neutral-400 dark:placeholder-text-neutral-600 
    focus-visible:outline-none focus-visible:ring-[2px]  focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600
      disabled:cursor-not-allowed disabled:opacity-50
      dark:shadow-[0px_0px_1px_1px_var(--neutral-700)]
      group-hover/input:shadow-none transition duration-400
      `,
      className
    )}
    ref={ref}
    {...props}
  />
```

To

```tsx
<input
  type={type}
  className={cn(
    'shadow-input file:border-0 dark:placeholder-text-neutral-600',
    'focus-visible:ring-[2px] dark:shadow-[0px_0px_1px_1px_var(--neutral-700)]',
    'group-hover/input:shadow-none',
    'flex h-10 w-full disabled:cursor-not-allowed', // sizing, interactions
    'rounded-md bg-gray-50 dark:bg-zinc-800 file:bg-transparent', // border, background
    'py-2 px-3', // padding
    'text-sm file:text-sm file:font-medium text-black dark:text-white', // textStyles
    'placeholder:text-neutral-400',
    'disabled:opacity-50', // transparency
    'focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600', // outlineEffects
    'focus-visible:outline-none',
    'transition duration-400 border-none', // transitionsAnimations
    className,
  )}
  ref={ref}
  {...props}
/>;
```

> :warning **Current Caveats**:
>
> - Will delete existing comments written next to classnames.
> - Only merges and refactors top level className utility functions
> - Will also merge and shift all className strings on the same level to the top.

## Installation

To install the plugin, you can use npm:

```bash
npm install prettier-plugin-tailline --save-dev
```

## To run on local file

```bash
npm run build
npx prettier --plugin ./dist/index.js {FILE-TO-FORMAT} --no-cache
```

After installation, you need to add the plugin to your Prettier configuration.

## For JSON Configuration (`.prettierrc` or `prettier.config.json`)

```json
{
  "plugins": ["prettier-plugin-tailline"]
}
```

### TODOS

[] - Create a config to work off of the tailwind config.
[] - Create a preference option for variants over sortings
[] - Read class order from the tailwind config. ()
[] - Read class groups from the tailwind config.
[] - Create group name mapping config.
