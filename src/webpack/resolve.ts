import type { Configuration } from 'webpack';

export default function resolve(config: Configuration) {
  if (typeof config.resolve === 'undefined') {
    return;
  }

  config.resolve.fallback = { fs: false };
}
