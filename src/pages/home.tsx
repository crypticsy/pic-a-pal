import { Coins, Image } from "lucide-react";

// Home Page Component
type HomePageProps = {
  navigateTo: (route: string) => void;
  appState?: any;
};

export const HomePage = ({ navigateTo, appState }: HomePageProps) => {
  const photoStripCount = appState?.photoStrips?.length || 0;

  return (
    <div className="h-full w-full flex items-center justify-center p-2 sm:p-4 overflow-hidden">
      {/* Photo Booth Structure */}
      <div className="relative">
        {/* Top Sign */}
        <div className="bg-gradient-to-b from-red-600 to-red-700 border-4 sm:border-6 border-black rounded-t-2xl sm:rounded-t-3xl p-3 sm:p-4 shadow-2xl">
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-black text-center text-white tracking-wider"
            style={{
              fontFamily: "monospace",
              textShadow: "2px 2px 0px rgba(0,0,0,0.3)",
            }}
          >
            PIC-A-PAL
          </h1>
          <p
            className="text-center text-yellow-300 text-xs sm:text-sm md:text-base font-bold mt-1"
            style={{ fontFamily: "monospace" }}
          >
            ★ CLASSIC PHOTO BOOTH ★
          </p>
        </div>

        {/* Main Booth Body */}
        <div className="bg-gradient-to-b from-gray-800 to-gray-900 border-x-4 sm:border-x-6 border-black p-3 sm:p-4 md:p-6 shadow-2xl">
          {/* Screen Area */}
          <div className="bg-black rounded-lg sm:rounded-xl p-2 sm:p-3 mb-3 sm:mb-4 border-2 sm:border-4 border-gray-600 shadow-inner">
            <div className="aspect-square bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
              {/* Standby Animation */}
              <div className="text-center z-10 p-2">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-3 sm:mb-4 border-4 sm:border-6 border-white rounded-full flex items-center justify-center animate-pulse">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white rounded-full"></div>
                </div>
                <p
                  className="text-white text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2"
                  style={{ fontFamily: "monospace" }}
                >
                  READY
                </p>
                <p
                  className="text-gray-400 text-xs sm:text-sm md:text-base"
                  style={{ fontFamily: "monospace" }}
                >
                  Insert coin to start
                </p>
              </div>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="bg-gray-700 rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 sm:border-4 border-gray-600">
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {/* Insert Coin Button - Left */}
              <button
                onClick={() => navigateTo("photobooth")}
                className="bg-gradient-to-b from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-black py-4 sm:py-6 px-2 sm:px-3 rounded-lg sm:rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-xl border-2 sm:border-4 border-yellow-700 flex flex-col items-center justify-center gap-1 sm:gap-2"
                style={{ fontFamily: "monospace" }}
              >
                <Coins className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 animate-pulse" />
                <span className="text-base sm:text-lg md:text-xl">INSERT</span>
                <span className="text-base sm:text-lg md:text-xl">COIN</span>
              </button>

              {/* Gallery Button - Right */}
              <button
                onClick={() => navigateTo("gallery")}
                className="bg-gradient-to-b from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-black py-4 sm:py-6 px-2 sm:px-3 rounded-lg sm:rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-xl border-2 sm:border-4 border-blue-800 flex flex-col items-center justify-center gap-1 sm:gap-2"
                style={{ fontFamily: "monospace" }}
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
          <div className="mt-3 sm:mt-4 bg-black/50 rounded-lg p-2 sm:p-3 border border-gray-600">
            <p
              className="text-yellow-400 text-center text-xs sm:text-sm font-bold"
              style={{ fontFamily: "monospace" }}
            >
              ▶ INSERT COIN TO START ◀
            </p>
            <p
              className="text-gray-400 text-center text-[10px] sm:text-xs mt-1"
              style={{ fontFamily: "monospace" }}
            >
              Takes 4 photos • Creates instant strip
            </p>
          </div>
        </div>

        {/* Bottom Base */}
        <div className="bg-gradient-to-b from-gray-900 to-black border-4 sm:border-6 border-black rounded-b-2xl sm:rounded-b-3xl p-2 sm:p-3 shadow-2xl">
          <div className="h-4 sm:h-6 md:h-8 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  );
};
