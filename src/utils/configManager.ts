/**
 * Configuration Manager
 *
 * Handles key-based configuration via URL parameters and session management.
 * When a URL has ?key=VALUE, it looks up the configuration in environment
 * variables and stores it in sessionStorage.
 */

const SESSION_KEY_NAME = 'picapal_config_key';
const SESSION_URL_NAME = 'picapal_session_url';

export interface GoogleDriveConfig {
  enabled: boolean;
  folderId: string; // Google Drive folder ID (optional)
  isKeyBased: boolean;
  photoLimit?: number; // Maximum number of photo strips allowed (undefined = unlimited)
}

/**
 * Parse URL parameters and check for key-based configuration
 */
export const initializeConfigFromURL = (): void => {
  const urlParams = new URLSearchParams(window.location.search);
  const key = urlParams.get('key');

  // Get current URL without query params
  const currentBaseURL = window.location.origin + window.location.pathname;
  const previousBaseURL = sessionStorage.getItem(SESSION_URL_NAME);

  // If URL has changed (new session), clear previous key
  if (previousBaseURL && previousBaseURL !== currentBaseURL) {
    sessionStorage.removeItem(SESSION_KEY_NAME);
    sessionStorage.removeItem(SESSION_URL_NAME);
  }

  // Store current base URL
  sessionStorage.setItem(SESSION_URL_NAME, currentBaseURL);

  // Check if URL contains key=VALUE
  if (key) {
    const configKey = key.toUpperCase();
    const envVarName = `VITE_CONFIG_${configKey}`;

    // Try to get configuration from environment variable
    const configValue = (import.meta.env as any)[envVarName];

    if (configValue) {
      // Store the key in sessionStorage
      sessionStorage.setItem(SESSION_KEY_NAME, key);
      console.log(`Configuration loaded for key: ${key}`);
    } else {
      console.warn(`No configuration found for key: ${key}`);
      sessionStorage.removeItem(SESSION_KEY_NAME);
    }
  }
};

/**
 * Get the current configuration key from sessionStorage
 */
export const getCurrentConfigKey = (): string | null => {
  return sessionStorage.getItem(SESSION_KEY_NAME);
};

/**
 * Check if the current session is using key-based configuration
 */
export const isKeyBasedConfig = (): boolean => {
  return getCurrentConfigKey() !== null;
};

/**
 * Parse configuration string from environment variable
 * Format: "enabled,folderId,photoLimit"
 */
const parseConfigString = (configString: string): Omit<GoogleDriveConfig, 'isKeyBased'> | null => {
  if (!configString) return null;

  const parts = configString.split(',').map(part => part.trim());

  if (parts.length < 2 || parts.length > 3) {
    console.error('Invalid config format. Expected: enabled,folderId[,photoLimit]');
    return null;
  }

  const [enabledStr, folderId, photoLimitStr] = parts;
  const enabled = enabledStr.toLowerCase() === 'true';
  const photoLimit = photoLimitStr && photoLimitStr !== '' ? parseInt(photoLimitStr, 10) : undefined;

  return {
    enabled,
    folderId: folderId || '',
    photoLimit: photoLimit && !isNaN(photoLimit) ? photoLimit : undefined,
  };
};

/**
 * Get Google Drive configuration based on priority:
 * 1. URL key-based config (from environment)
 * 2. Manual localStorage config (from Settings UI)
 */
export const getGoogleDriveConfig = (): GoogleDriveConfig => {
  // Priority 1: Check for key-based configuration
  const configKey = getCurrentConfigKey();
  if (configKey) {
    const envVarName = `VITE_CONFIG_${configKey.toUpperCase()}`;
    const configValue = (import.meta.env as any)[envVarName];

    if (configValue) {
      const parsedConfig = parseConfigString(configValue);
      if (parsedConfig) {
        return {
          ...parsedConfig,
          isKeyBased: true,
        };
      }
    }
  }

  // Priority 2: Check localStorage (manual configuration from Settings UI)
  const localEnabled = localStorage.getItem('googleDriveEnabled') === 'true';
  const localFolderId = localStorage.getItem('googleDriveFolderId') || '';

  if (localEnabled) {
    return {
      enabled: localEnabled,
      folderId: localFolderId,
      isKeyBased: false,
    };
  }

  // No configuration found - return disabled state
  return {
    enabled: false,
    folderId: '',
    isKeyBased: false,
  };
};

/**
 * Clear the current configuration key
 * (Useful when user wants to switch to manual config)
 */
export const clearConfigKey = (): void => {
  sessionStorage.removeItem(SESSION_KEY_NAME);
};

/**
 * Get the storage key for tracking photo count for the current config key
 */
const getPhotoCountStorageKey = (): string => {
  const configKey = getCurrentConfigKey();
  if (configKey) {
    return `picapal_photo_count_${configKey}`;
  }
  return 'picapal_photo_count_default';
};

/**
 * Get the number of photos taken for the current key
 */
export const getPhotosTaken = (): number => {
  const key = getPhotoCountStorageKey();
  const count = localStorage.getItem(key);
  return count ? parseInt(count, 10) : 0;
};

/**
 * Increment the photo count for the current key
 */
export const incrementPhotoCount = (): void => {
  const key = getPhotoCountStorageKey();
  const current = getPhotosTaken();
  localStorage.setItem(key, (current + 1).toString());
};

/**
 * Check if the user has reached the photo limit
 * Returns true if limit is reached, false otherwise
 */
export const hasReachedPhotoLimit = (): boolean => {
  const config = getGoogleDriveConfig();

  // If no photo limit is set, user can take unlimited photos
  if (!config.photoLimit) {
    return false;
  }

  const photosTaken = getPhotosTaken();
  return photosTaken >= config.photoLimit;
};

/**
 * Get the number of photos remaining
 * Returns undefined if there's no limit
 */
export const getPhotosRemaining = (): number | undefined => {
  const config = getGoogleDriveConfig();

  if (!config.photoLimit) {
    return undefined;
  }

  const photosTaken = getPhotosTaken();
  const remaining = config.photoLimit - photosTaken;
  return Math.max(0, remaining);
};
