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

/** The three numbers, and whether anything followed them. */
function parts(version: string): { numbers: number[]; prerelease: boolean } {
  const [core, ...rest] = version.split(/[-+]/);
  const numbers = core.split('.').map(part => parseInt(part, 10) || 0);
  // "2.5.0rc1" spells its candidate without a separator; "2.5.0-rc.1" with one.
  const glued = /\d+[a-z]/i.test(core);
  return { numbers, prerelease: rest.length > 0 || glued };
}

/**
 * True when `since` names a release later than the one the site advertises.
 *
 * **A candidate for a release is not that release.** Advertising `2.5.0-rc.1`
 * used to make a page marked `since: "2.5.0"` render "Since 2.5.0" -- the
 * suffix was dropped before comparing, so the two compared equal and the page
 * claimed a version nobody could install. That is precisely the claim this
 * field exists to prevent, and the first prerelease defeated it.
 */
export function isUpcoming(since: string, released: string = VERSION): boolean {
  const a = parts(since);
  const b = parts(released);
  for (let i = 0; i < Math.max(a.numbers.length, b.numbers.length); i++) {
    const delta = (a.numbers[i] ?? 0) - (b.numbers[i] ?? 0);
    if (delta !== 0) return delta > 0;
  }
  // Same numbers. A stable `since` is still upcoming while only a candidate for
  // it is out; a candidate `since` has arrived once the stable one is.
  return !a.prerelease && b.prerelease;
}

/** "Since 2.0.0" for what you can run today; "Landing in 2.5.0" for what you cannot. */
export function sinceLabel(since: string, released: string = VERSION): string {
  return isUpcoming(since, released) ? `Landing in ${since}` : `Since ${since}`;
}

/** Newest first — the order the facet chips are offered in. */
export function sortVersionsDescending(versions: string[]): string[] {
  return [...versions].sort((x, y) => (x === y ? 0 : isUpcoming(x, y) ? -1 : 1));
}
