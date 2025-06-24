import React, { Fragment, useMemo } from "react";
import { AxeResultWithStoryId } from "src/components/ReportViewer";
import {
  getResultsByImpact,
  getResultsByTag,
  getRuleConformanceLevel,
} from "src/components/ReportViewers/VPAT/helpers";
import { WCAGRuleLink } from "src/hooks/useReportServer";
import { ScanResult } from "src/server/runScan";
import { DL, Table, UL } from "storybook/internal/components";
import {
  useGlobals,
  useStorybookApi,
  useStorybookState,
} from "storybook/internal/manager-api";
import { API_StoryEntry } from "storybook/internal/types";

export interface RuleTableProps {
  report: ScanResult;
  ruleDefinitions: WCAGRuleLink[];
  tags: string[];
}
export function RuleTable({ report, ruleDefinitions, tags }: RuleTableProps) {
  const tableRules = ruleDefinitions.filter((rule) => {
    return tags.some((tag) => rule.tags?.includes(tag));
  });

  const sbState = useStorybookState();
  const stories = useMemo(() => sbState.index, [sbState.index]);
  const api = useStorybookApi();
  const [globals, updateGlobals] = useGlobals();
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
          const ruleIncompletes = getResultsByTag(
            report,
            rule.ruleTag,
            "incomplete",
          );
          const violationsByImpact = getResultsByImpact(ruleViolations);

          const incompleteByImpact = getResultsByImpact(ruleIncompletes);

          const uniqueByStoryId = (
            result: AxeResultWithStoryId,
            index: number,
            arr: AxeResultWithStoryId[],
          ) => {
            return arr.findIndex((r) => r.storyId === result.storyId) === index;
          };
          return (
            <tr key={index}>
              <td>
                <a href={rule.url} target="_blank">
                  {rule.label}
                </a>
              </td>
              <td>{conformanceLevel}</td>
              <td>
                {conformanceLevel === "No Violations Found" ? (
                  ""
                ) : (
                  <DL style={{ fontSize: "inherit", lineHeight: "inherit" }}>
                    {["critical", "serious", "moderate", "minor"].map(
                      (impact) => {
                        const impactResults = [
                          ...violationsByImpact[
                            impact as keyof ReturnType<
                              typeof getResultsByImpact
                            >
                          ].filter(uniqueByStoryId),
                          ...incompleteByImpact[
                            impact as keyof ReturnType<
                              typeof getResultsByImpact
                            >
                          ].filter(uniqueByStoryId),
                        ];

                        if (impactResults.length === 0) {
                          return null;
                        }

                        return (
                          <Fragment key={`${index}-${impact}`}>
                            <dt>{impact}</dt>
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
                                      <a
                                        href="#"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          api.selectStory(story.id);
                                          api.setQueryParams({
                                            tab: undefined,
                                          });
                                        }}
                                      >
                                        {story.title} - {story.name}
                                      </a>
                                    </li>
                                  ) : null;
                                })}
                              </UL>
                            </dd>
                          </Fragment>
                        );
                      },
                    )}
                  </DL>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}
