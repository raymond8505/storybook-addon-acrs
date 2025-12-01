import React, { Fragment, useMemo } from "react";
import { StoryLink } from "src/components/controls/StoryLink";
import { AxeResultWithStoryId } from "src/components/ReportViewer";
import {
  getResultsByImpact,
  getResultsByTag,
  getRuleConformanceLevel,
} from "src/components/ReportViewers/VPAT/helpers";
import { WCAGRuleLink } from "src/hooks/useReportServer";
import { useReportSettings } from "src/hooks/useReportSettings";
import { ScanResult } from "src/server/runScan";
import { DL, Table, UL } from "storybook/internal/components";
import {
  useStorybookApi,
  useStorybookState,
} from "storybook/internal/manager-api";
import { API_StoryEntry } from "storybook/internal/types";
import axe from "axe-core";

const uniqueByStoryId = (
  result: AxeResultWithStoryId,
  index: number,
  arr: AxeResultWithStoryId[],
) => {
  return arr.findIndex((r) => r.storyId === result.storyId) === index;
};
export interface RuleTableProps {
  report: ScanResult;
  ruleDefinitions: WCAGRuleLink[];
  tags: string[];
}
export function RuleTable({ report, ruleDefinitions, tags }: RuleTableProps) {
  const tableRules = ruleDefinitions.filter((rule) => {
    return tags.some((tag) => rule.tags?.includes(tag));
  });

  console.log({ tableRules });

  const sbState = useStorybookState();
  const stories = useMemo(() => sbState.index, [sbState.index]);
  const api = useStorybookApi();
  const { settings } = useReportSettings();
  const axeRules = axe.getRules();
  return (
    <Table
      style={{
        width: "100%",
        fontSize: "12px",
        lineHeight: "1.5",
      }}
    >
      <thead>
        <tr>
          <th>Rule</th>
          <th>Conformance Level</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        {tableRules.map((rule, index) => {
          const conformanceLevel = getRuleConformanceLevel(rule, report);
          const ruleViolations = getResultsByTag(
            report,
            rule.ruleTag,
            "violations",
          );
          const violationsByImpact = getResultsByImpact(ruleViolations);

          const excludedRules = settings.rules.exclude
            .map((r) => {
              return axeRules.find((rule) => rule.ruleId === r);
            })
            .filter((axeRule) => axeRule.tags?.includes(rule.ruleTag));

          return (
            <tr key={index}>
              <td>
                <a href={rule.url} target="_blank">
                  {rule.label}
                </a>
              </td>
              <td>{conformanceLevel}</td>
              <td>
                <DL style={{ fontSize: "inherit", lineHeight: "inherit" }}>
                  {["Critical", "Serious", "Moderate", "Minor"].map(
                    (impact) => {
                      const impactResults = [
                        ...violationsByImpact[
                          impact.toLowerCase() as keyof ReturnType<
                            typeof getResultsByImpact
                          >
                        ]
                          .filter(uniqueByStoryId)
                          .filter(
                            (result) =>
                              !settings.rules.exclude.find(
                                (ruleId) => ruleId === result.id,
                              ),
                          ),
                      ];

                      if (impactResults.length === 0) {
                        return null;
                      }

                      return (
                        <Fragment key={`${index}-${impact}`}>
                          <dt>{impact} Violations</dt>
                          <dd>
                            <UL
                              style={{
                                fontSize: "inherit",
                                lineHeight: "inherit",
                              }}
                            >
                              {impactResults.map((result, resultIndex) => {
                                const story = stories[
                                  result.storyId
                                ] as API_StoryEntry;

                                return story ? (
                                  <li
                                    key={`${index}-${impact}-${result.id}-${resultIndex}`}
                                  >
                                    <StoryLink story={story} /> ({result.id})
                                  </li>
                                ) : null;
                              })}
                            </UL>
                          </dd>
                        </Fragment>
                      );
                    },
                  )}
                  {excludedRules.length > 0 ? (
                    <>
                      <dt>Excluded Rules</dt>
                      <dd>
                        <UL
                          style={{
                            fontSize: "inherit",
                            lineHeight: "inherit",
                          }}
                        >
                          {excludedRules.map((rule, ruleIndex) => {
                            return (
                              <li key={`${index}-excluded-${ruleIndex}`}>
                                <a href={rule?.helpUrl} target="_blank">
                                  {rule?.ruleId}
                                </a>
                              </li>
                            );
                          })}
                        </UL>
                      </dd>
                    </>
                  ) : null}
                </DL>
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}
