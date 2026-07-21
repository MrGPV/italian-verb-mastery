import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { TENSES, type Tense } from "@/lib/verbs";

export const Route = createFileRoute("/theory")({
  head: () => ({
    meta: [
      { title: "Théorie — Conjuga" },
      { name: "description", content: "Théorie de la conjugaison italienne : chaque temps expliqué." },
    ],
  }),
  component: Theory,
});

// A cell can be a string (regular ending) or null (no form for that person).
type Cell = string | null;
type Table = {
  cols: string[];        // column headers e.g. ["-are (parl-)", "-ere (vend-)", "-ire (sent-)"]
  rows: { label: string; cells: Cell[] }[];
};
// Exceptions: each has a verb name and its irregular forms with the diverging
// substring highlighted (bold).
type ExceptionForm = { label: string; before: string; bold: string; after: string };
type Exception = { verb: string; forms: ExceptionForm[] };

type Block = {
  usage: string;
  when: string;
  examples?: string;           // regular verbs illustrating the rule
  formula?: string;            // composite tenses (no simple ending table)
  table?: Table;
  extraLines?: string[];       // free-form extra rules alongside the table
  exceptions?: Exception[];
};

const P = ["io", "tu", "lui/lei", "noi", "voi", "loro"];

const THEORY: Record<Tense, Block> = {
  infinitivo: {
    usage: "Forme non conjuguée du verbe (« manger », « partir »…).",
    when: "Après un autre verbe (voglio mangiare), après une préposition (per fare).",
    examples: "parlare, vedere, sentire, mangiare, dormire.",
    table: {
      cols: ["-are", "-ere", "-ire"],
      rows: [{ label: "exemples", cells: ["parlare, mangiare", "vedere, prendere", "sentire, dormire"] }],
    },
    exceptions: [
      { verb: "verbes réfléchis", forms: [{ label: "inf.", before: "alza", bold: "rsi", after: "" }, { label: "inf.", before: "mette", bold: "rsi", after: "" }] },
    ],
  },
  presente: {
    usage: "Action au moment présent ou vérité générale.",
    when: "« Je mange une pomme », « Il pleut souvent ici ».",
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
    exceptions: [
      { verb: "essere", forms: [{ label: "io", before: "", bold: "sono", after: "" }, { label: "tu", before: "", bold: "sei", after: "" }, { label: "lui", before: "", bold: "è", after: "" }] },
      { verb: "avere", forms: [{ label: "io", before: "", bold: "ho", after: "" }, { label: "tu", before: "", bold: "hai", after: "" }, { label: "loro", before: "", bold: "hanno", after: "" }] },
      { verb: "andare", forms: [{ label: "io", before: "", bold: "vado", after: "" }, { label: "loro", before: "", bold: "vanno", after: "" }] },
      { verb: "fare", forms: [{ label: "io", before: "", bold: "faccio", after: "" }, { label: "loro", before: "", bold: "fanno", after: "" }] },
    ],
  },
  presente_progressivo: {
    usage: "Action en cours (« être en train de… »).",
    when: "« Sto mangiando » = je suis en train de manger.",
    examples: "sto parlando, stai vedendo, sta dormendo.",
    formula: "stare (au présent) + gérondif du verbe.",
    table: {
      cols: ["-are → -ando", "-ere → -endo", "-ire → -endo"],
      rows: [{ label: "gérondif", cells: ["parlando", "vedendo", "sentendo"] }],
    },
    exceptions: [
      { verb: "fare", forms: [{ label: "gér.", before: "fa", bold: "cendo", after: "" }] },
      { verb: "dire", forms: [{ label: "gér.", before: "di", bold: "cendo", after: "" }] },
      { verb: "bere", forms: [{ label: "gér.", before: "be", bold: "vendo", after: "" }] },
    ],
  },
  passato_prossimo: {
    usage: "Action passée, terminée, souvent récente. Équivalent du passé composé.",
    when: "« Ho mangiato una mela », « Sono andato al mare ».",
    examples: "parlare → ho parlato · vendere → ho venduto · dormire → ho dormito.",
    formula: "avere ou essere (au présent) + participe passé.",
    table: {
      cols: ["-are → -ato", "-ere → -uto", "-ire → -ito"],
      rows: [{ label: "part. passé", cells: ["parlato", "venduto", "sentito"] }],
    },
    extraLines: [
      "Auxiliaire essere : mouvement/état + réfléchis. Le participe s'accorde en genre et nombre.",
      "Auxiliaire avere : verbes transitifs. Pas d'accord avec le sujet.",
    ],
    exceptions: [
      { verb: "fare", forms: [{ label: "pp", before: "fa", bold: "tto", after: "" }] },
      { verb: "dire", forms: [{ label: "pp", before: "de", bold: "tto", after: "" }] },
      { verb: "prendere", forms: [{ label: "pp", before: "pre", bold: "so", after: "" }] },
      { verb: "vedere", forms: [{ label: "pp", before: "vi", bold: "sto", after: "" }] },
      { verb: "mettere", forms: [{ label: "pp", before: "me", bold: "sso", after: "" }] },
      { verb: "essere/stare", forms: [{ label: "pp", before: "", bold: "stato", after: "" }] },
    ],
  },
  imperfetto: {
    usage: "Description dans le passé, habitude, action en cours.",
    when: "« Quand j'étais petit, mangiavo la pizza tous les jours ».",
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
    exceptions: [
      { verb: "essere", forms: [{ label: "io", before: "", bold: "ero", after: "" }, { label: "noi", before: "", bold: "eravamo", after: "" }] },
      { verb: "fare", forms: [{ label: "io", before: "fa", bold: "c", after: "evo" }] },
      { verb: "dire", forms: [{ label: "io", before: "di", bold: "c", after: "evo" }] },
      { verb: "bere", forms: [{ label: "io", before: "be", bold: "v", after: "evo" }] },
    ],
  },
  futuro: {
    usage: "Action à venir ou hypothèse forte sur le présent.",
    when: "« Domani mangerò », « Sarà stanco » (il doit être fatigué).",
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
    exceptions: [
      { verb: "essere", forms: [{ label: "io", before: "", bold: "sar", after: "ò" }] },
      { verb: "avere", forms: [{ label: "io", before: "a", bold: "vr", after: "ò" }] },
      { verb: "andare", forms: [{ label: "io", before: "and", bold: "r", after: "ò" }] },
      { verb: "vedere", forms: [{ label: "io", before: "ved", bold: "r", after: "ò" }] },
      { verb: "potere", forms: [{ label: "io", before: "po", bold: "tr", after: "ò" }] },
    ],
  },
  condizionale: {
    usage: "Politesse, souhait, conseil, hypothèse.",
    when: "« Vorrei un caffè », « Dovresti dormire ».",
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
    exceptions: [
      { verb: "essere", forms: [{ label: "io", before: "", bold: "sar", after: "ei" }] },
      { verb: "avere", forms: [{ label: "io", before: "a", bold: "vr", after: "ei" }] },
      { verb: "andare", forms: [{ label: "io", before: "and", bold: "r", after: "ei" }] },
    ],
  },
  congiuntivo: {
    usage: "Subjonctif : doute, souhait, opinion, subordonnées après « che ».",
    when: "« Penso che parli bene », « Voglio che tu senta questa canzone ».",
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
    exceptions: [
      { verb: "essere", forms: [{ label: "io", before: "", bold: "sia", after: "" }] },
      { verb: "avere", forms: [{ label: "io", before: "", bold: "abbia", after: "" }] },
      { verb: "andare", forms: [{ label: "io", before: "", bold: "vada", after: "" }] },
      { verb: "fare", forms: [{ label: "io", before: "", bold: "faccia", after: "" }] },
    ],
  },
  imperativo: {
    usage: "Donner un ordre, un conseil, une consigne.",
    when: "« Mangia ! », « Andiamo ! », « Ascoltate ! ».",
    examples: "parlare, vendere, sentire.",
    table: {
      cols: ["-are", "-ere", "-ire"],
      rows: [
        { label: "(tu)", cells: ["-a", "-i", "-i / -isci"] },
        { label: "(noi)", cells: ["-iamo", "-iamo", "-iamo"] },
        { label: "(voi)", cells: ["-ate", "-ete", "-ite"] },
      ],
    },
    extraLines: ["Négatif 2ᵉ p. sing. : non + infinitif (« non parlare ! »)."],
    exceptions: [
      { verb: "andare", forms: [{ label: "tu", before: "", bold: "va'", after: "" }] },
      { verb: "dare", forms: [{ label: "tu", before: "", bold: "da'", after: "" }] },
      { verb: "fare", forms: [{ label: "tu", before: "", bold: "fa'", after: "" }] },
      { verb: "stare", forms: [{ label: "tu", before: "", bold: "sta'", after: "" }] },
      { verb: "dire", forms: [{ label: "tu", before: "", bold: "di'", after: "" }] },
    ],
  },
  participio: {
    usage: "Sert à composer les temps composés et peut aussi être un adjectif.",
    when: "Combiné à avere/essere pour le passato prossimo, trapassato…",
    examples: "parlare → parlato · vendere → venduto · sentire → sentito.",
    table: {
      cols: ["-are → -ato", "-ere → -uto", "-ire → -ito"],
      rows: [{ label: "part. passé", cells: ["parlato", "venduto", "sentito"] }],
    },
    exceptions: [
      { verb: "fare", forms: [{ label: "pp", before: "fa", bold: "tto", after: "" }] },
      { verb: "dire", forms: [{ label: "pp", before: "de", bold: "tto", after: "" }] },
      { verb: "prendere", forms: [{ label: "pp", before: "pre", bold: "so", after: "" }] },
      { verb: "vedere", forms: [{ label: "pp", before: "vi", bold: "sto", after: "" }] },
      { verb: "mettere", forms: [{ label: "pp", before: "me", bold: "sso", after: "" }] },
      { verb: "aprire", forms: [{ label: "pp", before: "a", bold: "perto", after: "" }] },
    ],
  },
  gerundio: {
    usage: "Équivalent du gérondif français (« en …ant »).",
    when: "Manière ou simultanéité : « leggendo » = en lisant.",
    examples: "parlare → parlando · vedere → vedendo · sentire → sentendo.",
    table: {
      cols: ["-are → -ando", "-ere → -endo", "-ire → -endo"],
      rows: [{ label: "gérondif", cells: ["parlando", "vedendo", "sentendo"] }],
    },
    exceptions: [
      { verb: "fare", forms: [{ label: "gér.", before: "fa", bold: "cendo", after: "" }] },
      { verb: "dire", forms: [{ label: "gér.", before: "di", bold: "cendo", after: "" }] },
      { verb: "bere", forms: [{ label: "gér.", before: "be", bold: "vendo", after: "" }] },
    ],
  },
};

function Theory() {
  const [hidden, setHidden] = useState<Set<Tense>>(new Set());
  const toggle = (t: Tense) =>
    setHidden((h) => { const n = new Set(h); n.has(t) ? n.delete(t) : n.add(t); return n; });

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
                          {b.table.rows.map((r, i) => (
                            <tr key={i}>
                              <td className="border border-border/60 bg-muted/30 p-1.5 text-right text-[11px] font-bold text-muted-foreground">
                                {r.label}
                              </td>
                              {r.cells.map((c, j) => (
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
                {b.exceptions && b.exceptions.length > 0 && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-2">
                    <div className="mb-1.5 text-xs font-bold uppercase tracking-wide text-destructive">
                      Exceptions notoires
                    </div>
                    <ul className="space-y-1 text-xs">
                      {b.exceptions.map((ex, i) => (
                        <li key={i} className="flex flex-wrap items-baseline gap-x-2">
                          <span className="font-display text-sm font-bold italic text-foreground">{ex.verb}</span>
                          <span className="flex flex-wrap gap-x-2 gap-y-0.5">
                            {ex.forms.map((f, j) => (
                              <span key={j} className="whitespace-nowrap">
                                <span className="mr-1 text-[10px] font-semibold uppercase text-muted-foreground">{f.label}</span>
                                <span className="text-foreground">{f.before}</span>
                                <strong className="font-black text-destructive">{f.bold}</strong>
                                <span className="text-foreground">{f.after}</span>
                              </span>
                            ))}
                          </span>
                        </li>
                      ))}
                    </ul>
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