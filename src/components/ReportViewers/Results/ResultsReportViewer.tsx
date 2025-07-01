import React, { useMemo, useState } from "react";
import { ScanResult } from "src/server/runScan";
import {
  Button,
  H2,
  IconButton,
  Table as StyledTable,
} from "storybook/internal/components";
import {
  StoryEntry,
  useStorybookApi,
  useStorybookState,
} from "storybook/internal/manager-api";
import { API_StoryEntry } from "storybook/internal/types";
import axe from "axe-core";
import { Select, Statistic, Table, Tag } from "antd";
import { arraysOverlap, download } from "src/helpers";
import { styled } from "storybook/internal/theming";
import { DownloadIcon, QuestionIcon } from "@storybook/icons";
import { TagSelect } from "src/components/controls/TagSelect";
import { Fieldset } from "src/components/controls/styles";
import { useReportSettings } from "src/hooks/useReportSettings";
import { RuleSelect } from "src/components/controls/RuleSelect";
import { AxeTableResult } from "src/types";
import { StoryLink } from "src/components/controls/StoryLink";

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

const HelpTitle = styled.strong`
  display: flex;
  align-items: center;
  gap: 5px;
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
export function ResultsReportViewer({ report }: { report: ScanResult }) {
  const api = useStorybookApi();
  const sbState = useStorybookState();
  const stories = useMemo(() => sbState.index, [sbState.index]);
  const [ruleFilters, setRuleFilters] = useState<string[]>([]);
  const [tagFilters, setTagFilters] = useState<string[]>([]);
  const [impactFilters, setImpactFilters] = useState<string[]>([]);
  const { settings } = useReportSettings();

  const filteredResults = useMemo(() => {
    if (!report || report.results.length === 0) {
      return [];
    }

    function forRuleId(violation: axe.Result) {
      return ruleFilters?.includes(violation.id) ?? true;
    }

    function excludedRules(violation: axe.Result) {
      const rules = settings.rules.exclude;

      if (rules) {
        return !rules.includes(violation.id);
      }

      return true;
    }

    function forImpact(violation: axe.Result) {
      return impactFilters?.includes(violation.impact) ?? true;
    }

    function forTags(violation: axe.Result) {
      return arraysOverlap(tagFilters ?? [], violation.tags);
    }

    function excludedTags(violation: axe.Result) {
      return !arraysOverlap(settings.tags.exclude, violation.tags);
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

      if (settings.tags.exclude.length) {
        newResult.violations = newResult.violations.filter(excludedTags);
        newResult.incomplete = newResult.incomplete.filter(excludedTags);
      }

      if (settings.rules.exclude.length) {
        newResult.violations = newResult.violations.filter(excludedRules);
        newResult.incomplete = newResult.incomplete.filter(excludedRules);
      }
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
  }, [report?.results, ruleFilters, tagFilters, impactFilters, settings]);

  if (!report || report.results.length === 0) {
    return null;
  }

  const rulesMap = new Map(axe.getRules().map((rule) => [rule.ruleId, rule]));
  return (
    <div>
      <Header>
        <H2>Report Results</H2>
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

        {["Critical", "Serious", "Moderate", "Minor"].map((impact) => (
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

      <Fieldset columns={3}>
        <legend>Filters</legend>
        <label>
          <span>Rule:</span>
          <RuleSelect
            onChange={(value) => {
              setRuleFilters(value);
            }}
          />
        </label>
        <label>
          <span>Tags:</span>
          <TagSelect
            extraOptions={["violation", "incomplete"]}
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
            <DownloadIcon color="#090" />
          </Button>
        </span>
      </Fieldset>

      <Table<AxeTableResult>
        dataSource={filteredResults.flatMap((result) => {
          const story = stories[result.meta.storyId] as API_StoryEntry;
          return [
            ...result.violations.map((violation, i) => ({
              ...violation,
              story,
              type: "Violation" as AxeTableResult["type"],
              key: `${result.meta.storyId}-violation-${i}`,
            })),
            ...result.incomplete.map((violation, i) => ({
              ...violation,
              story,
              type: "Incomplete" as AxeTableResult["type"],
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
                <HelpTitle>
                  <QuestionIcon />
                  <a href={rule.helpUrl} target="_blank" rel="noreferrer">
                    {rule.help}
                  </a>
                </HelpTitle>
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
            defaultSortOrder: "ascend",
            sortDirections: ["ascend", "descend"],
            sorter: (a, b) => {
              return `${a.story?.title} - ${a.story?.name}`.localeCompare(
                `${b.story?.title} - ${b.story?.name}`,
              );
            },
            render: (_, record) => <StoryLink story={record.story} />,
          },
          {
            title: "Rule",
            render: (_, record) => {
              return (
                <div>
                  <strong>{record.id}</strong>
                </div>
              );
            },
            defaultSortOrder: "ascend",
            sortDirections: ["ascend", "descend"],
            sorter: (a, b) => a.id.localeCompare(b.id),
            dataIndex: "violation-rule",
          },
          {
            title: "Type",
            render: (text, record) => record.type,
            dataIndex: "violation-type",
            defaultSortOrder: "descend",
            sortDirections: ["ascend", "descend"],
            sorter: (a, b) => a.type.localeCompare(b.type),
          },
          {
            title: "Impact",
            render: (text, record) =>
              record.impact.charAt(0).toUpperCase() + record.impact.slice(1),
            dataIndex: "violation-impact",
            defaultSortOrder: "descend",
            sortDirections: ["ascend", "descend"],
            sorter: (a, b) => {
              const impacts = ["critical", "serious", "moderate", "minor"];
              return impacts.indexOf(a.impact) > impacts.indexOf(b.impact)
                ? -1
                : 1;
            },
          },
        ]}
      />
    </div>
  );
}
