import React, { useEffect } from "react";
import {
  addons,
  types,
  useStorybookState,
} from "storybook/internal/manager-api";

import { Tab } from "./components/Tab";
import { ADDON_ID, EVENTS, TAB_ID } from "src/constants";
import { ScanSettings, useScanSettings } from "src/hooks/useScanSettings";
import {
  BatchAcceptIcon,
  BatchDenyIcon,
  CheckIcon,
  CrossIcon,
} from "@storybook/icons";
import { styled } from "storybook/internal/theming";
import {
  API_ComponentEntry,
  API_GroupEntry,
  API_HashEntry,
  API_IndexHash,
  API_RootEntry,
  API_StoryEntry,
} from "storybook/internal/types";

const StatusWrapper = styled.span`
  display: block;
  background: white;
  border-radius: 2px;
  border: 1px solid #ccc;
  padding: 4px;
  line-height: 1;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export type EntryWithChildren =
  | API_RootEntry
  | API_GroupEntry
  | API_ComponentEntry;

function getAllChildStoryIds(
  children: string[],
  index: API_IndexHash,
): string[] {
  const childItems = children
    .map((childId) => index[childId])
    .filter((child) => !!child && child.type !== "docs");

  return [
    ...children,
    ...childItems.flatMap((child: EntryWithChildren | API_StoryEntry) => {
      if (child.type === "story") {
        return child.id;
      }
      return getAllChildStoryIds(child.children, index);
    }),
  ].filter((value, index, self) => self.indexOf(value) === index);
}

function ItemIcon({
  item,
  index,
  settings,
}: {
  item: API_HashEntry;
  index: API_IndexHash;
  settings: ScanSettings;
}) {
  const channel = addons.getChannel();

  useEffect(() => {
    channel.on(EVENTS.SCAN_STORIES_ADDED, (stories: string[]) => {
      console.log("Stories added:", stories);
    });
    channel.on(EVENTS.SCAN_STORIES_ADDED, (stories: string[]) => {
      console.log("Stories removed:", stories);
    });
  }, [channel]);
  if (item.type === "docs") {
    return (
      <span style={{ width: 10, height: 10, display: "inline-block" }}></span>
    );
  }
  if (item.type === "story") {
    return settings.stories?.includes(item.id) ? (
      <CheckIcon width={10} height={10} color="#090" />
    ) : (
      <CrossIcon width={10} height={10} color="#900" />
    );
  } else {
    if (!index) {
      return null;
    }
    const allChildren = getAllChildStoryIds(
      (item as EntryWithChildren).children ?? [],
      index,
    );
    const selectedStories = allChildren.filter((id) =>
      settings.stories?.includes(id),
    );
    return !selectedStories.length ? (
      <BatchDenyIcon height={10} width={10} color="#900" />
    ) : (
      <BatchAcceptIcon height={10} width={10} color="#090" />
    );
  }
}
addons.register(ADDON_ID, (api) => {
  addons.add(TAB_ID, {
    type: types.TAB,
    title: "ACR",
    // only show on local builds
    match: () => location.hostname.match(/(localhost|127\.0\.0\.1)/) !== null,
    render: ({ active }) => <Tab active={active} />,
  });

  addons.setConfig({
    sidebar: {
      renderLabel: (item) => {
        const { settingsOpen, settings, setSettings } = useScanSettings();
        const { index } = useStorybookState();
        const channel = addons.getChannel();

        return settingsOpen && api.getQueryParam("tab") === TAB_ID ? (
          <Label
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();

              if (item.type === "story") {
                if (settings.stories?.includes(item.id)) {
                  settings.stories = settings.stories.filter(
                    (id) => id !== item.id,
                  );
                  channel.emit(EVENTS.SCAN_STORIES_REMOVED, [item.id]);
                } else {
                  settings.stories = [...(settings.stories ?? []), item.id];
                  channel.emit(EVENTS.SCAN_STORIES_ADDED, [item.id]);
                }
                setSettings(settings);
              } else if (item.type !== "docs") {
                const allChildren = getAllChildStoryIds(
                  (item as EntryWithChildren).children ?? [],
                  index,
                );
                if (settings.stories?.some((id) => allChildren.includes(id))) {
                  settings.stories = settings.stories.filter(
                    (id) => !allChildren.includes(id),
                  );
                } else {
                  settings.stories = [
                    ...(settings.stories ?? []),
                    ...allChildren,
                  ];
                }
                setSettings(settings);
              }
            }}
          >
            <StatusWrapper>
              <ItemIcon item={item} settings={settings} index={index} />
            </StatusWrapper>
            {item.name}
          </Label>
        ) : (
          item.name
        );
      },
    },
  });
  // addons.add("button-id", {
  //   type: types.TOOL,
  //   title: "ACR Button",
  //   // only show on local builds
  //   match: () => location.hostname.match(/(localhost|127\.0\.0\.1)/) !== null,
  //   render: () => {
  //     const currentStoryId = api.getCurrentStoryData()?.id;
  //     return (
  //       <button
  //         onClick={() => {
  //           console.log("button clicked");
  //           addons
  //             .getChannel()
  //             .emit("storybook/a11y/result", {}, currentStoryId);
  //         }}
  //       >
  //         do the thing
  //       </button>
  //     );
  //   },
  // });
});
