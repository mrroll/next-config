import { defaultGetLocalIdent } from 'css-loader';
import type { WebpackConfigContext } from 'next/dist/server/config-shared';
import type { Configuration } from 'webpack';

export default function css(
  config: Configuration,
  configContext: WebpackConfigContext,
) {
  (
    config.module?.rules?.[2] as
      | {
          oneOf: Array<{
            use:
              | Array<{
                  loader: string | undefined;
                  options: {
                    modules:
                      | {
                          getLocalIdent: typeof defaultGetLocalIdent;
                          // If one wants to do Global CSS imports, this property must be deleted from the object.
                          mode: 'pure';
                          [key: string]: unknown;
                        }
                      | false;
                  };
                }>
              | undefined;
          }>;
        }
      | undefined
  )?.oneOf?.forEach((rule) => {
    if (typeof rule.use === 'undefined') {
      return;
    }

    if (rule.use instanceof Array === false) {
      return;
    }

    rule.use.forEach((item) => {
      if (typeof item.loader === 'undefined') {
        return;
      }

      if (
        item.loader.includes('css-loader') &&
        item.loader.includes('postcss-loader') === false &&
        item.options.modules !== false
      ) {
        if (item.options.modules.getLocalIdent !== undefined) {
          /**
           * Both localIdentName and getLocalIdent are needed.
           */
          if (configContext.dev === false) {
            item.options.modules.localIdentName = '[hash:base64:8]';
          }

          item.options.modules.getLocalIdent = new Proxy(
            item.options.modules.getLocalIdent,
            {
              apply(target, thisArg, argArray) {
                if (configContext.dev === true) {
                  return Reflect.apply(target, thisArg, argArray);
                }

                return defaultGetLocalIdent(...(argArray as Array<unknown>));
              },
            },
          );
        }
      }
    });
  });
}
