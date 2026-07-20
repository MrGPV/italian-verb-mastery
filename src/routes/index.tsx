import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { DIFFICULTIES, TENSES, type Difficulty, type Tense } from "@/lib/verbs";
import { DEFAULT_CONFIG, loadConfig, saveConfig, type SessionConfig } from "@/lib/storage";
import { Sparkles, PlayCircle, BookOpen, GraduationCap } from "lucide-react";

export const Route = createFileRoute("/")({ component: Index });

function Index() {
  const navigate = useNavigate();
  const [cfg, setCfg] = useState<SessionConfig>(DEFAULT_CONFIG);
  useEffect(() => setCfg(loadConfig()), []);

  const toggleDiff = (d: Difficulty) =>
    setCfg((c) => ({
      ...c,
      difficulties: c.difficulties.includes(d) ? c.difficulties.filter((x) => x !== d) : [...c.difficulties, d],
    }));
  const toggleTense = (t: Tense) =>
    setCfg((c) => ({
      ...c,
      tenses: c.tenses.includes(t) ? c.tenses.filter((x) => x !== t) : [...c.tenses, t],
    }));

  const canStart = cfg.difficulties.length > 0 && cfg.tenses.length > 0;
  const start = () => {
    saveConfig(cfg);
    navigate({ to: "/exercise" });
  };

  return (
    <AppShell>
      <section className="relative mb-6 overflow-hidden rounded-2xl border border-border/60 bg-card p-6 shadow-[var(--shadow-soft)]">
        <div className="tricolore-bar absolute inset-x-0 top-0" />
        <div className="absolute inset-y-0 left-0 w-1.5" style={{ background: "var(--tricolore-green)" }} />
        <p className="mt-2 font-display text-xs font-semibold uppercase tracking-[0.3em] text-primary">Impariamo l'italiano</p>
        <h1 className="mt-2 font-display text-3xl font-black leading-tight italic text-foreground">La coniugazione,<br/><span className="text-primary">senza stress.</span></h1>
        <p className="mt-3 text-sm text-muted-foreground">Configure ta session, entraîne-toi, progresse.</p>
        <div className="mt-4 h-1.5 w-28 rounded-full" style={{ background: "var(--gradient-tricolore)" }} />
      </section>

      <Card className="mb-4">
        <CardHeader><CardTitle className="text-base">Niveau des verbes</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-2">
          {DIFFICULTIES.map((d) => {
            const on = cfg.difficulties.includes(d.id);
            return (
              <button
                key={d.id}
                onClick={() => toggleDiff(d.id)}
                className={`rounded-xl border-2 p-3 text-left text-sm font-medium transition-all ${on ? "border-primary bg-primary/10 text-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/40"}`}
              >
                {d.label}
              </button>
            );
          })}
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader><CardTitle className="text-base">Temps</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {TENSES.map((t) => {
            const on = cfg.tenses.includes(t.id);
            return (
              <label
                key={t.id}
                className={`tense-${t.id} flex cursor-pointer items-center justify-between rounded-xl border-2 p-3 transition-all ${on ? "border-current shadow-sm" : "border-transparent opacity-60 hover:opacity-100"}`}
                style={{ textTransform: "none", letterSpacing: 0 }}
              >
                <div className="normal-case tracking-normal">
                  <div className="text-sm font-bold">{t.fr}</div>
                  <div className="font-display text-xs italic opacity-80">{t.it}</div>
                </div>
                <Checkbox checked={on} onCheckedChange={() => toggleTense(t.id)} />
              </label>
            );
          })}
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader><CardTitle className="text-base">Volume</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-4 gap-2">
          {[5, 10, 15, 20].map((n) => (
            <button
              key={n}
              onClick={() => setCfg((c) => ({ ...c, count: n as SessionConfig["count"] }))}
              className={`rounded-xl border-2 py-3 text-lg font-bold transition-all ${cfg.count === n ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:border-primary/40"}`}
            >
              {n}
            </button>
          ))}
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader><CardTitle className="text-base">Mode d'exercice</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-2">
          {[
            { id: "complet", title: "Verbe complet", desc: "Les 6 personnes du même verbe" },
            { id: "mixte", title: "Mixte", desc: "Questions aléatoires" },
          ].map((m) => {
            const on = cfg.mode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setCfg((c) => ({ ...c, mode: m.id as SessionConfig["mode"] }))}
                className={`rounded-xl border-2 p-3 text-left transition-all ${on ? "border-primary bg-primary/10" : "border-border bg-card"}`}
              >
                <div className="text-sm font-semibold">{m.title}</div>
                <div className="mt-1 text-xs text-muted-foreground">{m.desc}</div>
              </button>
            );
          })}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardContent className="flex items-center justify-between pt-6">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <Label htmlFor="smart" className="text-sm font-semibold">Entraînement intelligent</Label>
              <p className="text-xs text-muted-foreground">Cible tes points faibles en priorité.</p>
            </div>
          </div>
          <Switch id="smart" checked={cfg.smart} onCheckedChange={(v) => setCfg((c) => ({ ...c, smart: v }))} />
        </CardContent>
      </Card>

      <Button onClick={start} disabled={!canStart} size="lg" className="h-14 w-full text-base font-bold shadow-[var(--shadow-soft)]">
        <PlayCircle className="mr-2 h-5 w-5" />
        Commencer la session
      </Button>
      {!canStart && <p className="mt-2 text-center text-xs text-muted-foreground">Sélectionne au moins un niveau et un temps.</p>}

      <Button asChild variant="outline" size="lg" className="mt-3 h-12 w-full border-2 text-sm font-bold" style={{ borderColor: "var(--tricolore-green)", color: "var(--tricolore-green)" }}>
        <Link to="/dictionary"><BookOpen className="mr-2 h-4 w-4" />Consulter la conjugaison d'un verbe</Link>
      </Button>
      <Button asChild variant="outline" size="lg" className="mt-2 h-12 w-full border-2 text-sm font-bold" style={{ borderColor: "var(--tricolore-red)", color: "var(--tricolore-red)" }}>
        <Link to="/theory"><GraduationCap className="mr-2 h-4 w-4" />Théorie de la conjugaison</Link>
      </Button>
    </AppShell>
  );
}
