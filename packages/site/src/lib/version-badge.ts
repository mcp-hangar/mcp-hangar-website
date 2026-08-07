/**
 * A Learn page carries the release its subject became true in. Whether that
 * reads as history or as a promise depends on what is released *now*, so the
 * badge is derived from `VERSION` rather than frozen into the frontmatter:
 * bumping the advertised version is what retires "Landing in", and nothing
 * else has to be remembered.
 *
 * This replaced a two-value enum whose labels lived in four render sites. It
 * could say "1.6.0" or "2.0.0" and nothing else, so every release after those
 * two either went unlabelled or meant editing the mapping in all four.
 */
import { VERSION } from '../config';

/** Numeric release parts; a pre-release suffix is dropped ("2.5.0rc1" -> 2.5.0). */
function parts(version: string): number[] {
  return version.split('.').map(part => parseInt(part, 10) || 0);
}

/** True when `since` names a release later than the one the site advertises. */
export function isUpcoming(since: string, released: string = VERSION): boolean {
  const a = parts(since);
  const b = parts(released);
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const delta = (a[i] ?? 0) - (b[i] ?? 0);
    if (delta !== 0) return delta > 0;
  }
  return false;
}

/** "Since 2.0.0" for what you can run today; "Landing in 2.5.0" for what you cannot. */
export function sinceLabel(since: string, released: string = VERSION): string {
  return isUpcoming(since, released) ? `Landing in ${since}` : `Since ${since}`;
}

/** Newest first — the order the facet chips are offered in. */
export function sortVersionsDescending(versions: string[]): string[] {
  return [...versions].sort((x, y) => (x === y ? 0 : isUpcoming(x, y) ? -1 : 1));
}
