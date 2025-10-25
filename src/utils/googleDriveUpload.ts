// Google Drive upload utility for Vercel backend

// Configuration - you can set this via environment variable
const VERCEL_API_URL = import.meta.env.VITE_VERCEL_API_URL || '';

export interface UploadResponse {
  success: boolean;
  file_id?: string;
  file_name?: string;
  web_view_link?: string;
  message?: string;
  error?: string;
  authorized?: boolean;
}

/**
 * Check if the user is authorized with Google Drive
 */
export async function checkAuthorizationStatus(): Promise<boolean> {
  if (!VERCEL_API_URL) {
    console.warn('VITE_VERCEL_API_URL not configured');
    return false;
  }

  try {
    const response = await fetch(`${VERCEL_API_URL}/api/status`, {
      credentials: 'include', // Important for session cookies
    });

    const data = await response.json();
    return data.authorized === true;
  } catch (error) {
    console.error('Failed to check authorization status:', error);
    return false;
  }
}

/**
 * Get the authorization URL to redirect users to
 */
export function getAuthorizationUrl(): string {
  if (!VERCEL_API_URL) {
    console.warn('VITE_VERCEL_API_URL not configured');
    return '';
  }
  return `${VERCEL_API_URL}/authorize`;
}

/**
 * Upload a single image to Google Drive via Vercel backend
 * @param imageDataUrl - Base64 encoded image data URL (e.g., from canvas.toDataURL())
 * @param filename - Filename to use for the upload
 * @returns Upload response with file details or error
 */
export async function uploadImageToGoogleDrive(
  imageDataUrl: string,
  filename: string
): Promise<UploadResponse> {
  if (!VERCEL_API_URL) {
    return {
      success: false,
      error: 'Google Drive upload not configured. Set VITE_VERCEL_API_URL environment variable.',
    };
  }

  try {
    const response = await fetch(`${VERCEL_API_URL}/api/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important for session cookies
      body: JSON.stringify({
        image: imageDataUrl,
        filename: filename,
      }),
    });

    const data: UploadResponse = await response.json();

    if (!response.ok) {
      // Check if it's an authorization error
      if (response.status === 401) {
        return {
          success: false,
          authorized: false,
          error: 'Not authorized. Please authorize Google Drive access first.',
        };
      }

      return {
        success: false,
        error: data.error || 'Upload failed',
      };
    }

    return data;
  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error occurred',
    };
  }
}

/**
 * Upload multiple images (photo strip) to Google Drive
 * @param images - Array of base64 encoded image data URLs
 * @param baseFilename - Base filename (will be suffixed with -1, -2, etc.)
 * @returns Array of upload responses
 */
export async function uploadPhotoStripToGoogleDrive(
  images: string[],
  baseFilename: string
): Promise<UploadResponse[]> {
  const results: UploadResponse[] = [];

  // Remove extension from base filename if present
  const filenameWithoutExt = baseFilename.replace(/\.[^/.]+$/, '');

  for (let i = 0; i < images.length; i++) {
    const filename = `${filenameWithoutExt}-${i + 1}.jpg`;
    const result = await uploadImageToGoogleDrive(images[i], filename);
    results.push(result);

    // If we get an auth error, stop trying
    if (!result.success && result.authorized === false) {
      break;
    }

    // Add a small delay between uploads to avoid rate limiting
    if (i < images.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  return results;
}

/**
 * Helper to check if uploads are configured
 */
export function isUploadConfigured(): boolean {
  return !!VERCEL_API_URL;
}
