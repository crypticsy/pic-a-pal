import { FaImage, FaCameraRotate, FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { LuCoins } from "react-icons/lu";
import { Footer } from "../components/Footer";
import { ThemeToggle } from "../components/ThemeToggle";
import { Houses } from "../components/Houses";
import { Clouds } from "../components/Clouds";
import { Stars } from "../components/Stars";
import { InstagramModal } from "../components/InstagramModal";
import { useState, useEffect } from "react";
import { FilterType, getFilterName, getCSSFilter } from "../utils/filters";
import { isInstagramBrowser } from "../utils/photostrip";
import { getPhotosRemaining, hasReachedPhotoLimit, isKeyBasedConfig } from "../utils/configManager";

// Home Page Component
type HomePageProps = {
  navigateTo: (route: string) => void;
  appState?: any;
  setAppState?: React.Dispatch<React.SetStateAction<any>>;
};

export const HomePage = ({
  navigateTo,
  appState,
  setAppState,
}: HomePageProps) => {
  const photoStripCount = appState?.photoStrips?.length || 0;
  const photoCount = appState?.photoCount || 4;
  const [isMobile, setIsMobile] = useState(false);
  const [showInstagramModal, setShowInstagramModal] = useState(false);
  const cameraFacing = appState?.cameraFacing || "user";
  const selectedFilter = (appState?.selectedFilter as FilterType) || "normal";

  // Photo limit tracking
  const photosRemaining = getPhotosRemaining();
  const isLimitReached = hasReachedPhotoLimit();
  const isKeyBased = isKeyBasedConfig();

  // Detect if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent;
      const isMobileDevice =
        /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
          userAgent.toLowerCase()
        );
      setIsMobile(isMobileDevice);
    };
    checkMobile();
  }, []);

  // Detect Instagram browser and show modal
  useEffect(() => {
    if (isInstagramBrowser()) {
      setShowInstagramModal(true);
    }
  }, []);

  const toggleCamera = () => {
    setAppState?.((prev: any) => ({
      ...prev,
      cameraFacing: prev.cameraFacing === "user" ? "environment" : "user",
    }));
  };

  const filters: FilterType[] = ['normal', 'blackAndWhite', 'trippy', 'blueTint'];
  const currentFilterIndex = filters.indexOf(selectedFilter);

  const nextFilter = () => {
    const nextIndex = (currentFilterIndex + 1) % filters.length;
    setAppState?.((prev: any) => ({
      ...prev,
      selectedFilter: filters[nextIndex],
    }));
  };

  const prevFilter = () => {
    const prevIndex = (currentFilterIndex - 1 + filters.length) % filters.length;
    setAppState?.((prev: any) => ({
      ...prev,
      selectedFilter: filters[prevIndex],
    }));
  };

  return (
    <div className="h-full w-full relative overflow-hidden touch-none" style={{ height: '100dvh' }}>
      {/* Sky Background */}
      {/* <div className="absolute inset-0 bg-red-200 dark:bg-gray-800"></div> */}

      {/* Theme Toggle */}
      {setAppState && <ThemeToggle appState={appState} setAppState={setAppState} />}

      {/* Settings Button */}
      {/* {setAppState && <Settings appState={appState} setAppState={setAppState} />} */}

      {/* Main Scene Container */}
      <div className="absolute inset-0 flex flex-col" style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)'
      }}>
        {/* Stars (only in dark mode) */}
        <Stars />

        {/* Clouds */}
        <Clouds />

        {/* Sky Area */}
        <div className="flex-1 flex items-end justify-center pb-0 relative overflow-visible min-h-0" style={{ minHeight: 0 }}>
          {/* Houses positioned above ground (farthest back) */}
          <div className="absolute bottom-0 left-0 right-0 z-0">
            <Houses />
          </div>

          {/* Photo Booth Structure */}
          <div className="mb-0 z-30 relative w-full max-w-sm px-2 sm:px-3 flex flex-col justify-end">
            {/* Top Sign */}
            <div className="doodle-border-thick p-2 sm:p-2 md:p-3 shadow-2xl sketch-shadow bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-300 border-gray-800 dark:border-gray-300">
              <h1 className="text-xs sm:text-sm md:text-xl lg:text-2xl font-black text-center leading-tight text-black dark:text-white">
                Pocket Booth
              </h1>
              <p className="text-center text-[8px] sm:text-[10px] md:text-base font-bold mt-1 sm:mt-1 text-gray-600 dark:text-gray-400 font-micro">
                Photo Strip
              </p>
            </div>

            {/* Main Booth Body */}
            <div className="doodle-border-thick p-2 sm:p-2 md:p-3 shadow-2xl gap-2 sm:gap-2 md:gap-3 flex flex-col bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-300 border-gray-800 dark:border-gray-300">
              {/* Screen Area - Filter Selection with Preview */}
              <div className="bg-gray-900 doodle-box text-white p-1.5 shadow-inner">
                <div className="aspect-[16/12] bg-black doodle-border flex items-center justify-center relative overflow-hidden p-2">
                  {/* Filter Preview and Navigation */}
                  <div className="w-full flex justify-between px-2 z-10">
                    {/* Left Arrow */}
                    <button
                      onClick={prevFilter}
                      className="bg-yellow-400 dark:bg-yellow-600 hover:bg-yellow-500 dark:hover:bg-yellow-700 text-black p-2 sm:p-2 doodle-button flex-shrink-0 cursor-pointer min-h-24"
                    >
                      <FaChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>

                    {/* Center: Filter Demo and Name */}
                    <div className="flex flex-col items-center justify-center gap-3 flex-grow mx-2">
                      {/* Filter Demo Box */}
                      <div
                        className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 doodle-border border-white"
                        style={{ filter: getCSSFilter(selectedFilter) }}
                      >
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-yellow-400 rounded-full"></div>
                        </div>
                      </div>

                      {/* Filter Name */}
                      <span className="text-yellow-400 dark:text-yellow-300 px-3 sm:px-4 py-1 sm:py-1.5 font-bold text-[8px] sm:text-[10px] md:text-xs text-center">
                        {getFilterName(selectedFilter)}
                      </span>
                    </div>

                    {/* Right Arrow */}
                    <button
                      onClick={nextFilter}
                      className="bg-yellow-400 dark:bg-yellow-600 hover:bg-yellow-500 dark:hover:bg-yellow-700 text-black p-2 sm:p-2 doodle-button flex-shrink-0 cursor-pointer min-h-24"
                    >
                      <FaChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Controls Panel */}
              <div className="doodle-box p-1.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-800 dark:border-gray-300">
                <div className="grid grid-cols-2 gap-1 sm:gap-1.5">
                  {/* Insert Coin Button - Left */}
                  <button
                    onClick={() => !isLimitReached && navigateTo("photobooth")}
                    disabled={isLimitReached}
                    className={`font-black py-2 sm:py-3 md:py-4 px-1 sm:px-1.5 doodle-button shadow-xl flex flex-col items-center justify-center gap-0.5 ${
                      isLimitReached
                        ? 'bg-gray-400 dark:bg-gray-600 text-gray-700 dark:text-gray-400 cursor-not-allowed opacity-60'
                        : 'bg-yellow-400 dark:bg-yellow-500 hover:bg-yellow-500 dark:hover:bg-yellow-600 text-black cursor-pointer'
                    }`}
                  >
                    <LuCoins className={`w-3 h-3 sm:w-5 sm:h-5 md:w-6 md:h-6 ${!isLimitReached && 'animate-pulse'}`} />
                    <span className="text-[7px] sm:text-[10px] md:text-xs leading-tight font-micro">
                      {isLimitReached ? 'LIMIT' : 'INSERT'}
                    </span>
                    <span className="text-[7px] sm:text-[10px] md:text-xs leading-tight font-micro">
                      {isLimitReached ? 'REACHED' : 'COIN'}
                    </span>
                  </button>

                  {/* Gallery Button - Right */}
                  <button
                    onClick={() => navigateTo("gallery")}
                    className="bg-white hover:bg-gray-100 text-black font-black py-2 sm:py-3 md:py-4 px-1 sm:px-1.5 doodle-button shadow-xl flex flex-col items-center justify-center gap-0.5 cursor-pointer"
                  >
                    <FaImage className="w-3 h-3 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                    <span className="text-[7px] sm:text-[10px] md:text-xs leading-tight font-micro">
                      GALLERY
                    </span>
                    <span className="text-[7px] sm:text-[10px] leading-tight font-tiny5">
                      ({photoStripCount})
                    </span>
                  </button>
                </div>
              </div>

              {/* Photos Remaining Display - Only show when key is used and limit exists */}
              {isKeyBased && photosRemaining !== undefined && (
                <div className={`doodle-border text-center p-1.5 ${
                  photosRemaining === 0
                    ? 'bg-red-200 dark:bg-red-900/30 border-red-600 dark:border-red-400'
                    : photosRemaining <= 2
                    ? 'bg-yellow-200 dark:bg-yellow-900/30 border-yellow-600 dark:border-yellow-400'
                    : 'bg-green-200 dark:bg-green-900/30 border-green-600 dark:border-green-400'
                }`}>
                  <p className={`text-[7px] sm:text-[10px] md:text-xs font-bold leading-tight mb-0.5 font-micro ${
                    photosRemaining === 0
                      ? 'text-red-800 dark:text-red-200'
                      : photosRemaining <= 2
                      ? 'text-yellow-800 dark:text-yellow-200'
                      : 'text-green-800 dark:text-green-200'
                  }`}>
                    {photosRemaining === 0 ? 'No Photos Left' : 'Photos Remaining'}
                  </p>
                  {photosRemaining > 0 && (
                    <p className={`text-sm sm:text-base md:text-lg font-black font-tiny5 ${
                      photosRemaining <= 2
                        ? 'text-yellow-900 dark:text-yellow-100'
                        : 'text-green-900 dark:text-green-100'
                    }`}>
                      {photosRemaining}
                    </p>
                  )}
                </div>
              )}

              {/* Photo Count Selector */}
              <div className="bg-slate-300 doodle-border text-black p-1.5">
                <p className="text-black text-center text-[7px] sm:text-[10px] md:text-xs font-bold leading-tight mb-1 sm:mb-1.5 font-micro">
                  Strip Length
                </p>
                <div className="grid grid-cols-4 gap-0.5 sm:gap-1">
                  {[1, 2, 3, 4].map((count) => (
                    <button
                      key={count}
                      onClick={() =>
                        setAppState?.((prev: any) => ({
                          ...prev,
                          photoCount: count,
                        }))
                      }
                      className={`py-1 sm:py-1.5 px-1 sm:px-1.5 doodle-button font-bold font-tiny5 text-[10px] sm:text-xs md:text-sm transition-all ${
                        photoCount === count
                          ? "bg-yellow-400 text-black scale-105"
                          : "bg-white text-black hover:bg-gray-100"
                      }`}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>

              {/* Camera Selection (Mobile Only) */}
              {isMobile && (
                <div className="bg-blue-100 doodle-border text-black p-1.5">
                  <p className="text-black text-center text-[7px] sm:text-[10px] md:text-xs font-bold leading-tight mb-1 sm:mb-1.5 font-micro">
                    Camera
                  </p>
                  <button
                    onClick={toggleCamera}
                    className="w-full bg-white hover:bg-gray-100 text-black font-black py-1.5 sm:py-2 px-1.5 doodle-button shadow-xl flex items-center justify-center gap-1.5"
                  >
                    <FaCameraRotate className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-[7px] sm:text-[10px] md:text-xs leading-tight font-micro">
                      {cameraFacing === "user" ? "FRONT" : "BACK"}
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Base */}
            <div className="bg-gray-200 dark:bg-gray-900 doodle-border-thick text-gray-800 dark:text-gray-300 p-1 sm:p-2 shadow-2xl border-gray-800 dark:border-gray-300">
              <div className="h-2 sm:h-3 md:h-4 bg-gray-300 dark:bg-gray-600 doodle-border border-gray-800 dark:border-gray-300"></div>
            </div>
          </div>
        </div>

        {/* Ground Area - base only */}
        <div className="h-8 sm:h-10 md:h-12 lg:h-14 bg-gray-500 dark:bg-slate-950 border-y-0 relative flex-shrink-0"></div>
      </div>

      <Footer />

      {/* Instagram Browser Modal */}
      {showInstagramModal && (
        <InstagramModal onClose={() => setShowInstagramModal(false)} />
      )}
    </div>
  );
};
