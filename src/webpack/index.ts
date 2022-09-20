import type { NextConfig } from 'next';
import type { WebpackConfigContext } from 'next/dist/server/config-shared';
import type { Configuration } from 'webpack';
import resolve from './resolve';
import css from './css';
import svgr from './svgr';

export default function webpack(
  config: Configuration,
  configContext: WebpackConfigContext,
  configWebPack: NextConfig['webpack']
) {
  resolve(config);

  css(config, configContext);

  svgr(config);

  if (typeof configWebPack === 'function') {
    return configWebPack(config, configContext);
  }

  return config;
}
