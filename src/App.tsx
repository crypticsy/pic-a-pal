import { StrictMode, useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { GalleryPage, HomePage, PhotoBoothPage } from './pages';

// Main App Component with Routing
const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [appState, setAppState] = useState({
    myStream: null,
    photoStrips: []
  });

  const refs = {
    videoRef: useRef<HTMLVideoElement>(null),
    canvasRef: useRef<HTMLCanvasElement>(null)
  };

  const navigateTo = (page: string) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage navigateTo={navigateTo} appState={appState} />;
      case 'photobooth':
        return <PhotoBoothPage navigateTo={navigateTo} appState={appState} setAppState={setAppState} refs={refs} />;
      case 'gallery':
        return <GalleryPage navigateTo={navigateTo} appState={appState} setAppState={setAppState} refs={refs} />;
      default:
        return <HomePage navigateTo={navigateTo} appState={appState} />;
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-b from-gray-100 to-gray-200">
      {renderPage()}

      {/* Hidden canvas for photo capture */}
      <canvas ref={refs.canvasRef} className="hidden" />
    </div>
  );
};

// Render the app
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);