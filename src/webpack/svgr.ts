import type { Configuration } from 'webpack';

export default function svgr(config: Configuration) {
  config.module?.rules?.push({
    test: /\.svg$/i,
    issuer: /\.[jt]sx?$/,
    use: ['@svgr/webpack'],
  });
}
