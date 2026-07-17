// Italian verb database with conjugations and pedagogical notes.
// Tenses: presente, passato_prossimo, imperfetto, futuro, condizionale, congiuntivo

export type Person = "io" | "tu" | "lui" | "noi" | "voi" | "loro";
export const PERSONS: Person[] = ["io", "tu", "lui", "noi", "voi", "loro"];
export const PERSON_LABEL: Record<Person, string> = {
  io: "io",
  tu: "tu",
  lui: "lui/lei",
  noi: "noi",
  voi: "voi",
  loro: "loro",
};

export type Tense =
  | "presente"
  | "passato_prossimo"
  | "imperfetto"
  | "futuro"
  | "condizionale"
  | "congiuntivo";

export const TENSES: { id: Tense; fr: string; it: string }[] = [
  { id: "presente", fr: "Présent", it: "Presente" },
  { id: "passato_prossimo", fr: "Passé composé", it: "Passato prossimo" },
  { id: "imperfetto", fr: "Imparfait", it: "Imperfetto" },
  { id: "futuro", fr: "Futur", it: "Futuro semplice" },
  { id: "condizionale", fr: "Conditionnel", it: "Condizionale presente" },
  { id: "congiuntivo", fr: "Subjonctif", it: "Congiuntivo presente" },
];

export type Difficulty = "courant" | "regulier" | "irregulier" | "difficile" | "riflessivo";
export const DIFFICULTIES: { id: Difficulty; label: string }[] = [
  { id: "courant", label: "Les plus courants" },
  { id: "regulier", label: "Réguliers" },
  { id: "irregulier", label: "Exceptions / Irréguliers" },
  { id: "difficile", label: "Difficiles" },
  { id: "riflessivo", label: "Réfléchis / Pronominaux" },
];

export interface Verb {
  infinitive: string;
  french: string;
  difficulty: Difficulty;
  aux: "avere" | "essere";
  participle: string; // past participle
  gerund?: string;
  notes?: Partial<Record<Tense, string>>;
  conj: Partial<Record<Tense, Record<Person, string>>>;
}

// Helpers to generate regular -are/-ere/-ire conjugations
function regAre(stem: string): Record<Tense, Record<Person, string>> {
  return {
    presente: { io: stem + "o", tu: stem + "i", lui: stem + "a", noi: stem + "iamo", voi: stem + "ate", loro: stem + "ano" },
    imperfetto: { io: stem + "avo", tu: stem + "avi", lui: stem + "ava", noi: stem + "avamo", voi: stem + "avate", loro: stem + "avano" },
    futuro: { io: stem + "erò", tu: stem + "erai", lui: stem + "erà", noi: stem + "eremo", voi: stem + "erete", loro: stem + "eranno" },
    condizionale: { io: stem + "erei", tu: stem + "eresti", lui: stem + "erebbe", noi: stem + "eremmo", voi: stem + "ereste", loro: stem + "erebbero" },
    congiuntivo: { io: stem + "i", tu: stem + "i", lui: stem + "i", noi: stem + "iamo", voi: stem + "iate", loro: stem + "ino" },
    passato_prossimo: {} as any,
  };
}
function regEre(stem: string): Record<Tense, Record<Person, string>> {
  return {
    presente: { io: stem + "o", tu: stem + "i", lui: stem + "e", noi: stem + "iamo", voi: stem + "ete", loro: stem + "ono" },
    imperfetto: { io: stem + "evo", tu: stem + "evi", lui: stem + "eva", noi: stem + "evamo", voi: stem + "evate", loro: stem + "evano" },
    futuro: { io: stem + "erò", tu: stem + "erai", lui: stem + "erà", noi: stem + "eremo", voi: stem + "erete", loro: stem + "eranno" },
    condizionale: { io: stem + "erei", tu: stem + "eresti", lui: stem + "erebbe", noi: stem + "eremmo", voi: stem + "ereste", loro: stem + "erebbero" },
    congiuntivo: { io: stem + "a", tu: stem + "a", lui: stem + "a", noi: stem + "iamo", voi: stem + "iate", loro: stem + "ano" },
    passato_prossimo: {} as any,
  };
}
function regIre(stem: string, isc = false): Record<Tense, Record<Person, string>> {
  const pres = isc
    ? { io: stem + "isco", tu: stem + "isci", lui: stem + "isce", noi: stem + "iamo", voi: stem + "ite", loro: stem + "iscono" }
    : { io: stem + "o", tu: stem + "i", lui: stem + "e", noi: stem + "iamo", voi: stem + "ite", loro: stem + "ono" };
  const cong = isc
    ? { io: stem + "isca", tu: stem + "isca", lui: stem + "isca", noi: stem + "iamo", voi: stem + "iate", loro: stem + "iscano" }
    : { io: stem + "a", tu: stem + "a", lui: stem + "a", noi: stem + "iamo", voi: stem + "iate", loro: stem + "ano" };
  return {
    presente: pres,
    imperfetto: { io: stem + "ivo", tu: stem + "ivi", lui: stem + "iva", noi: stem + "ivamo", voi: stem + "ivate", loro: stem + "ivano" },
    futuro: { io: stem + "irò", tu: stem + "irai", lui: stem + "irà", noi: stem + "iremo", voi: stem + "irete", loro: stem + "iranno" },
    condizionale: { io: stem + "irei", tu: stem + "iresti", lui: stem + "irebbe", noi: stem + "iremmo", voi: stem + "ireste", loro: stem + "irebbero" },
    congiuntivo: cong,
    passato_prossimo: {} as any,
  };
}

// Auxiliaries (needed for passato prossimo generation)
const avere_pres: Record<Person, string> = { io: "ho", tu: "hai", lui: "ha", noi: "abbiamo", voi: "avete", loro: "hanno" };
const essere_pres: Record<Person, string> = { io: "sono", tu: "sei", lui: "è", noi: "siamo", voi: "siete", loro: "sono" };

function passato(aux: "avere" | "essere", participle: string): Record<Person, string> {
  const a = aux === "avere" ? avere_pres : essere_pres;
  if (aux === "essere") {
    // agreement: for simplicity use masculine singular / plural
    const sing = participle;
    const plur = participle.replace(/o$/, "i").replace(/a$/, "e");
    return {
      io: `${a.io} ${sing}`,
      tu: `${a.tu} ${sing}`,
      lui: `${a.lui} ${sing}`,
      noi: `${a.noi} ${plur}`,
      voi: `${a.voi} ${plur}`,
      loro: `${a.loro} ${plur}`,
    };
  }
  return {
    io: `${a.io} ${participle}`,
    tu: `${a.tu} ${participle}`,
    lui: `${a.lui} ${participle}`,
    noi: `${a.noi} ${participle}`,
    voi: `${a.voi} ${participle}`,
    loro: `${a.loro} ${participle}`,
  };
}

function withPassato(v: Verb): Verb {
  const pp = v.conj.passato_prossimo;
  if (pp && Object.keys(pp).length > 0) return v;
  const conj = { ...v.conj };
  conj.passato_prossimo = passato(v.aux, v.participle);
  return { ...v, conj };
}

// Reflexive helpers -----------------------------------------------------------
const REFL_PRONOUNS: Record<Person, string> = {
  io: "mi", tu: "ti", lui: "si", noi: "ci", voi: "vi", loro: "si",
};
function toReflexive(conj: Record<Tense, Record<Person, string>>): Record<Tense, Record<Person, string>> {
  const out = {} as Record<Tense, Record<Person, string>>;
  (Object.keys(conj) as Tense[]).forEach((t) => {
    const row = conj[t];
    if (!row || Object.keys(row).length === 0) return;
    out[t] = {
      io: `${REFL_PRONOUNS.io} ${row.io}`,
      tu: `${REFL_PRONOUNS.tu} ${row.tu}`,
      lui: `${REFL_PRONOUNS.lui} ${row.lui}`,
      noi: `${REFL_PRONOUNS.noi} ${row.noi}`,
      voi: `${REFL_PRONOUNS.voi} ${row.voi}`,
      loro: `${REFL_PRONOUNS.loro} ${row.loro}`,
    };
  });
  return out;
}
function reflexivePassato(participle: string): Record<Person, string> {
  const sing = participle;
  const plur = participle.replace(/o$/, "i").replace(/a$/, "e");
  return {
    io: `mi sono ${sing}`,
    tu: `ti sei ${sing}`,
    lui: `si è ${sing}`,
    noi: `ci siamo ${plur}`,
    voi: `vi siete ${plur}`,
    loro: `si sono ${plur}`,
  };
}
function reflexive(infinitive: string, french: string, stem: string, participle: string, kind: "are"|"ere"|"ire"|"ire-isc", note?: string): Verb {
  const base =
    kind === "are" ? regAre(stem) :
    kind === "ere" ? regEre(stem) :
    kind === "ire-isc" ? regIre(stem, true) :
    regIre(stem);
  const conj = toReflexive(base);
  conj.passato_prossimo = reflexivePassato(participle);
  return {
    infinitive, french, difficulty: "riflessivo", aux: "essere", participle,
    conj,
    notes: {
      presente: "Verbe pronominal : le pronom réfléchi (mi/ti/si/ci/vi/si) se place AVANT le verbe conjugué.",
      passato_prossimo: "Les verbes pronominaux se conjuguent toujours avec ESSERE. Le participe s'accorde avec le sujet (chiamato → chiamati au pluriel).",
      ...(note ? { presente: note } : {}),
    },
  };
}

// ---- Verbs -----------------------------------------------------------------

const rawVerbs: Verb[] = [
  // COURANTS (irréguliers de base)
  {
    infinitive: "essere", french: "être", difficulty: "courant", aux: "essere", participle: "stato",
    conj: {
      presente: { io: "sono", tu: "sei", lui: "è", noi: "siamo", voi: "siete", loro: "sono" },
      imperfetto: { io: "ero", tu: "eri", lui: "era", noi: "eravamo", voi: "eravate", loro: "erano" },
      futuro: { io: "sarò", tu: "sarai", lui: "sarà", noi: "saremo", voi: "sarete", loro: "saranno" },
      condizionale: { io: "sarei", tu: "saresti", lui: "sarebbe", noi: "saremmo", voi: "sareste", loro: "sarebbero" },
      congiuntivo: { io: "sia", tu: "sia", lui: "sia", noi: "siamo", voi: "siate", loro: "siano" },
    },
    notes: {
      presente: "Essere est totalement irrégulier. À la 3ème personne, on écrit 'è' avec un accent grave (à ne pas confondre avec 'e' = 'et').",
      passato_prossimo: "Essere se conjugue avec l'auxiliaire 'essere' lui-même. Le participe passé 'stato' s'accorde en genre et nombre.",
      imperfetto: "Radical particulier 'er-' à l'imparfait.",
    },
  },
  {
    infinitive: "avere", french: "avoir", difficulty: "courant", aux: "avere", participle: "avuto",
    conj: {
      presente: { io: "ho", tu: "hai", lui: "ha", noi: "abbiamo", voi: "avete", loro: "hanno" },
      imperfetto: { io: "avevo", tu: "avevi", lui: "aveva", noi: "avevamo", voi: "avevate", loro: "avevano" },
      futuro: { io: "avrò", tu: "avrai", lui: "avrà", noi: "avremo", voi: "avrete", loro: "avranno" },
      condizionale: { io: "avrei", tu: "avresti", lui: "avrebbe", noi: "avremmo", voi: "avreste", loro: "avrebbero" },
      congiuntivo: { io: "abbia", tu: "abbia", lui: "abbia", noi: "abbiamo", voi: "abbiate", loro: "abbiano" },
    },
    notes: {
      presente: "Avere prend un 'h' muet aux personnes ho/hai/ha/hanno pour distinguer à l'écrit (o, ai, a, anno).",
      futuro: "La voyelle du radical tombe : av-r-ò, pas 'aver-ò'.",
    },
  },
  {
    infinitive: "andare", french: "aller", difficulty: "courant", aux: "essere", participle: "andato",
    conj: {
      presente: { io: "vado", tu: "vai", lui: "va", noi: "andiamo", voi: "andate", loro: "vanno" },
      imperfetto: { io: "andavo", tu: "andavi", lui: "andava", noi: "andavamo", voi: "andavate", loro: "andavano" },
      futuro: { io: "andrò", tu: "andrai", lui: "andrà", noi: "andremo", voi: "andrete", loro: "andranno" },
      condizionale: { io: "andrei", tu: "andresti", lui: "andrebbe", noi: "andremmo", voi: "andreste", loro: "andrebbero" },
      congiuntivo: { io: "vada", tu: "vada", lui: "vada", noi: "andiamo", voi: "andiate", loro: "vadano" },
    },
    notes: {
      presente: "Andare est irrégulier : il utilise le radical 'v-' aux personnes fortes (io, tu, lui, loro) et 'and-' aux personnes faibles (noi, voi).",
      futuro: "Le 'a' du radical tombe : andrò, pas 'anderò'.",
    },
  },
  {
    infinitive: "fare", french: "faire", difficulty: "courant", aux: "avere", participle: "fatto",
    conj: {
      presente: { io: "faccio", tu: "fai", lui: "fa", noi: "facciamo", voi: "fate", loro: "fanno" },
      imperfetto: { io: "facevo", tu: "facevi", lui: "faceva", noi: "facevamo", voi: "facevate", loro: "facevano" },
      futuro: { io: "farò", tu: "farai", lui: "farà", noi: "faremo", voi: "farete", loro: "faranno" },
      condizionale: { io: "farei", tu: "faresti", lui: "farebbe", noi: "faremmo", voi: "fareste", loro: "farebbero" },
      congiuntivo: { io: "faccia", tu: "faccia", lui: "faccia", noi: "facciamo", voi: "facciate", loro: "facciano" },
    },
    notes: {
      presente: "Fare vient du latin 'facere' : on retrouve le radical 'fac-' à io/noi/loro (faccio, facciamo, fanno).",
      imperfetto: "Radical 'face-' à l'imparfait (facevo), pas 'fa-'.",
    },
  },
  {
    infinitive: "stare", french: "être / rester", difficulty: "courant", aux: "essere", participle: "stato",
    conj: {
      presente: { io: "sto", tu: "stai", lui: "sta", noi: "stiamo", voi: "state", loro: "stanno" },
      imperfetto: { io: "stavo", tu: "stavi", lui: "stava", noi: "stavamo", voi: "stavate", loro: "stavano" },
      futuro: { io: "starò", tu: "starai", lui: "starà", noi: "staremo", voi: "starete", loro: "staranno" },
      condizionale: { io: "starei", tu: "staresti", lui: "starebbe", noi: "staremmo", voi: "stareste", loro: "starebbero" },
      congiuntivo: { io: "stia", tu: "stia", lui: "stia", noi: "stiamo", voi: "stiate", loro: "stiano" },
    },
    notes: { presente: "Stare a un participe identique à essere : 'stato'. On l'utilise pour la santé et la localisation ('come stai?')." },
  },
  {
    infinitive: "dare", french: "donner", difficulty: "courant", aux: "avere", participle: "dato",
    conj: {
      presente: { io: "do", tu: "dai", lui: "dà", noi: "diamo", voi: "date", loro: "danno" },
      imperfetto: { io: "davo", tu: "davi", lui: "dava", noi: "davamo", voi: "davate", loro: "davano" },
      futuro: { io: "darò", tu: "darai", lui: "darà", noi: "daremo", voi: "darete", loro: "daranno" },
      condizionale: { io: "darei", tu: "daresti", lui: "darebbe", noi: "daremmo", voi: "dareste", loro: "darebbero" },
      congiuntivo: { io: "dia", tu: "dia", lui: "dia", noi: "diamo", voi: "diate", loro: "diano" },
    },
    notes: { presente: "Attention à l'accent sur 'dà' (3e pers.) pour le distinguer de la préposition 'da'." },
  },
  // RÉGULIERS
  {
    infinitive: "parlare", french: "parler", difficulty: "regulier", aux: "avere", participle: "parlato",
    conj: regAre("parl"),
    notes: { presente: "Verbe en -ARE classique. Terminaisons : -o, -i, -a, -iamo, -ate, -ano." },
  },
  {
    infinitive: "mangiare", french: "manger", difficulty: "regulier", aux: "avere", participle: "mangiato",
    conj: {
      presente: { io: "mangio", tu: "mangi", lui: "mangia", noi: "mangiamo", voi: "mangiate", loro: "mangiano" },
      imperfetto: { io: "mangiavo", tu: "mangiavi", lui: "mangiava", noi: "mangiavamo", voi: "mangiavate", loro: "mangiavano" },
      futuro: { io: "mangerò", tu: "mangerai", lui: "mangerà", noi: "mangeremo", voi: "mangerete", loro: "mangeranno" },
      condizionale: { io: "mangerei", tu: "mangeresti", lui: "mangerebbe", noi: "mangeremmo", voi: "mangereste", loro: "mangerebbero" },
      congiuntivo: { io: "mangi", tu: "mangi", lui: "mangi", noi: "mangiamo", voi: "mangiate", loro: "mangino" },
    },
    notes: {
      presente: "Les verbes en -CIARE / -GIARE perdent le 'i' devant un 'i' ou un 'e' : mangi (pas 'mangii'), mangeremo (pas 'mangieremo').",
    },
  },
  {
    infinitive: "credere", french: "croire", difficulty: "regulier", aux: "avere", participle: "creduto",
    conj: regEre("cred"),
    notes: { presente: "Verbe en -ERE régulier. Terminaisons : -o, -i, -e, -iamo, -ete, -ono." },
  },
  {
    infinitive: "dormire", french: "dormir", difficulty: "regulier", aux: "avere", participle: "dormito",
    conj: regIre("dorm"),
    notes: { presente: "Verbe en -IRE simple (sans -isc-). Se conjugue comme partire, sentire." },
  },
  {
    infinitive: "finire", french: "finir", difficulty: "regulier", aux: "avere", participle: "finito",
    conj: regIre("fin", true),
    notes: { presente: "Verbe en -IRE avec l'infixe -ISC- au présent (sauf noi/voi) : finisco, finisci, finisce, finiamo, finite, finiscono." },
  },
  {
    infinitive: "arrivare", french: "arriver", difficulty: "regulier", aux: "essere", participle: "arrivato",
    conj: regAre("arriv"),
    notes: { passato_prossimo: "Verbe de mouvement : auxiliaire ESSERE. Le participe passé s'accorde en genre et en nombre avec le sujet." },
  },
  // IRRÉGULIERS
  {
    infinitive: "potere", french: "pouvoir", difficulty: "irregulier", aux: "avere", participle: "potuto",
    conj: {
      presente: { io: "posso", tu: "puoi", lui: "può", noi: "possiamo", voi: "potete", loro: "possono" },
      imperfetto: { io: "potevo", tu: "potevi", lui: "poteva", noi: "potevamo", voi: "potevate", loro: "potevano" },
      futuro: { io: "potrò", tu: "potrai", lui: "potrà", noi: "potremo", voi: "potrete", loro: "potranno" },
      condizionale: { io: "potrei", tu: "potresti", lui: "potrebbe", noi: "potremmo", voi: "potreste", loro: "potrebbero" },
      congiuntivo: { io: "possa", tu: "possa", lui: "possa", noi: "possiamo", voi: "possiate", loro: "possano" },
    },
    notes: {
      presente: "Potere est irrégulier : radical 'poss-' aux personnes fortes, 'puo-' pour tu/lui. Note l'accent : può.",
      futuro: "Radical contracté 'potr-' au futur et au conditionnel.",
    },
  },
  {
    infinitive: "volere", french: "vouloir", difficulty: "irregulier", aux: "avere", participle: "voluto",
    conj: {
      presente: { io: "voglio", tu: "vuoi", lui: "vuole", noi: "vogliamo", voi: "volete", loro: "vogliono" },
      imperfetto: { io: "volevo", tu: "volevi", lui: "voleva", noi: "volevamo", voi: "volevate", loro: "volevano" },
      futuro: { io: "vorrò", tu: "vorrai", lui: "vorrà", noi: "vorremo", voi: "vorrete", loro: "vorranno" },
      condizionale: { io: "vorrei", tu: "vorresti", lui: "vorrebbe", noi: "vorremmo", voi: "vorreste", loro: "vorrebbero" },
      congiuntivo: { io: "voglia", tu: "voglia", lui: "voglia", noi: "vogliamo", voi: "vogliate", loro: "vogliano" },
    },
    notes: {
      presente: "Volere alterne trois radicaux : 'vogl-' (io, loro), 'vuo-' (tu, lui), 'vol-' (noi, voi).",
      condizionale: "'Vorrei' avec deux 'r' — c'est la forme polie pour demander ('Vorrei un caffè').",
    },
  },
  {
    infinitive: "dovere", french: "devoir", difficulty: "irregulier", aux: "avere", participle: "dovuto",
    conj: {
      presente: { io: "devo", tu: "devi", lui: "deve", noi: "dobbiamo", voi: "dovete", loro: "devono" },
      imperfetto: { io: "dovevo", tu: "dovevi", lui: "doveva", noi: "dovevamo", voi: "dovevate", loro: "dovevano" },
      futuro: { io: "dovrò", tu: "dovrai", lui: "dovrà", noi: "dovremo", voi: "dovrete", loro: "dovranno" },
      condizionale: { io: "dovrei", tu: "dovresti", lui: "dovrebbe", noi: "dovremmo", voi: "dovreste", loro: "dovrebbero" },
      congiuntivo: { io: "debba", tu: "debba", lui: "debba", noi: "dobbiamo", voi: "dobbiate", loro: "debbano" },
    },
    notes: { presente: "Attention à la 1ère personne du pluriel : 'dobbiamo' (radical 'dobb-')." },
  },
  {
    infinitive: "sapere", french: "savoir", difficulty: "irregulier", aux: "avere", participle: "saputo",
    conj: {
      presente: { io: "so", tu: "sai", lui: "sa", noi: "sappiamo", voi: "sapete", loro: "sanno" },
      imperfetto: { io: "sapevo", tu: "sapevi", lui: "sapeva", noi: "sapevamo", voi: "sapevate", loro: "sapevano" },
      futuro: { io: "saprò", tu: "saprai", lui: "saprà", noi: "sapremo", voi: "saprete", loro: "sapranno" },
      condizionale: { io: "saprei", tu: "sapresti", lui: "saprebbe", noi: "sapremmo", voi: "sapreste", loro: "saprebbero" },
      congiuntivo: { io: "sappia", tu: "sappia", lui: "sappia", noi: "sappiamo", voi: "sappiate", loro: "sappiano" },
    },
    notes: { presente: "Formes monosyllabiques 'so' et 'sa' — attention à ne pas confondre 'sa' (3e pers.) avec la préposition." },
  },
  {
    infinitive: "venire", french: "venir", difficulty: "irregulier", aux: "essere", participle: "venuto",
    conj: {
      presente: { io: "vengo", tu: "vieni", lui: "viene", noi: "veniamo", voi: "venite", loro: "vengono" },
      imperfetto: { io: "venivo", tu: "venivi", lui: "veniva", noi: "venivamo", voi: "venivate", loro: "venivano" },
      futuro: { io: "verrò", tu: "verrai", lui: "verrà", noi: "verremo", voi: "verrete", loro: "verranno" },
      condizionale: { io: "verrei", tu: "verresti", lui: "verrebbe", noi: "verremmo", voi: "verreste", loro: "verrebbero" },
      congiuntivo: { io: "venga", tu: "venga", lui: "venga", noi: "veniamo, ", voi: "veniate", loro: "vengano" },
    },
    notes: { futuro: "Futur avec double 'r' : verrò, verrai... (comme volere → vorrò)." },
  },
  {
    infinitive: "dire", french: "dire", difficulty: "irregulier", aux: "avere", participle: "detto",
    conj: {
      presente: { io: "dico", tu: "dici", lui: "dice", noi: "diciamo", voi: "dite", loro: "dicono" },
      imperfetto: { io: "dicevo", tu: "dicevi", lui: "diceva", noi: "dicevamo", voi: "dicevate", loro: "dicevano" },
      futuro: { io: "dirò", tu: "dirai", lui: "dirà", noi: "diremo", voi: "direte", loro: "diranno" },
      condizionale: { io: "direi", tu: "diresti", lui: "direbbe", noi: "diremmo", voi: "direste", loro: "direbbero" },
      congiuntivo: { io: "dica", tu: "dica", lui: "dica", noi: "diciamo", voi: "diciate", loro: "dicano" },
    },
    notes: { presente: "Dire vient du latin 'dicere' : radical 'dic-' à toutes les personnes sauf 'voi' (dite)." },
  },
  // DIFFICILES
  {
    infinitive: "bere", french: "boire", difficulty: "difficile", aux: "avere", participle: "bevuto",
    conj: {
      presente: { io: "bevo", tu: "bevi", lui: "beve", noi: "beviamo", voi: "bevete", loro: "bevono" },
      imperfetto: { io: "bevevo", tu: "bevevi", lui: "beveva", noi: "bevevamo", voi: "bevevate", loro: "bevevano" },
      futuro: { io: "berrò", tu: "berrai", lui: "berrà", noi: "berremo", voi: "berrete", loro: "berranno" },
      condizionale: { io: "berrei", tu: "berresti", lui: "berrebbe", noi: "berremmo", voi: "berreste", loro: "berrebbero" },
      congiuntivo: { io: "beva", tu: "beva", lui: "beva", noi: "beviamo", voi: "beviate", loro: "bevano" },
    },
    notes: { presente: "Bere garde le radical latin 'bev-' au présent et à l'imparfait, mais 'ber-' au futur/conditionnel (avec double 'r')." },
  },
  {
    infinitive: "uscire", french: "sortir", difficulty: "difficile", aux: "essere", participle: "uscito",
    conj: {
      presente: { io: "esco", tu: "esci", lui: "esce", noi: "usciamo", voi: "uscite", loro: "escono" },
      imperfetto: { io: "uscivo", tu: "uscivi", lui: "usciva", noi: "uscivamo", voi: "uscivate", loro: "uscivano" },
      futuro: { io: "uscirò", tu: "uscirai", lui: "uscirà", noi: "usciremo", voi: "uscirete", loro: "usciranno" },
      condizionale: { io: "uscirei", tu: "usciresti", lui: "uscirebbe", noi: "usciremmo", voi: "uscireste", loro: "uscirebbero" },
      congiuntivo: { io: "esca", tu: "esca", lui: "esca", noi: "usciamo", voi: "usciate", loro: "escano" },
    },
    notes: { presente: "Uscire change 'u' en 'e' aux personnes fortes : esco, esci, esce, escono — mais usciamo et uscite gardent le 'u'." },
  },
  {
    infinitive: "rimanere", french: "rester", difficulty: "difficile", aux: "essere", participle: "rimasto",
    conj: {
      presente: { io: "rimango", tu: "rimani", lui: "rimane", noi: "rimaniamo", voi: "rimanete", loro: "rimangono" },
      imperfetto: { io: "rimanevo", tu: "rimanevi", lui: "rimaneva", noi: "rimanevamo", voi: "rimanevate", loro: "rimanevano" },
      futuro: { io: "rimarrò", tu: "rimarrai", lui: "rimarrà", noi: "rimarremo", voi: "rimarrete", loro: "rimarranno" },
      condizionale: { io: "rimarrei", tu: "rimarresti", lui: "rimarrebbe", noi: "rimarremmo", voi: "rimarreste", loro: "rimarrebbero" },
      congiuntivo: { io: "rimanga", tu: "rimanga", lui: "rimanga", noi: "rimaniamo", voi: "rimaniate", loro: "rimangano" },
    },
    notes: {
      presente: "'g' apparaît à io et loro : rimango, rimangono.",
      passato_prossimo: "Participe irrégulier : 'rimasto' (pas 'rimanuto').",
    },
  },
  {
    infinitive: "scegliere", french: "choisir", difficulty: "difficile", aux: "avere", participle: "scelto",
    conj: {
      presente: { io: "scelgo", tu: "scegli", lui: "sceglie", noi: "scegliamo", voi: "scegliete", loro: "scelgono" },
      imperfetto: { io: "sceglievo", tu: "sceglievi", lui: "sceglieva", noi: "sceglievamo", voi: "sceglievate", loro: "sceglievano" },
      futuro: { io: "sceglierò", tu: "sceglierai", lui: "sceglierà", noi: "sceglieremo", voi: "sceglierete", loro: "sceglieranno" },
      condizionale: { io: "sceglierei", tu: "sceglieresti", lui: "sceglierebbe", noi: "sceglieremmo", voi: "scegliereste", loro: "sceglierebbero" },
      congiuntivo: { io: "scelga", tu: "scelga", lui: "scelga", noi: "scegliamo", voi: "scegliate", loro: "scelgano" },
    },
    notes: {
      presente: "Alternance 'gli' / 'lg' : scelgo (io), scegli (tu), scelgono (loro). Participe irrégulier : scelto.",
    },
  },
  {
    infinitive: "porre", french: "poser / placer", difficulty: "difficile", aux: "avere", participle: "posto",
    conj: {
      presente: { io: "pongo", tu: "poni", lui: "pone", noi: "poniamo", voi: "ponete", loro: "pongono" },
      imperfetto: { io: "ponevo", tu: "ponevi", lui: "poneva", noi: "ponevamo", voi: "ponevate", loro: "ponevano" },
      futuro: { io: "porrò", tu: "porrai", lui: "porrà", noi: "porremo", voi: "porrete", loro: "porranno" },
      condizionale: { io: "porrei", tu: "porresti", lui: "porrebbe", noi: "porremmo", voi: "porreste", loro: "porrebbero" },
      congiuntivo: { io: "ponga", tu: "ponga", lui: "ponga", noi: "poniamo", voi: "poniate", loro: "pongano" },
    },
    notes: { presente: "Porre vient du latin 'ponere' : radical 'pon-' partout. Modèle pour comporre, proporre, supporre." },
  },
  // RÉFLÉCHIS / PRONOMINAUX
  reflexive("chiamarsi", "s'appeler", "chiam", "chiamato", "are",
    "Chiamarsi = 'mi chiamo Luca' (je m'appelle Luca). Le pronom précède toujours le verbe."),
  reflexive("alzarsi", "se lever", "alz", "alzato", "are"),
  reflexive("lavarsi", "se laver", "lav", "lavato", "are"),
  reflexive("svegliarsi", "se réveiller", "svegli", "svegliato", "are"),
  reflexive("divertirsi", "s'amuser", "divert", "divertito", "ire",
    "Divertirsi suit la conjugaison en -IRE simple : mi diverto, ti diverti, si diverte..."),
  reflexive("sentirsi", "se sentir", "sent", "sentito", "ire"),
  reflexive("ricordarsi", "se souvenir", "ricord", "ricordato", "are"),
  reflexive("vestirsi", "s'habiller", "vest", "vestito", "ire"),
];

// Fix the small typo above (extra space in venire noi form)
rawVerbs.forEach((v) => {
  const c = v.conj.presente;
  if (c) for (const k of PERSONS) c[k] = c[k].trim().replace(/,$/, "");
});

export const VERBS: Verb[] = rawVerbs.map(withPassato);

export function findVerb(inf: string): Verb | undefined {
  return VERBS.find((v) => v.infinitive === inf);
}

// Real-subject alternatives for lui / loro slots to spice up questions
export const SUBJECT_ALIASES: Record<"lui" | "loro", string[]> = {
  lui: ["Luca", "Daniela", "Il gatto", "Mio padre", "La ragazza", "Marco"],
  loro: ["Luca e Marco", "Le ragazze", "Gli alberi", "I miei amici", "Daniela e Angela", "tu ed io"],
};
// "tu ed io" is a "noi" subject; keep it separate for noi
export const NOI_ALIASES = ["tu ed io", "io e Marco", "noi due"];
export const VOI_ALIASES = ["tu e Luca", "voi ragazzi", "tu ed Angela"];
export const TU_ALIASES: string[] = [];
export const IO_ALIASES: string[] = [];

export function displaySubject(person: Person, useAlias: boolean): string {
  if (!useAlias) return PERSON_LABEL[person];
  const pool =
    person === "lui" ? SUBJECT_ALIASES.lui
    : person === "loro" ? SUBJECT_ALIASES.loro
    : person === "noi" ? NOI_ALIASES
    : person === "voi" ? VOI_ALIASES
    : [];
  if (pool.length === 0) return PERSON_LABEL[person];
  return pool[Math.floor(Math.random() * pool.length)];
}