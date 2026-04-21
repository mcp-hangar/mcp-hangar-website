import {CLOUD_APP_URL, LINKS, INSTALL_COMMAND, DOCS_BASE} from "../config";

describe("config", () => {
    it("exports CLOUD_APP_URL as a valid URL", () => {
        expect(CLOUD_APP_URL).toMatch(/^https:\/\//);
    });

    it("exports INSTALL_COMMAND containing pip", () => {
        expect(INSTALL_COMMAND).toContain("pip");
        expect(INSTALL_COMMAND).toContain("mcp-hangar");
    });

    it("exports LINKS with expected keys", () => {
        expect(LINKS.github).toContain("github.com");
        expect(LINKS.cloudWaitlist).toContain("/waitlist");
        expect(LINKS.ossQuickstart).toContain(DOCS_BASE);
        expect(LINKS.cloudDocs).toContain("/cloud/");
        expect(LINKS.ossDocs).toContain("/oss/");
        expect(LINKS.blog).toContain("/blog/");
        expect(LINKS.pypi).toContain("pypi.org");
    });

    it("LINKS are all strings", () => {
        for (const [, value] of Object.entries(LINKS)) {
            expect(typeof value).toBe("string");
        }
    });
});

