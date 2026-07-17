import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { DIFFICULTIES, TENSES, type Difficulty, type Tense } from "@/lib/verbs";
import { DEFAULT_CONFIG, loadConfig, saveConfig, type SessionConfig } from "@/lib/storage";
import { Sparkles, PlayCircle } from "lucide-react";

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
      <section className="mb-6 rounded-2xl p-6 text-primary-foreground shadow-[var(--shadow-soft)]" style={{ background: "var(--gradient-hero)" }}>
        <p className="font-display text-xs font-semibold uppercase tracking-[0.3em] opacity-90">Impariamo l'italiano</p>
        <h1 className="mt-2 font-display text-3xl font-black leading-tight italic">La coniugazione,<br/>senza stress.</h1>
        <p className="mt-3 text-sm opacity-90">Configure ta session, entraîne-toi, progresse.</p>
        <div className="mt-4 h-1 w-24 rounded-full" style={{ background: "var(--gradient-tricolore)" }} />
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
              <label key={t.id} className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 transition-colors ${on ? "border-primary bg-primary/5" : "border-border"}`}>
                <div>
                  <div className="text-sm font-semibold">{t.fr}</div>
                  <div className="text-xs italic text-muted-foreground">{t.it}</div>
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
    </AppShell>
  );
}
