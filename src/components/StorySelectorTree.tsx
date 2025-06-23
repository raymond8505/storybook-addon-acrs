import { LI, UL } from "storybook/internal/components";
import { API_IndexHash, API_RootEntry } from "storybook/internal/types";
import React from "react";
export function StorySelectorTree({
  index: indexIn,
  onChange,
}: {
  index: API_IndexHash;
  onChange: (ids: string[]) => void;
}) {
  const index = { ...indexIn };

  return (
    <UL>
      {Object.entries(index)
        .filter(([_, story]) => story.type === "root")
        .map(([storyId, story]) => {
          const children = (story as API_RootEntry).children;
          return (
            <LI key={storyId}>
              <label>
                <input type="checkbox" name={storyId} />
                {children && children.length ? (
                  <UL>
                    {children.map((childId) => {
                      const child = index[childId];

                      return <LI></LI>;
                    })}
                  </UL>
                ) : null}
              </label>
            </LI>
          );
        })}
    </UL>
  );
}
