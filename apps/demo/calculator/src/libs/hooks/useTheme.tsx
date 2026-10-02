import React from "react";

const useTheme = () => {
  const [theme, setTheme] = React.useState("light");

  const initializeTheme = (darkSchemeMediaQueryList: MediaQueryList) => {
    const mediaMode = darkSchemeMediaQueryList.matches ? "dark" : "light";
    const theme = localStorage.getItem("theme") || mediaMode;
    document.body.dataset.theme = theme;
    setTheme(theme);
  };

  const toggleTheme = () => {
    const newTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", newTheme);
    document.body.dataset.theme = newTheme;
    setTheme(newTheme);
  };

  React.useEffect(() => {
    initializeTheme(window.matchMedia("(prefers-color-scheme: dark)"));
  }, []);

  return { theme, toggleTheme };
};
export default useTheme;
