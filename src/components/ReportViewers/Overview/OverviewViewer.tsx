import { Empty, Table } from "antd";
import React from "react";
import { StoryLink } from "src/components/controls/StoryLink";
import { ScanError, ScanResult, StoryScanResult } from "src/server/runScan";
import { H2, H3, H4 } from "storybook/internal/components";
import { useStorybookState } from "storybook/internal/manager-api";
import { styled } from "storybook/internal/theming";
import { API_HashEntry, API_StoryEntry } from "storybook/internal/types";

const Header = styled.header``;

export function OverviewViewer({ report }: { report: ScanResult }) {
  const { index } = useStorybookState();

  const roots = Object.entries(index).filter(
    ([_, entry]) => entry.type === "root",
  );
  console.log("OverviewViewer", report, index);

  if (!roots || roots.length === 0 || !report) {
    return <Empty description="No stories found" />;
  }

  return (
    <div>
      <Header>
        <H2>Report Overview</H2>
      </Header>
      <section>
        <H3>Stories</H3>
        <Table<StoryScanResult & { errors: ScanError[]; key: string }>
          dataSource={report.results.map((result) => ({
            ...result,
            key: result.meta.storyId,
            errors: report.errors.filter(
              (error) => error.storyId === result.meta.storyId,
            ),
          }))}
          rowKey="key"
          expandable={{
            expandedRowRender: (record) => {
              return (
                <div>
                  <H4>Errors</H4>
                  <pre>{JSON.stringify(record.errors, null, 2)}</pre>
                </div>
              );
            },
            rowExpandable: (record) => record.errors.length > 0,
          }}
          columns={[
            {
              title: "Story",
              dataIndex: "story-name",
              defaultSortOrder: "ascend",
              sortDirections: ["ascend", "descend"],
              sorter: (a, b) => {
                const aStory = index[a.meta.storyId] as API_StoryEntry;
                const bStory = index[b.meta.storyId] as API_StoryEntry;
                return `${aStory?.parent} - ${aStory?.name}`.localeCompare(
                  `${bStory?.parent} - ${bStory?.name}`,
                );
              },
              render: (_, record) => (
                <StoryLink
                  story={index[record.meta.storyId] as API_StoryEntry}
                />
              ),
            },
            {
              title: "Scan Time (ms)",
              dataIndex: "scan-time",
              defaultSortOrder: "descend",
              sortDirections: ["ascend", "descend"],
              sorter: (a, b) => a.meta.scanTime - b.meta.scanTime,
              render: (_, record) => `${record.meta.scanTime}`,
            },
            {
              title: "Errors",
              dataIndex: "errors",
              defaultSortOrder: "descend",
              sortDirections: ["ascend", "descend"],
              sorter: (a, b) => a.errors.length - b.errors.length,
              render: (_, record) => record.errors.length || 0,
            },
          ]}
        />
      </section>
    </div>
  );
}
