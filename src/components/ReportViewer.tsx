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
export function ReportViewer({id,ruleDefinitions,reportType}: {id?: string, ruleDefinitions?: WCAGRuleLink[],reportType: string})
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

  function getReportViewer(reportType: string, report: Report|null, ruleDefinitions?: WCAGRuleLink[])
  {
    switch(reportType)
    {
      case 'interactive':
        return <div>Interactive</div>
      default: 
        return <VPATReportViewer report={report} ruleDefinitions={ruleDefinitions} />
    }
  }

  return <div id="report">
    <style type="text/css" media="print">
      {`
        body, #root, #report, html {
            -ms-overflow-style: none !important;
            scrollbar-width: none !important;
            overflow: visible !important;
          }
          body::-webkit-scrollbar, #root::-webkit-scrollbar, #report::-webkit-scrollbar {
            display: none !important;
            width: 0 !important;
            background: transparent !important;
          }
        #root > div
        {
          display: block;
          height: auto;
        }
        #tab-inner,
        #tab-wrapper
        {
          padding: 0 !important;
        }
        #root > div > div:not(:nth-child(2)),
        main > div:first-child,
        #report-type-tabs,
        #sidebar,
        h1 {
          display: none;
        }
        #reports {
          width: 100%;
        }`}
    </style>
    {getReportViewer(reportType, report, ruleDefinitions)}
  </div>
}