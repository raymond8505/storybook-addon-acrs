import React from "react";
import { StoryEntry, useStorybookApi } from "storybook/internal/manager-api";
import { API_StoryEntry } from "storybook/internal/types";

export function StoryLink({ story }: { story?: StoryEntry | API_StoryEntry }) {
  const api = useStorybookApi();

  return (
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
  );
}
