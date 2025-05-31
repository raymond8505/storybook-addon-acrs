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

    <H3>Methodology</H3>
    <p>
      Storybook scanned using <a href="https://www.deque.com/axe/core-documentation/api-documentation/#section-1-introduction">Axe Core</a>.
    </p>
    <p>
      Each story is loaded in its iframe view and scanned after the page loads and the body becomes visible. If the story has a delay parameter, the scan waits for the delay to complete before scanning.
    </p>
    <H4>Scan Specs</H4>
    <UL>
      <li><strong>Axe-core Version:</strong> {firstResult.testEngine.version}</li>
      <li><strong>Browser User Agent:</strong> {firstResult.testEnvironment.userAgent}</li>
      <li><strong>Browser Dimensions:</strong> {firstResult.testEnvironment.windowWidth}x{firstResult.testEnvironment.windowHeight}</li>
    </UL>
    <H3>Conformance Levels</H3>
    <p>
      This report determines conformance levels based on the impact levels of 
      the violations found in this Storybook's components. <strong>Critical, Serious, Moderate, Minor</strong>{' '}
      See the <a href="https://docs.deque.com/devtools-mobile/2023.4.19/en/impact">Axe Rule Impact Levels documentation</a> for more information.
    </p>
    <DL>
      <dt>No Violations Found</dt>
      <dd>
        <p>No violations found for the given rule. This is not the same as "Supports" see <em>Using This Report</em> for more info</p>
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
          <li>One or more Serious Violations</li>
        </ul>
      </dd>
    </DL>    
    <H3>Using This Report</H3>
    <UL>
      <li>
        <H4>THIS IS NOT A MAGIC BULLET!</H4>
        <p>
          This method only catches low hanging fruit. It is not a replacement for manually testing the app itself.{' '}
          Less than half of accessibility issues can be caught by automated testing. Even fewer when only testing components{' '}
          in isolation. Use this report to nail your fundamentals and inform your best practices. <strong>This is meant to be{' '}
          an internal document.</strong>
        </p>
        <p>
          This report cannot determine if a rule is "supported" only that no violations were found for that rule.
          <strong>Support</strong> is defined as the product functionality meeting the criterion without known defects or meets with equivalent facilitation.
          This scan cannot determine intentionality of each component or its intended use, only whether the component contains known violations of the rules.
          This is one of the reasons this report is not a replacement for manual testing.
        </p>
        <H5>The following rules are not covered by this report:</H5>
          <UL>
            {ruleDefinitions.filter(rule => !rule.tags).map((rule, index) => {
              return <li key={index}>
                <a href={rule.url} target="_blank">{rule.label}</a>
              </li>
            }
            )}
          </UL>
      </li>
      <li>
        <strong>Parent stories will show their child components' violations</strong>
        <p>if a violation exists in a component at its most fundamental state, all its stories will be reported{' '}
          and any stories for parent components will be reported. It's best to start with your smallest components{' '}
          when addressing this report.</p>
        <p>
          eg: Panel component and Button component are both reported as violations. Knowing Panel contains Button components,{' '}
          resolve the issues for Button first and re-scan. Many of the Panel issues may be resolved by fixing the Button issues.
        </p>  
        </li>
    </UL>
    <H3>Table 1: Success Criteria, Level A</H3>
    <RuleTable report={report} ruleDefinitions={ruleDefinitions} tags={['wcag2a','wcag21a']} />
    <H3>Table 2: Success Criteria, Level AA</H3>
    <RuleTable report={report} ruleDefinitions={ruleDefinitions} tags={['wcag2aa','wcag21aa','wcag22aa']} />
    <H3>Table 3: Success Criteria, Level AAA</H3>
    <RuleTable report={report} ruleDefinitions={ruleDefinitions} tags={['wcag2aaa']} />
  </div>
}