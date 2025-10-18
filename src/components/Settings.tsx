import { useState, useEffect } from "react";
import { IoSettings, IoClose, IoLockClosed } from "react-icons/io5";
import { getGoogleDriveConfig, getCurrentConfigKey } from "../utils/configManager";

type SettingsProps = {
  appState: any;
  setAppState: React.Dispatch<React.SetStateAction<any>>;
};

export const Settings = ({ }: SettingsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [googleDriveClientId, setGoogleDriveClientId] = useState('');
  const [googleDriveFolderId, setGoogleDriveFolderId] = useState('');
  const [googleDriveEnabled, setGoogleDriveEnabled] = useState(false);
  const [isKeyBased, setIsKeyBased] = useState(false);
  const [configKey, setConfigKey] = useState<string | null>(null);

  // Load configuration when modal opens
  useEffect(() => {
    if (isOpen) {
      const config = getGoogleDriveConfig();
      const key = getCurrentConfigKey();

      setIsKeyBased(config.isKeyBased);
      setConfigKey(key);
      setGoogleDriveEnabled(config.enabled);
      setGoogleDriveClientId(config.clientId);
      setGoogleDriveFolderId(config.folderId);
    }
  }, [isOpen]);

  const handleSaveGoogleDrive = () => {
    if (isKeyBased) {
      alert('Cannot save: Configuration is controlled by URL key.');
      return;
    }

    localStorage.setItem('googleDriveClientId', googleDriveClientId);
    localStorage.setItem('googleDriveFolderId', googleDriveFolderId);
    localStorage.setItem('googleDriveEnabled', googleDriveEnabled.toString());
    alert('Google Drive settings saved! Refresh the page for changes to take effect.');
  };

  return (
    <>
      {/* Settings Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="absolute top-4 left-4 z-30 bg-transparent p-2 transition-colors text-slate-500 hover:text-slate-800 dark:text-slate-400 hover:dark:text-white cursor-pointer"
        title="Settings"
      >
        <IoSettings className="w-5 h-5 md:w-8 md:h-8" />
      </button>

      {/* Settings Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4 overflow-y-auto">
          <div className="doodle-border-thick max-w-md w-full p-6 shadow-2xl sketch-shadow relative bg-white dark:bg-gray-900 text-black dark:text-white border-black dark:border-white my-8">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-100 transition-colors text-black dark:text-white p-1 rounded-full cursor-pointer"
            >
              <IoClose className="w-6 h-6" />
            </button>

            {/* Header */}
            <h2 className="text-2xl font-bold mb-6 wavy-underline text-black dark:text-white">
              Settings
            </h2>

            {/* Settings Sections */}
            <div className="space-y-4">
              {/* Google Drive Section */}
              <div className="doodle-border p-4 bg-gray-100 dark:bg-gray-700 border-black dark:border-white">
                <h3 className="text-lg font-bold mb-3 text-black dark:text-white flex items-center gap-2">
                  Google Drive Auto-Upload
                  {isKeyBased && (
                    <span className="flex items-center gap-1 text-xs bg-yellow-400 dark:bg-yellow-600 text-black px-2 py-1 doodle-border font-micro">
                      <IoLockClosed className="w-3 h-3" />
                      KEY: {configKey}
                    </span>
                  )}
                </h3>

                {isKeyBased && (
                  <div className="mb-3 p-2 bg-yellow-100 dark:bg-yellow-900/30 doodle-border border-yellow-600">
                    <p className="text-xs text-yellow-900 dark:text-yellow-200 font-micro">
                      Configuration is controlled by URL key and cannot be edited.
                      The key will be cleared when a new session is started with the same URL.
                    </p>
                  </div>
                )}

                {/* Enable/Disable Toggle */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-bold text-black dark:text-white">Enable Auto-Upload</p>
                    <p className="text-xs mt-1 text-gray-600 dark:text-gray-400 font-micro">
                      Upload photos to Google Drive
                    </p>
                  </div>
                  <button
                    onClick={() => !isKeyBased && setGoogleDriveEnabled(!googleDriveEnabled)}
                    disabled={isKeyBased}
                    className={`w-12 h-6 rounded-full transition-colors doodle-border ${
                      googleDriveEnabled ? "bg-black" : "bg-gray-300"
                    } ${isKeyBased ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <div
                      className={`w-5 h-5 bg-white doodle-border rounded-full transition-transform ${
                        googleDriveEnabled ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Client ID Input */}
                <div className="mb-3">
                  <label className="text-xs font-bold text-black dark:text-white block mb-1 font-micro">
                    Client ID
                  </label>
                  <input
                    type="text"
                    value={googleDriveClientId}
                    onChange={(e) => setGoogleDriveClientId(e.target.value)}
                    placeholder="your_client_id.apps.googleusercontent.com"
                    disabled={isKeyBased}
                    className={`w-full px-2 py-1 text-xs doodle-border bg-white dark:bg-gray-800 text-black dark:text-white border-black dark:border-white font-micro ${
                      isKeyBased ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  />
                </div>

                {/* Folder ID Input */}
                <div className="mb-3">
                  <label className="text-xs font-bold text-black dark:text-white block mb-1 font-micro">
                    Folder ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={googleDriveFolderId}
                    onChange={(e) => setGoogleDriveFolderId(e.target.value)}
                    placeholder="folder_id_from_drive_url"
                    disabled={isKeyBased}
                    className={`w-full px-2 py-1 text-xs doodle-border bg-white dark:bg-gray-800 text-black dark:text-white border-black dark:border-white font-micro ${
                      isKeyBased ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  />
                </div>

                {/* Save Button */}
                <button
                  onClick={handleSaveGoogleDrive}
                  disabled={isKeyBased}
                  className={`w-full font-bold py-2 px-4 doodle-button text-xs bg-black dark:bg-white text-white dark:text-black border-black dark:border-white font-micro ${
                    isKeyBased ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isKeyBased ? "Settings Locked (URL Key Active)" : "Save Google Drive Settings"}
                </button>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="w-full mt-6 font-bold py-3 px-6 doodle-button transition-colors bg-black dark:bg-white text-white dark:text-black border-black dark:border-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
