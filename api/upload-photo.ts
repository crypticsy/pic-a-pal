/**
 * Vercel Serverless Function: Upload Photo to Google Drive
 *
 * This function uploads photos directly to Google Drive using a service account.
 * The service account credentials are stored securely in Vercel environment variables.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { google } from 'googleapis';

// CORS headers for cross-origin requests from GitHub Pages
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

/**
 * Initialize Google Drive client with service account
 */
function getDriveClient(serviceAccount: any) {
  const auth = new google.auth.GoogleAuth({
    credentials: serviceAccount,
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  });

  return google.drive({ version: 'v3', auth });
}

/**
 * Convert base64 data URL to Buffer
 */
function dataURLtoBuffer(dataURL: string): Buffer {
  const arr = dataURL.split(',');
  const bstr = Buffer.from(arr[1], 'base64');
  return bstr;
}

/**
 * Upload file to Google Drive
 */
async function uploadToDrive(
  drive: any,
  fileBuffer: Buffer,
  filename: string,
  folderId?: string
) {
  const fileMetadata: any = {
    name: filename,
    mimeType: 'image/jpeg',
  };

  // Add parent folder if specified
  if (folderId) {
    fileMetadata.parents = [folderId];
  }

  const { Readable } = require('stream');
  const media = {
    mimeType: 'image/jpeg',
    body: Readable.from(fileBuffer),
  };

  const response = await drive.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: 'id, name, webViewLink, webContentLink',
  });

  return response.data;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers for all responses
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).json({ message: 'OK' });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the key and photo data from request
    const { key, filename, photoData } = req.body;

    if (!key || !filename || !photoData) {
      return res.status(400).json({ error: 'Missing key, filename, or photoData' });
    }

    // Get service account JSON from environment variable based on key
    const envVarName = `GOOGLE_DRIVE_SERVICE_ACCOUNT_${key.toUpperCase()}`;
    const serviceAccountJson = process.env[envVarName];

    if (!serviceAccountJson) {
      console.error(`Service account not found for key: ${key}`);
      return res.status(404).json({ error: 'Configuration not found for this key' });
    }

    // Parse service account
    const serviceAccount = JSON.parse(serviceAccountJson);

    if (!serviceAccount.private_key || !serviceAccount.client_email) {
      return res.status(500).json({ error: 'Invalid service account configuration' });
    }

    // Get folder ID from environment (optional)
    const folderId = process.env[`GOOGLE_DRIVE_FOLDER_${key.toUpperCase()}`];

    // Initialize Google Drive client
    const drive = getDriveClient(serviceAccount);

    // Convert base64 to buffer
    const fileBuffer = dataURLtoBuffer(photoData);

    // Upload to Google Drive
    console.log('Uploading to Google Drive...');
    const result = await uploadToDrive(drive, fileBuffer, filename, folderId);

    console.log('Successfully uploaded to Google Drive:', result);

    // Return the result
    return res.status(200).json({
      success: true,
      fileId: result.id,
      fileName: result.name,
      webViewLink: result.webViewLink,
      webContentLink: result.webContentLink,
    });

  } catch (error) {
    console.error('Error uploading to Google Drive:', error);
    return res.status(500).json({
      error: 'Failed to upload to Google Drive',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
