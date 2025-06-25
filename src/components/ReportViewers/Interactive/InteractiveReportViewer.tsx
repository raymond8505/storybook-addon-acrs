import React, { useMemo, useState } from "react";
import { ScanResult } from "src/server/runScan";
import { Button, H2, Table, UL } from "storybook/internal/components";
import {
  useStorybookApi,
  useStorybookState,
} from "storybook/internal/manager-api";
import { API_StoryEntry } from "storybook/internal/types";
import axe from "axe-core";
import { Select, Statistic } from "antd";
import { arraysOverlap, download } from "src/helpers";
import { styled } from "storybook/internal/theming";

const Fieldset = styled.fieldset`
  &,
  > * {
    display: grid;
    align-items: center;
  }

  grid-template-columns: repeat(3, 1fr) auto;
  gap: 10px;
  position: sticky;
  top: 0;
  background: white;

  > * {
    grid-template-columns: auto 1fr;
  }

  > * > *:first-child {
    margin-right: 5px;
  }
`;

const ResultCounts = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  gap: 10px;
  font-size: 14px;
  margin: 10px 0;
`;

const Header = styled.header`
  text-align: center;
`;

function violationLabel(violation: axe.Result) {
  return (
    <div>
      <strong>
        {violation.impact} - {violation.id}{" "}
      </strong>
      <div>{violation.tags.join(", ")}</div>
    </div>
  );
}
export function InteractiveReportViewer({ report }: { report: ScanResult }) {
  const api = useStorybookApi();
  const sbState = useStorybookState();
  const stories = useMemo(() => sbState.index, [sbState.index]);
  const [ruleFilters, setRuleFilters] = useState<string[]>([]);
  const [tagFilters, setTagFilters] = useState<string[]>([]);
  const [impactFilters, setImpactFilters] = useState<string[]>([]);

  const filteredResults = useMemo(() => {
    if (!report || report.results.length === 0) {
      return [];
    }

    function forRuleId(violation: axe.Result) {
      return ruleFilters?.includes(violation.id) ?? true;
    }

    function forImpact(violation: axe.Result) {
      return impactFilters?.includes(violation.impact) ?? true;
    }

    function forTags(violation: axe.Result) {
      return arraysOverlap(tagFilters ?? [], violation.tags);
    }

    return report.results.map((result) => {
      const newResult = { ...result };

      if (ruleFilters.length) {
        newResult.violations = result.violations.filter(forRuleId);
        newResult.incomplete = result.incomplete.filter(forRuleId);
      }

      if (tagFilters.length) {
        newResult.violations = result.violations.filter(forTags);
        newResult.incomplete = result.incomplete.filter(forTags);
      }

      if (impactFilters.length) {
        newResult.violations = result.violations.filter(forImpact);
        newResult.incomplete = result.incomplete.filter(forImpact);
      }

      return newResult;
    });
  }, [report?.results, ruleFilters, tagFilters, impactFilters]);

  if (!report || report.results.length === 0) {
    return null;
  }
  return (
    <div>
      <Header>
        <H2>Interactive Accessibility Conformance Report</H2>
      </Header>
      <ResultCounts>
        <Statistic value={filteredResults.length} title="Stories" />

        <Statistic
          value={filteredResults.reduce((acc, cur) => {
            return acc + cur.violations.length;
          }, 0)}
          title="Violations"
        />

        <Statistic
          value={filteredResults.reduce((acc, cur) => {
            return acc + cur.incomplete.length;
          }, 0)}
          title="Incomplete"
        />

        {["critical", "serious", "moderate", "minor"].map((impact) => (
          <Statistic
            key={`impact-${impact}`}
            title={impact}
            value={filteredResults.reduce((acc, cur) => {
              return (
                acc +
                cur.violations.filter(
                  (v) => v.impact === impact.toLocaleLowerCase(),
                ).length +
                cur.incomplete.filter(
                  (v) => v.impact === impact.toLocaleLowerCase(),
                ).length
              );
            }, 0)}
          />
        ))}
      </ResultCounts>

      <Fieldset>
        <legend>Filters</legend>
        <label>
          <span>Rule:</span>
          <Select
            options={axe
              .getRules()
              .map((rule) => ({ label: rule.ruleId, value: rule.ruleId }))}
            placeholder="Select Rules"
            mode="tags"
            onChange={(value) => {
              setRuleFilters(value);
            }}
          />
        </label>
        <label>
          <span>Tags:</span>
          <Select
            options={axe
              .getRules()
              .flatMap((rule) => rule.tags)
              .filter((tag, index, self) => self.indexOf(tag) === index) // Unique tags
              .map((tag) => ({
                label: tag,
                value: tag,
              }))}
            placeholder="Select Tags"
            mode="tags"
            onChange={(value) => {
              setTagFilters(value);
            }}
          />
        </label>
        <label>
          <span>Impact:</span>
          <Select
            options={[
              { label: "Critical", value: "critical" },
              { label: "Serious", value: "serious" },
              { label: "Moderate", value: "moderate" },
              { label: "Minor", value: "minor" },
            ]}
            placeholder="Select Impact Levels"
            mode="tags"
            onChange={(value) => {
              setImpactFilters(value);
            }}
          />
        </label>
        <span>
          <Button
            onClick={() => {
              const csvData = [
                `Tags,${tagFilters.length ? tagFilters.join(", ") : "All"}`,
                `Rules,${ruleFilters.length ? ruleFilters.join(", ") : "All"}`,
                `Impacts,${impactFilters.length ? impactFilters.join(", ") : "All"}`,

                ...filteredResults.map((result) => {
                  const story = stories[result.meta.storyId] as API_StoryEntry;
                  return [
                    `${story?.title} - ${story?.name}`,
                    `http://localhost:6006/?path=/story/${story?.id}`,
                  ].join(",");
                }),
              ];

              download({
                data: csvData.join("\n"),
                fileName: "accessibility-report.csv",
                fileType: "text/csv",
              });
            }}
          >
            Download
          </Button>
        </span>
      </Fieldset>

      <Table
        style={{
          width: "100%",
          fontSize: "14px",
          lineHeight: "1.5",
        }}
      >
        <thead>
          <tr>
            <th>Story</th>
            <th>Violations</th>
            <th>Incomplete</th>
          </tr>
        </thead>
        <tbody>
          {filteredResults.map((storyResult, index) => {
            const story = stories[storyResult.meta.storyId] as API_StoryEntry;

            if (
              storyResult.violations.length === 0 &&
              storyResult.incomplete.length === 0
            ) {
              return null; // Skip stories with no violations or incomplete results
            }

            const numRows = Math.max(
              storyResult.violations.length,
              storyResult.incomplete.length,
            );

            const rows = [];
            for (let r = 0; r < numRows; r++) {
              rows.push(
                <tr key={`result-${index}__row-${r}`}>
                  {r === 0 ? (
                    <td rowSpan={numRows}>
                      <a
                        href={`index.html?path=/story/${story?.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          api.selectStory(story.id);
                          api.setQueryParams({
                            tab: undefined,
                          });
                        }}
                      >
                        {story?.title} - {story?.name}
                      </a>
                    </td>
                  ) : null}
                  <td>
                    {storyResult.violations?.[r]
                      ? violationLabel(storyResult.violations?.[r])
                      : ""}
                  </td>
                  <td>
                    {storyResult.incomplete?.[r]
                      ? violationLabel(storyResult.incomplete?.[r])
                      : ""}
                  </td>
                </tr>,
              );
            }

            return rows;
          })}
        </tbody>
      </Table>
    </div>
  );
}
