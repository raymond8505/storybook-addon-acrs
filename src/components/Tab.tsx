
import React, { useCallback } from "react";
import {  Button, H1 } from "storybook/internal/components";
import { useGlobals, useParameter } from "storybook/internal/manager-api";
import { styled } from "storybook/internal/theming";
import { KEY } from "../constants";
import { useVPATServer } from "src/hooks/useVPATServer";

interface TabProps {
  active: boolean;
}

const TabWrapper = styled.div(({ theme }) => ({
  background: theme.background.content,
  padding: "4rem 20px",
  minHeight: "100vh",
  boxSizing: "border-box",
}));

const TabInner = styled.div({
  maxWidth: 768,
  marginLeft: "auto",
  marginRight: "auto",
});

export const Tab: React.FC<TabProps> = ({ active }) => {
  // https://storybook.js.org/docs/react/addons/addons-api#useparameter
  const config = useParameter<string>(
    KEY,
    "fallback value of config from parameter",
  );

  const {runScan} = useVPATServer();

  

  // https://storybook.js.org/docs/addons/addons-api#useglobals
  const [globals, updateGlobals] = useGlobals();
  const value = globals[KEY];

  const update = useCallback((newValue: typeof value) => {
    updateGlobals({
      [KEY]: newValue,
    });
  }, []);

  if (!active) {
    return null;
  }

  return (
    <TabWrapper>
      <TabInner>
        <H1>Accessibility Conformance Report (VPAT)</H1>
        <Button onClick={() => runScan()}>Run Scan</Button>
      </TabInner>
    </TabWrapper>
  );
};
