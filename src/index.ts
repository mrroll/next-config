import merge from 'ts-deepmerge';
import type { NextConfig } from 'next';
import type { WebpackConfigContext } from 'next/dist/server/config-shared';
import type { Configuration } from 'webpack';
import defaultConfig from './config';
import defaultWebpack from './webpack';

const withConfig = (config: NextConfig) => {
  const { webpack, ...rest } = config;

  const updatedConfig = {
    ...merge(defaultConfig, rest),

    webpack: (config: Configuration, configContext: WebpackConfigContext) => {
      return defaultWebpack(config, configContext, webpack);
    },
  };

  return updatedConfig;
};

export = withConfig;
