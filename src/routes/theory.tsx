import { createFileRoute, Link } from "@tanstack/react-router";
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

type Block = {
  usage: string;
  when: string;
  form: { title: string; body: string }[];
  exceptions?: string;
};

const THEORY: Record<Tense, Block> = {
  infinitivo: {
    usage: "Forme non conjuguée du verbe (« manger », « partir »…).",
    when: "Après un autre verbe (voglio mangiare), après une préposition (per fare).",
    form: [
      { title: "-are", body: "parlare, mangiare, andare…" },
      { title: "-ere", body: "vedere, prendere, mettere…" },
      { title: "-ire", body: "sentire, dormire, finire…" },
    ],
    exceptions: "Verbes réfléchis : terminaison en -rsi (alzarsi, mettersi).",
  },
  presente: {
    usage: "Action au moment présent ou vérité générale.",
    when: "« Je mange une pomme », « Il pleut souvent ici ».",
    form: [
      { title: "-are (parl-)", body: "-o, -i, -a, -iamo, -ate, -ano" },
      { title: "-ere (vend-)", body: "-o, -i, -e, -iamo, -ete, -ono" },
      { title: "-ire (sent-)", body: "-o, -i, -e, -iamo, -ite, -ono" },
      { title: "-ire (fin- + isc)", body: "-isco, -isci, -isce, -iamo, -ite, -iscono" },
    ],
    exceptions: "essere, avere, andare, fare, stare, dare, potere, volere, dovere, sapere… sont irréguliers.",
  },
  presente_progressivo: {
    usage: "Action en cours (« être en train de… »).",
    when: "« Sto mangiando » = je suis en train de manger.",
    form: [
      { title: "Formule", body: "stare (présent) + gérondif du verbe." },
      { title: "-are → -ando", body: "parlare → sto parlando" },
      { title: "-ere / -ire → -endo", body: "vedere → sto vedendo · sentire → sto sentendo" },
    ],
    exceptions: "fare → facendo, dire → dicendo, bere → bevendo.",
  },
  passato_prossimo: {
    usage: "Action passée, terminée, souvent récente. Équivalent du passé composé.",
    when: "« Ho mangiato », « Sono andato al mare ».",
    form: [
      { title: "Formule", body: "avere ou essere (présent) + participe passé." },
      { title: "Participe régulier", body: "-are → -ato · -ere → -uto · -ire → -ito" },
      { title: "Auxiliaire essere", body: "Verbes de mouvement/état + réfléchis. Le participe s'accorde en genre et nombre avec le sujet." },
      { title: "Auxiliaire avere", body: "Verbes transitifs. Pas d'accord avec le sujet." },
    ],
    exceptions: "Nombreux participes irréguliers : fare→fatto, prendere→preso, vedere→visto, mettere→messo, dire→detto…",
  },
  imperfetto: {
    usage: "Description dans le passé, habitude, action en cours.",
    when: "« Quand j'étais petit… », « Il pleuvait ».",
    form: [
      { title: "-are", body: "-avo, -avi, -ava, -avamo, -avate, -avano" },
      { title: "-ere", body: "-evo, -evi, -eva, -evamo, -evate, -evano" },
      { title: "-ire", body: "-ivo, -ivi, -iva, -ivamo, -ivate, -ivano" },
    ],
    exceptions: "essere → ero, eri, era… · fare → facevo · dire → dicevo · bere → bevevo.",
  },
  futuro: {
    usage: "Action à venir ou hypothèse forte sur le présent.",
    when: "« Domani mangerò », « Sarà stanco » (il doit être fatigué).",
    form: [
      { title: "-are & -ere (radical + er-)", body: "-erò, -erai, -erà, -eremo, -erete, -eranno" },
      { title: "-ire (radical + ir-)", body: "-irò, -irai, -irà, -iremo, -irete, -iranno" },
    ],
    exceptions: "Radicaux contractés : avere→avrò, andare→andrò, vedere→vedrò, potere→potrò, sapere→saprò. essere→sarò.",
  },
  condizionale: {
    usage: "Politesse, souhait, conseil, hypothèse.",
    when: "« Vorrei un caffè », « Dovresti dormire ».",
    form: [
      { title: "-are & -ere", body: "-erei, -eresti, -erebbe, -eremmo, -ereste, -erebbero" },
      { title: "-ire", body: "-irei, -iresti, -irebbe, -iremmo, -ireste, -irebbero" },
    ],
    exceptions: "Mêmes radicaux contractés qu'au futur (avrei, andrei, vedrei, sarei…).",
  },
  congiuntivo: {
    usage: "Subjonctif : doute, souhait, opinion, subordonnées après « che ».",
    when: "« Penso che sia bello », « Voglio che tu venga ».",
    form: [
      { title: "-are", body: "-i, -i, -i, -iamo, -iate, -ino" },
      { title: "-ere / -ire", body: "-a, -a, -a, -iamo, -iate, -ano" },
      { title: "-ire (isc)", body: "-isca, -isca, -isca, -iamo, -iate, -iscano" },
    ],
    exceptions: "essere→sia, avere→abbia, andare→vada, fare→faccia, potere→possa, sapere→sappia.",
  },
  imperativo: {
    usage: "Donner un ordre, un conseil, une consigne.",
    when: "« Mangia ! », « Andiamo ! », « Ascoltate ! ».",
    form: [
      { title: "-are", body: "tu → -a · noi → -iamo · voi → -ate" },
      { title: "-ere", body: "tu → -i · noi → -iamo · voi → -ete" },
      { title: "-ire", body: "tu → -i (ou -isci) · noi → -iamo · voi → -ite" },
    ],
    exceptions: "Négatif à la 2e pers. sing. : non + infinitif (« non parlare ! »). Verbes courts : va', da', fa', sta', di'.",
  },
  participio: {
    usage: "Forme du verbe utilisée pour composer les temps composés et comme adjectif.",
    when: "Avec avere/essere pour le passato prossimo, trapassato, etc.",
    form: [
      { title: "-are → -ato", body: "parlare → parlato" },
      { title: "-ere → -uto", body: "vendere → venduto" },
      { title: "-ire → -ito", body: "sentire → sentito" },
    ],
    exceptions: "fare→fatto, dire→detto, prendere→preso, vedere→visto, mettere→messo, essere/stare→stato, aprire→aperto.",
  },
  gerundio: {
    usage: "Équivalent du gérondif français (« en …ant »).",
    when: "Manière ou simultanéité : « leggendo » = en lisant.",
    form: [
      { title: "-are → -ando", body: "parlare → parlando" },
      { title: "-ere / -ire → -endo", body: "vedere → vedendo · sentire → sentendo" },
    ],
    exceptions: "fare→facendo, dire→dicendo, bere→bevendo.",
  },
};

function Theory() {
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

      <div className="space-y-3">
        {TENSES.map((t) => {
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
                </div>
                <div>
                  <div className="mb-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">Formation</div>
                  <ul className="space-y-1 text-sm">
                    {b.form.map((f, i) => (
                      <li key={i} className="flex flex-wrap items-baseline gap-2">
                        <span className={`tense-chip tense-${t.id}`} style={{ padding: "0.1rem 0.5rem", fontSize: "0.6rem" }}>
                          {f.title}
                        </span>
                        <span className="text-foreground">{f.body}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {b.exceptions && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-2 text-xs">
                    <span className="font-bold text-destructive">Exceptions notoires : </span>
                    <span className="text-foreground">{b.exceptions}</span>
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