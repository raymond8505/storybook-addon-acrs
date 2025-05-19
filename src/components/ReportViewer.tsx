import React, { useEffect, useState } from "react"
import { VPATReportViewer } from "src/components/ReportViewers/VPAT/VPATReportViewer";
import { WCAGRuleLink } from "src/hooks/useVPATServer";

export interface AxeResult
{
  id: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  tags: string[];
}
export interface AxeResultWithStoryId extends AxeResult
{
  storyId?: string;
}
export interface StoryResult
{
  incomplete: AxeResult[];
  violations: AxeResult[];
  meta : {
    storyId: string;
  }
  testEngine: {
    name: string;
    version: string;
  }
  testEnvironment: {
    orientationAngle: number;
    orientationType: string;
    userAgent: string;
    windowWidth: number;
    windowHeight: number;
  }
}
export type Report = StoryResult[]
export function ReportViewer({id,ruleDefinitions}: {id?: string, ruleDefinitions?: WCAGRuleLink[]})
{
  const [report, setReport] = useState<Report|null>(null)

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:3001/${id}.json`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          response.json().then((json) => {
            setReport(json);
          })
        })
      }
  },[id])
  return <div>
    <VPATReportViewer report={report} ruleDefinitions={ruleDefinitions} />
  </div>
}