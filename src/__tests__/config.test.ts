import {CLOUD_APP_URL, LINKS, INSTALL_COMMAND, DOCS_BASE} from "../config";

describe("config", () => {
    it("exports CLOUD_APP_URL as a valid URL", () => {
        expect(CLOUD_APP_URL).toMatch(/^https:\/\//);
    });

    it("exports INSTALL_COMMAND containing curl", () => {
        expect(INSTALL_COMMAND).toContain("curl");
        expect(INSTALL_COMMAND).toContain("mcp-hangar.io");
    });

    it("exports LINKS with expected keys", () => {
        expect(LINKS.github).toContain("github.com");
        expect(LINKS.cloudSignup).toContain(CLOUD_APP_URL);
        expect(LINKS.cloudSignIn).toBe(CLOUD_APP_URL);
        expect(LINKS.ossQuickstart).toContain(DOCS_BASE);
        expect(LINKS.cloudDocs).toContain("/cloud/");
        expect(LINKS.ossDocs).toContain("/oss/");
        expect(LINKS.blog).toContain("/blog/");
        expect(LINKS.contactSales).toContain("contact-sales");
        expect(LINKS.pypi).toContain("pypi.org");
    });

    it("LINKS are all strings", () => {
        for (const [, value] of Object.entries(LINKS)) {
            expect(typeof value).toBe("string");
        }
    });
});

