import React, { useMemo } from "react";
import { ScanResult } from "src/server/runScan";
import { DL, Table, UL } from "storybook/internal/components";
import {
  useStorybookApi,
  useStorybookState,
} from "storybook/internal/manager-api";
import { API_StoryEntry } from "storybook/internal/types";
export function InteractiveReportViewer({ report }: { report: ScanResult }) {
  console.log(report);
  const api = useStorybookApi();
  const sbState = useStorybookState();
  const stories = useMemo(() => sbState.index, [sbState.index]);
  return (
    <div>
      <h2>Interactive Accessibility Conformance Report</h2>
      <h3>Filter Results by various criteria</h3>

      <Table
        style={{
          width: "100%",
          fontSize: "12px",
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
          {report.results
            .filter((result) => {
              return result.incomplete.some(
                (violation) => violation.id === "aria-prohibited-attr",
              );
            })
            .map((storyResult, index) => {
              const story = stories[storyResult.meta.storyId] as API_StoryEntry;

              return (
                <tr key={index}>
                  <td>
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
                      {story?.title} - {story?.name}
                    </a>
                  </td>
                  <td>
                    {storyResult.violations.length > 0 ? (
                      <UL>
                        {storyResult.violations
                          .filter((v) => v.tags.includes("wcag412"))
                          .map((violation, vIndex) => (
                            <li key={vIndex}>{violation.id}</li>
                          ))}
                      </UL>
                    ) : (
                      "No Violations"
                    )}
                  </td>
                  <td>
                    {storyResult.incomplete.length > 0 ? (
                      <UL>
                        {storyResult.incomplete.map((violation) => {
                          console.log(violation);
                          return <li>{violation.id}</li>;
                        })}
                      </UL>
                    ) : (
                      "No Incomplete"
                    )}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>
    </div>
  );
}
