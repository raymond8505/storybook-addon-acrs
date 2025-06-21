import type { Meta, StoryObj } from "@storybook/react";

import { ScanProgress } from "../components/ScanProgress";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof ScanProgress> = {
  title: "Addon/ScanProgress",
  component: ScanProgress,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes

  parameters: {},
};

// t

export default meta;
type Story = StoryObj<typeof ScanProgress>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const Primary: Story = {
  // More on args: https://storybook.js.org/docs/react/writing-stories/args
  args: {
    progress: {
      currentId: "addon-scanprogress--primary",
      currentIndex: 1,
      total: 10,
      progress: 0.5,
    },
  },
};
