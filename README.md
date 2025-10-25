# Pocket Booth 📸

Your pocket-sized photo booth application that captures instant photo strips with local storage.

## ✨ Features

- 📷 **Photo Strip Capture** - Take 1-4 photos with countdown timer
- 🎨 **Multiple Filters** - Black & White, Trippy, Blue Tint, and more
- 🌙 **Dark Mode** - Beautiful dark theme support
- 📱 **Mobile Optimized** - Works great on phones and tablets
- 🔒 **Photo Limits** - Configurable limits per event/key
- 🎯 **Instagram Detection** - Warns users to open in regular browser
- 💾 **Offline Gallery** - View all photos in local storage
- ⬇️ **Download Photos** - Save photo strips as JPEG files
- ☁️ **Google Drive Upload** - Optional cloud storage with OAuth (requires Vercel backend)

---

## 🚀 Quick Start

### Option 1: Basic Deployment (GitHub Pages Only)
**Free hosting with local browser storage only**

```bash
# Install dependencies
yarn install

# Build and deploy to GitHub Pages
yarn deploy
```

This deploys only the frontend. Photos are stored in browser's localStorage.

### Option 2: Full Deployment (GitHub Pages + Vercel)
**With Google Drive cloud upload support**

1. **Deploy Frontend to GitHub Pages:**
   ```bash
   yarn deploy
   ```

2. **Deploy Backend to Vercel:**
   - Create project in Vercel dashboard
   - Download OAuth JSON from Google Cloud Console
   - Set `GOOGLE_OAUTH_CREDENTIALS` environment variable
   - **Note**: Vercel deployment is manual via their web dashboard

3. **Connect Frontend to Backend:**
   - Create `.env.production` locally (gitignored, won't be committed)
   - Add: `VITE_VERCEL_API_URL=https://your-vercel-url.vercel.app`
   - Redeploy frontend: `yarn deploy`

📖 **Full guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)

### Local Development

```bash
yarn install
yarn dev
```

Visit `http://localhost:5173`

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
   - Photos saved in browser's local storage

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

Create `.env` file for development or production:

```bash
# Key-Based Photo Limit Configuration
# Format: VITE_CONFIG_[KEY_NAME]=[photoLimit]

# Example configurations:
VITE_CONFIG_MYEVENT=10
VITE_CONFIG_WEDDING=5
VITE_CONFIG_BIRTHDAY=20
VITE_CONFIG_DEMO=3
VITE_CONFIG_UNLIMITED=
```

### Multiple Events/Keys

Configure different photo limits for different events:

```bash
VITE_CONFIG_WEDDING=10
VITE_CONFIG_BIRTHDAY=20
VITE_CONFIG_CORPORATE=50
```

Access with: `https://yoursite.com/pocket-booth/?key=wedding`

**How it works:**
- User opens the app with a key parameter in the URL
- The app loads the photo limit from environment variables
- Photos taken are tracked per key in localStorage
- When limit is reached, the "INSERT COIN" button is disabled

---

## 🏗️ Architecture

### Basic Setup (GitHub Pages Only)
```
┌─────────────────┐
│  GitHub Pages   │  Static website hosting (free)
│   (Frontend)    │  - React + Vite
└────────┬────────┘  - Camera API
         │
         │ localStorage
         ▼
┌─────────────────┐
│  Browser        │  Local storage
│  localStorage   │  - Photo strips (base64)
└─────────────────┘  - Gallery data
                     - Photo count per key
```

### Full Setup (with Google Drive Upload)
```
┌─────────────────┐
│  GitHub Pages   │  Frontend (React + Vite)
│   (Frontend)    │  - Camera API
└────────┬────────┘  - Photo capture
         │
         │ API Calls
         ▼
┌─────────────────┐
│     Vercel      │  Backend (Python Flask)
│   (Backend)     │  - OAuth 2.0 flow
└────────┬────────┘  - Photo upload API
         │
         │ Google Drive API
         ▼
┌─────────────────┐
│  Google Drive   │  Cloud storage
│                 │  - Photo backup
└─────────────────┘  - 24hr OAuth sessions
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
# Deploy to GitHub Pages (frontend only)
yarn deploy
```

**Important**: `yarn deploy` only deploys the React frontend to GitHub Pages. For Vercel backend deployment, see [DEPLOYMENT.md](./DEPLOYMENT.md).

---

## 📝 Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **MediaDevices API** - Camera access
- **Canvas API** - Image processing

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

---

## 🙏 Acknowledgments

- Inspired by classic photo booth machines
- Built with modern web technologies
- Designed for simplicity and ease of use
