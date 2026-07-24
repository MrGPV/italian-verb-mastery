import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { loadStats, type StatsMap } from "@/lib/storage";
import { findVerb, TENSES, PERSON_LABEL, bestAnswerFor, type Tense, type Person, type Verb } from "@/lib/verbs";
import { AlertTriangle, ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/mistakes")({
  head: () => ({ meta: [{ title: "Top erreurs — Il Giardino dei Verbi" }, { name: "robots", content: "noindex" }] }),
  component: Mistakes,
});

interface Row {
  verb: string;
  tense: Tense;
  entries: { person: Person; ok: number; ko: number }[];
  ko: number;
  ok: number;
  total: number;
  rate: number;
}

function personLabel(t: Tense, p: Person): string {
  if (t === "infinitivo" || t === "participio" || t === "gerundio") return "—";
  if (t === "imperativo") return `(${p})`;
  return PERSON_LABEL[p];
}

const PERSON_ORDER_2COL: Person[] = ["io", "noi", "tu", "voi", "lui", "loro"];

function FullConj({ verb, tense }: { verb: Verb; tense: Tense }) {
  const t = TENSES.find((x) => x.id === tense);
  const persons: Person[] =
    tense === "infinitivo" || tense === "participio" || tense === "gerundio"
      ? (["lui"] as Person[])
      : tense === "imperativo"
      ? (["tu", "noi", "voi"] as Person[])
      : PERSON_ORDER_2COL;
  const cols = tense === "imperativo" || persons.length === 1 ? "grid-cols-1" : "grid-cols-2";
  return (
    <div className="mt-3 rounded-xl border border-border/60 bg-muted/30 p-3">
      <div className={`tense-chip tense-${tense} mb-2`}>
        <span>{t?.fr}</span><span className="opacity-70">·</span>
        <span className="font-display italic normal-case tracking-normal">{t?.it}</span>
      </div>
      <div className={`grid gap-x-4 gap-y-1 text-sm ${cols}`}>
        {persons.map((p) => {
          const ans = bestAnswerFor(verb, tense, p);
          if (!ans) return null;
          const label =
            tense === "infinitivo" ? "it." :
            tense === "participio" || tense === "gerundio" ? "→" :
            tense === "imperativo" ? `(${p})` : PERSON_LABEL[p];
          return (
            <div key={p} className="flex items-baseline gap-2">
              <span className="w-14 shrink-0 text-right text-xs font-semibold text-muted-foreground">{label}</span>
              <span className="font-semibold text-foreground">{ans}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Mistakes() {
  const [stats, setStats] = useState<StatsMap>({});
  const [expanded, setExpanded] = useState<number | null>(null);
  useEffect(() => setStats(loadStats()), []);

  const grouped = new Map<string, Row>();
  for (const [k, s] of Object.entries(stats)) {
    if (!k.includes("__")) continue;
    const [verb, tense, person] = k.split("__") as [string, Tense, Person];
    if (s.ko <= 0) continue;
    const key = `${verb}__${tense}`;
    const cur = grouped.get(key) || { verb, tense, entries: [], ko: 0, ok: 0, total: 0, rate: 0 };
    cur.entries.push({ person, ok: s.ok, ko: s.ko });
    cur.ko += s.ko; cur.ok += s.ok; cur.total += s.ok + s.ko;
    grouped.set(key, cur);
  }
  const rows: Row[] = [...grouped.values()]
    .map((r) => ({ ...r, rate: r.total ? r.ok / r.total : 0 }))
    .sort((a, b) => b.ko - a.ko || a.rate - b.rate)
    .slice(0, 20);

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
                const isOpen = expanded === idx;
                const sortedEntries = [...r.entries].sort((a, b) => b.ko - a.ko);
                return (
                  <li key={idx} className="rounded-xl border border-border bg-card p-3">
                    <button
                      type="button"
                      onClick={() => setExpanded(isOpen ? null : idx)}
                      className="flex w-full items-start gap-3 text-left"
                      aria-expanded={isOpen}
                    >
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-destructive/15 text-xs font-black text-destructive">
                        {idx + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline gap-x-2">
                          <span className="font-display text-lg font-bold italic text-foreground">{r.verb}</span>
                          {v && <span className="truncate text-xs italic text-muted-foreground">« {v.french} »</span>}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs">
                          <span className={`tense-chip tense-${r.tense}`} style={{ padding: "0.15rem 0.55rem", fontSize: "0.65rem" }}>
                            {t?.fr}
                          </span>
                        </div>
                        <ul className="mt-1.5 space-y-0.5 text-xs">
                          {sortedEntries.map((e) => {
                            const ans = v ? bestAnswerFor(v, r.tense, e.person) : undefined;
                            return (
                              <li key={e.person} className="flex flex-wrap items-baseline gap-x-2">
                                <span className="w-14 shrink-0 font-semibold text-muted-foreground">
                                  {personLabel(r.tense, e.person)}
                                </span>
                                {ans && <span className="font-bold text-success">→ {ans}</span>}
                                <span className="ml-auto tabular-nums text-destructive">✗ {e.ko}</span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                      <div className="flex shrink-0 items-center gap-2 text-right">
                        <div>
                        <div className="text-lg font-black tabular-nums text-destructive">✗ {r.ko}</div>
                        <div className="text-xs text-muted-foreground">{pct}% ({r.ok}/{r.total})</div>
                        </div>
                        {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                      </div>
                    </button>
                    {isOpen && v && <FullConj verb={v} tense={r.tense} />}
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