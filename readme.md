# next-config

This module extends the default options of [Next.js](https://nextjs.org/).
Requires Next.js ^9.5

# Get Started

1. `yarn install @mrroll/next-config`
2. Enable the plugin in your Next.js configuration file:

```js
// next.config.js
const withConfig = require("@mrroll/next-config");

module.exports = withConfig({
  // your config for other plugins or the general next.js here...
});
```

# Features

- Loads and enables [next-optimized-images](https://github.com/cyrilwanner/next-optimized-images) and all image loaders.
- [css-loader modules](https://webpack.js.org/loaders/css-loader/#object) default options

  - [`localIdentName`](https://webpack.js.org/loaders/css-loader/#localidentname) in development is `[path][name]__[local]--[hash:base64:5]`
  - [`localIdentName`](https://webpack.js.org/loaders/css-loader/#localidentname) in production is `[hash:base64:8]`
  - [`mode`](https://webpack.js.org/loaders/css-loader/#mode) has been reset to default so you can use global css modules.

  ```scss
  :global(.box) {
    //
  }
  ```

- Minifies CSS in production.

# TODO

### Polyfills

- [ ] Support `tsconfig.json`
- [ ] Support the `paths` object for module resolution
