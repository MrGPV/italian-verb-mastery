import { PERSONS, VERBS, type Person, type Tense, type Verb, displaySubject } from "./verbs";
import type { SessionConfig, StatsMap } from "./storage";

export interface Question {
  verb: Verb;
  tense: Tense;
  person: Person;
  subject: string; // displayed subject
  answer: string;
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

function subjectFor(tense: Tense, person: Person, useAlias: boolean): string {
  if (SINGLE_FORM.includes(tense)) return "→";
  if (tense === "imperativo") return person + " !";
  return displaySubject(person, useAlias);
}

export function buildSession(config: SessionConfig, stats: StatsMap): Item[] {
  const pool = VERBS.filter(
    (v) => config.difficulties.includes(v.difficulty) && config.tenses.some((t) => v.conj[t]),
  );
  if (pool.length === 0 || config.tenses.length === 0) return [];

  const items: Item[] = [];
  for (let i = 0; i < config.count; i++) {
    const weights = pool.map((v) => (config.smart ? verbWeight(v, stats) : 1));
    const verb = pickWeighted(pool, weights);
    const availTenses = config.tenses.filter((t) => verb.conj[t]);
    if (availTenses.length === 0) { i--; continue; }
    const tense = availTenses[Math.floor(Math.random() * availTenses.length)];
    const row = verb.conj[tense]!;
    const availPersons = PERSONS.filter((p) => row[p]);
    if (availPersons.length === 0) { i--; continue; }

    if (config.mode === "complet") {
      const useAlias = Math.random() < 0.15;
      const questions: Question[] = [];
      for (const p of availPersons) {
        const ans = row[p];
        if (!ans) continue;
        questions.push({ verb, tense, person: p, subject: subjectFor(tense, p, useAlias), answer: ans });
      }
      if (questions.length === 0) { i--; continue; }
      items.push({ kind: "complet", verb, tense, questions });
    } else {
      const person = availPersons[Math.floor(Math.random() * availPersons.length)];
      const ans = row[person]!;
      items.push({
        kind: "mixte", verb, tense,
        questions: [{ verb, tense, person, subject: subjectFor(tense, person, Math.random() < 0.2), answer: ans }],
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