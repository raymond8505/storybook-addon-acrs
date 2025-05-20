
import React, { useCallback, useEffect, useMemo } from "react";
import {  Button, H1, H2 } from "storybook/internal/components";
import {   useGlobals, useStorybookState } from "storybook/internal/manager-api";
import { styled } from "storybook/internal/theming";

import { useVPATServer } from "src/hooks/useVPATServer";
import { ReportViewer } from "src/components/ReportViewer";
import { ScanProgress } from "src/components/ScanProgress";

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

  const {runScan, ruleDefinitions, scanning, scanProgress, connected} = useVPATServer({
    onReportCreated: useCallback((report) => {
      updateGlobals({
        report: encodeURIComponent(report.id)
      })
    },[updateGlobals])
  });

  if (!active) {
    return null;
  }

  return (
    <TabWrapper style={{
      height: "100%"
    }}>
      <TabInner style={{
        maxWidth: "none",
        padding: "0 10vmin 4rem",
      }}>
        <H1>Accessibility Conformance Reports</H1>
        {connected ? <>
        <div>
          <Button onClick={() => runScan(allStories.map(story => story.id))} disabled={scanning}>Run Scan</Button>
          {scanning ? <ScanProgress progress={scanProgress} /> : null}
        </div>
        {
          globals.report && !scanning ? <ReportViewer id={globals.report} ruleDefinitions={ruleDefinitions} /> : null
        }</> : <div>Connecting To Server</div>}
      </TabInner>
    </TabWrapper>
  );
};
