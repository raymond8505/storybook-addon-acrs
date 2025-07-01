import React, { useEffect, useState } from "react";
import { ResultsReportViewer } from "src/components/ReportViewers/Results/ResultsReportViewer";
import { PrintStyles } from "src/components/ReportViewers/PrintStyles";
import { VPATReportViewer } from "src/components/ReportViewers/VPAT/VPATReportViewer";
import { WCAGRuleLink } from "src/hooks/useReportServer";
import { ScanMeta, ScanResult } from "src/server/runScan";
import { OverviewViewer } from "src/components/ReportViewers/Overview/OverviewViewer";

export interface AxeResult {
  id: string;
  impact: "critical" | "serious" | "moderate" | "minor";
  tags: string[];
}
export interface AxeResultWithStoryId extends AxeResult {
  storyId?: string;
}
export interface StoryResult {
  incomplete: AxeResult[];
  violations: AxeResult[];
  meta: {
    storyId: string;
  };
}
export interface RawStoryResult extends StoryResult {
  testEngine: {
    name: string;
    version: string;
  };
  testEnvironment: {
    orientationAngle: number;
    orientationType: string;
    userAgent: string;
    windowWidth: number;
    windowHeight: number;
  };
}
export function ReportViewer({
  id,
  ruleDefinitions,
  reportType,
}: {
  id?: string;
  ruleDefinitions?: WCAGRuleLink[];
  reportType: string;
}) {
  const [report, setReport] = useState<ScanResult | null>(null);
  const [reportFetchError, setReportFetchError] = useState<any | null>(null);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:3001/${id}.json`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          response.json().then((json) => {
            setReport(json);
            setReportFetchError(null);
          });
        })
        .catch((e) => {
          setReportFetchError(e);
        });
    }
  }, [id]);

  function getReportViewer(
    reportType: "VPAT" | "results" | "overview" | string,
    report: ScanResult | null,
    ruleDefinitions?: WCAGRuleLink[],
  ) {
    switch (reportType) {
      case "results":
        return <ResultsReportViewer report={report} />;
      case "overview":
        return <OverviewViewer report={report} />;
      case "VPAT":
      default:
        return (
          <VPATReportViewer report={report} ruleDefinitions={ruleDefinitions} />
        );
    }
  }

  return (
    <div
      id="report"
      style={{
        overflow: "auto",
        paddingRight: "10vmin",
      }}
    >
      <PrintStyles />
      {reportFetchError
        ? `Error getting report ${id}: ${reportFetchError.message}`
        : getReportViewer(reportType, report, ruleDefinitions)}
    </div>
  );
}
