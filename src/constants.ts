export const ADDON_ID = "storybook-addon-acr";
export const TAB_ID = `${ADDON_ID}/tab`;
export const STATE_PREFIX = `${ADDON_ID}/state/`;
export const EVENT_PREFIX = `${ADDON_ID}/event/`;
export const STATE = {
  REPORT_SETTINGS_OPEN: `${STATE_PREFIX}report-settings-open`,
  REPORT_SETTINGS: `${STATE_PREFIX}report-settings`,
};
export const EVENTS = {
  SCAN_STORIES_ADDED: `${EVENT_PREFIX}scan-stories-added`,
  SCAN_STORIES_REMOVED: `${EVENT_PREFIX}scan-stories-removed`,
};
