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
    false,
  );

  const [settings, setSettings] = useAddonState<ScanSettings>(
    STATE.SCAN_SETTINGS,
    {},
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
