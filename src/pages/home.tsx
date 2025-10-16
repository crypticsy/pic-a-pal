import { FaImage, FaCameraRotate } from "react-icons/fa6";
import { LuCoins } from "react-icons/lu";
import { Footer } from "../components/Footer";
import { Settings } from "../components/Settings";
import { Houses } from "../components/Houses";
import { Clouds } from "../components/Clouds";
import { Stars } from "../components/Stars";
import { useState, useEffect } from "react";

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
  const cameraFacing = appState?.cameraFacing || "user";

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

  const toggleCamera = () => {
    setAppState?.((prev: any) => ({
      ...prev,
      cameraFacing: prev.cameraFacing === "user" ? "environment" : "user",
    }));
  };

  return (
    <div className="h-full w-full relative overflow-hidden">
      {/* Sky Background */}
      {/* <div className="absolute inset-0 bg-red-200 dark:bg-gray-800"></div> */}

      {/* Settings Button */}
      {setAppState && <Settings appState={appState} setAppState={setAppState} />}

      {/* Main Scene Container */}
      <div className="absolute inset-0 flex flex-col">
        {/* Stars (only in dark mode) */}
        <Stars />

        {/* Clouds */}
        <Clouds />

        {/* Sky Area */}
        <div className="flex-1 flex items-end justify-center pb-0 relative overflow-visible">
          {/* Houses positioned above ground (farthest back) */}
          <div className="absolute bottom-0 left-0 right-0 z-0">
            <Houses />
          </div>

          {/* Photo Booth Structure */}
          <div className="mb-0 z-30 relative">
            {/* Top Sign */}
            <div className="doodle-border-thick p-2 sm:p-3 md:p-4 shadow-2xl sketch-shadow mx-6 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-300 border-gray-800 dark:border-gray-300">
              <h1 className="text-sm sm:text-base md:text-xl lg:text-2xl font-black text-center leading-tight text-black dark:text-white">
                PIC-A-PAL
              </h1>
              <p className="text-center text-[8px] sm:text-xs md:text-sm font-bold mt-1 sm:mt-2 text-gray-600 dark:text-gray-400">
                PHOTO BOOTH
              </p>
            </div>

            {/* Main Booth Body */}
            <div className="doodle-border-thick p-2 sm:p-3 md:p-4 shadow-2xl gap-4 flex flex-col bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-300 border-gray-800 dark:border-gray-300">
              {/* Screen Area */}
              <div className="bg-gray-900 doodle-box text-white p-2 shadow-inner">
                <div className="aspect-square bg-black doodle-border flex items-center justify-center relative overflow-hidden">
                  {/* Standby Animation */}
                  <div className="text-center z-10 p-2">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 mx-auto mb-2 sm:mb-3 doodle-border border-white flex items-center justify-center animate-pulse">
                      <div className="w-5 h-5 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-white doodle-border"></div>
                    </div>
                    <p className="text-white text-xs sm:text-sm md:text-base font-bold mb-1 leading-tight">
                      READY!
                    </p>
                    <p className="text-gray-300 text-[8px] sm:text-xs md:text-sm font-semibold leading-tight">
                      INSERT COIN
                    </p>
                  </div>
                </div>
              </div>

              {/* Controls Panel */}
              <div className="doodle-box p-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-800 dark:border-gray-300">
                <div className="grid grid-cols-2 gap-1 sm:gap-2">
                  {/* Insert Coin Button - Left */}
                  <button
                    onClick={() => navigateTo("photobooth")}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-black py-3 sm:py-4 md:py-6 px-1 sm:px-2 doodle-button shadow-xl flex flex-col items-center justify-center gap-1 cursor-pointer"
                  >
                    <LuCoins className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 animate-pulse" />
                    <span className="text-[8px] sm:text-xs md:text-sm leading-tight">
                      INSERT
                    </span>
                    <span className="text-[8px] sm:text-xs md:text-sm leading-tight">
                      COIN
                    </span>
                  </button>

                  {/* Gallery Button - Right */}
                  <button
                    onClick={() => navigateTo("gallery")}
                    className="bg-white hover:bg-gray-100 text-black font-black py-3 sm:py-4 md:py-6 px-1 sm:px-2 doodle-button shadow-xl flex flex-col items-center justify-center gap-1 cursor-pointer"
                  >
                    <FaImage className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8" />
                    <span className="text-[8px] sm:text-xs md:text-sm leading-tight">
                      GALLERY
                    </span>
                    <span className="text-[8px] sm:text-xs leading-tight">
                      ({photoStripCount})
                    </span>
                  </button>
                </div>
              </div>

              {/* Photo Count Selector */}
              <div className="bg-slate-300 doodle-border text-black p-2">
                <p className="text-black text-center text-[8px] sm:text-xs md:text-sm font-bold leading-tight mb-1 sm:mb-2">
                  Strip Length
                </p>
                <div className="grid grid-cols-4 gap-1">
                  {[1, 2, 3, 4].map((count) => (
                    <button
                      key={count}
                      onClick={() =>
                        setAppState?.((prev: any) => ({
                          ...prev,
                          photoCount: count,
                        }))
                      }
                      className={`py-1 sm:py-2 px-1 sm:px-2 doodle-button font-bold text-xs sm:text-sm md:text-base transition-all ${
                        photoCount === count
                          ? "bg-black text-white scale-105"
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
                <div className="bg-blue-100 doodle-border text-black p-2">
                  <p className="text-black text-center text-[8px] sm:text-xs md:text-sm font-bold leading-tight mb-1 sm:mb-2">
                    Camera
                  </p>
                  <button
                    onClick={toggleCamera}
                    className="w-full bg-white hover:bg-gray-100 text-black font-black py-2 sm:py-3 px-2 doodle-button shadow-xl flex items-center justify-center gap-2"
                  >
                    <FaCameraRotate className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-[8px] sm:text-xs md:text-sm leading-tight">
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
        <div className="h-10 sm:h-12 md:h-14 bg-gray-500 dark:bg-slate-950 border-y-0 relative"></div>
      </div>

      <Footer />
    </div>
  );
};
