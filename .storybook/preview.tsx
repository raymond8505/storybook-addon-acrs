import React from "react";
import type { Preview } from "@storybook/react";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  initialGlobals: {
    background: { value: "light" },
  },
  decorators: [
    (Story) => (
      <div>
        <style type="text/css">
          {`
        body {
          font-family:"Nunito Sans",-apple-system,".SFNSText-Regular","San Francisco",BlinkMacSystemFont,"Segoe UI","Helvetica Neue",Helvetica,Arial,sans-serif;
          font-size:16px;
          margin:0;
          -webkit-font-smoothing:antialiased;
          -moz-osx-font-smoothing:grayscale;
          -webkit-tap-highlight-color:rgba(0, 0, 0, 0);
          -webkit-overflow-scrolling:touch;
          padding:0;
          color:#2E3438;
          
        }`}
        </style>
        <Story />
      </div>
    ),
  ],
};

export default preview;
