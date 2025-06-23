import { useEffect } from "react";
import { STATE } from "src/constants";
import {
  useAddonState,
  useStorybookApi,
  useStorybookState,
} from "storybook/internal/manager-api";

export interface ScanSettings {
  stories?: string[];
  tags?: string[];
}
export function useScanSettings() {
  const [settingsOpen, setSettingsOpen] = useAddonState(
    STATE.SCAN_SETTINGS_OPEN,
    true,
  );

  const { index, theme } = useStorybookState();
  const api = useStorybookApi();

  const localStorageId = `${theme.brandUrl}/${STATE.SCAN_SETTINGS}`;

  const [settings, setSettings] = useAddonState<ScanSettings>(
    STATE.SCAN_SETTINGS,
    JSON.parse(localStorage.getItem(localStorageId) ?? "{}"),
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
    setSettings: (newSettings: ScanSettings) => {
      setSettings({
        ...newSettings,
      });
    },
  };
}
