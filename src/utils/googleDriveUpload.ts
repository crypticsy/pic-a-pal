/**
 * Google Drive Upload Utility (Server-side via Vercel)
 *
 * This utility uploads photos to Google Drive using a Vercel serverless function.
 * The service account credentials are stored securely on the server.
 */

import { getGoogleDriveConfig, getCurrentConfigKey } from './configManager';

// API endpoint configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Upload a photo strip to Google Drive via Vercel serverless function
 *
 * @param photoStripData - Base64 encoded image data (data URL)
 * @param filename - Name of the file to be saved
 * @returns Promise with the upload result
 */
export const uploadPhotoToGoogleDrive = async (
  photoStripData: string,
  filename: string
): Promise<{ success: boolean; fileId?: string; fileName?: string; webViewLink?: string }> => {
  const config = getGoogleDriveConfig();

  if (!config.enabled) {
    console.log('Google Drive auto-upload is disabled');
    return { success: false };
  }

  const key = getCurrentConfigKey();
  if (!key) {
    console.error('No configuration key found. Upload requires a key-based configuration.');
    return { success: false };
  }

  try {
    console.log('Uploading to Google Drive via Vercel API...');

    const response = await fetch(`${API_BASE_URL}/upload-photo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key,
        filename,
        photoData: photoStripData,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload to Google Drive');
    }

    const result = await response.json();
    console.log('Successfully uploaded to Google Drive:', result);

    return {
      success: true,
      fileId: result.fileId,
      fileName: result.fileName,
      webViewLink: result.webViewLink,
    };
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
  const key = getCurrentConfigKey();
  return config.enabled && !!key;
};

/**
 * Initialize Google Drive (no-op for server-side implementation)
 * Kept for backwards compatibility
 */
export const initGoogleDrive = async (): Promise<void> => {
  const config = getGoogleDriveConfig();
  if (!config.enabled) {
    console.log('Google Drive auto-upload is disabled or not configured');
    return;
  }

  console.log('Google Drive ready (using server-side upload via Vercel)');
};
