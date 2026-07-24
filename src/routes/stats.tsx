import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { loadStats, resetStats, type StatsMap } from "@/lib/storage";
import { VERBS, findVerb } from "@/lib/verbs";
import { Trash2, TrendingUp, Target } from "lucide-react";

export const Route = createFileRoute("/stats")({
  head: () => ({ meta: [{ title: "Statistiques — Il Giardino dei Verbi" }, { name: "robots", content: "noindex" }] }),
  component: Stats,
});

function Stats() {
  const [stats, setStats] = useState<StatsMap>({});
  useEffect(() => setStats(loadStats()), []);

  const verbRows = VERBS.map((v) => {
    const s = stats[v.infinitive] || { ok: 0, ko: 0, lastSeen: 0 };
    const total = s.ok + s.ko;
    const rate = total ? Math.round((s.ok / total) * 100) : null;
    return { verb: v, ...s, total, rate };
  })
    .filter((r) => r.total > 0)
    .sort((a, b) => (a.rate ?? 100) - (b.rate ?? 100) || b.total - a.total);

  const totalOk = verbRows.reduce((a, r) => a + r.ok, 0);
  const totalKo = verbRows.reduce((a, r) => a + r.ko, 0);
  const totalAll = totalOk + totalKo;
  const globalRate = totalAll ? Math.round((totalOk / totalAll) * 100) : 0;

  const handleReset = () => {
    if (confirm("Réinitialiser toutes les statistiques ?")) {
      resetStats();
      setStats({});
    }
  };

  return (
    <AppShell>
      <section className="mb-6 rounded-2xl p-6 text-primary-foreground shadow-[var(--shadow-soft)]" style={{ background: "var(--gradient-hero)" }}>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest opacity-80">
          <TrendingUp className="h-4 w-4" /> Ton score global
        </div>
        <div className="mt-2 flex items-end gap-3">
          <div className="text-6xl font-black leading-none">{globalRate}%</div>
          <div className="pb-1 text-sm opacity-90">de réussite</div>
        </div>
        <div className="mt-3 flex gap-4 text-sm">
          <span>✓ {totalOk} bonnes</span>
          <span>✗ {totalKo} erreurs</span>
        </div>
      </section>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="flex items-center gap-2 text-base">
            <Target className="h-4 w-4" /> Détail par verbe
          </CardTitle>
          {verbRows.length > 0 && (
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {verbRows.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Pas encore de statistiques. Fais une session pour voir tes progrès !</p>
          ) : (
            <ul className="space-y-2">
              {verbRows.map((r) => {
                const rate = r.rate ?? 0;
                const color = rate >= 80 ? "text-success" : rate >= 50 ? "text-primary" : "text-destructive";
                const bar = rate >= 80 ? "bg-success" : rate >= 50 ? "bg-primary" : "bg-destructive";
                return (
                  <li key={r.verb.infinitive} className="rounded-xl border border-border bg-card p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="min-w-0">
                        <div className="truncate font-semibold capitalize">{r.verb.infinitive}</div>
                        <div className="truncate text-xs italic text-muted-foreground">{r.verb.french}</div>
                      </div>
                      <div className="shrink-0 text-right">
                        <div className={`text-lg font-black tabular-nums ${color}`}>{rate}%</div>
                        <div className="text-xs text-muted-foreground">{r.ok}/{r.total}</div>
                      </div>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div className={`h-full transition-all ${bar}`} style={{ width: `${rate}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}