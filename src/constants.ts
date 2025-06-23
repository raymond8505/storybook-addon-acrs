export const ADDON_ID = "storybook-addon-acr";
export const TAB_ID = `${ADDON_ID}/tab`;
export const STATE_PREFIX = `${ADDON_ID}/state/`;
export const EVENT_PREFIX = `${ADDON_ID}/event/`;
export const STATE = {
  SCAN_SETTINGS_OPEN: `${STATE_PREFIX}scan-settings-open`,
  SCAN_SETTINGS: `${STATE_PREFIX}scan-settings`,
};
export const EVENTS = {
  SCAN_STORIES_ADDED: `${EVENT_PREFIX}scan-stories-added`,
  SCAN_STORIES_REMOVED: `${EVENT_PREFIX}scan-stories-removed`,
};
