import { ScanProgress as IScanProgress } from "src/hooks/useVPATServer";
import React, { useMemo } from "react";
import { useStorybookState } from "storybook/internal/manager-api";
import { API_StoryEntry } from "storybook/internal/types";
import { styled } from "@storybook/theming";
import { msToHMS } from "../helpers";

const Wrapper = styled.div`
  font-size: 12px;
`;

const ProgressBar = styled.div`
  height: 1em;
  flex-grow: 1;
  border: 1px solid #ccc;
  position: relative;
`;

const ProgressBarFill = styled.div<{ barWidth: string }>`
  width: ${({ barWidth }) => barWidth};
  height: 100%;
  background-color: #4caf50;
  transition: width 0.1s linear;
  position: absolute;
  top: 0;
  left: 0;
`;

const DL = styled.dl`
  display: grid;
  grid-template-columns: auto 1fr;
  width: 100%;
  border: 1px solid #ccc;
  margin-top: 0.5em;
  padding-top: 0.5em;

  dt {
    font-weight: bold;
  }
  dd,
  dt {
    margin: 0;
    padding: 0.2em 0.5em;
    line-height: 1.4;
  }
`;

export function ScanProgress({ progress }: { progress: IScanProgress | null }) {
  const sbState = useStorybookState();

  const currentStory = useMemo(() => {
    return sbState.index?.[progress?.currentId] as API_StoryEntry;
  }, [sbState, progress?.currentId]);

  if (!progress) {
    return null;
  }

  return (
    <Wrapper>
      <ProgressBar>
        <ProgressBarFill barWidth={`${Math.round(progress.progress * 100)}%`} />
      </ProgressBar>

      <DL>
        <dt>Time Remaining:</dt>
        <dd>{msToHMS(progress.estimatedMSRemaining)}</dd>
        <dt>Progress:</dt>
        <dd>
          {Math.round(progress.progress * 100)}% ({progress.currentIndex} /{" "}
          {progress.total})
        </dd>
        <dt style={{ gridColumn: "1/3" }}>Current Story:</dt>
        <dd style={{ gridColumn: "1/3", wordBreak: "break-all" }}>
          <div>{currentStory?.title ?? "Story Not Found"}</div>
          <div>{currentStory?.name ?? "Story Not Found"}</div>
        </dd>
      </DL>
    </Wrapper>
  );
}
