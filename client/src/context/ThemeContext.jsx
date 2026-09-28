import { flushSync } from "react-dom";
import { useEffect, useState } from "react";
import { ThemeContext } from "./themeContext";

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem("mathmind-theme");
  if (savedTheme === "light" || savedTheme === "dark") return savedTheme;
  return window.matchMedia?.("(prefers-color-scheme: light)").matches ? "light" : "dark";
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("mathmind-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    const updateTheme = () => flushSync(() => {
      setTheme((currentTheme) => currentTheme === "dark" ? "light" : "dark");
    });

    if (typeof document.startViewTransition === "function") {
      document.startViewTransition(updateTheme);
    } else {
      updateTheme();
    }
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}
