import { Link, useRouterState } from "@tanstack/react-router";
import {
  Moon,
  Sun,
  BarChart3,
  Home,
  BookOpen,
  AlertTriangle,
  GraduationCap,
  MoreVertical,
} from "lucide-react";
import { useTheme } from "@/lib/theme";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ReactNode } from "react";

export function AppShell({ children, bare = false }: { children: ReactNode; bare?: boolean }) {
  const { theme, toggle } = useTheme();
  const path = useRouterState({ select: (s) => s.location.pathname });

  const menu = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Menu" className="h-9 w-9">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem asChild>
          <Link to="/"><Home className="mr-2 h-4 w-4" /> Accueil</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/dictionary"><BookOpen className="mr-2 h-4 w-4" /> Coniugatore</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/theory"><GraduationCap className="mr-2 h-4 w-4" /> Théorie</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/mistakes"><AlertTriangle className="mr-2 h-4 w-4" /> Top erreurs</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/stats"><BarChart3 className="mr-2 h-4 w-4" /> Statistiques</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={(e) => { e.preventDefault(); toggle(); }}>
          {theme === "dark" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
          {theme === "dark" ? "Mode clair" : "Mode sombre"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  if (bare) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="fixed right-2 top-2 z-40">{menu}</div>
        <main key={path} className="mx-auto max-w-xl px-4 pb-24 pt-3 animate-fade-in">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-12 max-w-xl items-center justify-between px-3">
          <Link to="/" className="flex min-w-0 items-center gap-2">
            <img
              src="/favicon.png"
              alt="Il Giardino dei Verbi"
              width={28}
              height={28}
              className="h-7 w-7 shrink-0 rounded-lg shadow-[var(--shadow-soft)]"
            />
            <span className="truncate font-display text-base font-black italic leading-none tracking-tight">
              Il Giardino <span className="text-primary">dei Verbi</span>
            </span>
          </Link>
          {menu}
        </div>
      </header>
      <main key={path} className="mx-auto max-w-xl px-4 pb-24 pt-3 animate-fade-in">
        {children}
      </main>
    </div>
  );
}