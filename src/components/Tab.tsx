
import React, { useMemo } from "react";
import {  Button, H1 } from "storybook/internal/components";
import {  useParameter, useStorybookState } from "storybook/internal/manager-api";
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

  const {internal_index} = useStorybookState();
  const allStories = useMemo(() => Object.entries(internal_index.entries).filter(([_,{type}]) => type === "story").map(([_,story]) => story),[internal_index]);

  const {runScan} = useVPATServer();

  if (!active) {
    return null;
  }

  return (
    <TabWrapper>
      <TabInner>
        <H1>Accessibility Conformance Report (VPAT)</H1>
        <Button onClick={() => runScan(allStories.map(story => story.id))}>Run Scan</Button>
      </TabInner>
    </TabWrapper>
  );
};
