import {describe, it, expect} from "vitest";
import {isUpcoming, sinceLabel, sortVersionsDescending} from "../lib/version-badge";
import {VERSION} from "../config";

describe("version-badge", () => {
    it("calls a later release upcoming and an earlier one shipped", () => {
        expect(isUpcoming("2.5.0", "2.4.0")).toBe(true);
        expect(isUpcoming("2.4.0", "2.5.0")).toBe(false);
        expect(isUpcoming("2.4.0", "2.4.0")).toBe(false);
    });

    it("compares numerically, not as strings", () => {
        // "1.10.0" < "1.9.0" lexically, and that would mislabel a whole release.
        expect(isUpcoming("1.10.0", "1.9.0")).toBe(true);
        expect(isUpcoming("2.0.0", "1.6.0")).toBe(true);
    });

    it("treats a candidate as earlier than the release it is a candidate for", () => {
        // The bug this replaced: the suffix was dropped before comparing, so
        // advertising 2.5.0-rc.1 made a `since: "2.5.0"` page claim it shipped.
        expect(isUpcoming("2.5.0", "2.5.0-rc.1")).toBe(true);
        expect(isUpcoming("2.5.0", "2.5.0rc1")).toBe(true);
        expect(isUpcoming("2.5.0", "2.5.0-rc.2")).toBe(true);
        // And the other direction: a candidate has arrived once the stable is out.
        expect(isUpcoming("2.5.0rc1", "2.5.0")).toBe(false);
        // A later release is still later, suffix or not.
        expect(isUpcoming("2.6.0", "2.5.0-rc.1")).toBe(true);
        expect(isUpcoming("2.4.0", "2.5.0-rc.1")).toBe(false);
    });

    it("labels a page for a release only a candidate exists of as landing", () => {
        expect(sinceLabel("2.5.0", "2.5.0-rc.1")).toBe("Landing in 2.5.0");
    });

    it("retires 'Landing in' when the advertised version catches up", () => {
        // The point of deriving the badge: bumping VERSION is the only edit.
        expect(sinceLabel("2.5.0", "2.4.0")).toBe("Landing in 2.5.0");
        expect(sinceLabel("2.5.0", "2.5.0")).toBe("Since 2.5.0");
    });

    it("orders the facet chips newest first", () => {
        expect(sortVersionsDescending(["1.6.0", "2.5.0", "2.0.0"])).toEqual([
            "2.5.0",
            "2.0.0",
            "1.6.0",
        ]);
    });

    it("defaults to the advertised version", () => {
        expect(sinceLabel(VERSION)).toBe(`Since ${VERSION}`);
    });
});
