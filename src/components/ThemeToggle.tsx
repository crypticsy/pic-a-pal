import { IoSunny, IoMoon } from "react-icons/io5";

type ThemeToggleProps = {
  appState: any;
  setAppState: React.Dispatch<React.SetStateAction<any>>;
};

export const ThemeToggle = ({ appState, setAppState }: ThemeToggleProps) => {
  const theme = appState?.theme || "light";
  const isDark = theme === "dark";

  const toggleTheme = () => {
    setAppState((prev: any) => ({
      ...prev,
      theme: prev.theme === "light" ? "dark" : "light",
    }));
  };

  return (
    <button
      onClick={toggleTheme}
      className="absolute top-4 right-4 z-30 bg-transparent p-2 transition-all text-yellow-500 hover:text-yellow-600 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer hover:scale-110"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDark ? (
        <IoMoon className="w-5 h-5 md:w-10 md:h-10 animate-pulse" />
      ) : (
        <IoSunny className="w-5 h-5 md:w-10 md:h-10 animate-spin-slow" />
      )}
    </button>
  );
};
