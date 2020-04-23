# next-config

This module extends the default options of [Next.js](https://nextjs.org/).
Requires Next.js ^9.3

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

- Loads and enables [next-optimized-images](https://github.com/cyrilwanner/next-optimized-images).
- Pass in environment variables by placing them in a `.env file` similar to [what Create-React-App does](https://create-react-app.dev/docs/adding-custom-environment-variables/).
  - You must create custom environment variables beginning with NEXTJS\_. Any other variables will be ignored to avoid accidentally exposing a private key on the machine that could have the same name.
- Webpack [resolve.modules](https://webpack.js.org/configuration/resolve/#resolvemodules) includes the `src` directory.
  - This allows you to import files from `src`

```js
// imports src/pages/index/someModule.js
import someModule from "pages/index/someModule";
```

- Exposes [prependData](https://webpack.js.org/loaders/sass-loader/#prependdata) which allows you to store your global configuration, variables, functions, mixins etc. in one place.
  - in `next.config.js`

```js
const withConfig = require("@mrroll/next-config");
module.exports = withConfig({
    // Loads `scss/globals/index.scss` in every SCSS file imported
  scssPrependData = `@import "~scss/globals/index";`
});
```

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

- Specify your own polyfill by passing in a `polyfills` array or string.
  - **Important Note: You may not use paths that are loaded with [resolve.modules](https://webpack.js.org/configuration/resolve/#resolvemodules). e.g. the file `$PROJECT_FOLDER/folder/poyfill.js` must be loaded with `./folder/poyfill`, not `folder/poyfill`. This does not apply to modules found in `node_modules`.**

```js
// next.config.js
const withConfig = require("@mrroll/next-config");

module.exports = withConfig({
  // your config for other plugins or the general next.js here...

  // Pass in an array
  polyfills: ['./somePolyfill','somePolyfillFromNodeModules'];

  // Or

  // Pass in a string.
  polyfills: './somepolyFill';
});
```

# Dependency Notes

- svg-sprite-loader is locked due to https://github.com/JetBrains/svg-sprite-loader/issues/186
