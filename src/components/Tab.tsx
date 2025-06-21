import React, { useCallback, useMemo, useState } from "react";
import { Button, H1 } from "storybook/internal/components";
import { useGlobals, useStorybookState } from "storybook/internal/manager-api";

import { useVPATServer } from "src/hooks/useVPATServer";
import { ReportViewer } from "src/components/ReportViewer";
import { ScanProgress } from "src/components/ScanProgress";
import { msToDateString } from "src/helpers";
import {
  ReportButton,
  Reports,
  ReportsList,
  ReportTypeTabs,
  Sidebar,
  TabButton,
  TabInner,
  TabWrapper,
  View,
} from "src/components/Tab.styles";

interface TabProps {
  active: boolean;
}

export const Tab: React.FC<TabProps> = ({ active }) => {
  const [globals, updateGlobals] = useGlobals();

  const sbState = useStorybookState();
  const allStories = useMemo(
    () =>
      sbState.internal_index?.entries
        ? Object.entries(sbState.internal_index?.entries)
            .filter(([_, { type }]) => type === "story")
            .map(([_, story]) => story)
        : undefined,
    [sbState],
  );

  const {
    runScan,
    ruleDefinitions,
    scanning,
    scanProgress,
    connected,
    reports,
  } = useVPATServer({
    onReportCreated: useCallback(
      (report) => {
        updateGlobals({
          report: encodeURIComponent(report.id),
        });
      },
      [updateGlobals],
    ),
  });

  const [currentReportTab, setCurrentReportTab] = useState("vpat");

  if (!active) {
    return null;
  }

  return (
    <TabWrapper id="tab-wrapper">
      <TabInner id="tab-inner">
        <H1>Accessibility Conformance Reports</H1>
        {connected ? (
          <View>
            <Sidebar id="sidebar">
              <Button
                onClick={() => runScan(allStories.map((story) => story.id))}
                disabled={scanning}
              >
                Run Scan
              </Button>
              {scanning ? <ScanProgress progress={scanProgress} /> : null}
              <ReportsList>
                {reports.map((reportId) => (
                  <li key={reportId}>
                    <ReportButton
                      onClick={() =>
                        updateGlobals({ report: encodeURIComponent(reportId) })
                      }
                      active={globals.report === encodeURIComponent(reportId)}
                    >
                      {msToDateString(reportId)}
                    </ReportButton>
                  </li>
                ))}
              </ReportsList>
            </Sidebar>
            <Reports id="reports">
              <ReportTypeTabs id="report-type-tabs">
                <TabButton
                  active={currentReportTab === "vpat"}
                  onClick={() => setCurrentReportTab("vpat")}
                >
                  VPAT
                </TabButton>
                <TabButton
                  active={currentReportTab === "interactive"}
                  onClick={() => setCurrentReportTab("interactive")}
                >
                  Interactive
                </TabButton>
              </ReportTypeTabs>
              {globals.report ? (
                <ReportViewer
                  id={globals.report}
                  ruleDefinitions={ruleDefinitions}
                  reportType={currentReportTab}
                />
              ) : null}
            </Reports>
          </View>
        ) : (
          <div>Connecting To Server</div>
        )}
      </TabInner>
    </TabWrapper>
  );
};
