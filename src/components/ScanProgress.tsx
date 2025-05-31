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

  return <div style={{fontSize: '10px'}}>
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      gap: '1px'
    }}>
      <div>{Math.round(progress.progress * 100)}%</div>
      <div style={{
      height: '1em',
      flexGrow: 1,
      border: '1px solid #ccc',
      position: 'relative',
    }}>
      <div style={{
        width: `${Math.round(progress.progress * 100)}%`,
        height: '100%',
        backgroundColor: '#4caf50',
        transition: 'width 0.1s linear',
        position: 'absolute',
        top: 0,
        left: 0,
      }}></div>
      </div>
    </div>
    <div>{progress.currentIndex} / {progress.total}: {currentStory.title} - {currentStory.name}</div>
  </div>
}