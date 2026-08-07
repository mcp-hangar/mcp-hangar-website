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

    it("ignores a pre-release suffix", () => {
        expect(isUpcoming("2.5.0rc1", "2.5.0")).toBe(false);
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
