// Pixel art houses component with lit windows in dark mode
type BuildingConfig = {
  width: number;
  height: number;
  color: string;
  darkColor: string;
  roofType: 'flat' | 'peaked' | 'antenna';
  roofColor: string;
  darkRoofColor: string;
  windowCols: number;
  windowRows: number;
  windowPattern: boolean[]; // true = lit in dark mode
};

const generateBuilding = (config: BuildingConfig, index: number) => {
  const {
    width,
    height,
    color,
    darkColor,
    roofType,
    roofColor,
    darkRoofColor,
    windowCols,
    windowRows,
    windowPattern,
  } = config;

  const windowSize = Math.floor((width * 0.8) / windowCols);
  const gap = 2;

  return (
    <div key={index} className="flex flex-col items-center" style={{ minWidth: `${width}px` }}>
      {/* Roof */}
      {roofType === 'flat' && (
        <div className={`h-4 ${roofColor} ${darkRoofColor}`} style={{ width: `${width}px` }}></div>
      )}
      {roofType === 'antenna' && (
        <div className="flex flex-col items-center">
          <div className={`w-2 h-8 ${roofColor} ${darkRoofColor}`}></div>
          <div className="w-3 h-2 bg-red-500 dark:bg-red-600"></div>
          <div className={`h-4 ${roofColor} ${darkRoofColor}`} style={{ width: `${width}px` }}></div>
        </div>
      )}
      {roofType === 'peaked' && (
        <div className="flex flex-col items-center">
          <div className={`w-4 h-3 ${roofColor} ${darkRoofColor} mx-auto`}></div>
          <div className={`w-8 h-3 ${roofColor} ${darkRoofColor} mx-auto`}></div>
          <div className={`h-4 ${roofColor} ${darkRoofColor}`} style={{ width: `${width}px` }}></div>
        </div>
      )}

      {/* Building body */}
      <div className={`${color} ${darkColor} p-2 shadow-black shadow-2xl`} style={{ width: `${width}px`, height: `${height}px` }}>
        {/* Windows grid */}
        <div className="h-full flex flex-col justify-start gap-2">
          {Array.from({ length: windowRows }).map((_, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-2">
              {Array.from({ length: windowCols }).map((_, colIndex) => {
                const patternIndex = rowIndex * windowCols + colIndex;
                const isLit = windowPattern[patternIndex % windowPattern.length];
                return (
                  <div
                    key={colIndex}
                    className={`${
                      isLit
                        ? 'bg-gray-700 dark:bg-yellow-300'
                        : 'bg-gray-800 dark:bg-gray-900'
                    }`}
                    style={{ width: `${windowSize}px`, height: `${windowSize}px` }}
                  ></div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const Houses = () => {
  // Diverse building configurations - each unique in size and style
  const buildings: BuildingConfig[] = [
    // Very tall skyscrapers
    { width: 120, height: 220, color: 'bg-gray-300', darkColor: 'dark:bg-gray-800', roofType: 'antenna', roofColor: 'bg-gray-400', darkRoofColor: 'dark:bg-gray-700', windowCols: 4, windowRows: 10, windowPattern: [true, false, true, true, true, true, false, true, false, true, true, false, true, true, true, true, false, true, true, false, true, true, false, true, true, false, true, true, true, true, false, true, true, false, true, true, true, false, true, true] },
    { width: 70, height: 140, color: 'bg-slate-300', darkColor: 'dark:bg-slate-900', roofType: 'flat', roofColor: 'bg-slate-400', darkRoofColor: 'dark:bg-slate-800', windowCols: 2, windowRows: 6, windowPattern: [true, false, true, true, false, true, true, false, true, true, false, true] },
    { width: 160, height: 180, color: 'bg-gray-200', darkColor: 'dark:bg-gray-900', roofType: 'flat', roofColor: 'bg-gray-400', darkRoofColor: 'dark:bg-gray-800', windowCols: 6, windowRows: 7, windowPattern: [true, false, true, true, false, true, true, true, false, true, true, false, true, true, true, false, true, true, false, true, true, false, true, true, true, false, true, true, false, true, true, true, false, true, true, false, true, true, false, true, true, false] },
    { width: 95, height: 190, color: 'bg-stone-300', darkColor: 'dark:bg-stone-900', roofType: 'peaked', roofColor: 'bg-stone-500', darkRoofColor: 'dark:bg-stone-800', windowCols: 3, windowRows: 8, windowPattern: [true, true, false, false, true, true, true, false, true, true, true, false, true, false, true, true, false, true, true, true, false, true, false, true] },
    { width: 130, height: 160, color: 'bg-neutral-300', darkColor: 'dark:bg-neutral-900', roofType: 'antenna', roofColor: 'bg-neutral-400', darkRoofColor: 'dark:bg-neutral-800', windowCols: 5, windowRows: 6, windowPattern: [true, false, true, false, true, true, true, false, true, true, false, true, true, false, true, true, false, true, false, true, false, true, true, false, true, true, false, true, true, false] },

    // Medium height variety
    { width: 85, height: 170, color: 'bg-zinc-300', darkColor: 'dark:bg-zinc-900', roofType: 'peaked', roofColor: 'bg-zinc-500', darkRoofColor: 'dark:bg-zinc-800', windowCols: 3, windowRows: 7, windowPattern: [true, false, true, true, true, false, false, true, true, true, true, false, true, false, true, true, true, false, false, true, true] },
    { width: 145, height: 150, color: 'bg-gray-300', darkColor: 'dark:bg-gray-800', roofType: 'flat', roofColor: 'bg-gray-500', darkRoofColor: 'dark:bg-gray-700', windowCols: 5, windowRows: 6, windowPattern: [true, true, false, true, true, false, true, true, false, true, true, false, true, true, false, true, true, false, true, true, false, true, true, false, true, true, false, true, true, false] },
    { width: 100, height: 200, color: 'bg-slate-200', darkColor: 'dark:bg-slate-900', roofType: 'antenna', roofColor: 'bg-slate-400', darkRoofColor: 'dark:bg-slate-800', windowCols: 4, windowRows: 9, windowPattern: [true, false, true, true, true, true, false, false, true, true, true, true, false, true, false, true, true, false, true, true, false, true, true, true, false, true, false, true, true, false, true, true, false, true, true, false] },
    { width: 65, height: 130, color: 'bg-stone-200', darkColor: 'dark:bg-stone-900', roofType: 'flat', roofColor: 'bg-stone-400', darkRoofColor: 'dark:bg-stone-800', windowCols: 2, windowRows: 5, windowPattern: [true, false, true, true, false, true, true, false, true, true] },
    { width: 110, height: 185, color: 'bg-neutral-200', darkColor: 'dark:bg-neutral-900', roofType: 'peaked', roofColor: 'bg-neutral-500', darkRoofColor: 'dark:bg-neutral-800', windowCols: 4, windowRows: 8, windowPattern: [true, true, false, false, true, true, true, false, true, true, true, false, true, false, true, true, false, true, true, true, false, true, false, true, true, false, true, true, false, true, true, true] },

    // Shorter buildings
    { width: 125, height: 145, color: 'bg-zinc-200', darkColor: 'dark:bg-zinc-900', roofType: 'flat', roofColor: 'bg-zinc-400', darkRoofColor: 'dark:bg-zinc-800', windowCols: 4, windowRows: 5, windowPattern: [true, false, true, true, false, true, true, false, true, true, false, true, true, false, true, true, false, true, true, false] },
    { width: 90, height: 155, color: 'bg-gray-300', darkColor: 'dark:bg-gray-800', roofType: 'antenna', roofColor: 'bg-gray-400', darkRoofColor: 'dark:bg-gray-700', windowCols: 3, windowRows: 6, windowPattern: [true, true, false, true, false, true, false, true, true, true, false, true, false, true, true, true, true, false] },
    { width: 150, height: 165, color: 'bg-slate-300', darkColor: 'dark:bg-slate-900', roofType: 'peaked', roofColor: 'bg-slate-500', darkRoofColor: 'dark:bg-slate-800', windowCols: 6, windowRows: 6, windowPattern: [true, false, true, false, true, true, true, true, false, true, true, false, false, true, true, false, true, true, true, false, true, false, true, false, true, true, false, true, true, false, true, false, true, false, true, true] },
    { width: 75, height: 175, color: 'bg-stone-300', darkColor: 'dark:bg-stone-900', roofType: 'flat', roofColor: 'bg-stone-500', darkRoofColor: 'dark:bg-stone-800', windowCols: 2, windowRows: 7, windowPattern: [true, false, true, true, false, true, true, false, true, true, false, true, true, false] },
    { width: 135, height: 195, color: 'bg-neutral-300', darkColor: 'dark:bg-neutral-900', roofType: 'antenna', roofColor: 'bg-neutral-400', darkRoofColor: 'dark:bg-neutral-800', windowCols: 5, windowRows: 8, windowPattern: [true, false, true, true, false, true, true, false, true, true, false, true, true, false, true, true, false, true, false, true, false, true, true, false, true, true, false, true, true, false, true, false, true, false, true, true, false, true, true, false] },

    // More variety
    { width: 80, height: 160, color: 'bg-zinc-300', darkColor: 'dark:bg-zinc-900', roofType: 'peaked', roofColor: 'bg-zinc-500', darkRoofColor: 'dark:bg-zinc-800', windowCols: 3, windowRows: 6, windowPattern: [true, false, true, true, true, false, false, true, true, true, true, false, true, false, true, true, true, false] },
    { width: 115, height: 140, color: 'bg-gray-200', darkColor: 'dark:bg-gray-900', roofType: 'flat', roofColor: 'bg-gray-400', darkRoofColor: 'dark:bg-gray-800', windowCols: 4, windowRows: 5, windowPattern: [true, true, false, true, false, true, true, false, true, true, false, true, true, false, true, true, false, true, true, false] },
    { width: 140, height: 210, color: 'bg-slate-200', darkColor: 'dark:bg-slate-900', roofType: 'antenna', roofColor: 'bg-slate-400', darkRoofColor: 'dark:bg-slate-800', windowCols: 5, windowRows: 9, windowPattern: [true, false, true, true, false, true, true, false, true, true, false, true, true, false, true, true, false, true, false, true, false, true, true, false, true, true, false, true, true, false, true, false, true, false, true, true, false, true, true, false, true, false, true, true, false] },
    { width: 70, height: 150, color: 'bg-stone-200', darkColor: 'dark:bg-stone-900', roofType: 'peaked', roofColor: 'bg-stone-400', darkRoofColor: 'dark:bg-stone-800', windowCols: 2, windowRows: 6, windowPattern: [true, false, true, true, false, true, true, false, true, true, false, true] },
    { width: 105, height: 170, color: 'bg-neutral-200', darkColor: 'dark:bg-neutral-900', roofType: 'flat', roofColor: 'bg-neutral-500', darkRoofColor: 'dark:bg-neutral-800', windowCols: 3, windowRows: 7, windowPattern: [true, true, false, false, true, true, true, false, true, true, true, false, true, false, true, true, false, true, true, true, false] },

    // Additional buildings
    { width: 95, height: 180, color: 'bg-zinc-200', darkColor: 'dark:bg-zinc-900', roofType: 'antenna', roofColor: 'bg-zinc-400', darkRoofColor: 'dark:bg-zinc-800', windowCols: 3, windowRows: 7, windowPattern: [true, false, true, true, true, false, false, true, true, true, true, false, true, false, true, true, true, false, false, true, true] },
    { width: 155, height: 155, color: 'bg-gray-300', darkColor: 'dark:bg-gray-800', roofType: 'flat', roofColor: 'bg-gray-500', darkRoofColor: 'dark:bg-gray-700', windowCols: 6, windowRows: 6, windowPattern: [true, true, false, true, true, false, false, true, true, false, true, true, true, false, true, true, false, true, true, false, true, false, true, true, false, true, true, false, true, true, true, true, false, true, true, false] },
    { width: 85, height: 165, color: 'bg-slate-300', darkColor: 'dark:bg-slate-900', roofType: 'peaked', roofColor: 'bg-slate-400', darkRoofColor: 'dark:bg-slate-800', windowCols: 3, windowRows: 6, windowPattern: [true, false, true, true, true, false, false, true, true, true, true, false, true, false, true, true, true, false] },
    { width: 120, height: 190, color: 'bg-stone-300', darkColor: 'dark:bg-stone-900', roofType: 'antenna', roofColor: 'bg-stone-500', darkRoofColor: 'dark:bg-stone-800', windowCols: 4, windowRows: 8, windowPattern: [true, false, true, true, true, true, false, false, true, true, true, true, false, true, false, true, true, false, true, true, false, true, true, true, false, true, false, true, true, false, true, true] },
    { width: 75, height: 135, color: 'bg-neutral-300', darkColor: 'dark:bg-neutral-900', roofType: 'flat', roofColor: 'bg-neutral-400', darkRoofColor: 'dark:bg-neutral-800', windowCols: 2, windowRows: 5, windowPattern: [true, false, true, true, false, true, true, false, true, true] },

    // Final set
    { width: 130, height: 175, color: 'bg-zinc-300', darkColor: 'dark:bg-zinc-900', roofType: 'peaked', roofColor: 'bg-zinc-500', darkRoofColor: 'dark:bg-zinc-800', windowCols: 5, windowRows: 7, windowPattern: [true, false, true, false, true, true, true, false, true, true, false, true, true, false, true, true, false, true, false, true, false, true, true, false, true, true, false, true, true, false, true, false, true, false, true] },
    { width: 90, height: 145, color: 'bg-gray-200', darkColor: 'dark:bg-gray-900', roofType: 'flat', roofColor: 'bg-gray-400', darkRoofColor: 'dark:bg-gray-800', windowCols: 3, windowRows: 5, windowPattern: [true, true, false, true, false, true, false, true, true, true, false, true, false, true, true] },
    { width: 110, height: 205, color: 'bg-slate-200', darkColor: 'dark:bg-slate-900', roofType: 'antenna', roofColor: 'bg-slate-500', darkRoofColor: 'dark:bg-slate-800', windowCols: 4, windowRows: 9, windowPattern: [true, false, true, true, true, true, false, true, false, true, true, false, true, true, true, true, false, true, true, false, true, true, false, true, true, false, true, true, true, true, false, true, true, false, true, true] },
    { width: 165, height: 160, color: 'bg-stone-200', darkColor: 'dark:bg-stone-900', roofType: 'flat', roofColor: 'bg-stone-500', darkRoofColor: 'dark:bg-stone-800', windowCols: 6, windowRows: 6, windowPattern: [true, false, true, true, false, true, true, true, false, true, true, false, true, true, true, false, true, true, false, true, true, false, true, true, true, false, true, true, false, true, true, true, false, true, true, false] },
    { width: 100, height: 150, color: 'bg-neutral-200', darkColor: 'dark:bg-neutral-900', roofType: 'peaked', roofColor: 'bg-neutral-400', darkRoofColor: 'dark:bg-neutral-800', windowCols: 3, windowRows: 6, windowPattern: [true, true, false, false, true, true, true, false, true, true, true, false, true, false, true, true, false, true] },
    { width: 125, height: 185, color: 'bg-zinc-200', darkColor: 'dark:bg-zinc-900', roofType: 'antenna', roofColor: 'bg-zinc-400', darkRoofColor: 'dark:bg-zinc-800', windowCols: 4, windowRows: 7, windowPattern: [true, false, true, true, true, true, false, false, true, true, true, true, false, true, false, true, true, false, true, true, false, true, true, true, false, true, false, true] },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 flex items-end pointer-events-none z-10" style={{ gap: '0px', filter: 'blur(1px)' }}>
      {buildings.map((building, index) => generateBuilding(building, index))}
    </div>
  );
};
