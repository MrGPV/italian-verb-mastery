import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { loadTheme, saveTheme } from "./storage";

type Theme = "light" | "dark";
const Ctx = createContext<{ theme: Theme; toggle: () => void }>({ theme: "light", toggle: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  useEffect(() => {
    const t = loadTheme();
    setTheme(t);
    document.documentElement.classList.toggle("dark", t === "dark");
  }, []);
  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    saveTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };
  return <Ctx.Provider value={{ theme, toggle }}>{children}</Ctx.Provider>;
}
export const useTheme = () => useContext(Ctx);