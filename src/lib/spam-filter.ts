/**
 * Lightweight heuristics to spot bot-generated contact submissions
 * (random consonant strings, dot-stuffed gmail aliases, link spam).
 * Used both to block submissions client-side and to flag rows in admin.
 */

const VOWELS = /[aeiou]/i;

/** "EXiWpigSHaKbtfhhFAHHDVFK" style random strings. */
export function looksLikeGibberish(value: string): boolean {
  const v = value.trim();
  if (v.length < 8) return false;
  if (/\s/.test(v)) {
    // multi-word: only flag when every word is gibberish
    return v.split(/\s+/).filter(Boolean).every((w) => looksLikeGibberish(w));
  }
  if (!/^[A-Za-z]+$/.test(v)) return false;

  const letters = v.split("");
  const vowels = letters.filter((c) => VOWELS.test(c)).length;
  const vowelRatio = vowels / letters.length;

  // random case flipping (aBcDeF...) is a strong bot signal
  let caseFlips = 0;
  for (let i = 1; i < letters.length; i++) {
    const a = letters[i - 1]!;
    const b = letters[i]!;
    if ((a === a.toUpperCase()) !== (b === b.toUpperCase())) caseFlips++;
  }

  return vowelRatio < 0.28 || caseFlips >= Math.max(5, letters.length * 0.4);
}

/** Gmail dot-stuffing: a.t.u.t.er.ow.e.m.6.9.1@gmail.com */
export function looksLikeStuffedEmail(email: string) {
  const local = email.split("@")[0] ?? "";
  const dots = (local.match(/\./g) ?? []).length;
  return dots >= 4;
}

export function containsLinkSpam(text: string) {
  const links = (text.match(/https?:\/\//gi) ?? []).length;
  return links >= 2;
}

export type SpamCandidate = {
  name?: string | null;
  email?: string | null;
  subject?: string | null;
  notes?: string | null;
};

/** True when a contact query looks machine generated. */
export function isSpamLead(lead: SpamCandidate) {
  const name = lead.name ?? "";
  const subject = lead.subject ?? "";
  const notes = lead.notes ?? "";
  const email = lead.email ?? "";

  let score = 0;
  if (looksLikeGibberish(name)) score += 2;
  if (looksLikeGibberish(subject)) score += 2;
  if (looksLikeGibberish(notes)) score += 2;
  if (email && looksLikeStuffedEmail(email)) score += 2;
  if (containsLinkSpam(notes)) score += 2;

  return score >= 2;
}
