import { Fieldset } from "src/components/controls/styles";
import { TagSelect } from "src/components/controls/TagSelect";
import { useReportSettings } from "src/hooks/useReportSettings";

import { H2 } from "storybook/internal/components";

import { styled } from "storybook/internal/theming";
import React from "react";
const Wrapper = styled.div`
  width: 85%;
  height: 100%;
  padding-right: 10vmin;
`;

export function ReportSettings() {
  const { settings, setSettings } = useReportSettings();
  return (
    <Wrapper>
      <H2>Report Settings</H2>
      <Fieldset columns={2} sticky={false}>
        <legend>Tags</legend>
        <label>
          <span>Include:</span>
          <TagSelect
            defaultValue={settings.tags.include}
            onChange={(tags) => {
              setSettings({
                ...settings,
                tags: {
                  ...settings.tags,
                  include: tags as string[],
                },
              });
            }}
          />
        </label>
        <label>
          <span>Exclude:</span>
          <TagSelect
            defaultValue={settings.tags.exclude}
            onChange={(tags) => {
              setSettings({
                ...settings,
                tags: {
                  ...settings.tags,
                  exclude: tags as string[],
                },
              });
            }}
          />
        </label>
      </Fieldset>
    </Wrapper>
  );
}
