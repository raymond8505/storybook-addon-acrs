import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import { ScanSettings } from "src/components/ScanSettings";
import { STATE, TAB_ID } from "src/constants";
import { useScanSettings } from "src/hooks/useScanSettings";

interface TabProps {
  active: boolean;
}

const ScanWrapper = styled.div``;

const ScanButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Tab: React.FC<TabProps> = ({ active }) => {
  const [globals, updateGlobals] = useGlobals();
  const { settingsOpen, setSettingsOpen, settings } = useScanSettings();
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

  const [currentReportTab, setCurrentReportTab] = useState("interactive");

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
                  <IconButton onClick={() => setSettingsOpen((prev) => !prev)}>
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
