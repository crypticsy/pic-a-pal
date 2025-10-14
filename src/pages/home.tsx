import { Coins, Image } from "lucide-react";

// Home Page Component
type HomePageProps = {
  navigateTo: (route: string) => void;
  appState?: any;
};

export const HomePage = ({ navigateTo, appState }: HomePageProps) => {
  const photoStripCount = appState?.photoStrips?.length || 0;

  return (
    <div className="h-full w-full flex items-center justify-center p-2 sm:p-4 overflow-hidden bg-white">
      {/* Photo Booth Structure */}
      <div className="relative">
        {/* Top Sign */}
        <div className="bg-white doodle-border-thick text-black p-3 sm:p-4 shadow-2xl sketch-shadow -rotate-1">
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-black text-center text-black tracking-wide"
            style={{
              fontFamily: "'Permanent Marker', cursive",
            }}
          >
            PIC-A-PAL
          </h1>
          <p
            className="text-center text-gray-600 text-base sm:text-lg md:text-xl font-bold mt-2"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            ★ CLASSIC PHOTO BOOTH ★
          </p>
        </div>

        {/* Main Booth Body */}
        <div className="bg-white doodle-border-thick text-black p-3 sm:p-4 md:p-6 shadow-2xl rotate-0">
          {/* Screen Area */}
          <div className="bg-gray-900 doodle-box text-white p-2 sm:p-3 mb-3 sm:mb-4 shadow-inner">
            <div className="aspect-square bg-black doodle-border flex items-center justify-center relative overflow-hidden">
              {/* Standby Animation */}
              <div className="text-center z-10 p-2">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-3 sm:mb-4 doodle-border border-white flex items-center justify-center animate-pulse">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white doodle-border"></div>
                </div>
                <p
                  className="text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2"
                  style={{ fontFamily: "'Permanent Marker', cursive" }}
                >
                  READY!
                </p>
                <p
                  className="text-gray-300 text-sm sm:text-base md:text-lg font-semibold"
                  style={{ fontFamily: "'Caveat', cursive" }}
                >
                  Insert coin to start
                </p>
              </div>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="bg-gray-100 doodle-box text-black p-3 sm:p-4">
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {/* Insert Coin Button - Left */}
              <button
                onClick={() => navigateTo("photobooth")}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-black py-4 sm:py-6 px-2 sm:px-3 doodle-button shadow-xl flex flex-col items-center justify-center gap-1 sm:gap-2 rotate-1"
                style={{ fontFamily: "'Permanent Marker', cursive" }}
              >
                <Coins className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 animate-pulse" />
                <span className="text-base sm:text-lg md:text-xl">INSERT</span>
                <span className="text-base sm:text-lg md:text-xl">COIN</span>
              </button>

              {/* Gallery Button - Right */}
              <button
                onClick={() => navigateTo("gallery")}
                className="bg-white hover:bg-gray-100 text-black font-black py-4 sm:py-6 px-2 sm:px-3 doodle-button shadow-xl flex flex-col items-center justify-center gap-1 sm:gap-2 -rotate-1"
                style={{ fontFamily: "'Permanent Marker', cursive" }}
              >
                <Image className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
                <span className="text-base sm:text-lg md:text-xl">GALLERY</span>
                <span className="text-sm sm:text-base">
                  ({photoStripCount})
                </span>
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-3 sm:mt-4 bg-gray-100 doodle-border text-black p-2 sm:p-3">
            <p
              className="text-black text-center text-sm sm:text-base font-bold"
              style={{ fontFamily: "'Caveat', cursive" }}
            >
              ▶ INSERT COIN TO START ◀
            </p>
            <p
              className="text-gray-600 text-center text-xs sm:text-sm mt-1 font-semibold"
              style={{ fontFamily: "'Caveat', cursive" }}
            >
              Takes 4 photos • Creates instant strip
            </p>
          </div>
        </div>

        {/* Bottom Base */}
        <div className="bg-gray-200 doodle-border-thick text-black p-2 sm:p-3 shadow-2xl rotate-1">
          <div className="h-4 sm:h-6 md:h-8 bg-gray-300 doodle-border"></div>
        </div>
      </div>
    </div>
  );
};
