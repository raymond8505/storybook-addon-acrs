import { ScanProgress as IScanProgress } from "src/hooks/useVPATServer";
import React, { useMemo } from "react";
import { useStorybookState } from "storybook/internal/manager-api";
import { API_StoryEntry } from "storybook/internal/types";

export function ScanProgress({ progress }: { progress: IScanProgress | null }) {
  const sbState = useStorybookState();
  const currentStory = useMemo(() => {
    return sbState.index?.[progress?.currentId] as API_StoryEntry;
  },[
    sbState,
    progress?.currentId,
  ])

  if (!progress) {
    return null;
  }

  return <div style={{
    display: "inline-block",
  }}>
    <span>{progress.currentIndex} / {progress.total} ({Math.round(progress.progress * 100)}%) {currentStory.title} - {currentStory.name}</span>
  </div>
}