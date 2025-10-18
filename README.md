# Pocket Booth

Your pocket-sized photo booth application that captures instant photo strips you can download.


## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
# Build for production
npm run build
```

### Preview Production Build

```bash
# Preview production build
npm run preview
```

## How to Use

1. Click **"INSERT COIN"** to start the photo booth
2. Camera loads and countdown begins automatically (3 seconds)
3. 4 photos are captured automatically (2.5 seconds between each)
4. View your photo strip and download it
5. Access **"GALLERY"** to view all your saved photo strips

## Browser Permissions

The app requires camera access to function. You'll be prompted to allow camera permissions when you first use the photo booth.

## Google Drive Auto-Upload (Optional)

You can configure the app to automatically upload photo strips to Google Drive when they are captured. There are two ways to configure this feature, with different priority levels.

### Configuration Methods (Priority Order)

The app supports two configuration methods in this priority order:
1. **URL Key-Based Config** (Highest - for events/shared deployments)
2. **Manual UI Config** (for personal use)

---

### Method 1: URL Key-Based Configuration (Recommended for Events)

This method is ideal for shared deployments, events, or when you want to pre-configure settings that users cannot modify.

#### Setup Steps:

1. **Create a Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select an existing one

2. **Enable Google Drive API**
   - In your project, go to "APIs & Services" > "Library"
   - Search for "Google Drive API" and enable it

3. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Select "Web application" as the application type
   - Add your app's URL to "Authorized JavaScript origins"
   - Copy the Client ID

4. **Configure Environment Variables**
   - Copy `.env.example` to `.env`
   - Add a configuration key in this format:
     ```
     VITE_CONFIG_MYEVENT=true,your_client_id.apps.googleusercontent.com,optional_folder_id
     ```
   - Examples:
     ```
     VITE_CONFIG_WEDDING=true,123456-abc.apps.googleusercontent.com,1a2b3c4d5e6f
     VITE_CONFIG_BIRTHDAY=true,789012-xyz.apps.googleusercontent.com,
     ```

5. **Share URL with Users**
   - Add `?mode=key&key=MYEVENT` to your app URL
   - Example: `https://yourapp.com/?mode=key&key=wedding`
   - Users visiting this URL will automatically have Google Drive configured
   - Settings are locked and cannot be edited in the UI
   - The key is stored in sessionStorage and cleared when the URL changes

#### How It Works:
- The key in the URL must match a `VITE_CONFIG_[KEY]` environment variable (case-insensitive)
- Configuration is loaded automatically and stored in sessionStorage
- Settings are displayed as read-only in the Settings modal
- The key is destroyed when a new session starts with a different base URL
- Perfect for events where you want consistent configuration for all users

---

### Method 2: Manual UI Configuration (For Personal Use)

This method allows users to configure their own Google Drive settings via the app interface.

#### Setup Steps:

1. **Create Google Cloud Project** (same as Method 1, steps 1-3)

2. **Configure in the App**
   - Open the app and click the Settings icon (gear icon in the top right)
   - In the "Google Drive Auto-Upload" section:
     - Toggle "Enable Auto-Upload" to ON
     - Paste your Client ID in the "Client ID" field
     - (Optional) Add a Folder ID if you want photos saved to a specific folder
   - Click "Save Google Drive Settings"
   - Refresh the page for changes to take effect

#### How It Works:
- Settings are saved in browser's localStorage and persist across sessions
- Users have full control to enable/disable and modify settings
- Great for personal use or development
