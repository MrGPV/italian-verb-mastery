import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { loadConfig, loadStats, recordAttempt } from "@/lib/storage";
import { buildSession, isCorrect, type Question } from "@/lib/session";
import { TENSES } from "@/lib/verbs";
import { CheckCircle2, XCircle, Info, ArrowRight, Trophy } from "lucide-react";

export const Route = createFileRoute("/exercise")({
  head: () => ({ meta: [{ title: "Session — Conjuga" }, { name: "robots", content: "noindex" }] }),
  component: Exercise,
});

type State = "input" | "correct" | "wrong";

function Exercise() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [i, setI] = useState(0);
  const [input, setInput] = useState("");
  const [state, setState] = useState<State>("input");
  const [score, setScore] = useState({ ok: 0, ko: 0 });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const qs = buildSession(loadConfig(), loadStats());
    setQuestions(qs);
  }, []);

  const q = questions[i];
  const done = questions.length > 0 && i >= questions.length;
  const tenseLabel = useMemo(() => (q ? TENSES.find((t) => t.id === q.tense) : null), [q]);

  useEffect(() => {
    if (state === "input") inputRef.current?.focus();
  }, [state, i]);

  if (questions.length === 0) {
    return (
      <AppShell>
        <Card><CardContent className="pt-6 text-center text-sm text-muted-foreground">Aucune question disponible avec ces réglages.</CardContent></Card>
      </AppShell>
    );
  }

  if (done) {
    const total = score.ok + score.ko;
    const pct = total ? Math.round((score.ok / total) * 100) : 0;
    return (
      <AppShell>
        <Card className="animate-pop overflow-hidden">
          <div className="p-6 text-center text-primary-foreground" style={{ background: "var(--gradient-hero)" }}>
            <Trophy className="mx-auto h-12 w-12" />
            <h2 className="mt-3 text-2xl font-black">Bravo !</h2>
            <p className="mt-1 opacity-90">Session terminée</p>
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

  const check = () => {
    if (!q || state !== "input" || !input.trim()) return;
    const ok = isCorrect(input, q.answer);
    recordAttempt(q.verb.infinitive, q.tense, q.person, ok);
    setScore((s) => (ok ? { ...s, ok: s.ok + 1 } : { ...s, ko: s.ko + 1 }));
    setState(ok ? "correct" : "wrong");
    if (ok) setTimeout(next, 700);
  };

  const next = () => {
    setState("input");
    setInput("");
    setI((n) => n + 1);
  };

  const progress = ((i) / questions.length) * 100;

  return (
    <AppShell>
      <div className="mb-4 flex items-center gap-3">
        <Progress value={progress} className="h-2" />
        <span className="text-xs font-semibold tabular-nums text-muted-foreground">{i + 1}/{questions.length}</span>
      </div>

      <Card className={`mb-4 overflow-hidden ${state === "wrong" ? "animate-shake" : ""} ${state === "correct" ? "animate-pop" : ""}`}>
        <CardContent className="pt-6">
          <div className="mb-4 flex items-center justify-between text-xs">
            <span className="rounded-full bg-primary/10 px-3 py-1 font-semibold uppercase tracking-wide text-primary">
              {tenseLabel?.fr}
            </span>
            <span className="italic text-muted-foreground">{tenseLabel?.it}</span>
          </div>

          <div className="mb-6 text-center">
            <div className="text-4xl font-black tracking-tight text-foreground">{q.verb.infinitive}</div>
            <div className="mt-1 text-sm italic text-muted-foreground">« {q.verb.french} »</div>
          </div>

          <div className="mb-2 text-center text-sm font-medium text-muted-foreground">Conjugue avec :</div>
          <div className="mb-5 text-center text-2xl font-bold text-accent-foreground">
            <span className="rounded-lg bg-accent/60 px-3 py-1">{q.subject}</span>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); state === "input" ? check() : next(); }}>
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={state !== "input"}
              placeholder="Ta réponse..."
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              className={`h-14 text-center text-xl font-semibold transition-colors ${
                state === "correct" ? "border-success bg-success/10 text-success" :
                state === "wrong" ? "border-destructive bg-destructive/10 text-destructive" : ""
              }`}
            />

            {state === "input" && (
              <Button type="submit" size="lg" className="mt-4 h-14 w-full text-base font-bold" disabled={!input.trim()}>
                Vérifier
              </Button>
            )}

            {state === "correct" && (
              <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-success/10 py-3 font-bold text-success">
                <CheckCircle2 className="h-5 w-5" /> Bravo !
              </div>
            )}

            {state === "wrong" && (
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-2 rounded-xl bg-destructive/10 p-3 text-destructive">
                  <XCircle className="h-5 w-5 shrink-0" />
                  <div className="text-sm">
                    <div className="font-semibold">Bonne réponse :</div>
                    <div className="text-lg font-black text-foreground">{q.answer}</div>
                  </div>
                </div>
                {q.verb.notes?.[q.tense] && (
                  <div className="rounded-xl border border-accent/40 bg-accent/10 p-3">
                    <div className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-accent-foreground">
                      <Info className="h-3.5 w-3.5" /> Explication
                    </div>
                    <p className="text-sm text-foreground">{q.verb.notes[q.tense]}</p>
                  </div>
                )}
                <Button type="submit" size="lg" className="h-14 w-full text-base font-bold">
                  Continuer <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
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