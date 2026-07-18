import { Link, useRouterState } from "@tanstack/react-router";
import { Moon, Sun, BarChart3, Home, BookOpen } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  const { theme, toggle } = useTheme();
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl text-lg font-black text-primary-foreground shadow-[var(--shadow-soft)]" style={{ background: "var(--gradient-hero)" }}>
              C
            </span>
            <span className="font-display text-xl font-black tracking-tight">Conjuga</span>
          </Link>
          <div className="flex items-center gap-1">
            <Button asChild variant="ghost" size="icon" aria-label="Accueil">
              <Link to="/"><Home className="h-5 w-5" /></Link>
            </Button>
            <Button asChild variant="ghost" size="icon" aria-label="Coniugatore">
              <Link to="/dictionary"><BookOpen className="h-5 w-5" /></Link>
            </Button>
            <Button asChild variant="ghost" size="icon" aria-label="Statistiques">
              <Link to="/stats"><BarChart3 className="h-5 w-5" /></Link>
            </Button>
            <Button variant="ghost" size="icon" onClick={toggle} aria-label="Thème">
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>
      <main key={path} className="mx-auto max-w-xl px-4 pb-24 pt-4 animate-fade-in">
        {children}
      </main>
    </div>
  );
}