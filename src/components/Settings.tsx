import { useState } from "react";
import { Settings as SettingsIcon, X } from "lucide-react";

type SettingsProps = {
  appState: any;
  setAppState: React.Dispatch<React.SetStateAction<any>>;
};

export const Settings = ({ appState, setAppState }: SettingsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const debugCamera = appState?.debugCamera || false;
  const theme = appState?.theme || "light";

  return (
    <>
      {/* Settings Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="absolute top-4 right-4 z-30 bg-transparent p-2 transition-colors text-black dark:text-white"
        title="Settings"
      >
        <SettingsIcon className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      {/* Settings Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
          <div className="doodle-border-thick max-w-md w-full p-6 shadow-2xl sketch-shadow relative bg-white dark:bg-gray-900 text-black dark:text-white border-black dark:border-white">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 transition-colors text-black dark:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Header */}
            <h2 className="text-2xl font-bold mb-6 wavy-underline text-black dark:text-white">
              Settings
            </h2>

            {/* Debug Mode Section */}
            <div className="space-y-4">
              <div className="doodle-border p-4 bg-gray-100 dark:bg-gray-700 border-black dark:border-white">
                <h3 className="text-lg font-bold mb-3 text-black dark:text-white">
                  Debug Mode
                </h3>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-black dark:text-white">Camera Debug</p>
                    <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                      Skip camera access, use placeholder
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setAppState((prev: any) => ({
                        ...prev,
                        debugCamera: !prev.debugCamera,
                      }))
                    }
                    className={`w-12 h-6 rounded-full transition-colors doodle-border ${
                      debugCamera ? "bg-black" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white doodle-border rounded-full transition-transform ${
                        debugCamera ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Theme Section */}
              <div className="doodle-border p-4 bg-gray-100 dark:bg-gray-700 border-black dark:border-white">
                <h3 className="text-lg font-bold mb-3 text-black dark:text-white">
                  Appearance
                </h3>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-black dark:text-white">Theme</p>
                    <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                      Current: {theme === "light" ? "Light" : "Dark"}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setAppState((prev: any) => ({
                        ...prev,
                        theme: prev.theme === "light" ? "dark" : "light",
                      }))
                    }
                    className={`w-12 h-6 rounded-full transition-colors doodle-border ${
                      theme === "dark" ? "bg-black" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white doodle-border rounded-full transition-transform ${
                        theme === "dark" ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
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
