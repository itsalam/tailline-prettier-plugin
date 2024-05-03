# prettier-plugin-tailline

This is a Prettier plugin designed to enhance the formatting of TailwindCSS classes within TypeScript files. It sorts class names into groups and manages newlines to improve readability and maintainability of your code.

## Features

- **Sorting**: Automatically sorts TailwindCSS class names according to best practices.
- **Grouping**: Groups class names to make the template look cleaner and more organized.
- **TypeScript Support**: Fully supports TypeScript, providing error checks and completions that work seamlessly with your development environment.

## Example

From

```tsx
  <HoverCardPrimitive.Content
    ref={ref}
    align={align}
    sideOffset={sideOffset}
    className={cn(
      "z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
```

To

```tsx
    <HoverCardPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in" ,
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0" ,
        "data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95" ,
        "data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2" ,
        "data-[side=left]:slide-in-from-right-2" ,
        "data-[side=right]:slide-in-from-left-2" ,
        "data-[side=top]:slide-in-from-bottom-2",
        "z-50 w-64 rounded-md p-4", // layoutControl, sizing, border, padding
        "outline-none border shadow-md", // shadowFilterEffects, rules
        className,
      )}
      {...props}
    />
```

## Installation

To install the plugin, you can use npm:

```bash
npm install prettier-plugin-tailline --save-dev
```

After installation, you need to add the plugin to your Prettier configuration. Here's how you can do it:

## For JSON Configuration (`.prettierrc` or `prettier.config.json`)

```json
{
  "plugins": ["prettier-plugin-tailline"]
}
```
