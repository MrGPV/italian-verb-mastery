import {
  PERSONS, VERBS, computeAnswer, displaySubjectInfo,
  type Person, type Tense, type Verb,
} from "./verbs";
import type { SessionConfig, StatsMap } from "./storage";

export interface Question {
  verb: Verb;
  tense: Tense;
  person: Person;
  subject: string; // displayed subject
  answer: string;
  // Translation exercises (tense === "infinitivo")
  prompt?: string;          // word to display instead of the italian infinitive
  hideFrench?: boolean;     // hide the french translation subtitle
  alternates?: string[];    // additional accepted answers
  directionLabel?: string;  // "→ Traduis en italien" / "→ Traduis en français"
}

// A session item = one exercise counted in the volume.
// - mode "mixte" → 1 question
// - mode "complet" → up to 6 questions (all persons of the same verb+tense)
export interface Item {
  kind: "mixte" | "complet";
  verb: Verb;
  tense: Tense;
  questions: Question[];
}

function pickWeighted<T>(items: T[], weights: number[]): T {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

function verbWeight(v: Verb, stats: StatsMap): number {
  const s = stats[v.infinitive];
  if (!s || s.ok + s.ko === 0) return 3; // unseen -> medium-high
  const total = s.ok + s.ko;
  const failRate = s.ko / total;
  const daysSince = (Date.now() - s.lastSeen) / (1000 * 60 * 60 * 24);
  return 1 + failRate * 5 + Math.min(daysSince, 7) * 0.3;
}

const SINGLE_FORM: Tense[] = ["participio", "gerundio"];

function subjectFor(tense: Tense, person: Person, useAlias: boolean, needsGender: boolean): { text: string; info: ReturnType<typeof displaySubjectInfo> } {
  const info = displaySubjectInfo(person, useAlias, needsGender);
  if (SINGLE_FORM.includes(tense)) return { text: "→", info };
  if (tense === "imperativo") return { text: `(${person})`, info };
  return { text: info.text, info };
}

function splitFrench(fr: string): string[] {
  return fr.split(/[\/,;]/).map((s) => s.trim()).filter(Boolean);
}

function buildInfinitivoQuestion(verb: Verb): Question {
  return {
    verb, tense: "infinitivo", person: "lui", subject: "→ italiano",
    prompt: verb.french,
    hideFrench: true,
    answer: verb.infinitive,
    directionLabel: "Traduis en italien",
  };
}

export function buildSession(config: SessionConfig, stats: StatsMap): Item[] {
  const DYN: Tense[] = ["presente_progressivo", "infinitivo"];
  const pool = VERBS.filter(
    (v) =>
      config.difficulties.includes(v.difficulty) &&
      config.tenses.some((t) => DYN.includes(t) || v.conj[t]),
  );
  if (pool.length === 0 || config.tenses.length === 0) return [];
  const allTenses: Tense[] = config.tenses.slice();

  const items: Item[] = [];
  for (let i = 0; i < config.count; i++) {
    const weights = pool.map((v) => (config.smart ? verbWeight(v, stats) : 1));
    const verb = pickWeighted(pool, weights);
    // presente_progressivo & infinitivo are generated dynamically and always available
    const availTenses = allTenses.filter(
      (t) => t === "presente_progressivo" || t === "infinitivo" || verb.conj[t],
    );
    if (availTenses.length === 0) { i--; continue; }
    const tense = availTenses[Math.floor(Math.random() * availTenses.length)];

    if (tense === "infinitivo") {
      items.push({ kind: "mixte", verb, tense, questions: [buildInfinitivoQuestion(verb)] });
      continue;
    }

    let availPersons: Person[];
    if (tense === "presente_progressivo") {
      availPersons = [...PERSONS];
    } else {
      const row = verb.conj[tense]!;
      availPersons = PERSONS.filter((p) => row[p]);
    }
    if (availPersons.length === 0) { i--; continue; }

    // For all passato_prossimo exercises: give a gender hint (forces the
    // student to reason about which auxiliary and whether the participle
    // must agree). For essere/reflexive it also drives agreement.
    const needsAgreement = tense === "passato_prossimo";

    if (config.mode === "complet") {
      const useAlias = needsAgreement ? Math.random() < 0.6 : Math.random() < 0.15;
      const questions: Question[] = [];
      for (const p of availPersons) {
        const sf = subjectFor(tense, p, useAlias, needsAgreement);
        const ans = computeAnswer(verb, tense, sf.info);
        if (!ans) continue;
        const q: Question = { verb, tense, person: p, subject: sf.text, answer: ans };
        if (tense === "passato_prossimo" && sf.info.ambiguous) {
          const otherG = sf.info.gender === "m" ? "f" : "m";
          const alt = computeAnswer(verb, tense, { ...sf.info, gender: otherG });
          if (alt && alt !== ans) q.alternates = [alt];
        }
        questions.push(q);
      }
      if (questions.length === 0) { i--; continue; }
      items.push({ kind: "complet", verb, tense, questions });
    } else {
      const person = availPersons[Math.floor(Math.random() * availPersons.length)];
      const useAlias = needsAgreement ? Math.random() < 0.6 : Math.random() < 0.2;
      const sf = subjectFor(tense, person, useAlias, needsAgreement);
      const ans = computeAnswer(verb, tense, sf.info);
      if (!ans) { i--; continue; }
      const q: Question = { verb, tense, person, subject: sf.text, answer: ans };
      if (tense === "passato_prossimo" && sf.info.ambiguous) {
        const otherG = sf.info.gender === "m" ? "f" : "m";
        const alt = computeAnswer(verb, tense, { ...sf.info, gender: otherG });
        if (alt && alt !== ans) q.alternates = [alt];
      }
      items.push({
        kind: "mixte", verb, tense,
        questions: [q],
      });
    }
  }
  return items;
}

export function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

export function isCorrect(input: string, answer: string): boolean {
  return normalize(input) === normalize(answer);
}

export function isCorrectQ(input: string, q: Question): boolean {
  const n = normalize(input);
  if (n === normalize(q.answer)) return true;
  return (q.alternates ?? []).some((a) => normalize(a) === n);
}

// Best reference answer to display for diff highlighting on error.
export function bestReference(input: string, q: Question): string {
  const all = [q.answer, ...(q.alternates ?? [])];
  if (all.length <= 1) return q.answer;
  const n = normalize(input);
  let best = all[0], bestScore = -1;
  for (const a of all) {
    const na = normalize(a);
    let s = 0;
    const min = Math.min(n.length, na.length);
    for (let i = 0; i < min; i++) if (n[i] === na[i]) s++;
    if (s > bestScore) { bestScore = s; best = a; }
  }
  return best;
}