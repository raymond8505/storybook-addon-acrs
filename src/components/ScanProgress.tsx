import { ScanProgress as IScanProgress } from "src/hooks/useVPATServer";
import React, { useMemo } from "react";
import { useStorybookState } from "storybook/internal/manager-api";
import { API_StoryEntry } from "storybook/internal/types";
import styled from "@emotion/styled";
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
  grid-template-columns: auto auto;
  width: fit-content;
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
          {progress.currentIndex} / {progress.total} (
          {Math.round(progress.progress * 100)}%)
        </dd>
        <dt>Current Story:</dt>
        <dd>
          <div>{currentStory?.title ?? "Story Not Found"}</div>
          <strong>{currentStory?.name ?? "Story Not Found"}</strong>
        </dd>
      </DL>
    </Wrapper>
  );
}
