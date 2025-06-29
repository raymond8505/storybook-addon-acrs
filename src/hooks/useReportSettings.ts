import { useEffect, useState } from "react";
import { STATE } from "src/constants";
import {
  useAddonState,
  useStorybookApi,
  useStorybookState,
} from "storybook/internal/manager-api";

export interface ReportSettings {
  stories?: string[];
  tags?: {
    include: string[];
    exclude: string[];
  };
}
export function useReportSettings() {
  const [settingsOpen, setSettingsOpen] = useState(true);

  const { index, theme } = useStorybookState();
  const api = useStorybookApi();

  const localStorageId = `${theme.brandUrl}/${STATE.REPORT_SETTINGS}`;

  const [settings, setSettings] = useState<ReportSettings>(
    (() => {
      const storedVal = localStorage.getItem(localStorageId);
      if (storedVal) return JSON.parse(localStorage.getItem(localStorageId));
      return {
        stories: undefined,
        tags: {
          include: [],
          exclude: [],
        },
      };
    })(),
  );

  useEffect(() => {
    if (!settings.stories && index) {
      settings.stories = Object.entries(index)
        .filter(([_, val]) => val.type === "story")
        .map(([key]) => key);

      setSettings(settings);
    }
  }, [settings, index]);

  useEffect(() => {
    localStorage.setItem(localStorageId, JSON.stringify(settings));
  }, [settings]);

  return {
    settingsOpen,
    setSettingsOpen,
    settings,
    setSettings: (newSettings: ReportSettings) => {
      setSettings({
        ...newSettings,
      });
    },
  };
}
