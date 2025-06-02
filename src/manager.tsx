import React from "react";
import { addons, types } from "storybook/internal/manager-api";

import { Tab } from "./components/Tab";
import { ADDON_ID, TAB_ID } from "src/constants";

addons.register(ADDON_ID, (api) => {

  addons.add(TAB_ID, {
    type: types.TAB,
    title: "ACR",
    // only show on local builds
    match: () => location.hostname.match(/(localhost|127\.0\.0\.1)/) !== null,
    render: ({ active }) => <Tab active={active} />,
  });
  addons.add('button-id',{
    type: types.TOOL,
    title: "ACR Button",
    // only show on local builds
    match: () => location.hostname.match(/(localhost|127\.0\.0\.1)/) !== null,
    render: () => <button onClick={()=>{
      console.log('button clicked');
      addons.getChannel().on('storybook/a11y/result',(e) => {
        console.log('a11y result', e);
      })
    }}>do the thing</button>
  })
});
