import type { StorybookConfig } from "@storybook/react-webpack5";
import path from "path";

const config: StorybookConfig = {
  stories: [
    "../shared/src/**/*.mdx",
    "../shared/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-a11y",
  ],
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
  webpackFinal: async (config) => {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "@shared": path.resolve(__dirname, "../shared/src"),
      };
      config.resolve.extensions = config.resolve.extensions || [];
      config.resolve.extensions.push(".ts", ".tsx", ".js", ".jsx");
    }

    // Config ts-loader to compile tsx stories and compile JSX -> JS
    config.module?.rules?.push({
      test: /\.(ts|tsx)$/,
      use: [
        {
          loader: require.resolve("ts-loader"),
          options: {
            transpileOnly: true,
            configFile: path.resolve(__dirname, "../tsconfig.json"),
            compilerOptions: {
              jsx: "react-jsx",
            },
          },
        },
      ],
      exclude: /node_modules/,
    });

    // Add PostCSS loader for CSS compilation
    config.module?.rules?.push({
      test: /\.css$/,
      use: [
        {
          loader: require.resolve("postcss-loader"),
          options: {
            postcssOptions: {
              plugins: [
                require("tailwindcss"),
                require("autoprefixer"),
              ],
            },
          },
        },
      ],
      include: path.resolve(__dirname, "../"),
    });

    return config;
  },
};

export default config;
