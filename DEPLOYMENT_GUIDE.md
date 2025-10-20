# Pocket Booth - Deployment Guide
## GitHub Pages (Frontend) + Vercel (API) + Google Drive

This guide shows you how to deploy Pocket Booth with:
- **Frontend**: GitHub Pages (free static hosting)
- **API**: Vercel serverless function (free tier)
- **Storage**: Google Drive with service account

---

## Quick Overview

```
┌──────────────────┐
│  GitHub Pages    │  Your static website
│   (Frontend)     │  https://username.github.io/pocket-booth
└────────┬─────────┘
         │
         │ POST /api/upload-photo
         │ {key, filename, photoData}
         ▼
┌──────────────────┐
│     Vercel       │  Serverless function
│      (API)       │  https://your-api.vercel.app
└────────┬─────────┘
         │
         │ Google Drive API
         │ (with service account)
         ▼
┌──────────────────┐
│  Google Drive    │  Photo storage
│     Folder       │  Organized by event
└──────────────────┘
```

---

## Step 1: Google Drive Setup (5 min)

### 1.1 Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project: **"pocket-booth"**
3. Enable **Google Drive API**:
   - Go to "APIs & Services" > "Library"
   - Search "Google Drive API"
   - Click "Enable"

### 1.2 Create Service Account

1. Go to "IAM & Admin" > "Service Accounts"
2. Click **"CREATE SERVICE ACCOUNT"**
3. Name: `pocket-booth-uploader`
4. Click "CREATE AND CONTINUE"
5. Skip roles (click "CONTINUE")
6. Click "DONE"

### 1.3 Create JSON Key

1. Click on the service account you just created
2. Go to **"KEYS"** tab
3. Click **"ADD KEY"** > "Create new key"
4. Choose **JSON**
5. Click "CREATE"
6. **Save the downloaded JSON file securely!**

### 1.4 Share Google Drive Folder

1. Create a folder in your Google Drive (e.g., "Pocket Booth Photos")
2. Right-click > Share
3. Add the service account email (from JSON: `client_email`)
4. Give **"Editor"** permission
5. Copy the folder ID from URL:
   ```
   https://drive.google.com/drive/folders/1a2b3c4d5e6f7g8h9i0j
                                           ^^^^^^^^^^^^^^^^^^^^
                                           This is your folder ID
   ```

---

## Step 2: Deploy API to Vercel (3 min)

### 2.1 Deploy to Vercel

**Option A: Vercel Dashboard**

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repo
3. Project name: `pocket-booth-api`
4. Click **Deploy**

**Option B: Vercel CLI**

```bash
npm install -g vercel
vercel login
vercel --prod
```

### 2.2 Add Environment Variables

In Vercel Dashboard > Settings > Environment Variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `GOOGLE_DRIVE_SERVICE_ACCOUNT_USER` | Paste entire JSON from Step 1.3 | Production |
| `GOOGLE_DRIVE_FOLDER_USER` | Your folder ID from Step 1.4 | Production |
| `ALLOWED_ORIGIN` | `https://username.github.io` | Production |

**Important**: Replace `USER` with your key name, and `username` with your GitHub username.

### 2.3 Get API URL

After deployment, copy your Vercel URL:
```
https://pocket-booth-api-abc123.vercel.app
```

---

## Step 3: Configure Frontend (2 min)

### 3.1 Create .env.production

```bash
# Your Vercel API URL
VITE_API_BASE_URL=https://your-api.vercel.app/api

# Event configuration
# Format: enabled,folderId,photoLimit
VITE_CONFIG_USER=true,1a2b3c4d5e6f7g8h9i0j,5
```

Replace:
- `your-api.vercel.app` - Your Vercel URL
- `1a2b3c4d5e6f7g8h9i0j` - Your Google Drive folder ID
- `5` - Photo limit (or leave empty for unlimited)

---

## Cost

- **GitHub Pages**: $0 (free)
- **Vercel**: $0 (Hobby plan)
- **Google Drive**: $0 (15GB free storage)

**Total: $0/month!** 🎉

---

## Security

✅ Service account credentials stored only on Vercel
✅ No OAuth flow required for users
✅ Photos private in your Google Drive
✅ CORS protection for API
✅ Photo limits per event
