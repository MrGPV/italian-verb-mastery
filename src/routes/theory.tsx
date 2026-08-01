import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  TENSES, VERBS, PERSONS, regularReference,
  type Person, type Tense,
} from "@/lib/verbs";

export const Route = createFileRoute("/theory")({
  head: () => ({
    meta: [
      { title: "Théorie — Il Giardino dei Verbi" },
      { name: "description", content: "Théorie de la conjugaison italienne : chaque temps expliqué." },
    ],
  }),
  component: Theory,
});

type Cell = string | null;
type Table = {
  cols: string[];
  rows: { label: string; cells: Cell[] }[];
};
type ExCell = { text: string; hl?: boolean } | null;

type Block = {
  usage: string;
  when: string;
  examples?: string;
  formula?: string;
  table?: Table;
  extraLines?: string[];
};

const P = ["io", "tu", "lui/lei", "noi", "voi", "loro"];

const THEORY: Partial<Record<Tense, Block>> = {
  infinitivo: {
    usage: "Forme non conjuguée du verbe. Trois terminaisons : -are, -ere, -ire.",
    when: "« Voglio mangiare. » « Per fare tutto ci vuole tempo. »",
    examples: "parlare, vedere, sentire, mangiare, dormire.",
    table: {
      cols: ["-are", "-ere", "-ire"],
      rows: [{ label: "exemples", cells: ["parlare, mangiare", "vedere, prendere", "sentire, dormire"] }],
    },
  },
  presente: {
    usage: "Action au moment présent ou vérité générale.",
    when: "« Mangio una mela. » « Piove spesso qui. »",
    examples: "parlare, vendere, sentire, finire (isc).",
    table: {
      cols: ["-are (parl-)", "-ere (vend-)", "-ire (sent-)", "-ire isc (fin-)"],
      rows: [
        { label: P[0], cells: ["-o", "-o", "-o", "-isco"] },
        { label: P[1], cells: ["-i", "-i", "-i", "-isci"] },
        { label: P[2], cells: ["-a", "-e", "-e", "-isce"] },
        { label: P[3], cells: ["-iamo", "-iamo", "-iamo", "-iamo"] },
        { label: P[4], cells: ["-ate", "-ete", "-ite", "-ite"] },
        { label: P[5], cells: ["-ano", "-ono", "-ono", "-iscono"] },
      ],
    },
  },
  presente_progressivo: {
    usage: "Action en cours (« être en train de… »).",
    when: "« Sto mangiando. » « Stiamo lavorando. »",
    examples: "sto parlando, stai vedendo, sta dormendo.",
    formula: "stare (au présent) + gérondif du verbe.",
    table: {
      cols: ["-are → -ando", "-ere → -endo", "-ire → -endo"],
      rows: [{ label: "gérondif", cells: ["parlando", "vedendo", "sentendo"] }],
    },
  },
  passato_prossimo: {
    usage: "Action passée, terminée, souvent récente. Équivalent du passé composé.",
    when: "« Ho mangiato una mela. » « Sono andato al mare. »",
    examples: "parlare → ho parlato · vendere → ho venduto · dormire → ho dormito.",
    formula: "avere ou essere (au présent) + participe passé.",
    table: {
      cols: ["-are → -ato", "-ere → -uto", "-ire → -ito"],
      rows: [{ label: "part. passé", cells: ["parlato", "venduto", "sentito"] }],
    },
    extraLines: [
      "Auxiliaire essere : mouvement/état + réfléchis. Le participe s'accorde en genre et nombre.",
      "Auxiliaire avere : verbes transitifs. Pas d'accord avec le sujet.",
      "Voir les participes irréguliers dans la section « Participe passé ».",
    ],
  },
  imperfetto: {
    usage: "Description dans le passé, habitude, action en cours.",
    when: "« Da piccolo, mangiavo la pizza ogni giorno. »",
    examples: "parlare, vendere, sentire.",
    table: {
      cols: ["-are", "-ere", "-ire"],
      rows: [
        { label: P[0], cells: ["-avo", "-evo", "-ivo"] },
        { label: P[1], cells: ["-avi", "-evi", "-ivi"] },
        { label: P[2], cells: ["-ava", "-eva", "-iva"] },
        { label: P[3], cells: ["-avamo", "-evamo", "-ivamo"] },
        { label: P[4], cells: ["-avate", "-evate", "-ivate"] },
        { label: P[5], cells: ["-avano", "-evano", "-ivano"] },
      ],
    },
  },
  futuro: {
    usage: "Action à venir ou hypothèse forte sur le présent.",
    when: "« Domani mangerò tardi. » « Sarà stanco. »",
    examples: "parlare → parlerò · vedere → vedrò · sentire → sentirò.",
    table: {
      cols: ["-are & -ere (er-)", "-ire (ir-)"],
      rows: [
        { label: P[0], cells: ["-erò", "-irò"] },
        { label: P[1], cells: ["-erai", "-irai"] },
        { label: P[2], cells: ["-erà", "-irà"] },
        { label: P[3], cells: ["-eremo", "-iremo"] },
        { label: P[4], cells: ["-erete", "-irete"] },
        { label: P[5], cells: ["-eranno", "-iranno"] },
      ],
    },
  },
  condizionale: {
    usage: "Politesse, souhait, conseil, hypothèse.",
    when: "« Vorrei un caffè. » « Dovresti dormire di più. »",
    examples: "parlare → parlerei · vedere → vedrei · sentire → sentirei.",
    table: {
      cols: ["-are & -ere", "-ire"],
      rows: [
        { label: P[0], cells: ["-erei", "-irei"] },
        { label: P[1], cells: ["-eresti", "-iresti"] },
        { label: P[2], cells: ["-erebbe", "-irebbe"] },
        { label: P[3], cells: ["-eremmo", "-iremmo"] },
        { label: P[4], cells: ["-ereste", "-ireste"] },
        { label: P[5], cells: ["-erebbero", "-irebbero"] },
      ],
    },
  },
  congiuntivo: {
    usage: "Subjonctif : doute, souhait, opinion, subordonnées après « che ».",
    when: "« Penso che tu parli bene. » « Voglio che senta questa canzone. »",
    examples: "parlare, vendere, sentire, finire (isc).",
    table: {
      cols: ["-are (parl-)", "-ere (vend-)", "-ire (sent-)", "-ire isc (fin-)"],
      rows: [
        { label: P[0], cells: ["-i", "-a", "-a", "-isca"] },
        { label: P[1], cells: ["-i", "-a", "-a", "-isca"] },
        { label: P[2], cells: ["-i", "-a", "-a", "-isca"] },
        { label: P[3], cells: ["-iamo", "-iamo", "-iamo", "-iamo"] },
        { label: P[4], cells: ["-iate", "-iate", "-iate", "-iate"] },
        { label: P[5], cells: ["-ino", "-ano", "-ano", "-iscano"] },
      ],
    },
  },
  imperativo: {
    usage: "Donner un ordre, un conseil, une consigne.",
    when: "« Mangia! » « Andiamo! » « Ascoltate! »",
    examples: "parlare, vendere, sentire.",
    table: {
      cols: ["-are", "-ere", "-ire"],
      rows: [
        { label: "(tu)", cells: ["-a", "-i", "-i / -isci"] },
        { label: "(noi)", cells: ["-iamo", "-iamo", "-iamo"] },
        { label: "(voi)", cells: ["-ate", "-ete", "-ite"] },
      ],
    },
    extraLines: ["Négatif 2ᵉ p. sing. : non + infinitif (« non parlare! »)."],
  },
  participio: {
    usage: "Sert à composer les temps composés et peut aussi être un adjectif.",
    when: "« Ho parlato. » « Sono arrivato. »",
    examples: "parlare → parlato · vendere → venduto · sentire → sentito.",
    table: {
      cols: ["-are → -ato", "-ere → -uto", "-ire → -ito"],
      rows: [{ label: "part. passé", cells: ["parlato", "venduto", "sentito"] }],
    },
  },
  gerundio: {
    usage: "Équivalent du gérondif français (« en …ant »).",
    when: "« Leggendo si impara. » « Camminando ho incontrato Marco. »",
    examples: "parlare → parlando · vedere → vedendo · sentire → sentendo.",
    table: {
      cols: ["-are → -ando", "-ere → -endo", "-ire → -endo"],
      rows: [{ label: "gérondif", cells: ["parlando", "vedendo", "sentendo"] }],
    },
  },
};

// ---- Exception detection: compute directly from the verb database ----

type FiniteRow = { label: string; cells: ExCell[] };
type FiniteGrid = { verbs: string[]; rows: FiniteRow[] };

// Persons per tense
const FINITE_TENSES: Tense[] = [
  "presente", "imperfetto", "futuro", "condizionale", "congiuntivo",
];
const IMP_PERSONS: Person[] = ["tu", "noi", "voi"];

function chunk<T>(a: T[], n: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < a.length; i += n) out.push(a.slice(i, i + n));
  return out;
}

function collectFinite(tense: Tense, persons: Person[]): { verb: string; cells: ExCell[] }[] {
  const out: { verb: string; cells: ExCell[] }[] = [];
  for (const v of VERBS) {
    if (v.difficulty === "riflessivo") continue;
    const actual = v.conj[tense];
    if (!actual) continue;
    const reg = regularReference(v)[tense];
    if (!reg) continue;
    let anyDiff = false;
    const cells: ExCell[] = persons.map((p) => {
      const a = actual[p];
      const rr = reg[p];
      if (!a) return null;
      if (a !== rr) { anyDiff = true; return { text: a, hl: true }; }
      return { text: a };
    });
    if (anyDiff) out.push({ verb: v.infinitive, cells });
  }
  return out;
}

function collectSimple(tense: "participio" | "gerundio"): { verb: string; form: string }[] {
  const out: { verb: string; form: string }[] = [];
  for (const v of VERBS) {
    if (v.difficulty === "riflessivo") continue;
    const a = v.conj[tense]?.lui ?? (tense === "participio" ? v.participle : "");
    const rr = regularReference(v)[tense]?.lui ?? "";
    if (a && rr && a !== rr) out.push({ verb: v.infinitive, form: a });
  }
  return out;
}

function buildGrids(tense: Tense, persons: Person[], perTable = 5): FiniteGrid[] {
  const items = collectFinite(tense, persons);
  return chunk(items, perTable).map((group) => ({
    verbs: group.map((g) => g.verb),
    rows: persons.map((p, i) => ({
      label: p === "lui" ? "lui/lei" : p,
      cells: group.map((g) => g.cells[i]),
    })),
  }));
}

function buildImperativoGrids(perTable = 5): FiniteGrid[] {
  const items = collectFinite("imperativo", IMP_PERSONS);
  return chunk(items, perTable).map((group) => ({
    verbs: group.map((g) => g.verb),
    rows: IMP_PERSONS.map((p, i) => ({
      label: `(${p})`,
      cells: group.map((g) => g.cells[i]),
    })),
  }));
}

function gridsForTense(tense: Tense): FiniteGrid[] {
  if (FINITE_TENSES.includes(tense)) return buildGrids(tense, PERSONS);
  if (tense === "imperativo") return buildImperativoGrids();
  return [];
}

function listForTense(tense: Tense): { verb: string; form: string }[] {
  if (tense === "participio") return collectSimple("participio");
  if (tense === "gerundio" || tense === "presente_progressivo") return collectSimple("gerundio");
  return [];
}

function Theory() {
  const [hidden, setHidden] = useState<Set<Tense>>(new Set());
  const toggle = (t: Tense) =>
    setHidden((prev) => { const n = new Set(prev); if (n.has(t)) n.delete(t); else n.add(t); return n; });

  return (
    <AppShell>
      <section className="mb-4 flex items-center gap-2">
        <Button asChild variant="ghost" size="icon" aria-label="Retour">
          <Link to="/"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <div>
          <h1 className="font-display text-2xl font-black italic text-foreground">Théorie</h1>
          <p className="text-xs text-muted-foreground">L'essentiel de la conjugaison, temps par temps.</p>
        </div>
      </section>

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
                  onClick={() => toggle(t.id)}
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

      <div className="space-y-3">
        {TENSES.filter((t) => !hidden.has(t.id)).map((t) => {
          const b = THEORY[t.id];
          if (!b) return null;
          const grids = gridsForTense(t.id);
          const list = listForTense(t.id);
          return (
            <Card key={t.id} className="overflow-hidden">
              <CardContent className="space-y-3 pt-5">
                <div className={`tense-chip tense-chip-lg tense-${t.id} w-full justify-center`}>
                  <span className="font-display font-black">{t.fr}</span>
                  <span className="opacity-70">·</span>
                  <span className="font-display italic font-semibold normal-case tracking-normal">{t.it}</span>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">À quoi ça sert</div>
                  <p className="text-sm text-foreground">{b.usage}</p>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Quand l'utiliser</div>
                  <p className="text-sm italic text-foreground">{b.when}</p>
                  {b.examples && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      <span className="font-bold uppercase tracking-wide">Ex. réguliers : </span>
                      <span className="italic">{b.examples}</span>
                    </p>
                  )}
                </div>
                <div>
                  <div className="mb-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">Formation</div>
                  {b.formula && (
                    <p className="mb-2 text-sm text-foreground">
                      <span className="font-bold">Formule : </span>{b.formula}
                    </p>
                  )}
                  {b.table && (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-xs">
                        <thead>
                          <tr>
                            <th className="border border-border/60 bg-muted/50 p-1.5 text-left font-bold"></th>
                            {b.table.cols.map((c, i) => (
                              <th key={i} className={`border border-border/60 p-1.5 text-center tense-${t.id}`}>
                                <span className="font-black tracking-wide">{c}</span>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {b.table.rows.map((row, i) => (
                            <tr key={i}>
                              <td className="border border-border/60 bg-muted/30 p-1.5 text-right text-[11px] font-bold text-muted-foreground">
                                {row.label}
                              </td>
                              {row.cells.map((c, j) => (
                                <td key={j} className="border border-border/60 p-1.5 text-center font-semibold text-foreground">
                                  {c ?? "—"}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {b.extraLines?.map((line, i) => (
                    <p key={i} className="mt-2 text-xs text-foreground">{line}</p>
                  ))}
                </div>

                {grids.length > 0 && (
                  <div className="space-y-5 rounded-lg border border-destructive/30 bg-destructive/5 p-2">
                    <div className="text-xs font-bold uppercase tracking-wide text-destructive">
                      Exceptions notoires ({collectFinite(t.id, t.id === "imperativo" ? IMP_PERSONS : PERSONS).length})
                    </div>
                    {grids.map((g, gi) => (
                      <div
                        key={gi}
                        className="overflow-x-auto rounded-md border-2 border-destructive/25 bg-card/70 p-1.5 shadow-[var(--shadow-soft)]"
                      >
                        <table className="w-full border-collapse text-xs">
                          <thead>
                            <tr>
                              <th className="border border-border/60 bg-muted/40 p-1.5"></th>
                              {g.verbs.map((v, i) => (
                                <th key={i} className="border border-border/60 bg-muted/40 p-1.5 text-center">
                                  <span className="font-display text-sm font-black italic text-foreground">{v}</span>
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {g.rows.map((row, i) => (
                              <tr key={i}>
                                <td className="border border-border/60 bg-muted/30 p-1.5 text-right text-[11px] font-bold text-muted-foreground">
                                  {row.label}
                                </td>
                                {row.cells.map((c, j) => (
                                  <td key={j} className="border border-border/60 p-1.5 text-center">
                                    {c === null ? (
                                      <span className="text-muted-foreground">—</span>
                                    ) : c.hl ? (
                                      <strong className="font-black text-destructive">{c.text}</strong>
                                    ) : (
                                      <span className="text-foreground">{c.text}</span>
                                    )}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ))}
                  </div>
                )}

                {list.length > 0 && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-2">
                    <div className="mb-1.5 text-xs font-bold uppercase tracking-wide text-destructive">
                      Exceptions notoires ({list.length})
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-xs">
                        <thead>
                          <tr>
                            <th className="border border-border/60 bg-muted/40 p-1.5 text-left font-bold">Infinitif</th>
                            <th className="border border-border/60 bg-muted/40 p-1.5 text-left font-bold">Forme irrégulière</th>
                          </tr>
                        </thead>
                        <tbody>
                          {list.map((row, i) => (
                            <tr key={i}>
                              <td className="border border-border/60 p-1.5">
                                <span className="font-display italic font-semibold text-foreground">{row.verb}</span>
                              </td>
                              <td className="border border-border/60 p-1.5">
                                <strong className="font-black text-destructive">{row.form}</strong>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
}