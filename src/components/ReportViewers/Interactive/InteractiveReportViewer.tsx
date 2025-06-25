import React, { useMemo, useState } from "react";
import { ScanResult } from "src/server/runScan";
import {
  Button,
  H2,
  Table as StyledTable,
} from "storybook/internal/components";
import {
  useStorybookApi,
  useStorybookState,
} from "storybook/internal/manager-api";
import { API_StoryEntry } from "storybook/internal/types";
import axe from "axe-core";
import { Select, Statistic, Table, Tag } from "antd";
import { arraysOverlap, download } from "src/helpers";
import { styled } from "storybook/internal/theming";
import { DownloadIcon } from "@storybook/icons";

const Fieldset = styled.fieldset`
  &,
  > * {
    display: grid;
    align-items: center;
  }

  grid-template-columns: repeat(3, 1fr) auto;
  gap: 10px;
  position: sticky;
  z-index: 1;
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
  gap: 3%;
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

      newResult.violations = newResult.violations.map((violation) => ({
        ...violation,
        tags: [...violation.tags, "violation"],
      }));

      newResult.incomplete = newResult.incomplete.map((violation) => ({
        ...violation,
        tags: [...violation.tags, "incomplete"],
      }));

      if (ruleFilters.length) {
        newResult.violations = newResult.violations.filter(forRuleId);
        newResult.incomplete = newResult.incomplete.filter(forRuleId);
      }

      if (tagFilters.length) {
        newResult.violations = newResult.violations.filter(forTags);
        newResult.incomplete = newResult.incomplete.filter(forTags);
      }

      if (impactFilters.length) {
        newResult.violations = newResult.violations.filter(forImpact);
        newResult.incomplete = newResult.incomplete.filter(forImpact);
      }

      return newResult;
    });
  }, [report?.results, ruleFilters, tagFilters, impactFilters]);

  if (!report || report.results.length === 0) {
    return null;
  }

  const rulesMap = new Map(axe.getRules().map((rule) => [rule.ruleId, rule]));
  return (
    <div>
      <Header>
        <H2>Interactive Accessibility Conformance Report</H2>
      </Header>
      <ResultCounts>
        <Statistic
          value={
            filteredResults
              .filter((r) => r.violations.length > 0 || r.incomplete.length > 0)
              .map(
                (result) =>
                  (stories[result.meta.storyId] as API_StoryEntry)?.title,
              )
              .filter((component, index, self) => {
                return self.indexOf(component) === index;
              }).length
          }
          title="Components"
        />
        <Statistic
          value={
            filteredResults.filter(
              (r) => r.violations.length > 0 || r.incomplete.length > 0,
            ).length
          }
          title="Stories"
        />

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
            allowClear={true}
          />
        </label>
        <label>
          <span>Tags:</span>
          <Select
            options={axe
              .getRules()
              .flatMap((rule) => rule.tags)
              .filter((tag, index, self) => self.indexOf(tag) === index)
              .concat(["violation", "incomplete"])
              .map((tag) => ({
                label: tag,
                value: tag,
              }))}
            placeholder="Select Tags"
            mode="tags"
            onChange={(value) => {
              setTagFilters(value);
            }}
            allowClear={true}
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
            <DownloadIcon color="#090" />
          </Button>
        </span>
      </Fieldset>

      <Table
        dataSource={filteredResults.flatMap((result) => {
          const story = stories[result.meta.storyId] as API_StoryEntry;
          return [
            ...result.violations.map((violation, i) => ({
              ...violation,
              story,
              type: "Violation",
              key: `${result.meta.storyId}-violation-${i}`,
            })),
            ...result.incomplete.map((violation, i) => ({
              ...violation,
              story,
              type: "Incomplete",
              key: `${result.meta.storyId}-incomplete-${i}`,
            })),
          ];
        })}
        rowKey="key"
        expandable={{
          expandedRowRender: (record) => {
            const rule = rulesMap.get(record.id);
            return (
              <div>
                <strong>
                  <a href={rule.helpUrl} target="_blank" rel="noreferrer">
                    {rule.help}
                  </a>
                </strong>
                <p>{rule.description}</p>
                <div>
                  {record.tags.map((tag, i) => (
                    <Tag key={`${record.key}-${record.id}__${tag}--${i}`}>
                      {tag}
                    </Tag>
                  ))}
                </div>
              </div>
            );
          },
          rowExpandable: (record) => rulesMap.has(record.id),
        }}
        columns={[
          {
            title: "Story",
            dataIndex: "story-name",
            render: (text, record) => (
              <a
                href={`index.html?path=/story/${record.story?.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  api.selectStory(record.story.id);
                  api.setQueryParams({
                    tab: undefined,
                  });
                }}
              >
                {record.story?.title} - {record.story?.name}
              </a>
            ),
          },
          {
            title: "Rule",
            render: (text, record) => {
              const rule = rulesMap.get(record.id);
              return (
                <div>
                  <strong>{rule.ruleId}</strong>
                </div>
              );
            },
            dataIndex: "violation-rule",
          },
          {
            title: "Type",
            render: (text, record) => record.type,
            dataIndex: "violation-type",
          },
          {
            title: "Impact",
            render: (text, record) => record.impact,
            dataIndex: "violation-impact",
          },
        ]}
      />
    </div>
  );
}
