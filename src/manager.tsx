import React from "react";
import { addons, types } from "storybook/internal/manager-api";

import { Tab } from "./components/Tab";

import { ADDON_ID,  TAB_ID } from "./constants";

/**
 * Note: if you want to use JSX in this file, rename it to `manager.tsx`
 * and update the entry prop in tsup.config.ts to use "src/manager.tsx",
 */

// Register the addon
addons.register(ADDON_ID, (api) => {

  // addons.add(TOOL_ID, {
  //   type: types.TOOL,
  //   title: "My addon 2",
  //   match: ({ tabId }) =>
  //     !!(tabId === TAB_ID),
  //   render: () => <Tool api={api} />,
  // });

  addons.add(TAB_ID, {
    type: types.TAB,
    title: "VPAT",
    render: ({ active }) => <Tab active={active} />,
  });
});
