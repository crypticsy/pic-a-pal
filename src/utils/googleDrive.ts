/**
 * Google Drive Upload Utility
 *
 * This utility provides functionality to automatically upload photos to Google Drive.
 * It uses the Google Drive API v3 with OAuth 2.0 authentication.
 *
 * Setup Instructions:
 * 1. Create a project at https://console.cloud.google.com
 * 2. Enable Google Drive API
 * 3. Create OAuth 2.0 credentials (Web application type)
 * 4. Add authorized JavaScript origins (your app's URL)
 * 5. Configure via URL key or Settings modal
 */

import { getGoogleDriveConfig } from './configManager';

// Google API constants
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

let gapiInited = false;
let gisInited = false;
let tokenClient: any = null;

/**
 * Load the Google API client library
 */
export const loadGoogleAPI = async (): Promise<void> => {
  const config = getGoogleDriveConfig();
  if (!config.enabled || !config.clientId) {
    console.log('Google Drive auto-upload is disabled or not configured');
    return;
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      // @ts-ignore
      gapi.load('client', async () => {
        try {
          // @ts-ignore
          await gapi.client.init({
            apiKey: '', // API key not required for OAuth2
            discoveryDocs: [DISCOVERY_DOC],
          });
          gapiInited = true;
          console.log('Google API client initialized');
          resolve();
        } catch (error) {
          console.error('Error initializing Google API client:', error);
          reject(error);
        }
      });
    };
    script.onerror = () => reject(new Error('Failed to load Google API'));
    document.body.appendChild(script);
  });
};

/**
 * Load the Google Identity Services library
 */
export const loadGoogleIdentity = async (): Promise<void> => {
  const config = getGoogleDriveConfig();
  if (!config.enabled || !config.clientId) {
    return;
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      // @ts-ignore
      tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: config.clientId,
        scope: SCOPES,
        callback: '', // will be set during request
      });
      gisInited = true;
      console.log('Google Identity Services initialized');
      resolve();
    };
    script.onerror = () => reject(new Error('Failed to load Google Identity Services'));
    document.body.appendChild(script);
  });
};

/**
 * Initialize Google Drive API
 * Call this once when your app loads
 */
export const initGoogleDrive = async (): Promise<void> => {
  const config = getGoogleDriveConfig();
  if (!config.enabled || !config.clientId) {
    console.log('Google Drive auto-upload is disabled or not configured');
    return;
  }

  try {
    await Promise.all([loadGoogleAPI(), loadGoogleIdentity()]);
    console.log('Google Drive API ready');
  } catch (error) {
    console.error('Failed to initialize Google Drive API:', error);
    throw error;
  }
};

/**
 * Request authorization from the user
 */
const requestAuthorization = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!tokenClient) {
      reject(new Error('Token client not initialized'));
      return;
    }

    tokenClient.callback = (response: any) => {
      if (response.error) {
        reject(response);
        return;
      }
      resolve(response.access_token);
    };

    // @ts-ignore
    if (gapi.client.getToken() === null) {
      // Prompt the user to select a Google Account and ask for consent to share their data
      tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      // Skip display of account chooser and consent dialog for an existing session
      tokenClient.requestAccessToken({ prompt: '' });
    }
  });
};

/**
 * Convert base64 data URL to Blob
 */
const dataURLtoBlob = (dataURL: string): Blob => {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

/**
 * Upload a photo strip to Google Drive
 *
 * @param photoStripData - Base64 encoded image data (data URL)
 * @param filename - Name of the file to be saved
 * @returns Promise with the uploaded file's metadata
 */
export const uploadPhotoToGoogleDrive = async (
  photoStripData: string,
  filename: string
): Promise<any> => {
  const config = getGoogleDriveConfig();

  if (!config.enabled) {
    console.log('Google Drive auto-upload is disabled');
    return null;
  }

  if (!config.clientId) {
    console.error('Google Drive Client ID not configured');
    return null;
  }

  if (!gapiInited || !gisInited) {
    console.error('Google Drive API not initialized. Call initGoogleDrive() first.');
    return null;
  }

  try {
    // Request authorization if needed
    await requestAuthorization();

    // Convert data URL to Blob
    const blob = dataURLtoBlob(photoStripData);

    // Prepare metadata
    const metadata = {
      name: filename,
      mimeType: 'image/jpeg',
      ...(config.folderId && { parents: [config.folderId] }),
    };

    // Create form data for multipart upload
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', blob);

    // Upload to Google Drive
    // @ts-ignore
    const token = gapi.client.getToken();
    const response = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.access_token}`,
        },
        body: form,
      }
    );

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Successfully uploaded to Google Drive:', result);
    return result;
  } catch (error) {
    console.error('Error uploading to Google Drive:', error);
    throw error;
  }
};

/**
 * Check if Google Drive auto-upload is enabled
 */
export const isGoogleDriveEnabled = (): boolean => {
  const config = getGoogleDriveConfig();
  return config.enabled && !!config.clientId;
};

/**
 * Check if current configuration is key-based (from URL)
 */
export const isKeyBasedConfig = (): boolean => {
  const config = getGoogleDriveConfig();
  return config.isKeyBased;
};

/**
 * Sign out from Google
 */
export const signOutGoogleDrive = (): void => {
  // @ts-ignore
  const token = gapi?.client?.getToken();
  if (token !== null) {
    // @ts-ignore
    google.accounts.oauth2.revoke(token.access_token);
    // @ts-ignore
    gapi.client.setToken('');
  }
};
