# 7.0.0

- Add correct peer dependency.
- Remove image optmization. Simply use https://nextjs.org/docs/api-reference/next/image

# 6.1.0

- Last Version of next-config with next-optimized-images

- Temporarily use fork of next-optimized-images
  - Package | https://www.npmjs.com/package/@mrroll/next-optimized-images
  - Pull Request | https://github.com/cyrilwanner/next-optimized-images/pull/201
  - Issue | https://github.com/cyrilwanner/next-optimized-images/issues/50
- Change eslint configuration.
- Update dependencies.

# 6.0.0

- Remove polyfill feature.

# 5.0.0

- Revert allowing use of global css in any file containing `_app`

# 4.1.0

- Add the use of global css in any file containing `_app`

# 4.0.0

- Remove `scssPrependData` in favort of `sassOptions.prependData`

# 3.0.0

## Notable Changes

- Remove .env parsing.

## Others

- Remove dotenv dependency.
- Fix eslint config.
- Update dependencies.
