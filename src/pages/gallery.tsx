import { Camera, Download, Image, ArrowLeft, Trash2 } from 'lucide-react';

type PhotoStripType = {
  id: number;
  photos: string[];
  timestamp: string;
  date: string;
};

type GalleryPageProps = {
  navigateTo: (route: string) => void;
  appState: any;
  setAppState: React.Dispatch<React.SetStateAction<any>>;
  refs: {
    videoRef: React.RefObject<HTMLVideoElement | null>;
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
  };
};

// Gallery Page Component
export const GalleryPage = ({ navigateTo, appState, setAppState }: GalleryPageProps) => {
  const downloadStrip = (strip: PhotoStripType) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const outerBorder = 40; // Border around entire strip
    const photoBorder = 15; // Border between photos
    const photoSize = 400; // Each photo is square

    // Calculate total height with borders between photos
    const totalPhotoHeight = photoSize * 4;
    const totalBorderHeight = photoBorder * 3; // 3 borders between 4 photos

    const totalWidth = photoSize + (outerBorder * 2);
    const totalHeight = totalPhotoHeight + totalBorderHeight + (outerBorder * 2);

    canvas.width = totalWidth;
    canvas.height = totalHeight;

    // Fill with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, totalWidth, totalHeight);

    let loadedImages = 0;

    strip.photos.forEach((photoUrl, index) => {
      const img = new window.Image();
      img.src = photoUrl;
      img.onload = () => {
        // Calculate Y position with borders between photos
        const yPos = outerBorder + (index * (photoSize + photoBorder));

        // Draw photo
        ctx.drawImage(img, outerBorder, yPos, photoSize, photoSize);
        loadedImages++;

        if (loadedImages === strip.photos.length) {
          const link = document.createElement('a');
          link.download = `photo-strip-${strip.id}.jpg`;
          link.href = canvas.toDataURL('image/jpeg', 0.95);
          link.click();
        }
      };
    });
  };

  const deleteStrip = (stripId: number) => {
    if (confirm('Delete this photo strip?')) {
      setAppState((prev: typeof appState) => ({
        ...prev,
        photoStrips: prev.photoStrips.filter((strip: PhotoStripType) => strip.id !== stripId)
      }));
    }
  };

  const photoStrips = appState.photoStrips || [];

  return (
    <div className="h-full w-full p-4 bg-white overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigateTo('home')}
            className="text-black hover:text-gray-600 transition-colors flex items-center gap-2 doodle-button bg-white px-3 py-2"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            <ArrowLeft className="w-6 h-6" />
            <span className="text-lg font-bold">Back</span>
          </button>

          <h1 className="text-3xl font-bold text-black wavy-underline" style={{ fontFamily: "'Permanent Marker', cursive" }}>
            PHOTO GALLERY
          </h1>

          <div className="text-black text-lg font-bold bg-gray-100 px-3 py-2 doodle-border" style={{ fontFamily: "'Caveat', cursive" }}>
            {photoStrips.length} strip{photoStrips.length !== 1 ? 's' : ''}
          </div>
        </div>

        {photoStrips.length === 0 ? (
          <div className="bg-white doodle-border-thick text-black p-12 text-center sketch-shadow rotate-1">
            <Image className="w-16 h-16 text-black mx-auto mb-4" />
            <h2 className="text-3xl text-black mb-2 font-bold" style={{ fontFamily: "'Permanent Marker', cursive" }}>No photo strips yet</h2>
            <p className="text-gray-600 mb-6 text-lg font-semibold" style={{ fontFamily: "'Caveat', cursive" }}>Take some photos to see them here!</p>
            <button
              onClick={() => navigateTo('photobooth')}
              className="bg-black hover:bg-gray-800 text-white font-bold px-8 py-3 doodle-button transition-colors flex items-center gap-2 mx-auto"
              style={{ fontFamily: "'Permanent Marker', cursive" }}
            >
              <Camera className="w-5 h-5" />
              START PHOTO BOOTH
            </button>
          </div>
        ) : (
          <div className="max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {photoStrips.map((strip: PhotoStripType, idx: number) => (
                <div key={strip.id} className={`bg-gray-100 doodle-border-thick text-black p-4 sketch-shadow ${idx % 3 === 0 ? 'rotate-1' : idx % 3 === 1 ? '-rotate-1' : 'rotate-2'}`}>
                  {/* Photo Strip Preview */}
                  <div className="bg-white doodle-box p-2 mb-3 shadow-lg max-h-[400px] overflow-y-auto">
                    <div className="space-y-1">
                      {strip.photos.map((photo, index) => (
                        <img
                          key={index}
                          src={photo}
                          alt={`Photo ${index + 1}`}
                          className="w-full doodle-border"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Strip Info */}
                  <div className="text-center mb-3">
                    <p className="text-black font-bold text-base" style={{ fontFamily: "'Caveat', cursive" }}>{strip.date}</p>
                    <p className="text-gray-600 text-sm font-semibold" style={{ fontFamily: "'Caveat', cursive" }}>{strip.timestamp}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => downloadStrip(strip)}
                      className="flex-1 bg-black hover:bg-gray-800 text-white py-2 px-3 doodle-button transition-colors flex items-center justify-center gap-2 text-sm font-bold"
                      style={{ fontFamily: "'Caveat', cursive" }}
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                    <button
                      onClick={() => deleteStrip(strip.id)}
                      className="bg-white hover:bg-gray-200 text-black p-2 doodle-button transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigateTo('photobooth')}
            className="bg-black hover:bg-gray-800 text-white font-bold px-8 py-3 doodle-button transition-colors flex items-center gap-2 -rotate-2"
            style={{ fontFamily: "'Permanent Marker', cursive" }}
          >
            <Camera className="w-5 h-5" />
            TAKE MORE PHOTOS
          </button>
        </div>
      </div>
    </div>
  );
};
