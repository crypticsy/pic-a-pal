export const createPhotoStripCanvas = async (
  photos: string[],
  canvasRef?: HTMLCanvasElement
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = canvasRef || document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    const outerBorder = 40;
    const photoBorder = 15;
    const photoSize = 400;
    const numPhotos = photos.length;
    const totalPhotoHeight = photoSize * numPhotos;
    const totalBorderHeight = photoBorder * (numPhotos - 1);
    const totalWidth = photoSize + (outerBorder * 2);
    const totalHeight = totalPhotoHeight + totalBorderHeight + (outerBorder * 2);

    canvas.width = totalWidth;
    canvas.height = totalHeight;

    // Fill with black background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, totalWidth, totalHeight);

    let loadedImages = 0;

    photos.forEach((photoUrl, index) => {
      const img = new window.Image();
      img.src = photoUrl;
      img.onload = () => {
        const yPos = outerBorder + (index * (photoSize + photoBorder));
        ctx.drawImage(img, outerBorder, yPos, photoSize, photoSize);
        loadedImages++;

        if (loadedImages === photos.length) {
          resolve(canvas.toDataURL('image/jpeg', 0.95));
        }
      };
      img.onerror = () => reject(new Error('Failed to load image'));
    });
  });
};

export const downloadPhotoStrip = async (photos: string[], filename: string) => {
  try {
    const dataUrl = await createPhotoStripCanvas(photos);
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error('Failed to download photo strip:', error);
  }
};
