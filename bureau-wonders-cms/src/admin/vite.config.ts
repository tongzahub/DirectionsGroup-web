import { mergeConfig, type UserConfig } from 'vite';

export default (config: UserConfig) => {
  return mergeConfig(config, {
    plugins: [],
    build: {
      sourcemap: false,
    },
    server: {
      host: '0.0.0.0',
      port: 8080,
    },
  });
};