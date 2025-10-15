import { StrictMode, useState, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { GalleryPage, HomePage, PhotoBoothPage } from './pages';

// Main App Component with Routing
const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [appState, setAppState] = useState({
    myStream: null,
    photoStrips: []
  });

  const refs = {
    videoRef: useRef<HTMLVideoElement>(null),
    canvasRef: useRef<HTMLCanvasElement>(null)
  };

  // Handle initial load fade-in
  useEffect(() => {
    setTimeout(() => setIsInitialLoad(false), 100);
  }, []);

  const navigateTo = (page: string) => {
    if (page === currentPage) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPage(page);
      setIsTransitioning(false);
    }, 300);
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
    <div className={`h-screen w-screen overflow-hidden bg-white ${isInitialLoad ? 'opacity-0' : 'fade-in'}`}>
      <div className={isTransitioning ? 'fade-out ' : 'fade-in ' + ' h-full w-full'}>
        {renderPage()}
      </div>

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