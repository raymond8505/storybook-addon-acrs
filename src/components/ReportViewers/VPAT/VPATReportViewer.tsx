import React from "react"
import { Report } from "src/components/ReportViewer"
import { RuleTable } from "src/components/ReportViewers/VPAT/RuleTable"
import { WCAGRuleLink } from "src/hooks/useVPATServer"
import { DL, H2, H3, H4, H5, UL } from "storybook/internal/components"
export function VPATReportViewer({report,ruleDefinitions}: {report?: Report, ruleDefinitions: WCAGRuleLink[]}){
  
  if(!report || report.length === 0) {
    return null
  }
  const firstResult = report?.[0]
  
  return <div>
    <H2>Accessibility Conformance Report</H2>
    <H3>(Based on VPAT® Version 2.4)</H3>

    <H4>Methodology</H4>
    <p>
      Storybook scanned using <a href="https://www.deque.com/axe/core-documentation/api-documentation/#section-1-introduction">Axe Core</a>.
    </p>
    <H5>Scan Specs</H5>
    <UL>
      <li><strong>Axe-core Version:</strong> {firstResult.testEngine.version}</li>
      <li><strong>Browser User Agent:</strong> {firstResult.testEnvironment.userAgent}</li>
      <li><strong>Browser Dimensions:</strong> {firstResult.testEnvironment.windowWidth}x{firstResult.testEnvironment.windowHeight}</li>
    </UL>
    <H4>Conformance Levels</H4>
    <DL>
      <dt>Supports</dt>
      <dd>
        <p>The functionality of the product has at least one method that meets the criterion without 
        known defects or meets with equivalent facilitation.</p>
        <ul>
          <li>No Critical Violations</li>
          <li>No Serious Violations</li>
          <li>No Moderate Violations</li>
          <li>No Minor Violations</li>
        </ul>
      </dd>
      <dt>Partially Supports</dt>
      <dd>
        <p>Some functionality of the product does not meet the criterion.</p>
        <ul>
          <li>No Critical Violations</li>
          <li>No Serious Violations</li>
          <li>Some or no Moderate Violations</li>
          <li>Some or no Minor Violations</li>
        </ul>
      </dd>
      <dt>Does Not Support</dt>
      <dd>
        <p>The majority of product functionality does not meet the criterion.</p>
        <ul>
          <li>One or more Critical Violations or</li>
          <li>One or more Violations</li>
        </ul>
      </dd>
    </DL>
    <H4>Definitions</H4>
    <H5>Impact Levels</H5>
    <p>
      This report determines conformance levels based the impact levels of 
      the violations found in this Storybook's components. <strong>Critical, Serious, Moderate, Minor</strong>{' '}
      See the <a href="https://docs.deque.com/devtools-mobile/2023.4.19/en/impact">Axe Rule Impact Levels documentation</a> for more information.
    </p>
    <H3>Table 1: Success Criteria, Level A</H3>
    <RuleTable report={report} ruleDefinitions={ruleDefinitions} tags={['wcag2a','wcag21a']} />
    <H3>Table 2: Success Criteria, Level AA</H3>
    <RuleTable report={report} ruleDefinitions={ruleDefinitions} tags={['wcag2aa','wcag21aa','wcag22aa']} />
  </div>
}