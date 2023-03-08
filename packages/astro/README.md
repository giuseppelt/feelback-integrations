# Feelback Astro integration library

This package is the Astro SDK of the [Feelback](https://www.feelback.dev) service, which includes:
- builtin **components** with **presets** ready to use in your pages
- a javascript client for easy interaction with the [Feelback API](https://www.feelback.dev/docs/api-reference), useful for building custom components
- predefined **styling** you can adopt for nice-looking components with no effort


## Prerequisite
- node 16+
- astro 1.9+

## Installation
Add the package with your package manager of choice:
```sh
npm install astro-feelback
# or
pnpm add astro-feelback
# or
yarn add astro-feelback
```

## Example
After the package is installed, you can import components:
```astro
---
import FeelbackPulse from "astro-feelback/components/FeelbackPulse.astro";

interface Props = {
    title: string
}

const { title } = Astro.props;
---

<div>
    <h1>{title}</h1>
    <FeelbackPulse contentSetId="content-set-id-from-panel" icon="heart" showCount />
</div>
```

## Style
The package provides a predefined style you can import:
```astro
---
import "astro-feedback/styles/feelback.css";
---

<html>
    ...
</html>
```


### Project example
Checkout the sample project [astro-docs](samples/astro-docs) for a concrete **Feelback** integration and several usage examples.


## Additional resources
- Read the full [integration guide](https://www.feelback.dev/docs/integrations/astro)
- Checkout the official [documentation](https://www.feelback.dev/docs) with a full overview of the Feelback service


## Types
This package is built in typescript so it has full typings support.

## License
[MIT](LICENSE) © [Giuseppe La Torre](https://github.com/giuseppelt)
