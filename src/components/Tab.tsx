import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Button, H1, IconButton } from "storybook/internal/components";
import {
  useAddonState,
  useGlobals,
  useStorybookApi,
  useStorybookState,
} from "storybook/internal/manager-api";

import { useReportServer } from "src/hooks/useReportServer";
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
import { CogIcon } from "@storybook/icons";
import { styled } from "storybook/internal/theming";
import { ReportSettings } from "src/components/ReportSettings";
import { STATE, TAB_ID } from "src/constants";
import { useReportSettings } from "src/hooks/useReportSettings";
import { Empty } from "antd";

interface TabProps {
  active: boolean;
}

const ScanWrapper = styled.div``;

const ScanButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Tab: FC<TabProps> = ({ active }) => {
  const [globals, updateGlobals] = useGlobals();
  const { settingsOpen, setSettingsOpen, settings } = useReportSettings();
  const sbState = useStorybookState();
  const api = useStorybookApi();

  useEffect(() => {
    api.setSelectedPanel(TAB_ID);
  }, [api]);
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
  } = useReportServer({
    onReportCreated: useCallback(
      (report) => {
        updateGlobals({
          report: encodeURIComponent(report.id),
        });
      },
      [updateGlobals],
    ),
  });

  const [currentReportTab, setCurrentReportTab] = useState("VPAT");

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
              <ScanWrapper>
                <ScanButtonWrapper>
                  <Button
                    onClick={() => runScan(settings.stories)}
                    disabled={scanning}
                  >
                    Run Scan
                  </Button>
                  <IconButton onClick={() => setSettingsOpen(!settingsOpen)}>
                    <CogIcon />
                  </IconButton>
                </ScanButtonWrapper>
                {scanning ? <ScanProgress progress={scanProgress} /> : null}
              </ScanWrapper>
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
            {settingsOpen ? (
              <ReportSettings />
            ) : (
              <Reports id="reports">
                <ReportTypeTabs id="report-type-tabs">
                  <TabButton
                    active={currentReportTab === "vpat"}
                    onClick={() => setCurrentReportTab("vpat")}
                  >
                    VPAT
                  </TabButton>
                  <TabButton
                    active={currentReportTab === "results"}
                    onClick={() => setCurrentReportTab("results")}
                  >
                    Results
                  </TabButton>
                  <TabButton
                    active={currentReportTab === "overview"}
                    onClick={() => setCurrentReportTab("overview")}
                  >
                    Overview
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
            )}
          </View>
        ) : (
          <Empty
            description={
              <span>
                Please connect to the report server to view or run scans.
              </span>
            }
          />
        )}
      </TabInner>
    </TabWrapper>
  );
};
