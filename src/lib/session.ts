import { PERSONS, VERBS, type Person, type Tense, type Verb, displaySubject } from "./verbs";
import type { SessionConfig, StatsMap } from "./storage";

export interface Question {
  verb: Verb;
  tense: Tense;
  person: Person;
  subject: string; // displayed subject
  answer: string;
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

export function buildSession(config: SessionConfig, stats: StatsMap): Question[] {
  const pool = VERBS.filter(
    (v) => config.difficulties.includes(v.difficulty) && config.tenses.some((t) => v.conj[t]),
  );
  if (pool.length === 0 || config.tenses.length === 0) return [];

  const questions: Question[] = [];

  if (config.mode === "complet") {
    // pick N/6 verb+tense combos, each spawns 6 questions (io..loro)
    const groups = Math.max(1, Math.ceil(config.count / 6));
    for (let g = 0; g < groups && questions.length < config.count; g++) {
      const weights = pool.map((v) => (config.smart ? verbWeight(v, stats) : 1));
      const verb = pickWeighted(pool, weights);
      const availTenses = config.tenses.filter((t) => verb.conj[t]);
      const tense = availTenses[Math.floor(Math.random() * availTenses.length)];
      for (const p of PERSONS) {
        if (questions.length >= config.count) break;
        const ans = verb.conj[tense]?.[p];
        if (!ans) continue;
        questions.push({
          verb,
          tense,
          person: p,
          subject: displaySubject(p, Math.random() < 0.3),
          answer: ans,
        });
      }
    }
  } else {
    for (let i = 0; i < config.count; i++) {
      const weights = pool.map((v) => (config.smart ? verbWeight(v, stats) : 1));
      const verb = pickWeighted(pool, weights);
      const availTenses = config.tenses.filter((t) => verb.conj[t]);
      const tense = availTenses[Math.floor(Math.random() * availTenses.length)];
      const person = PERSONS[Math.floor(Math.random() * PERSONS.length)];
      const ans = verb.conj[tense]?.[person];
      if (!ans) {
        i--;
        continue;
      }
      questions.push({
        verb,
        tense,
        person,
        subject: displaySubject(person, Math.random() < 0.35),
        answer: ans,
      });
    }
  }

  return questions;
}

export function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

export function isCorrect(input: string, answer: string): boolean {
  return normalize(input) === normalize(answer);
}