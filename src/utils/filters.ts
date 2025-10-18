// Image filter utilities

export type FilterType = 'normal' | 'blackAndWhite' | 'trippy' | 'blueTint';

export const FILTERS = {
  normal: {
    name: 'Normal',
    cssFilter: 'none',
  },
  blackAndWhite: {
    name: 'Black & White',
    cssFilter: 'grayscale(100%)',
  },
  trippy: {
    name: 'Trippy',
    cssFilter: 'invert(100%) hue-rotate(180deg) saturate(200%) contrast(120%)',
  },
  blueTint: {
    name: 'Blue Tint',
    cssFilter: 'sepia(50%) hue-rotate(180deg) saturate(150%)',
  },
} as const;

/**
 * Apply filter to a canvas context
 * This function processes the image data directly for more control
 */
export const applyCanvasFilter = (
  canvas: HTMLCanvasElement,
  filter: FilterType
): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  switch (filter) {
    case 'blackAndWhite':
      // Convert to grayscale
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg;
        data[i + 1] = avg;
        data[i + 2] = avg;
      }
      break;

    case 'trippy':
      // Invert + hue rotate (180deg) + high saturation + contrast
      // Matches CSS: invert(100%) hue-rotate(180deg) saturate(200%) contrast(120%)
      for (let i = 0; i < data.length; i += 4) {
        // Step 1: Invert colors
        let r = 255 - data[i];
        let g = 255 - data[i + 1];
        let b = 255 - data[i + 2];

        // Step 2: Hue rotation (180 degrees)
        // Converting RGB to HSL, rotate hue by 180, convert back
        // Simplified: for 180deg rotation, we swap and complement
        const hueR = b;
        const hueG = g;
        const hueB = r;

        // Step 3: Increase saturation (200% = 2x)
        const gray = 0.2989 * hueR + 0.5870 * hueG + 0.1140 * hueB;
        const satR = gray + (hueR - gray) * 2.0;
        const satG = gray + (hueG - gray) * 2.0;
        const satB = gray + (hueB - gray) * 2.0;

        // Step 4: Increase contrast (120% = 1.2x)
        const contrastR = ((satR - 128) * 1.2) + 128;
        const contrastG = ((satG - 128) * 1.2) + 128;
        const contrastB = ((satB - 128) * 1.2) + 128;

        data[i] = Math.min(255, Math.max(0, contrastR));
        data[i + 1] = Math.min(255, Math.max(0, contrastG));
        data[i + 2] = Math.min(255, Math.max(0, contrastB));
      }
      break;

    case 'blueTint':
      // Blue tint with sepia base
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Apply sepia
        const sepiaR = (r * 0.393 + g * 0.769 + b * 0.189);
        const sepiaG = (r * 0.349 + g * 0.686 + b * 0.168);
        const sepiaB = (r * 0.272 + g * 0.534 + b * 0.131);

        // Shift towards blue (hue rotate)
        const blueR = sepiaB * 0.5;
        const blueG = sepiaG * 0.8;
        const blueB = sepiaR * 1.2;

        // Increase saturation
        const gray = 0.2989 * blueR + 0.5870 * blueG + 0.1140 * blueB;
        const satR = gray + (blueR - gray) * 1.5;
        const satG = gray + (blueG - gray) * 1.5;
        const satB = gray + (blueB - gray) * 1.5;

        data[i] = Math.min(255, Math.max(0, satR));
        data[i + 1] = Math.min(255, Math.max(0, satG));
        data[i + 2] = Math.min(255, Math.max(0, satB));
      }
      break;

    case 'normal':
    default:
      return;
  }

  ctx.putImageData(imageData, 0, 0);
};

/**
 * Get CSS filter string for a given filter type
 * Useful for applying filters to video elements in real-time
 */
export const getCSSFilter = (filter: FilterType): string => {
  return FILTERS[filter].cssFilter;
};

/**
 * Get filter name for display
 */
export const getFilterName = (filter: FilterType): string => {
  return FILTERS[filter].name;
};
