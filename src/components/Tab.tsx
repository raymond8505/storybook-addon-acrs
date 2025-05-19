
import React, { useEffect, useMemo } from "react";
import {  Button, H1 } from "storybook/internal/components";
import {   useGlobals, useStorybookState } from "storybook/internal/manager-api";
import { styled } from "storybook/internal/theming";

import { useVPATServer } from "src/hooks/useVPATServer";
import { ReportViewer } from "src/components/ReportViewer";

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


  const [globals,updateGlobals] = useGlobals()
  
  const sbState = useStorybookState();
  const allStories = useMemo(() => sbState.internal_index?.entries ? 
                                    Object.entries(sbState.internal_index?.entries).filter(([_,{type}]) => type === "story").map(([_,story]) => story) 
                                  : undefined,
                            [sbState])

  const {runScan} = useVPATServer({
    onReportCreated: (report) => {
      updateGlobals({
        report: encodeURIComponent(report.id)
      })
    },
  });

  if (!active) {
    return null;
  }

  return (
    <TabWrapper>
      <TabInner>
        <H1>Accessibility Conformance Reports</H1>
        <Button onClick={() => runScan(allStories.map(story => story.id))}>Run Scan</Button>
        {
          globals.report ? <ReportViewer id={globals.report} /> : null
        }
      </TabInner>
    </TabWrapper>
  );
};
