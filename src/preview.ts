import React from "react";

import { exposeParameters, instantTransitions } from "src/decorators";
import type { ProjectAnnotations, Renderer } from "storybook/internal/types";

const preview: ProjectAnnotations<Renderer> = {
  initialGlobals: {
    ["report"]: "results",
  },
  decorators: [exposeParameters, instantTransitions],
};

export default preview;
