import type { StorybookConfig } from "@storybook/react-vite";
const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "./local-preset.js",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {}
  },
  async viteFinal(config) {
    // Merge custom configuration into the default config
    const { mergeConfig } = await import('vite');
 
    const mergedConfig = mergeConfig(config, {
      build: {
        watch: {
          include: new RegExp(`${process.cwd()}/dist/.*`),
        }
      }
    });
    
    return mergedConfig;
  },
  docs: {
    autodocs: "tag",
  },
};
export default config;
