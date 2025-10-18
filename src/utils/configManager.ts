/**
 * Configuration Manager
 *
 * Handles key-based configuration via URL parameters and session management.
 * When a URL has ?mode=key&key=VALUE, it looks up the configuration in environment
 * variables and stores it in sessionStorage.
 */

const SESSION_KEY_NAME = 'picapal_config_key';
const SESSION_URL_NAME = 'picapal_session_url';

export interface GoogleDriveConfig {
  enabled: boolean;
  clientId: string;
  folderId: string;
  isKeyBased: boolean;
}

/**
 * Parse URL parameters and check for key-based configuration
 */
export const initializeConfigFromURL = (): void => {
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get('mode');
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

  // Check if URL contains mode=key&key=VALUE
  if (mode === 'key' && key) {
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
 * Format: "enabled,clientId,folderId"
 */
const parseConfigString = (configString: string): Omit<GoogleDriveConfig, 'isKeyBased'> | null => {
  if (!configString) return null;

  const parts = configString.split(',').map(part => part.trim());

  if (parts.length !== 3) {
    console.error('Invalid config format. Expected: enabled,clientId,folderId');
    return null;
  }

  const [enabledStr, clientId, folderId] = parts;
  const enabled = enabledStr.toLowerCase() === 'true';

  return {
    enabled,
    clientId: clientId || '',
    folderId: folderId || '',
  };
};

/**
 * Get Google Drive configuration based on priority:
 * 1. URL key-based config (from environment)
 * 2. Manual localStorage config (from Settings UI)
 * 3. Environment variables (fallback)
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
  const localClientId = localStorage.getItem('googleDriveClientId') || '';
  const localFolderId = localStorage.getItem('googleDriveFolderId') || '';

  if (localEnabled && localClientId) {
    return {
      enabled: localEnabled,
      clientId: localClientId,
      folderId: localFolderId,
      isKeyBased: false,
    };
  }

  // Priority 3: Fallback to environment variables (legacy support)
  const envEnabled = import.meta.env.VITE_GOOGLE_DRIVE_AUTO_UPLOAD === 'true';
  const envClientId = import.meta.env.VITE_GOOGLE_DRIVE_CLIENT_ID || '';
  const envFolderId = import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_ID || '';

  return {
    enabled: envEnabled,
    clientId: envClientId,
    folderId: envFolderId,
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
