# Pocket Booth 📸

Your pocket-sized photo booth application that captures instant photo strips with automatic cloud storage backup.

## ✨ Features

- 📷 **Photo Strip Capture** - Take 1-4 photos with countdown timer
- 🎨 **Multiple Filters** - Black & White, Trippy, Blue Tint, and more
- 🌙 **Dark Mode** - Beautiful dark theme support
- 📱 **Mobile Optimized** - Works great on phones and tablets
- ☁️ **Cloud Backup** - Automatic upload to Google Drive
- 🔒 **Photo Limits** - Configurable limits per event/key
- 🎯 **Instagram Detection** - Warns users to open in regular browser
- 💾 **Offline Gallery** - View all photos in local storage

---

## 🚀 Quick Start

Choose your deployment method:

### Option 1: GitHub Pages + Vercel (Recommended)
**Free hosting with Google Drive storage**

📖 **[Follow the Complete Deployment Guide →](./DEPLOYMENT_GUIDE.md)**

- ✅ Free hosting on GitHub Pages
- ✅ Serverless API on Vercel
- ✅ Free Google Drive storage (15GB)

### Option 2: Local Development Only
Just testing or developing locally

```bash
npm install
npm run dev
```

---

## 🎮 How to Use

### Basic Usage

1. **Start the Booth**
   - Click **"INSERT COIN"** button
   - Allow camera permissions when prompted

2. **Capture Photos**
   - Countdown begins (3 seconds)
   - Multiple photos captured automatically
   - 2.5 seconds between each shot

3. **Download & Share**
   - View your photo strip
   - Download as JPEG
   - Photos auto-upload to cloud (if configured)

4. **Gallery**
   - Access all saved photo strips
   - Download or delete strips

### Advanced Features

- **Filters**: Choose from 4 different photo filters
- **Strip Length**: Select 1-4 photos per strip
- **Camera Flip**: Switch between front/back camera (mobile)
- **Dark Mode**: Toggle light/dark theme

---

## 🔧 Configuration

### Environment Variables

Create `.env.production` for production deployment:

```bash
# API endpoint (your Vercel serverless function)
VITE_API_BASE_URL=https://your-api.vercel.app/api

# Event configuration
# Format: enabled,folderId,photoLimit
VITE_CONFIG_USER=true,1a2b3c4d5e6f7g8h9i0j,5
```

### Multiple Events

Configure different settings for different events:

```bash
VITE_CONFIG_WEDDING=true,folder-id-wedding,10
VITE_CONFIG_BIRTHDAY=true,folder-id-birthday,20
VITE_CONFIG_CORPORATE=true,folder-id-corporate,50
```

Access with: `https://yoursite.com/?key=wedding`

---

## 🏗️ Architecture

```
┌─────────────────┐
│  GitHub Pages   │  Static website hosting (free)
│   (Frontend)    │
└────────┬────────┘
         │
         │ POST /api/upload-photo
         ▼
┌─────────────────┐
│     Vercel      │  Serverless functions
│      (API)      │  - Upload to Google Drive
└────────┬────────┘  - Service account auth
         │
         │ Google Drive API
         ▼
┌─────────────────┐
│  Google Drive   │  Photo storage
│     Folder      │  - 15GB free
└─────────────────┘  - Organized by event
```

---

## 🛠️ Development

### Prerequisites

- Node.js 18+
- npm or yarn
- Modern browser with camera support

### Local Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/pocket-booth.git
cd pocket-booth

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173`

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Deploy

```bash
# Deploy to GitHub Pages
npm run deploy
```