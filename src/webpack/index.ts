import type { NextConfig } from 'next';
import type { WebpackConfigContext } from 'next/dist/server/config-shared';
import type { Configuration } from 'webpack';

import css from '@/webpack/css';
import resolve from '@/webpack/resolve';
import svgr from '@/webpack/svgr';

export default function webpack(
  config: Configuration,
  configContext: WebpackConfigContext,
  configWebPack: NextConfig['webpack'],
) {
  resolve(config);

  css(config, configContext);

  svgr(config);

  if (typeof configWebPack === 'function') {
    return configWebPack(config, configContext) as unknown;
  }

  return config;
}
