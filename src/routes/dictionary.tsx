import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  VERBS, TENSES, PERSON_LABEL,
  regularReference, diffParts, computeAnswer, displaySubjectInfo,
  type Verb, type Tense, type Person,
} from "@/lib/verbs";

export const Route = createFileRoute("/dictionary")({
  head: () => ({
    meta: [
      { title: "Coniugatore — Il Giardino dei Verbi" },
      { name: "description", content: "Cherche un verbe italien et vois toute sa conjugaison." },
    ],
  }),
  component: Dictionary,
});

function norm(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function Dictionary() {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Verb | null>(null);
  const [hidden, setHidden] = useState<Set<Tense>>(new Set());

  const nq = norm(q.trim());
  const suggestions = useMemo(() => {
    if (!nq || selected) return [];
    return VERBS
      .filter((v) => norm(v.infinitive).includes(nq) || norm(v.french).includes(nq))
      .sort((a, b) => a.infinitive.localeCompare(b.infinitive))
      .slice(0, 12);
  }, [nq, selected]);

  const sortedVerbs = useMemo(
    () => [...VERBS].sort((a, b) => a.infinitive.localeCompare(b.infinitive)),
    [],
  );
  const selIdx = selected ? sortedVerbs.findIndex((v) => v.infinitive === selected.infinitive) : -1;
  const gotoIdx = (idx: number) => {
    const v = sortedVerbs[(idx + sortedVerbs.length) % sortedVerbs.length];
    setSelected(v); setQ(v.infinitive);
  };
  const toggleTense = (t: Tense) =>
    setHidden((h) => {
      const n = new Set(h); n.has(t) ? n.delete(t) : n.add(t); return n;
    });

  return (
    <AppShell>
      <section className="mb-4">
        <h1 className="font-display text-2xl font-black italic text-foreground">Coniugatore</h1>
        <p className="text-sm text-muted-foreground">Recherche un verbe en italien <em>ou</em> en français.</p>
      </section>

      <div className="relative mb-3">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={q}
          placeholder="es. mangiare, plaire, s'endormir…"
          onChange={(e) => { setQ(e.target.value); setSelected(null); }}
          className="h-12 pl-9 pr-9 text-base"
          autoFocus
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
        />
        {q && (
          <button
            type="button"
            aria-label="Effacer"
            onClick={() => { setQ(""); setSelected(null); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {suggestions.length > 0 && (
        <Card className="mb-4 max-h-[26rem] overflow-auto py-1">
          <ul>
            {suggestions.map((v) => (
              <li key={v.infinitive}>
                <button
                  onClick={() => { setSelected(v); setQ(v.infinitive); }}
                  className="flex w-full items-baseline justify-between gap-3 border-b border-border/60 px-4 py-3 text-left last:border-b-0 hover:bg-accent/20"
                >
                  <span className="font-display text-lg font-bold italic text-foreground">{v.infinitive}</span>
                  <span className="text-sm italic text-muted-foreground">« {v.french} »</span>
                </button>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {selected && (
        <>
          <div className="mb-3 flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => gotoIdx(selIdx - 1)} aria-label="Verbe précédent">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <select
              value={selected.infinitive}
              onChange={(e) => {
                const v = sortedVerbs.find((x) => x.infinitive === e.target.value);
                if (v) { setSelected(v); setQ(v.infinitive); }
              }}
              className="h-10 flex-1 rounded-md border border-input bg-card px-3 text-sm font-semibold text-foreground"
            >
              {sortedVerbs.map((v) => (
                <option key={v.infinitive} value={v.infinitive}>
                  {v.infinitive} — {v.french}
                </option>
              ))}
            </select>
            <Button variant="outline" size="icon" onClick={() => gotoIdx(selIdx + 1)} aria-label="Verbe suivant">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <Card className="mb-3">
            <CardContent className="pt-4">
              <div className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Temps affichés
              </div>
              <div className="flex flex-wrap gap-1.5">
                {TENSES.map((t) => {
                  const on = !hidden.has(t.id);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => toggleTense(t.id)}
                      className={`tense-chip tense-${t.id} transition-opacity ${on ? "" : "opacity-30"}`}
                      style={{ padding: "0.25rem 0.6rem", fontSize: "0.65rem" }}
                      aria-pressed={on}
                    >
                      {t.fr}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <VerbFullConj verb={selected} hidden={hidden} />
        </>
      )}

      {!selected && !suggestions.length && !q && (
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Tape les premières lettres… {VERBS.length} verbes disponibles.
        </p>
      )}
      {!selected && !suggestions.length && q && (
        <p className="mt-6 text-center text-sm text-muted-foreground">Aucun verbe trouvé.</p>
      )}
    </AppShell>
  );
}

function personLabel(t: Tense, p: Person): string {
  if (t === "participio" || t === "gerundio") return "→";
  if (t === "imperativo") return `(${p})`;
  return PERSON_LABEL[p];
}

const PERSON_ORDER_2COL: Person[] = ["io", "noi", "tu", "voi", "lui", "loro"];

function progressivoRow(verb: Verb): Record<Person, string> {
  const out = {} as Record<Person, string>;
  (["io","tu","lui","noi","voi","loro"] as Person[]).forEach((p) => {
    // Use masculine singular/plural as canonical display
    const info = displaySubjectInfo(p, false);
    out[p] = computeAnswer(verb, "presente_progressivo", { ...info, gender: "m" });
  });
  return out;
}

function VerbFullConj({ verb, hidden }: { verb: Verb; hidden: Set<Tense> }) {
  const ref = useMemo(() => regularReference(verb), [verb]);
  return (
    <Card className="overflow-hidden">
      <div className="tricolore-bar" />
      <CardContent className="space-y-6 pt-6">
        <div className="text-center">
          <div className="font-display text-4xl font-black italic text-foreground">{verb.infinitive}</div>
          <div className="mt-1 text-sm italic text-muted-foreground">« {verb.french} »</div>
          <div className="mt-2 flex justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <span className="rounded-full bg-muted px-2 py-0.5">aux. {verb.aux}</span>
            <span className="rounded-full bg-muted px-2 py-0.5">{verb.difficulty}</span>
          </div>
        </div>

        {TENSES.filter((t) => !hidden.has(t.id)).map((t) => {
          const row = t.id === "presente_progressivo" ? progressivoRow(verb) : verb.conj[t.id];
          if (!row || Object.values(row).every((x) => !x)) return null;
          const refRow = t.id === "presente_progressivo" ? undefined : ref[t.id];
          return (
            <div key={t.id}>
              <div className={`tense-chip tense-${t.id} mb-3`}>
                <span>{t.fr}</span>
                <span className="opacity-70">·</span>
                <span className="font-display italic normal-case tracking-normal">{t.it}</span>
              </div>
              <div className={`grid gap-y-1 gap-x-4 text-sm ${t.id === "imperativo" ? "grid-cols-1" : "grid-cols-2"}`}>
                {(t.id === "imperativo" ? (["tu","noi","voi"] as Person[]) : PERSON_ORDER_2COL).map((p) => {
                  const val = (row as Partial<Record<Person, string>>)[p];
                  if (!val) return null;
                  // No irregular highlighting when we don't have a regular
                  // reference (e.g. presente_progressivo is dynamically built
                  // from `stare` + gerundio and has no "regular" counterpart).
                  const parts = refRow?.[p]
                    ? diffParts(val, refRow[p])
                    : [{ text: val, bold: false }];
                  return (
                    <div key={p} className="flex items-baseline gap-2">
                      <span className="w-12 shrink-0 text-right text-xs font-semibold text-muted-foreground">
                        {personLabel(t.id, p)}
                      </span>
                      <span className="text-foreground">
                        {parts.map((part, i) =>
                          part.bold
                            ? <strong key={i} className="font-black text-primary">{part.text}</strong>
                            : <span key={i}>{part.text}</span>
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        <p className="border-t border-border pt-3 text-center text-[11px] italic text-muted-foreground">
          Les <strong className="text-primary">parties irrégulières</strong> apparaissent en rouge gras.
        </p>
      </CardContent>
    </Card>
  );
}