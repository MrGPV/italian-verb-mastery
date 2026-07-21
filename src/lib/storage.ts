// LocalStorage-backed helpers for stats, config, theme.
import type { Difficulty, Person, Tense } from "./verbs";

export interface SessionConfig {
  difficulties: Difficulty[];
  tenses: Tense[];
  count: 5 | 10 | 15 | 20;
  mode: "complet" | "mixte";
  smart: boolean;
  topOnly?: boolean;
}

export interface AttemptStat {
  ok: number;
  ko: number;
  lastSeen: number; // timestamp
}

export type StatsMap = Record<string, AttemptStat>; // key: verb__tense__person or verb

const CFG_KEY = "conjIt.config";
const STATS_KEY = "conjIt.stats";
const THEME_KEY = "conjIt.theme";

export const DEFAULT_CONFIG: SessionConfig = {
  difficulties: ["courant", "regulier"],
  tenses: ["presente"],
  count: 10,
  mode: "mixte",
  smart: false,
  topOnly: false,
};

export function loadConfig(): SessionConfig {
  if (typeof window === "undefined") return DEFAULT_CONFIG;
  try {
    const raw = window.localStorage.getItem(CFG_KEY);
    if (!raw) return DEFAULT_CONFIG;
    return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_CONFIG;
  }
}
export function saveConfig(c: SessionConfig) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CFG_KEY, JSON.stringify(c));
}

export function loadStats(): StatsMap {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(STATS_KEY) || "{}");
  } catch {
    return {};
  }
}
export function saveStats(s: StatsMap) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STATS_KEY, JSON.stringify(s));
}
export function resetStats() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STATS_KEY);
}

export function recordAttempt(verb: string, tense: Tense, person: Person, correct: boolean) {
  const stats = loadStats();
  const now = Date.now();
  const keys = [verb, `${verb}__${tense}__${person}`];
  for (const k of keys) {
    const cur = stats[k] || { ok: 0, ko: 0, lastSeen: 0 };
    cur.lastSeen = now;
    if (correct) cur.ok++; else cur.ko++;
    stats[k] = cur;
  }
  saveStats(stats);
}

export function loadTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  const t = window.localStorage.getItem(THEME_KEY);
  if (t === "dark" || t === "light") return t;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
export function saveTheme(t: "light" | "dark") {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(THEME_KEY, t);
}