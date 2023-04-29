import { MoonIcon, SunIcon } from "@heroicons/react/20/solid";
import { useFetcher } from "@remix-run/react";
import { useTheme } from "~/utils/providers/ThemeProvider";

export const ToggleTheme = () => {
  const [theme, setTheme] = useTheme();
  const fetcher = useFetcher();

  return (
    <button
      className="flex items-center justify-center w-6 h-6 rounded-lg shadow-md shadow-black/5 ring-1 ring-black/5 dark:bg-slate-700 dark:ring-inset dark:ring-white/5"
      onClick={() => {
        if (theme === "light") {
          setTheme("dark");
          fetcher.submit({ theme: "dark" }, { method: "post", action: "/updateUserTheme" });
        } else if (theme === "dark") {
          setTheme("light");
          fetcher.submit({ theme: "light" }, { method: "post", action: "/updateUserTheme" });
        }
      }}
    >
      {theme === "light" && <SunIcon className="w-4 h-4 fill-sky-400" />}
      {theme === "dark" && <MoonIcon className="w-4 h-4 fill-sky-400" />}
    </button>
  );
};
