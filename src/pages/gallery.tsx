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

    const stripWidth = 400;
    const stripHeight = 1600;
    const photoHeight = stripHeight / 4;

    canvas.width = stripWidth;
    canvas.height = stripHeight;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, stripWidth, stripHeight);

    let loadedImages = 0;

    strip.photos.forEach((photoUrl, index) => {
      const img = new window.Image();
      img.src = photoUrl;
      img.onload = () => {
        ctx.drawImage(img, 0, index * photoHeight, stripWidth, photoHeight);
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
            className="text-black hover:text-gray-600 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-6 h-6" />
            <span>Back</span>
          </button>

          <h1 className="text-2xl font-bold text-black" style={{ fontFamily: 'monospace' }}>
            PHOTO GALLERY
          </h1>

          <div className="text-black text-sm">
            {photoStrips.length} strip{photoStrips.length !== 1 ? 's' : ''}
          </div>
        </div>

        {photoStrips.length === 0 ? (
          <div className="bg-white border-8 border-gray-800 rounded-xl p-12 text-center">
            <Image className="w-16 h-16 text-gray-800 mx-auto mb-4" />
            <h2 className="text-xl text-black mb-2">No photo strips yet</h2>
            <p className="text-gray-600 mb-6">Take some photos to see them here!</p>
            <button
              onClick={() => navigateTo('photobooth')}
              className="bg-black hover:bg-gray-800 text-white font-bold px-8 py-3 rounded-lg transition-colors flex items-center gap-2 mx-auto border-2 border-gray-800"
              style={{ fontFamily: 'monospace' }}
            >
              <Camera className="w-5 h-5" />
              START PHOTO BOOTH
            </button>
          </div>
        ) : (
          <div className="max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {photoStrips.map((strip: PhotoStripType) => (
                <div key={strip.id} className="bg-white border-4 border-gray-800 rounded-xl p-4">
                  {/* Photo Strip Preview */}
                  <div className="bg-white rounded-lg p-2 mb-3 shadow-lg border-2 border-gray-300 max-h-[400px] overflow-y-auto">
                    <div className="space-y-1">
                      {strip.photos.map((photo, index) => (
                        <img
                          key={index}
                          src={photo}
                          alt={`Photo ${index + 1}`}
                          className="w-full rounded"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Strip Info */}
                  <div className="text-center mb-3">
                    <p className="text-black font-semibold text-sm">{strip.date}</p>
                    <p className="text-gray-600 text-xs">{strip.timestamp}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => downloadStrip(strip)}
                      className="flex-1 bg-black hover:bg-gray-800 text-white py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm border-2 border-gray-800"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                    <button
                      onClick={() => deleteStrip(strip.id)}
                      className="bg-white hover:bg-gray-200 text-black p-2 rounded-lg transition-colors border-2 border-gray-800"
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
            className="bg-white hover:bg-gray-200 text-black font-bold px-8 py-3 rounded-lg transition-colors flex items-center gap-2 border-4 border-gray-800"
            style={{ fontFamily: 'monospace' }}
          >
            <Camera className="w-5 h-5" />
            TAKE MORE PHOTOS
          </button>
        </div>
      </div>
    </div>
  );
};
