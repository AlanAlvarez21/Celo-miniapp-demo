import { createRequire } from 'module';
const require = createRequire(import.meta.url);

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /thread-stream\/test\//,
      loader: 'ignore-loader',
    });
    config.module.rules.push({
      test: /thread-stream\/bench\.js/,
      loader: 'ignore-loader',
    });
    config.module.rules.push({
      test: /thread-stream\/README\.md/,
      loader: 'ignore-loader',
    });
    config.module.rules.push({
      test: /thread-stream\/LICENSE/,
      loader: 'ignore-loader',
    });
    config.module.rules.push({
      test: /@react-native-async-storage\/async-storage/,
      loader: 'ignore-loader',
    });
    config.module.rules.push({
      test: /pino-pretty/,
      loader: 'ignore-loader',
    });

    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@react-native-async-storage/async-storage': false,
    };

    if (!isServer) {
      config.plugins.push(
        new (require('webpack').IgnorePlugin)({
          resourceRegExp: /^pino-pretty$/,
          contextRegExp: /pino$/,
        })
      );
    }

    return config;
  },
}

export default nextConfig
