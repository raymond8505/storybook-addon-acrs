
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
  padding: "2rem 0 0",
  minWidth: "100%",
  boxSizing: "border-box",
  height: "100%",
  overflow: "hidden",
}));

const TabInner = styled.div({
  marginLeft: "auto",
  marginRight: "auto",
  maxWidth: "none",
  padding: "0 0 0 10vmin",
  height: "100%",
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'stretch',
});

const Sidebar = styled.div({
  width: '15%',
  height: '100%',
})

const Reports = styled.div({
  width: '85%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'stretch'
})

const View = styled.div({
  display: 'flex',
  flexDirection: 'row',
  height: '100%',
  width: '100%',
  overflow: 'hidden',
  boxSizing: 'border-box',
  position: 'relative',
  gap: '10px',

});

const ReportTypeTabs = styled.div({
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  marginBottom: '10px',
  justifyContent: 'flex-start',
  gap: '2px',
  justifySelf: 'flex-start',
})

const TabButton = styled(Button)<{ active?: boolean }>(({ active }) => ({
  flexGrow: 0,
  textAlign: 'center',
  fontWeight: active ? 'bold' : 'normal',
  backgroundColor: active ? '#e0e0e0' : 'transparent',
  borderBottom: active ? '2px solid #007bff' : 'none',
  color: active ? '#007bff' : '#000',
  cursor: 'pointer',
  padding: '10px',
  marginRight: '5px',
  '&:last-child': {
    marginRight: '0',
  }
}))
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

  const [currentReportTab,setCurrentReportTab] = useState('vpat')

  if (!active) {
    return null;
  }

  return (
    <TabWrapper id="tab-wrapper">
      <TabInner id="tab-inner">
        <H1>Accessibility Conformance Reports</H1>
        {connected ? <View>
          <Sidebar id="sidebar">
            <Button onClick={() => runScan(allStories.map(story => story.id))} disabled={scanning}>Run Scan</Button>
            {scanning ? <ScanProgress progress={scanProgress} /> : null}
          </Sidebar>
          <Reports id="reports">
            <ReportTypeTabs id="report-type-tabs">
              <TabButton active={currentReportTab === 'vpat'} onClick={() => setCurrentReportTab('vpat')}>VPAT</TabButton>
              <TabButton active={currentReportTab === 'interactive'} onClick={() => setCurrentReportTab('interactive')}>Interactive</TabButton>
              
            </ReportTypeTabs>
          {
            globals.report ? <ReportViewer id={globals.report} ruleDefinitions={ruleDefinitions} reportType={currentReportTab} /> : null
          }
          </Reports>
        </View> : <div>Connecting To Server</div>}
        
      </TabInner>
    </TabWrapper>
  );
};
