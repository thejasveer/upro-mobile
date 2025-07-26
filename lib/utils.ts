/**
 * Returns initials from a name string.
 * - If the name has two or more words, returns the first letter of the first two words.
 * - If the name is a single word, returns its first two characters.
 * All output is upper‑cased.
 *
 * @param name  The input name, e.g. "word1 word2 word3" or "single"
 * @returns     A 2‑character string of initials.
 */
export function getInitials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "";

  const words = trimmed.split(/\s+/);
  if (words.length === 1) {
    // Single word → first two characters
    return words[0].substring(0, 2).toUpperCase();
  }

  // Multiple words → first letters of first two words
  const [first, second] = words;
  return (first[0] + second[0]).toUpperCase();
}
