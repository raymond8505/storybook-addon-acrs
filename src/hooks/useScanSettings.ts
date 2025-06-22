import { useEffect } from "react";
import { STATE } from "src/constants";
import {
  useAddonState,
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

  const [settings, setSettings] = useAddonState<ScanSettings>(
    STATE.SCAN_SETTINGS,
    JSON.parse(localStorage.getItem(STATE.SCAN_SETTINGS) ?? "{}"),
  );

  const { index } = useStorybookState();

  useEffect(() => {
    if (!settings.stories && index) {
      settings.stories = Object.entries(index)
        .filter(([_, val]) => val.type === "story")
        .map(([key]) => key);

      setSettings(settings);
    }
  }, [settings, index]);

  useEffect(() => {
    localStorage.setItem(STATE.SCAN_SETTINGS, JSON.stringify(settings));
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
