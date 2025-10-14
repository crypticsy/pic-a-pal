# Pic-a-Pal Photo Booth

A classic photo booth application that captures 4 photos and creates an instant strip you can download.

## Features

- **Classic Photo Booth Experience**: Retro design inspired by traditional photo booths
- **4-Photo Strip**: Automatically captures 4 photos with countdown timer
- **Square Format**: Photos are captured in square format (1:1 aspect ratio)
- **Camera Effects**: Flash animation and shutter sound for each photo
- **Photo Gallery**: View and manage all your photo strips
- **Download Strips**: Save your photo strips as a single image file
- **Responsive Design**: Works on mobile, tablet, and desktop

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

## Tech Stack

- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Web Audio API** - Camera shutter sound
- **Canvas API** - Photo capture and strip generation

## Browser Permissions

The app requires camera access to function. You'll be prompted to allow camera permissions when you first use the photo booth.

## License

MIT
