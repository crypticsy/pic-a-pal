import { Coins, Image } from "lucide-react";

// Home Page Component
type HomePageProps = {
  navigateTo: (route: string) => void;
  appState?: any;
};

export const HomePage = ({ navigateTo, appState }: HomePageProps) => {
  const photoStripCount = appState?.photoStrips?.length || 0;

  return (
    <div className="h-full w-full relative overflow-hidden">
      {/* Sky Background - Minimal gray */}
      <div className="absolute inset-0 bg-gray-200"></div>

      {/* Pixel Clouds - White only */}
      <div className="absolute top-4 left-4 sm:left-8 w-12 h-8 sm:w-16 sm:h-10 bg-white doodle-border border-black opacity-90 animate-float"></div>
      <div className="absolute top-8 right-12 sm:right-20 w-16 h-10 sm:w-20 sm:h-12 bg-white doodle-border border-black opacity-90 animate-float-delayed"></div>
      <div className="absolute top-16 left-1/4 w-14 h-9 sm:w-18 sm:h-11 bg-white doodle-border border-black opacity-90 animate-float-slow"></div>
      <div className="absolute top-20 right-1/3 w-10 h-6 sm:w-14 sm:h-8 bg-white doodle-border border-black opacity-90 animate-float"></div>

      {/* Main Scene Container */}
      <div className="absolute inset-0 flex flex-col">
        {/* Sky Area (upper 60%) */}
        <div className="flex-grow flex items-end justify-center pb-0 relative">
          {/* Flying Bird */}
          <div className="absolute top-1/4 left-1/3 w-4 h-3 sm:w-6 sm:h-4 animate-fly">
            <div className="w-2 h-1 sm:w-3 sm:h-1 bg-gray-800 doodle-border inline-block"></div>
            <div className="w-2 h-1 sm:w-3 sm:h-1 bg-gray-800 doodle-border inline-block ml-1"></div>
          </div>

          {/* Photo Booth Structure */}
          <div className="mb-0 z-10 relative">
        {/* Top Sign */}
        <div className="bg-white doodle-border-thick text-black p-2 sm:p-3 md:p-4 shadow-2xl sketch-shadow mx-6">
          <h1
            className="text-sm sm:text-base md:text-xl lg:text-2xl font-black text-center text-black leading-tight"
          >
            PIC-A-PAL
          </h1>
          <p
            className="text-center text-gray-600 text-[8px] sm:text-xs md:text-sm font-bold mt-1 sm:mt-2"
          >
            PHOTO BOOTH
          </p>
        </div>

        {/* Main Booth Body */}
        <div className="bg-white doodle-border-thick text-black p-2 sm:p-3 md:p-4 shadow-2xl">
          {/* Screen Area */}
          <div className="bg-gray-900 doodle-box text-white p-2 mb-2 sm:mb-3 shadow-inner">
            <div className="aspect-square bg-black doodle-border flex items-center justify-center relative overflow-hidden">
              {/* Standby Animation */}
              <div className="text-center z-10 p-2">
                <div className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 mx-auto mb-2 sm:mb-3 doodle-border border-white flex items-center justify-center animate-pulse">
                  <div className="w-5 h-5 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-white doodle-border"></div>
                </div>
                <p
                  className="text-white text-xs sm:text-sm md:text-base font-bold mb-1 leading-tight"
                >
                  READY!
                </p>
                <p
                  className="text-gray-300 text-[8px] sm:text-xs md:text-sm font-semibold leading-tight"
                >
                  INSERT COIN
                </p>
              </div>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="bg-gray-100 doodle-box text-black p-2">
            <div className="grid grid-cols-2 gap-1 sm:gap-2">
              {/* Insert Coin Button - Left */}
              <button
                onClick={() => navigateTo("photobooth")}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-black py-3 sm:py-4 md:py-6 px-1 sm:px-2 doodle-button shadow-xl flex flex-col items-center justify-center gap-1 cursor-pointer"
              >
                <Coins className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 animate-pulse" />
                <span className="text-[8px] sm:text-xs md:text-sm leading-tight">INSERT</span>
                <span className="text-[8px] sm:text-xs md:text-sm leading-tight">COIN</span>
              </button>

              {/* Gallery Button - Right */}
              <button
                onClick={() => navigateTo("gallery")}
                className="bg-white hover:bg-gray-100 text-black font-black py-3 sm:py-4 md:py-6 px-1 sm:px-2 doodle-button shadow-xl flex flex-col items-center justify-center gap-1 cursor-pointer"
              >
                <Image className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8" />
                <span className="text-[8px] sm:text-xs md:text-sm leading-tight">GALLERY</span>
                <span className="text-[8px] sm:text-xs leading-tight">
                  ({photoStripCount})
                </span>
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-2 bg-gray-100 doodle-border text-black p-2">
            <p
              className="text-black/50 text-center text-[8px] sm:text-xs md:text-sm font-bold leading-tight"
            >
              INSERT COIN
            </p>
            <p
              className="text-gray-600/50 text-center text-[7px] sm:text-[8px] md:text-xs mt-1 font-semibold leading-tight"
            >
              4 PHOTOS
            </p>
          </div>
        </div>

        {/* Bottom Base */}
        <div className="bg-gray-200 doodle-border-thick text-black p-1 sm:p-2 shadow-2xl">
          <div className="h-2 sm:h-3 md:h-4 bg-gray-300 doodle-border"></div>
        </div>
          </div>
        </div>

        {/* Ground Area (lower 40%) - Minimal black/white */}
        <div className="h-10 sm:h-26 md:h-14 bg-gray-400 doodle-border-thick border-black border-t-4 border-b-0 border-y-0 relative overflow-hidden" />
      </div>
    </div>
  );
};
