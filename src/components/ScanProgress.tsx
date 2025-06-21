import { ScanProgress as IScanProgress } from "src/hooks/useVPATServer";
import React, { useMemo } from "react";
import { useStorybookState } from "storybook/internal/manager-api";
import { API_StoryEntry } from "storybook/internal/types";

export function ScanProgress({ progress }: { progress: IScanProgress | null }) {
  const sbState = useStorybookState();
  console.log("ScanProgress", progress, sbState);
  const currentStory = useMemo(() => {
    return sbState.index?.[progress?.currentId] as API_StoryEntry;
  }, [sbState, progress?.currentId]);

  if (!progress) {
    return null;
  }

  return (
    <div style={{ fontSize: "10px" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "1px",
        }}
      >
        <div
          style={{
            height: "1em",
            flexGrow: 1,
            border: "1px solid #ccc",
            position: "relative",
          }}
        >
          <div
            style={{
              width: `${Math.round(progress.progress * 100)}%`,
              height: "100%",
              backgroundColor: "#4caf50",
              transition: "width 0.1s linear",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          ></div>
        </div>
      </div>
      <dl>
        <dt>Time Remaining:</dt>
        <dd></dd>
        <dt>Progress:</dt>
        <dd>
          {progress.currentIndex} / {progress.total} (
          {Math.round(progress.progress * 100)}%)
        </dd>
        <dt>Current Story:</dt>
        <dd>
          {currentStory?.title ?? "Story Not Found"} -{" "}
          <strong>{currentStory?.name ?? "Story Not Found"}</strong>
        </dd>
      </dl>
    </div>
  );
}
