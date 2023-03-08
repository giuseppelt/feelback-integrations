# Feelback React integration library

This package is the React SDK of the [Feelback](https://www.feelback.dev) service, which includes:
- builtin **components** with **presets** ready to use in your pages
- **hooks** for easy interaction with the [Feelback API](https://www.feelback.dev/docs/api-reference), useful for building custom components
- predefined **styling** you can adopt for nice-looking components with no effort


## Prerequisite
- node 14+
- react 17+ (peer dependency)

## Installation
Add the package with your package manager of choice:
```sh
npm install @feelback/react
# or
pnpm add @feelback/react
# or
yarn add @feelback/react
```

The package is completely tree-shakable. You can take advantage of bundlers like [Vite](https://vitejs.dev/) or [esbuild](https://esbuild.github.io/) to trim the final package size with only the components you actually use.

## Example
After the package is installed, you can import components and presets:
```tsx
import { FeelbackPulse, PRESET_PULSE_HEART } from "@feelback/react";

function PostTitle({ title }) {
    return (
        <div>
            <h1>{title}</h1>
            <FeelbackPulse contentSetId="content-set-id-from-the-panel"
                preset={PRESET_PULSE_HEART}
                showCount
            />
        </div>
    );
}
```

## Style
The package provides a predefined style you can import:
```ts
import "@feelback/react/styles/feelback.css";
```

## Additional resources
- Read the full [integration guide](https://www.feelback.dev/docs/integrations/react)
- Checkout the official [documentation](https://www.feelback.dev/docs) with a full overview of the Feelback service


## Types
This package is built in typescript so it has full typings support.

## License
[MIT](LICENSE) © [Giuseppe La Torre](https://github.com/giuseppelt)
