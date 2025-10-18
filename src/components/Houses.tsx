import { useState, useEffect, useMemo } from 'react';

// Building config with window pattern included
type BuildingConfig = {
  width: number;
  height: number;
  color: string;
  darkColor: string;
  roofType: 'flat' | 'peaked' | 'antenna';
  roofColor: string;
  darkRoofColor: string;
  windowPattern: boolean[]; // Store pattern in config
};

// Generate random window pattern based on total windows
const generateWindowPattern = (totalWindows: number): boolean[] => {
  return Array.from({ length: totalWindows }, () => Math.random() > 0.4);
};

// Calculate window grid based on building dimensions
const calculateWindowGrid = (width: number, height: number) => {
  // Fewer windows - target 2-4 columns and calculate rows to fill height
  const gap = 4;

  // Determine columns based on width
  let cols: number;
  if (width < 80) {
    cols = 2;
  } else if (width < 120) {
    cols = 3;
  } else {
    cols = 4;
  }

  // Calculate window dimensions to fill the entire building
  const availableWidth = width - 16; // Account for padding (p-2 = 8px each side)
  const availableHeight = height - 16;

  const windowWidth = Math.floor((availableWidth - (cols - 1) * gap) / cols);

  // Calculate how many rows we need to fill the height with larger windows
  const windowHeight = windowWidth; // Square windows
  const rows = Math.max(2, Math.floor(availableHeight / (windowHeight + gap)));

  return { cols, rows, windowSize: windowWidth };
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
    windowPattern,
  } = config;

  const { cols, rows, windowSize } = calculateWindowGrid(width, height);

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
        <div className="h-full flex flex-col justify-between">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-1">
              {Array.from({ length: cols }).map((_, colIndex) => {
                const patternIndex = rowIndex * cols + colIndex;
                const isLit = windowPattern[patternIndex % windowPattern.length];
                return (
                  <div
                    key={colIndex}
                    className={`${
                      isLit
                        ? 'bg-gray-700/40 dark:bg-yellow-300/20'
                        : 'bg-gray-800/20 dark:bg-gray-900/40'
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

// Generate random building with height scaled for mobile
const generateRandomBuilding = (isMobile: boolean): BuildingConfig => {
  const colors = [
    { light: 'bg-gray-300', dark: 'dark:bg-gray-800' },
    { light: 'bg-gray-200', dark: 'dark:bg-gray-900' },
    { light: 'bg-stone-300', dark: 'dark:bg-stone-900' },
    { light: 'bg-neutral-300', dark: 'dark:bg-neutral-900' },
    { light: 'bg-slate-200', dark: 'dark:bg-slate-900' },
    { light: 'bg-zinc-300', dark: 'dark:bg-zinc-900' },
    { light: 'bg-slate-300', dark: 'dark:bg-slate-900' },
  ];

  const roofColors = [
    { light: 'bg-gray-400', dark: 'dark:bg-gray-700' },
    { light: 'bg-gray-500', dark: 'dark:bg-gray-800' },
    { light: 'bg-stone-500', dark: 'dark:bg-stone-800' },
    { light: 'bg-neutral-400', dark: 'dark:bg-neutral-800' },
    { light: 'bg-slate-400', dark: 'dark:bg-slate-800' },
    { light: 'bg-zinc-400', dark: 'dark:bg-zinc-800' },
    { light: 'bg-slate-500', dark: 'dark:bg-slate-800' },
  ];

  const roofTypes: ('flat' | 'peaked' | 'antenna')[] = ['flat', 'peaked', 'antenna'];

  const widths = [65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160, 165];

  // Scale heights down for mobile devices (60% of desktop heights)
  const heightScale = isMobile ? 0.6 : 1.0;
  const baseHeights = [
    // Short: 80-150
    85, 95, 100, 110, 115, 120, 130, 140, 150,
    // Medium: 150-250
    155, 170, 180, 185, 195, 200, 210, 220, 225, 240,
    // Tall: 250-350
    260, 265, 280, 300, 310, 330,
    // Very tall: 350-450
    370, 390, 420, 435,
    // Extra tall: 450-550
    480, 520
  ];
  const heights = baseHeights.map(h => Math.floor(h * heightScale));

  const colorPair = colors[Math.floor(Math.random() * colors.length)];
  const roofColorPair = roofColors[Math.floor(Math.random() * roofColors.length)];
  const width = widths[Math.floor(Math.random() * widths.length)];
  const height = heights[Math.floor(Math.random() * heights.length)];

  // Calculate windows for this building and generate pattern
  const { cols, rows } = calculateWindowGrid(width, height);
  const windowPattern = generateWindowPattern(cols * rows);

  return {
    width,
    height,
    color: colorPair.light,
    darkColor: colorPair.dark,
    roofType: roofTypes[Math.floor(Math.random() * roofTypes.length)],
    roofColor: roofColorPair.light,
    darkRoofColor: roofColorPair.dark,
    windowPattern, // Include pattern in config
  };
};

// Shuffle array utility
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Session storage keys
const SESSION_KEY_LAYER1 = 'houses_layer1';
const SESSION_KEY_LAYER2 = 'houses_layer2';
const SESSION_KEY_LAYER3 = 'houses_layer3';
const SESSION_KEY_ISMOBILE = 'houses_isMobile';

type HouseLayerProps = {
  buildingCount: number;
  blurAmount: string;
  opacity: number;
  zIndex: number;
  layerKey: string;
};

const HouseLayer = ({ buildingCount, blurAmount, opacity, zIndex, layerKey }: HouseLayerProps) => {
  const [buildings, setBuildings] = useState<BuildingConfig[]>([]);

  useEffect(() => {
    // Detect if device is mobile
    const checkMobile = () => {
      const userAgent = navigator.userAgent;
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        userAgent.toLowerCase()
      );
      return isMobileDevice;
    };

    const mobileStatus = checkMobile();

    // Try to load from sessionStorage
    const storedBuildings = sessionStorage.getItem(layerKey);
    const storedMobileStatus = sessionStorage.getItem(SESSION_KEY_ISMOBILE);

    // Check if we have stored buildings AND the mobile status hasn't changed
    if (storedBuildings && storedMobileStatus === String(mobileStatus)) {
      try {
        setBuildings(JSON.parse(storedBuildings));
        return;
      } catch (e) {
        console.error('Failed to parse stored buildings', e);
      }
    }

    // Generate new buildings
    const newBuildings = shuffleArray(
      Array.from({ length: buildingCount }, () => generateRandomBuilding(mobileStatus))
    );
    setBuildings(newBuildings);

    // Store in sessionStorage
    sessionStorage.setItem(layerKey, JSON.stringify(newBuildings));
    sessionStorage.setItem(SESSION_KEY_ISMOBILE, String(mobileStatus));
  }, [buildingCount, layerKey]);

  // Memoize the rendered buildings to prevent re-renders
  const renderedBuildings = useMemo(() => {
    return buildings.map((building, index) => generateBuilding(building, index));
  }, [buildings]);

  if (buildings.length === 0) {
    return null;
  }

  return (
    <div
      className="absolute bottom-0 left-0 right-0 flex items-end pointer-events-none"
      style={{
        gap: '0px',
        filter: `blur(${blurAmount})`,
        opacity,
        zIndex,
      }}
    >
      {renderedBuildings}
    </div>
  );
};

export const Houses = () => {
  return (
    <>
      {/* Layer 3 (Farthest back) - Most blur */}
      <HouseLayer buildingCount={25} blurAmount="8px" opacity={0.5} zIndex={1} layerKey={SESSION_KEY_LAYER3} />

      {/* Layer 2 (Middle) - Medium blur */}
      <HouseLayer buildingCount={22} blurAmount="3px" opacity={0.7} zIndex={2} layerKey={SESSION_KEY_LAYER2} />

      {/* Layer 1 (Front) - Slight blur */}
      <HouseLayer buildingCount={20} blurAmount="1px" opacity={1} zIndex={3} layerKey={SESSION_KEY_LAYER1} />
    </>
  );
};
