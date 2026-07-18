// Italian verb database with conjugations and pedagogical notes.
// Tenses: presente, passato_prossimo, imperfetto, futuro, condizionale, congiuntivo

export type Person = "io" | "tu" | "lui" | "noi" | "voi" | "loro";
export const PERSONS: Person[] = ["io", "tu", "lui", "noi", "voi", "loro"];
export const PERSON_LABEL: Record<Person, string> = {
  io: "io",
  tu: "tu",
  lui: "lui",
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
  | "congiuntivo"
  | "imperativo"
  | "participio"
  | "gerundio";

export const TENSES: { id: Tense; fr: string; it: string }[] = [
  { id: "presente", fr: "Présent", it: "Presente" },
  { id: "passato_prossimo", fr: "Passé composé", it: "Passato prossimo" },
  { id: "imperfetto", fr: "Imparfait", it: "Imperfetto" },
  { id: "futuro", fr: "Futur", it: "Futuro semplice" },
  { id: "condizionale", fr: "Conditionnel", it: "Condizionale presente" },
  { id: "congiuntivo", fr: "Subjonctif", it: "Congiuntivo presente" },
  { id: "imperativo", fr: "Impératif", it: "Imperativo" },
  { id: "participio", fr: "Participe passé", it: "Participio passato" },
  { id: "gerundio", fr: "Gérondif", it: "Gerundio presente" },
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
  conj: Partial<Record<Tense, Partial<Record<Person, string>>>>;
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
    imperativo: { io: "", tu: stem + "a", lui: "", noi: stem + "iamo", voi: stem + "ate", loro: "" },
    participio: { io: "", tu: "", lui: stem + "ato", noi: "", voi: "", loro: "" },
    gerundio: { io: "", tu: "", lui: stem + "ando", noi: "", voi: "", loro: "" },
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
    imperativo: { io: "", tu: stem + "i", lui: "", noi: stem + "iamo", voi: stem + "ete", loro: "" },
    participio: { io: "", tu: "", lui: stem + "uto", noi: "", voi: "", loro: "" },
    gerundio: { io: "", tu: "", lui: stem + "endo", noi: "", voi: "", loro: "" },
  };
}
function regIre(stem: string, isc = false): Record<Tense, Record<Person, string>> {
  const pres = isc
    ? { io: stem + "isco", tu: stem + "isci", lui: stem + "isce", noi: stem + "iamo", voi: stem + "ite", loro: stem + "iscono" }
    : { io: stem + "o", tu: stem + "i", lui: stem + "e", noi: stem + "iamo", voi: stem + "ite", loro: stem + "ono" };
  const cong = isc
    ? { io: stem + "isca", tu: stem + "isca", lui: stem + "isca", noi: stem + "iamo", voi: stem + "iate", loro: stem + "iscano" }
    : { io: stem + "a", tu: stem + "a", lui: stem + "a", noi: stem + "iamo", voi: stem + "iate", loro: stem + "ano" };
  const impTu = isc ? stem + "isci" : stem + "i";
  return {
    presente: pres,
    imperfetto: { io: stem + "ivo", tu: stem + "ivi", lui: stem + "iva", noi: stem + "ivamo", voi: stem + "ivate", loro: stem + "ivano" },
    futuro: { io: stem + "irò", tu: stem + "irai", lui: stem + "irà", noi: stem + "iremo", voi: stem + "irete", loro: stem + "iranno" },
    condizionale: { io: stem + "irei", tu: stem + "iresti", lui: stem + "irebbe", noi: stem + "iremmo", voi: stem + "ireste", loro: stem + "irebbero" },
    congiuntivo: cong,
    passato_prossimo: {} as any,
    imperativo: { io: "", tu: impTu, lui: "", noi: stem + "iamo", voi: stem + "ite", loro: "" },
    participio: { io: "", tu: "", lui: stem + "ito", noi: "", voi: "", loro: "" },
    gerundio: { io: "", tu: "", lui: stem + "endo", noi: "", voi: "", loro: "" },
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
  // Reflexive imperative / participio / gerundio with enclitic pronouns
  const impTu =
    kind === "are" ? stem + "ati" :
    kind === "ere" ? stem + "iti" :
    kind === "ire-isc" ? stem + "isciti" :
    stem + "iti";
  const impNoi = stem + "iamoci";
  const impVoi =
    kind === "are" ? stem + "atevi" :
    kind === "ere" ? stem + "etevi" :
    stem + "itevi";
  const gerund =
    kind === "are" ? stem + "andosi" : stem + "endosi";
  conj.imperativo = { tu: impTu, noi: impNoi, voi: impVoi } as any;
  conj.participio = { lui: participle } as any;
  conj.gerundio = { lui: gerund } as any;
  return {
    infinitive, french, difficulty: "riflessivo", aux: "essere", participle,
    gerund,
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
  {
    infinitive: "vedere", french: "voir", difficulty: "courant", aux: "avere", participle: "visto",
    gerund: "vedendo",
    conj: {
      presente: { io: "vedo", tu: "vedi", lui: "vede", noi: "vediamo", voi: "vedete", loro: "vedono" },
      imperfetto: { io: "vedevo", tu: "vedevi", lui: "vedeva", noi: "vedevamo", voi: "vedevate", loro: "vedevano" },
      futuro: { io: "vedrò", tu: "vedrai", lui: "vedrà", noi: "vedremo", voi: "vedrete", loro: "vedranno" },
      condizionale: { io: "vedrei", tu: "vedresti", lui: "vedrebbe", noi: "vedremmo", voi: "vedreste", loro: "vedrebbero" },
      congiuntivo: { io: "veda", tu: "veda", lui: "veda", noi: "vediamo", voi: "vediate", loro: "vedano" },
    },
    notes: { presente: "Vedere a un participe irrégulier ('visto') et un futur contracté ('vedrò')." },
  },
  {
    infinitive: "sentire", french: "entendre / sentir", difficulty: "courant", aux: "avere", participle: "sentito",
    conj: regIre("sent"),
    notes: { presente: "Sentire = entendre (perception). Se conjugue en -IRE simple (sans -isc-)." },
  },
  {
    infinitive: "prendere", french: "prendre", difficulty: "courant", aux: "avere", participle: "preso",
    gerund: "prendendo",
    conj: {
      presente: { io: "prendo", tu: "prendi", lui: "prende", noi: "prendiamo", voi: "prendete", loro: "prendono" },
      imperfetto: { io: "prendevo", tu: "prendevi", lui: "prendeva", noi: "prendevamo", voi: "prendevate", loro: "prendevano" },
      futuro: { io: "prenderò", tu: "prenderai", lui: "prenderà", noi: "prenderemo", voi: "prenderete", loro: "prenderanno" },
      condizionale: { io: "prenderei", tu: "prenderesti", lui: "prenderebbe", noi: "prenderemmo", voi: "prendereste", loro: "prenderebbero" },
      congiuntivo: { io: "prenda", tu: "prenda", lui: "prenda", noi: "prendiamo", voi: "prendiate", loro: "prendano" },
    },
    notes: { passato_prossimo: "Participe irrégulier : 'preso'." },
  },
  {
    infinitive: "mettere", french: "mettre / poser", difficulty: "courant", aux: "avere", participle: "messo",
    gerund: "mettendo",
    conj: {
      presente: { io: "metto", tu: "metti", lui: "mette", noi: "mettiamo", voi: "mettete", loro: "mettono" },
      imperfetto: { io: "mettevo", tu: "mettevi", lui: "metteva", noi: "mettevamo", voi: "mettevate", loro: "mettevano" },
      futuro: { io: "metterò", tu: "metterai", lui: "metterà", noi: "metteremo", voi: "metterete", loro: "metteranno" },
      condizionale: { io: "metterei", tu: "metteresti", lui: "metterebbe", noi: "metteremmo", voi: "mettereste", loro: "metterebbero" },
      congiuntivo: { io: "metta", tu: "metta", lui: "metta", noi: "mettiamo", voi: "mettiate", loro: "mettano" },
    },
    notes: { passato_prossimo: "Participe irrégulier : 'messo'." },
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
  { infinitive: "cantare", french: "chanter", difficulty: "regulier", aux: "avere", participle: "cantato", conj: regAre("cant"), notes: { presente: "Verbe régulier en -ARE." } },
  { infinitive: "lavorare", french: "travailler", difficulty: "regulier", aux: "avere", participle: "lavorato", conj: regAre("lavor") },
  { infinitive: "vendere", french: "vendre", difficulty: "regulier", aux: "avere", participle: "venduto", conj: regEre("vend") },
  { infinitive: "partire", french: "partir", difficulty: "regulier", aux: "essere", participle: "partito", conj: regIre("part"), notes: { passato_prossimo: "Verbe de mouvement : auxiliaire ESSERE, le participe s'accorde avec le sujet." } },
  { infinitive: "ricevere", french: "recevoir", difficulty: "regulier", aux: "avere", participle: "ricevuto", conj: regEre("ricev") },
  { infinitive: "capire", french: "comprendre / saisir", difficulty: "regulier", aux: "avere", participle: "capito", conj: regIre("cap", true), notes: { presente: "Verbe en -IRE avec l'infixe -ISC- : capisco, capisci, capisce, capiamo, capite, capiscono." } },
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
  {
    infinitive: "tenere", french: "tenir / garder", difficulty: "irregulier", aux: "avere", participle: "tenuto",
    conj: {
      presente: { io: "tengo", tu: "tieni", lui: "tiene", noi: "teniamo", voi: "tenete", loro: "tengono" },
      imperfetto: { io: "tenevo", tu: "tenevi", lui: "teneva", noi: "tenevamo", voi: "tenevate", loro: "tenevano" },
      futuro: { io: "terrò", tu: "terrai", lui: "terrà", noi: "terremo", voi: "terrete", loro: "terranno" },
      condizionale: { io: "terrei", tu: "terresti", lui: "terrebbe", noi: "terremmo", voi: "terreste", loro: "terrebbero" },
      congiuntivo: { io: "tenga", tu: "tenga", lui: "tenga", noi: "teniamo", voi: "teniate", loro: "tengano" },
    },
    notes: { presente: "Alternance 'teng-' / 'tien-' / 'ten-'. Futur avec double 'r' : terrò." },
  },
  {
    infinitive: "salire", french: "monter", difficulty: "irregulier", aux: "essere", participle: "salito",
    conj: {
      presente: { io: "salgo", tu: "sali", lui: "sale", noi: "saliamo", voi: "salite", loro: "salgono" },
      imperfetto: { io: "salivo", tu: "salivi", lui: "saliva", noi: "salivamo", voi: "salivate", loro: "salivano" },
      futuro: { io: "salirò", tu: "salirai", lui: "salirà", noi: "saliremo", voi: "salirete", loro: "saliranno" },
      condizionale: { io: "salirei", tu: "saliresti", lui: "salirebbe", noi: "saliremmo", voi: "salireste", loro: "salirebbero" },
      congiuntivo: { io: "salga", tu: "salga", lui: "salga", noi: "saliamo", voi: "saliate", loro: "salgano" },
    },
    notes: { presente: "'g' apparaît à io et loro : salgo, salgono." },
  },
  {
    infinitive: "morire", french: "mourir", difficulty: "irregulier", aux: "essere", participle: "morto",
    conj: {
      presente: { io: "muoio", tu: "muori", lui: "muore", noi: "moriamo", voi: "morite", loro: "muoiono" },
      imperfetto: { io: "morivo", tu: "morivi", lui: "moriva", noi: "morivamo", voi: "morivate", loro: "morivano" },
      futuro: { io: "morirò", tu: "morirai", lui: "morirà", noi: "moriremo", voi: "morirete", loro: "moriranno" },
      condizionale: { io: "morirei", tu: "moriresti", lui: "morirebbe", noi: "moriremmo", voi: "morireste", loro: "morirebbero" },
      congiuntivo: { io: "muoia", tu: "muoia", lui: "muoia", noi: "moriamo", voi: "moriate", loro: "muoiano" },
    },
    notes: { presente: "Diphtongue 'uo' aux personnes fortes : muoio, muori... Participe irrégulier : 'morto'." },
  },
  {
    infinitive: "piacere", french: "plaire", difficulty: "irregulier", aux: "essere", participle: "piaciuto",
    conj: {
      presente: { io: "piaccio", tu: "piaci", lui: "piace", noi: "piacciamo", voi: "piacete", loro: "piacciono" },
      imperfetto: { io: "piacevo", tu: "piacevi", lui: "piaceva", noi: "piacevamo", voi: "piacevate", loro: "piacevano" },
      futuro: { io: "piacerò", tu: "piacerai", lui: "piacerà", noi: "piaceremo", voi: "piacerete", loro: "piaceranno" },
      condizionale: { io: "piacerei", tu: "piaceresti", lui: "piacerebbe", noi: "piaceremmo", voi: "piacereste", loro: "piacerebbero" },
      congiuntivo: { io: "piaccia", tu: "piaccia", lui: "piaccia", noi: "piacciamo", voi: "piacciate", loro: "piacciano" },
    },
    notes: { presente: "Double 'c' à io et loro : piaccio, piacciono. Se construit à l'envers : 'mi piace' = ça me plaît." },
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
  {
    infinitive: "tradurre", french: "traduire", difficulty: "difficile", aux: "avere", participle: "tradotto",
    gerund: "traducendo",
    conj: {
      presente: { io: "traduco", tu: "traduci", lui: "traduce", noi: "traduciamo", voi: "traducete", loro: "traducono" },
      imperfetto: { io: "traducevo", tu: "traducevi", lui: "traduceva", noi: "traducevamo", voi: "traducevate", loro: "traducevano" },
      futuro: { io: "tradurrò", tu: "tradurrai", lui: "tradurrà", noi: "tradurremo", voi: "tradurrete", loro: "tradurranno" },
      condizionale: { io: "tradurrei", tu: "tradurresti", lui: "tradurrebbe", noi: "tradurremmo", voi: "tradurreste", loro: "tradurrebbero" },
      congiuntivo: { io: "traduca", tu: "traduca", lui: "traduca", noi: "traduciamo", voi: "traduciate", loro: "traducano" },
    },
    notes: { presente: "Du latin 'traducere' : radical 'traduc-'. Futur avec double 'r' : tradurrò. Participe : tradotto." },
  },
  {
    infinitive: "condurre", french: "conduire / mener", difficulty: "difficile", aux: "avere", participle: "condotto",
    gerund: "conducendo",
    conj: {
      presente: { io: "conduco", tu: "conduci", lui: "conduce", noi: "conduciamo", voi: "conducete", loro: "conducono" },
      imperfetto: { io: "conducevo", tu: "conducevi", lui: "conduceva", noi: "conducevamo", voi: "conducevate", loro: "conducevano" },
      futuro: { io: "condurrò", tu: "condurrai", lui: "condurrà", noi: "condurremo", voi: "condurrete", loro: "condurranno" },
      condizionale: { io: "condurrei", tu: "condurresti", lui: "condurrebbe", noi: "condurremmo", voi: "condurreste", loro: "condurrebbero" },
      congiuntivo: { io: "conduca", tu: "conduca", lui: "conduca", noi: "conduciamo", voi: "conduciate", loro: "conducano" },
    },
    notes: { presente: "Même modèle que tradurre : radical 'conduc-', participe 'condotto'." },
  },
  {
    infinitive: "cogliere", french: "cueillir / saisir", difficulty: "difficile", aux: "avere", participle: "colto",
    gerund: "cogliendo",
    conj: {
      presente: { io: "colgo", tu: "cogli", lui: "coglie", noi: "cogliamo", voi: "cogliete", loro: "colgono" },
      imperfetto: { io: "coglievo", tu: "coglievi", lui: "coglieva", noi: "coglievamo", voi: "coglievate", loro: "coglievano" },
      futuro: { io: "coglierò", tu: "coglierai", lui: "coglierà", noi: "coglieremo", voi: "coglierete", loro: "coglieranno" },
      condizionale: { io: "coglierei", tu: "coglieresti", lui: "coglierebbe", noi: "coglieremmo", voi: "cogliereste", loro: "coglierebbero" },
      congiuntivo: { io: "colga", tu: "colga", lui: "colga", noi: "cogliamo", voi: "cogliate", loro: "colgano" },
    },
    notes: { presente: "Comme scegliere : alternance 'gli' / 'lg'. Participe irrégulier : colto." },
  },
  {
    infinitive: "spegnere", french: "éteindre", difficulty: "difficile", aux: "avere", participle: "spento",
    gerund: "spegnendo",
    conj: {
      presente: { io: "spengo", tu: "spegni", lui: "spegne", noi: "spegniamo", voi: "spegnete", loro: "spengono" },
      imperfetto: { io: "spegnevo", tu: "spegnevi", lui: "spegneva", noi: "spegnevamo", voi: "spegnevate", loro: "spegnevano" },
      futuro: { io: "spegnerò", tu: "spegnerai", lui: "spegnerà", noi: "spegneremo", voi: "spegnerete", loro: "spegneranno" },
      condizionale: { io: "spegnerei", tu: "spegneresti", lui: "spegnerebbe", noi: "spegneremmo", voi: "spegnereste", loro: "spegnerebbero" },
      congiuntivo: { io: "spenga", tu: "spenga", lui: "spenga", noi: "spegniamo", voi: "spegniate", loro: "spengano" },
    },
    notes: { presente: "Alternance 'gn' / 'ng' : spegno / spengo. Participe irrégulier : spento." },
  },
  {
    infinitive: "tacere", french: "se taire", difficulty: "difficile", aux: "avere", participle: "taciuto",
    gerund: "tacendo",
    conj: {
      presente: { io: "taccio", tu: "taci", lui: "tace", noi: "tacciamo", voi: "tacete", loro: "tacciono" },
      imperfetto: { io: "tacevo", tu: "tacevi", lui: "taceva", noi: "tacevamo", voi: "tacevate", loro: "tacevano" },
      futuro: { io: "tacerò", tu: "tacerai", lui: "tacerà", noi: "taceremo", voi: "tacerete", loro: "taceranno" },
      condizionale: { io: "tacerei", tu: "taceresti", lui: "tacerebbe", noi: "taceremmo", voi: "tacereste", loro: "tacerebbero" },
      congiuntivo: { io: "taccia", tu: "taccia", lui: "taccia", noi: "tacciamo", voi: "tacciate", loro: "tacciano" },
    },
    notes: { presente: "Double 'c' à io et loro : taccio, tacciono." },
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
  reflexive("pettinarsi", "se coiffer / se peigner", "pettin", "pettinato", "are"),
  reflexive("addormentarsi", "s'endormir", "addorment", "addormentato", "are"),
  reflexive("preoccuparsi", "s'inquiéter / se préoccuper", "preoccup", "preoccupato", "are"),
  reflexive("fermarsi", "s'arrêter", "ferm", "fermato", "are"),
];

// Fix the small typo above (extra space in venire noi form)
rawVerbs.forEach((v) => {
  const c = v.conj.presente;
  if (c) for (const k of PERSONS) {
    const val = c[k];
    if (val) c[k] = val.trim().replace(/,$/, "");
  }
});

// Add imperativo (tu/noi/voi), participio and gerundio to irregular verbs.
const IRREG_EXTRAS: Record<string, { imp?: { tu?: string; noi?: string; voi?: string }; gerund: string }> = {
  essere:    { imp: { tu: "sii",   noi: "siamo",     voi: "siate"    }, gerund: "essendo" },
  avere:     { imp: { tu: "abbi",  noi: "abbiamo",   voi: "abbiate"  }, gerund: "avendo" },
  andare:    { imp: { tu: "va'",   noi: "andiamo",   voi: "andate"   }, gerund: "andando" },
  fare:      { imp: { tu: "fa'",   noi: "facciamo",  voi: "fate"     }, gerund: "facendo" },
  stare:     { imp: { tu: "sta'",  noi: "stiamo",    voi: "state"    }, gerund: "stando" },
  dare:      { imp: { tu: "da'",   noi: "diamo",     voi: "date"     }, gerund: "dando" },
  potere:    { gerund: "potendo" }, // défectif : pas d'impératif
  volere:    { imp: { tu: "vogli", noi: "vogliamo",  voi: "vogliate" }, gerund: "volendo" },
  dovere:    { gerund: "dovendo" },
  sapere:    { imp: { tu: "sappi", noi: "sappiamo",  voi: "sappiate" }, gerund: "sapendo" },
  venire:    { imp: { tu: "vieni", noi: "veniamo",   voi: "venite"   }, gerund: "venendo" },
  dire:      { imp: { tu: "di'",   noi: "diciamo",   voi: "dite"     }, gerund: "dicendo" },
  bere:      { imp: { tu: "bevi",  noi: "beviamo",   voi: "bevete"   }, gerund: "bevendo" },
  uscire:    { imp: { tu: "esci",  noi: "usciamo",   voi: "uscite"   }, gerund: "uscendo" },
  rimanere:  { imp: { tu: "rimani",noi: "rimaniamo", voi: "rimanete" }, gerund: "rimanendo" },
  scegliere: { imp: { tu: "scegli",noi: "scegliamo", voi: "scegliete"}, gerund: "scegliendo" },
  porre:     { imp: { tu: "poni",  noi: "poniamo",   voi: "ponete"   }, gerund: "ponendo" },
  vedere:    { imp: { tu: "vedi",  noi: "vediamo",   voi: "vedete"   }, gerund: "vedendo" },
  prendere:  { imp: { tu: "prendi",noi: "prendiamo", voi: "prendete" }, gerund: "prendendo" },
  mettere:   { imp: { tu: "metti", noi: "mettiamo",  voi: "mettete"  }, gerund: "mettendo" },
  tenere:    { imp: { tu: "tieni", noi: "teniamo",   voi: "tenete"   }, gerund: "tenendo" },
  salire:    { imp: { tu: "sali",  noi: "saliamo",   voi: "salite"   }, gerund: "salendo" },
  morire:    { imp: { tu: "muori", noi: "moriamo",   voi: "morite"   }, gerund: "morendo" },
  piacere:   { imp: { tu: "piaci", noi: "piacciamo", voi: "piacete"  }, gerund: "piacendo" },
  tradurre:  { imp: { tu: "traduci",noi: "traduciamo",voi: "traducete"}, gerund: "traducendo" },
  condurre:  { imp: { tu: "conduci",noi: "conduciamo",voi: "conducete"}, gerund: "conducendo" },
  cogliere:  { imp: { tu: "cogli", noi: "cogliamo",  voi: "cogliete" }, gerund: "cogliendo" },
  spegnere:  { imp: { tu: "spegni",noi: "spegniamo", voi: "spegnete" }, gerund: "spegnendo" },
  tacere:    { imp: { tu: "taci",  noi: "tacciamo",  voi: "tacete"   }, gerund: "tacendo" },
};
function withExtras(v: Verb): Verb {
  const conj: Partial<Record<Tense, Partial<Record<Person, string>>>> = { ...v.conj };
  // Reflexives already have their extras set by reflexive().
  if (v.difficulty !== "riflessivo") {
    if (!conj.participio || !conj.participio.lui) {
      conj.participio = { lui: v.participle };
    }
    const gerund = v.gerund ?? IRREG_EXTRAS[v.infinitive]?.gerund;
    if (gerund && (!conj.gerundio || !conj.gerundio.lui)) {
      conj.gerundio = { lui: gerund };
    }
    const extras = IRREG_EXTRAS[v.infinitive];
    if (extras?.imp && (!conj.imperativo || Object.values(conj.imperativo).every((x) => !x))) {
      conj.imperativo = { tu: extras.imp.tu, noi: extras.imp.noi, voi: extras.imp.voi };
    }
  }
  return { ...v, conj };
}

export const VERBS: Verb[] = rawVerbs.map(withPassato).map(withExtras);

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
  if (!useAlias) {
    // 3ème pers. singulier : alterne "lui" / "lei" (jamais "lui/lei")
    if (person === "lui") return Math.random() < 0.5 ? "lui" : "lei";
    return PERSON_LABEL[person];
  }
  const pool =
    person === "lui" ? SUBJECT_ALIASES.lui
    : person === "loro" ? SUBJECT_ALIASES.loro
    : person === "noi" ? NOI_ALIASES
    : person === "voi" ? VOI_ALIASES
    : [];
  if (pool.length === 0) {
    if (person === "lui") return Math.random() < 0.5 ? "lui" : "lei";
    return PERSON_LABEL[person];
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

// ---------- Regular reference (for irregular-highlighting in the dictionary) ---------
export function regularReference(v: Verb): Partial<Record<Tense, Partial<Record<Person, string>>>> {
  const inf = v.infinitive;
  const isRefl = v.difficulty === "riflessivo";
  const base = isRefl ? inf.slice(0, -2) + "e" : inf;
  let raw: Record<Tense, Record<Person, string>> | null = null;
  let stem = "";
  if (base.endsWith("are")) { stem = base.slice(0, -3); raw = regAre(stem); }
  else if (base.endsWith("ere")) { stem = base.slice(0, -3); raw = regEre(stem); }
  else if (base.endsWith("ire")) { stem = base.slice(0, -3); raw = regIre(stem); }
  else if (base.endsWith("rre")) { stem = base.slice(0, -3); raw = regEre(stem); }
  if (!raw) return {};
  const regPart = raw.participio.lui!;
  if (isRefl) {
    const refl = toReflexive(raw);
    refl.passato_prossimo = reflexivePassato(regPart);
    const gerund = base.endsWith("are") ? stem + "andosi" : stem + "endosi";
    refl.gerundio = { io: "", tu: "", lui: gerund, noi: "", voi: "", loro: "" };
    refl.participio = { io: "", tu: "", lui: regPart, noi: "", voi: "", loro: "" };
    return refl;
  }
  raw.passato_prossimo = passato(v.aux, regPart);
  return raw;
}

export type DiffPart = { text: string; bold: boolean };
function simpleDiff(a: string, r: string): DiffPart[] {
  if (a === r) return [{ text: a, bold: false }];
  let p = 0;
  while (p < a.length && p < r.length && a[p] === r[p]) p++;
  let s = 0;
  while (s < a.length - p && s < r.length - p && a[a.length - 1 - s] === r[r.length - 1 - s]) s++;
  const parts: DiffPart[] = [];
  if (p > 0) parts.push({ text: a.slice(0, p), bold: false });
  if (a.length - p - s > 0) parts.push({ text: a.slice(p, a.length - s), bold: true });
  if (s > 0) parts.push({ text: a.slice(a.length - s), bold: false });
  return parts;
}
export function diffParts(actual: string, ref?: string): DiffPart[] {
  if (!actual) return [];
  if (!ref) return [{ text: actual, bold: true }];
  const aw = actual.split(" ");
  const rw = ref.split(" ");
  if (aw.length !== rw.length) return simpleDiff(actual, ref);
  const parts: DiffPart[] = [];
  aw.forEach((word, i) => {
    if (i > 0) parts.push({ text: " ", bold: false });
    parts.push(...simpleDiff(word, rw[i]));
  });
  return parts;
}