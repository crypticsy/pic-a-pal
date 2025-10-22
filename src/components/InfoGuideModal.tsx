import { FaXmark, FaCamera, FaImage, FaSliders } from 'react-icons/fa6';

type InfoGuideModalProps = {
  onClose: () => void;
};

export const InfoGuideModal = ({ onClose }: InfoGuideModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75">
      <div className="bg-white dark:bg-gray-800 doodle-border-thick max-w-md w-full p-6 sketch-shadow relative max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
        >
          <FaXmark className="w-5 h-5 text-gray-800 dark:text-gray-200" />
        </button>

        {/* Header */}
        <div className="text-center mb-4">
          <div className="text-5xl mb-3">📸</div>
          <h2 className="text-2xl font-bold text-black dark:text-white mb-2">
            Photo Booth Guide
          </h2>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300 text-center">
            Welcome to Pocket Booth! Here's how to create your photo strip.
          </p>

          {/* Instructions */}
          <div className="space-y-4">
            {/* Step 1 */}
            <div className="doodle-border p-4 bg-gray-50 dark:bg-gray-700">
              <div className="flex items-start gap-3">
                <div className="bg-black dark:bg-white text-white dark:text-black rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                  1
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-900 dark:text-gray-100 mb-2">
                    <FaSliders className="inline w-4 h-4 mr-1" />
                    Choose Your Settings
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Before taking photos, customize your experience:
                  </p>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 mt-2 ml-4 space-y-1 list-disc list-inside">
                    <li><strong>Filter:</strong> Use arrows to preview and select a filter</li>
                    <li><strong>Strip Length:</strong> Pick 1-4 photos for your strip</li>
                    <li><strong>Camera:</strong> Choose front or back camera (mobile)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="doodle-border p-4 bg-gray-50 dark:bg-gray-700">
              <div className="flex items-start gap-3">
                <div className="bg-black dark:bg-white text-white dark:text-black rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                  2
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-900 dark:text-gray-100 mb-2">
                    <FaCamera className="inline w-4 h-4 mr-1" />
                    Insert Coin to Start
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Click the "INSERT COIN" button to start the photo session. You'll get a 3-second countdown, then photos will be taken automatically with pauses between each shot!
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="doodle-border p-4 bg-gray-50 dark:bg-gray-700">
              <div className="flex items-start gap-3">
                <div className="bg-black dark:bg-white text-white dark:text-black rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                  3
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-900 dark:text-gray-100 mb-2">
                    <FaImage className="inline w-4 h-4 mr-1" />
                    View & Download
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    After your session, download your photo strip! All photos are automatically saved in the Gallery for later viewing and downloading.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="doodle-border p-4 bg-blue-50 dark:bg-blue-900/30">
            <p className="font-bold text-sm text-gray-900 dark:text-gray-100 mb-2">
              💡 Pro Tips:
            </p>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 list-disc list-inside">
              <li>Preview filters in the TV screen before starting</li>
              <li>Try different poses for each photo in your strip</li>
              <li>Make sure you have good lighting for best results</li>
              <li>All your photo strips are saved in the Gallery!</li>
            </ul>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-full py-3 px-4 doodle-button transition-colors flex items-center justify-center gap-2 text-sm font-bold bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 border-gray-800 dark:border-gray-300"
          >
            Got It!
          </button>

          {/* Footer note */}
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
            You can access this guide anytime by clicking the info icon
          </p>
        </div>
      </div>
    </div>
  );
};
