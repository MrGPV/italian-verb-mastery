import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { loadConfig, loadStats, recordAttempt } from "@/lib/storage";
import { buildSession, isCorrectQ, bestReference, type Item } from "@/lib/session";
import { PERSON_LABEL, TENSES, diffParts } from "@/lib/verbs";
import { CheckCircle2, XCircle, BookOpen, ArrowRight, Trophy } from "lucide-react";

export const Route = createFileRoute("/exercise")({
  head: () => ({ meta: [{ title: "Session — Il Giardino dei Verbi" }, { name: "robots", content: "noindex" }] }),
  component: Exercise,
});

type ItemState = "input" | "checked";
const ACCENTS = ["à", "è", "é", "ì", "ò", "ù"];
// Order tuned so a 2-column grid shows singular on the left, plural on the right.
const PERSON_ORDER_2COL = ["io", "noi", "tu", "voi", "lui", "loro"] as const;

function Exercise() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [i, setI] = useState(0);
  const [inputs, setInputs] = useState<string[]>([]);
  const [state, setState] = useState<ItemState>("input");
  const [results, setResults] = useState<boolean[]>([]);
  const [score, setScore] = useState({ ok: 0, ko: 0 });
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const focusedIdx = useRef<number>(0);

  useEffect(() => {
    const its = buildSession(loadConfig(), loadStats());
    setItems(its);
    if (its[0]) setInputs(new Array(its[0].questions.length).fill(""));
  }, []);

  const item = items[i];
  const done = items.length > 0 && i >= items.length;
  const tenseLabel = useMemo(() => (item ? TENSES.find((t) => t.id === item.tense) : null), [item]);

  useEffect(() => {
    if (state === "input") {
      const first = inputRefs.current[0];
      first?.focus();
      focusedIdx.current = 0;
    }
  }, [state, i]);

  if (items.length === 0) {
    return (
      <AppShell bare>
        <Card><CardContent className="pt-6 text-center text-sm text-muted-foreground">Aucune question disponible avec ces réglages.</CardContent></Card>
      </AppShell>
    );
  }

  if (done) {
    const total = score.ok + score.ko;
    const pct = total ? Math.round((score.ok / total) * 100) : 0;
    return (
      <AppShell bare>
        <Card className="animate-pop overflow-hidden">
          <div className="tricolore-bar" />
          <div className="p-6 text-center">
            <Trophy className="mx-auto h-12 w-12 text-primary" />
            <h2 className="mt-3 font-display text-3xl font-black italic text-foreground">Bravissimo !</h2>
            <p className="mt-1 italic text-muted-foreground">Sessione completata</p>
          </div>
          <CardContent className="space-y-4 pt-6 text-center">
            <div className="text-5xl font-black text-foreground">{pct}%</div>
            <p className="text-sm text-muted-foreground">{score.ok} bonnes réponses sur {total}</p>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => navigate({ to: "/" })}>Accueil</Button>
              <Button className="flex-1" onClick={() => navigate({ to: "/stats" })}>Voir les stats</Button>
            </div>
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  const allFilled = inputs.every((v) => v.trim().length > 0);

  const check = () => {
    if (!item || state !== "input" || !allFilled) return;
    const res = item.questions.map((q, k) => isCorrectQ(inputs[k], q));
    res.forEach((ok, k) => {
      const q = item.questions[k];
      recordAttempt(q.verb.infinitive, q.tense, q.person, ok);
    });
    const okCount = res.filter(Boolean).length;
    setScore((s) => ({ ok: s.ok + okCount, ko: s.ko + (res.length - okCount) }));
    setResults(res);
    setState("checked");
    if (res.every(Boolean)) setTimeout(next, 800);
  };

  const next = () => {
    const nextIdx = i + 1;
    setState("input");
    setResults([]);
    setInputs(items[nextIdx] ? new Array(items[nextIdx].questions.length).fill("") : []);
    setI(nextIdx);
  };

  const insertAccent = (ch: string) => {
    const idx = focusedIdx.current;
    const el = inputRefs.current[idx];
    if (!el || state !== "input") return;
    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? start;
    const cur = inputs[idx] ?? "";
    const next = cur.slice(0, start) + ch + cur.slice(end);
    setInputs((arr) => arr.map((v, k) => (k === idx ? next : v)));
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + ch.length;
      el.setSelectionRange(pos, pos);
    });
  };

  const progress = ((i) / items.length) * 100;
  const allCorrect = state === "checked" && results.every(Boolean);
  const firstQ = item.questions[0];
  const isInfinitivo = item.tense === "infinitivo";
  const bigDisplay = firstQ.prompt ?? item.verb.infinitive;
  const hideFrench = firstQ.hideFrench;

  return (
    <AppShell bare>
      <div className="mb-3 flex items-center gap-3 pr-11">
        <Progress value={progress} className="h-2" />
        <span className="text-xs font-semibold tabular-nums text-muted-foreground">{i + 1}/{items.length}</span>
      </div>

      <Card className={`mb-4 overflow-hidden ${state === "checked" && !allCorrect ? "animate-shake" : ""} ${allCorrect ? "animate-pop" : ""}`}>
        <div className="tricolore-bar" />
        <CardContent className="pt-6">
          <div className={`tense-chip tense-chip-lg tense-${item.tense} mb-5 w-full justify-center text-center shadow-sm`}>
            <span className="font-display font-black">{tenseLabel?.fr}</span>
            <span className="opacity-70">·</span>
            <span className="font-display italic font-semibold normal-case tracking-normal">{tenseLabel?.it}</span>
          </div>

          <div className="mb-6 text-center">
            <div className="font-display text-4xl font-black tracking-tight text-foreground">{bigDisplay}</div>
            {!hideFrench && (
              <div className="mt-1 text-sm italic text-muted-foreground">« {item.verb.french} »</div>
            )}
            {firstQ.directionLabel && (
              <div className="mt-2 text-sm font-semibold text-primary">{firstQ.directionLabel}</div>
            )}
          </div>

          {item.kind === "complet" && !isInfinitivo && (
            <div className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Conjugue les 6 personnes
            </div>
          )}

          <form autoComplete="off" onSubmit={(e) => { e.preventDefault(); state === "input" ? check() : next(); }}>
            <div className="space-y-2">
              {item.questions.map((q, k) => {
                const checked = state === "checked";
                const ok = results[k];
                const border = !checked ? "" : ok ? "border-success bg-success/10" : "border-destructive bg-destructive/10";
                const ref = checked && !ok ? bestReference(inputs[k] ?? "", q) : q.answer;
                return (
                  <div key={k} className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2">
                    <div className="text-right">
                      <span className="block whitespace-nowrap rounded-md bg-accent/50 px-2 py-1 text-sm font-bold" style={{ color: "oklch(0.32 0.12 148)" }}>
                        {q.subject}
                      </span>
                    </div>
                    <div>
                      <Input
                        ref={(el) => { inputRefs.current[k] = el; }}
                        value={inputs[k] ?? ""}
                        onChange={(e) => setInputs((arr) => arr.map((v, j) => (j === k ? e.target.value : v)))}
                        onFocus={() => { focusedIdx.current = k; }}
                        disabled={checked}
                        placeholder="…"
                        type="text"
                        name={`risposta-${k}`}
                        inputMode="text"
                        enterKeyHint="done"
                        autoComplete="off"
                        autoCorrect="off"
                        data-form-type="other"
                        data-lpignore="true"
                        data-1p-ignore
                        autoCapitalize="none"
                        spellCheck={false}
                        className={`h-11 text-base font-semibold transition-colors ${border}`}
                      />
                      {checked && !ok && (
                        <div className="mt-1 space-y-0.5 pl-1 text-xs">
                          <div className="flex items-center gap-1">
                            <XCircle className="h-3.5 w-3.5 text-destructive shrink-0" />
                            <span className="text-muted-foreground">Ta réponse :</span>
                            <span className="font-semibold">
                              {diffParts(inputs[k] ?? "", ref).map((part, i) =>
                                part.bold
                                  ? <span key={i} className="rounded bg-destructive/25 px-0.5 font-bold text-destructive">{part.text}</span>
                                  : <span key={i}>{part.text}</span>
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" />
                            <span className="text-muted-foreground">Correct :</span>
                            <span className="font-bold text-foreground">
                              {diffParts(ref, inputs[k] ?? "").map((part, i) =>
                                part.bold
                                  ? <span key={i} className="rounded bg-success/25 px-0.5 text-success">{part.text}</span>
                                  : <span key={i}>{part.text}</span>
                              )}
                            </span>
                            {(q.alternates?.length ?? 0) > 0 && (
                              <span className="ml-1 text-muted-foreground">
                                (aussi&nbsp;: {[q.answer, ...(q.alternates ?? [])].filter((a) => a !== ref).join(", ")})
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {state === "input" && (
              <>
                <div className="mt-4 flex justify-center gap-1.5">
                  {ACCENTS.map((ch) => (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => insertAccent(ch)}
                      className="h-10 w-10 rounded-lg border border-border bg-card text-lg font-bold text-foreground shadow-sm transition-colors hover:border-primary hover:bg-primary/10 active:scale-95"
                      aria-label={`Insérer ${ch}`}
                    >
                      {ch}
                    </button>
                  ))}
                </div>
                <Button type="submit" size="lg" className="mt-4 h-14 w-full text-base font-bold" disabled={!allFilled}>
                  Vérifier
                </Button>
              </>
            )}

            {state === "checked" && allCorrect && (
              <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-success/10 py-3 font-bold text-success">
                <CheckCircle2 className="h-5 w-5" /> Bravissimo !
              </div>
            )}

            {state === "checked" && !allCorrect && !isInfinitivo && (
              <div className="mt-4 space-y-3">
                <div className="rounded-xl border border-accent/40 bg-accent/10 p-3">
                  <div className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-foreground">
                    <BookOpen className="h-3.5 w-3.5" />
                    Conjugaison — <span className="italic">{item.verb.infinitive}</span> · {tenseLabel?.it}
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                    {PERSON_ORDER_2COL.map((p) => {
                      const ans = item.verb.conj[item.tense]?.[p];
                      if (!ans) return null;
                      const label =
                        item.tense === "participio" || item.tense === "gerundio"
                          ? "→"
                          : item.tense === "imperativo"
                          ? `(${p})`
                          : PERSON_LABEL[p];
                      return (
                        <div key={p} className="flex items-baseline gap-2">
                          <span className="w-14 shrink-0 text-right text-xs font-semibold text-muted-foreground">{label}</span>
                          <span className="font-semibold text-foreground">{ans}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <Button type="submit" size="lg" className="h-14 w-full text-base font-bold">
                  Continuer <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}

            {state === "checked" && !allCorrect && isInfinitivo && (
              <Button type="submit" size="lg" className="mt-4 h-14 w-full text-base font-bold">
                Continuer <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      <div className="flex justify-center gap-4 text-xs text-muted-foreground">
        <span>✓ {score.ok}</span>
        <span>✗ {score.ko}</span>
      </div>
    </AppShell>
  );
}