import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { loadStats, type StatsMap } from "@/lib/storage";
import { findVerb, TENSES, PERSON_LABEL, DIFFICULTIES, type Tense, type Person } from "@/lib/verbs";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/mistakes")({
  head: () => ({ meta: [{ title: "Top erreurs — Conjuga" }, { name: "robots", content: "noindex" }] }),
  component: Mistakes,
});

interface Row {
  verb: string;
  tense: Tense;
  person: Person;
  ok: number;
  ko: number;
  total: number;
  rate: number;
}

function personLabel(t: Tense, p: Person): string {
  if (t === "infinitivo" || t === "participio" || t === "gerundio") return "—";
  if (t === "imperativo") return p + " !";
  return PERSON_LABEL[p];
}

function Mistakes() {
  const [stats, setStats] = useState<StatsMap>({});
  useEffect(() => setStats(loadStats()), []);

  const rows: Row[] = Object.entries(stats)
    .filter(([k]) => k.includes("__"))
    .map(([k, s]) => {
      const [verb, tense, person] = k.split("__") as [string, Tense, Person];
      const total = s.ok + s.ko;
      return { verb, tense, person, ok: s.ok, ko: s.ko, total, rate: total ? s.ok / total : 0 };
    })
    .filter((r) => r.ko > 0)
    .sort((a, b) => b.ko - a.ko || a.rate - b.rate)
    .slice(0, 20);

  const diffLabel = (d: string) => DIFFICULTIES.find((x) => x.id === d)?.label ?? d;
  const diffClass = (d: string) =>
    d === "riflessivo" ? "bg-primary/15 text-primary"
    : d === "irregulier" ? "bg-destructive/15 text-destructive"
    : d === "regulier" ? "bg-success/15 text-success"
    : "bg-muted text-muted-foreground";

  return (
    <AppShell>
      <section className="mb-4 flex items-center gap-2">
        <Button asChild variant="ghost" size="icon" aria-label="Retour">
          <Link to="/stats"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <div>
          <h1 className="font-display text-2xl font-black italic text-foreground">Top 20 des erreurs</h1>
          <p className="text-xs text-muted-foreground">Du plus mal réussi au moins mal réussi.</p>
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <AlertTriangle className="h-4 w-4 text-destructive" /> À retravailler en priorité
          </CardTitle>
        </CardHeader>
        <CardContent>
          {rows.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Aucune erreur enregistrée. Fais quelques sessions d'abord !
            </p>
          ) : (
            <ol className="space-y-2">
              {rows.map((r, idx) => {
                const v = findVerb(r.verb);
                const t = TENSES.find((x) => x.id === r.tense);
                const pct = Math.round(r.rate * 100);
                return (
                  <li key={idx} className="rounded-xl border border-border bg-card p-3">
                    <div className="flex items-start gap-3">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-destructive/15 text-xs font-black text-destructive">
                        {idx + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline gap-x-2">
                          <span className="font-display text-lg font-bold italic text-foreground">{r.verb}</span>
                          {v && (
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${diffClass(v.difficulty)}`}>
                              {diffLabel(v.difficulty)}
                            </span>
                          )}
                        </div>
                        {v && <div className="truncate text-xs italic text-muted-foreground">« {v.french} »</div>}
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                          <span className={`tense-chip tense-${r.tense}`} style={{ padding: "0.15rem 0.55rem", fontSize: "0.65rem" }}>
                            {t?.fr}
                          </span>
                          <span className="font-semibold text-muted-foreground">{personLabel(r.tense, r.person)}</span>
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <div className="text-lg font-black tabular-nums text-destructive">✗ {r.ko}</div>
                        <div className="text-xs text-muted-foreground">{pct}% ({r.ok}/{r.total})</div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}