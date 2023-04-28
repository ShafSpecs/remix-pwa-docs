import { createContext, useContext, useState } from "react";
import type { Dispatch, ReactNode } from "react";

// Really great article on managing light and dark themes with SSR and hydration. https://www.mattstobbs.com/remix-dark-mode/
// Most if not all of this is from that article. Changed from a Theme enum because enums are terrible in Typescript.

export type Theme = "light" | "dark";

const prefersDarkMQ = "(prefers-color-scheme: dark)";
const getPreferredTheme = () => (window.matchMedia(prefersDarkMQ).matches ? "dark" : "light");

const clientThemeCode = `
;(() => {
  const cl = document.documentElement.classList;
  const theme = window.matchMedia(${JSON.stringify(prefersDarkMQ)}).matches
    ? 'dark'
    : 'light';
  const themeAlreadyApplied = cl.contains(theme);
  if (themeAlreadyApplied) {
    // do nothing
  } else {
    cl.add(theme);
  }
})();
`;

/**
 * @description Script to prevent FOUC when the theme is applied on the client. Added a boolean in case SSR steps in with a user_theme.
 * However, this could become annoying to manage error boundaries if the Provider is inside a Document using loaderData.
 * Root Error Boundaries are unable to use LoaderData so you'd need to either remove the ThemeProvider from the regular Document or have your ThemeProvider not have ssr
 *
 * @param ssr_theme - If the theme is already applied on the server, we don't need to apply it again on the client.
 * @returns
 */
export function StopFOUC({ ssr_theme }: { ssr_theme?: boolean }) {
  return !ssr_theme ? <script dangerouslySetInnerHTML={{ __html: clientThemeCode }} /> : <></>;
}

type ThemeContextType = [Theme | null, Dispatch<React.SetStateAction<Theme | null>>];

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function ThemeProvider({ children, ssr_theme }: { children: ReactNode; ssr_theme: Theme | null }) {
  const [theme, setTheme] = useState<Theme | null>(() => {
    if (ssr_theme) return ssr_theme;
    if (typeof window === "undefined") {
      return null;
    }
    return getPreferredTheme();
  });

  return <ThemeContext.Provider value={[theme, setTheme]}>{children}</ThemeContext.Provider>;
}

function useTheme() {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}

export { ThemeProvider, useTheme };
