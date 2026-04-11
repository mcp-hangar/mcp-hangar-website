import {render, screen} from "@testing-library/react";
import {MemoryRouter} from "react-router-dom";
import Pricing from "../Pricing";

function renderPricing() {
    return render(
        <MemoryRouter initialEntries={["/pricing"]}>
            <Pricing/>
        </MemoryRouter>
    );
}

describe("Pricing", () => {
    it("renders the page heading", () => {
        renderPricing();
        const heading = screen.getByRole("heading", {level: 1});
        expect(heading).toHaveTextContent(/Start free/i);
        expect(heading).toHaveTextContent(/The cloud is coming/i);
    });

    it("renders all three tier cards with headings", () => {
        renderPricing();
        const tierHeadings = screen.getAllByRole("heading", {level: 3});
        const tierNames = tierHeadings.map(h => h.textContent);
        expect(tierNames).toContain("OSS Agent");
        expect(tierNames).toContain("Pro");
        expect(tierNames).toContain("Enterprise");
    });

    it("shows correct pricing", () => {
        renderPricing();
        expect(screen.getByText("Free")).toBeInTheDocument();
        expect(screen.getByText("$29")).toBeInTheDocument();
        const customTexts = screen.getAllByText("Custom");
        expect(customTexts.length).toBeGreaterThan(0);
    });

    it("renders CTA buttons for each tier", () => {
        renderPricing();
        const githubLinks = screen.getAllByRole("link", {name: /View on GitHub/i});
        expect(githubLinks[0]).toHaveAttribute("href", expect.stringContaining("github.com"));
        const earlyAccessLinks = screen.getAllByRole("link", {name: /Join Early Access/i});
        expect(earlyAccessLinks.length).toBeGreaterThanOrEqual(1);
        expect(earlyAccessLinks[0]).toHaveAttribute("href", expect.stringContaining("early-access"));
        expect(screen.getByRole("link", {name: /Join Enterprise Waitlist/i})).toHaveAttribute("href", expect.stringContaining("waitlist"));
    });

    it("renders the feature comparison table", () => {
        renderPricing();
        expect(screen.getByText("Feature Comparison")).toBeInTheDocument();
        expect(screen.getByText("Hangar instances")).toBeInTheDocument();
        expect(screen.getByText("Event retention")).toBeInTheDocument();
        expect(screen.getByText("Team seats")).toBeInTheDocument();
    });

    it("renders comparison table values correctly", () => {
        renderPricing();
        const cellsLocal = screen.getAllByText("Local");
        expect(cellsLocal.length).toBeGreaterThan(0);
        const cells30days = screen.getAllByText("30 days");
        expect(cells30days.length).toBeGreaterThan(0);
    });

    it("renders early access badge on Pro tier", () => {
        renderPricing();
        expect(screen.getByText("3 months free at launch")).toBeInTheDocument();
    });

    it("renders guidance boxes", () => {
        renderPricing();
        expect(screen.getByText(/When OSS is enough/)).toBeInTheDocument();
        expect(screen.getByText(/When to join Pro early access/)).toBeInTheDocument();
        expect(screen.getByText(/When to join Enterprise waitlist/)).toBeInTheDocument();
    });

    it("renders the self-host callout section", () => {
        renderPricing();
        const heading = screen.getByRole("heading", {name: /The agent is yours/i});
        expect(heading).toBeInTheDocument();
        const ossLinks = screen.getAllByRole("link", {name: /OSS Agent Docs/i});
        expect(ossLinks.length).toBeGreaterThanOrEqual(1);
    });

    it("renders navigation with active pricing link", () => {
        renderPricing();
        const pricingLinks = screen.getAllByRole("link", {name: "Pricing"});
        const activeLink = pricingLinks.find(el => el.classList.contains("text-sky-400"));
        expect(activeLink).toBeDefined();
    });

    it("renders footer", () => {
        renderPricing();
        expect(screen.getByText(/© 2026 MCP Hangar/)).toBeInTheDocument();
    });

    it("shows September 2026 launch date", () => {
        renderPricing();
        const sept = screen.getAllByText(/September 2026/);
        expect(sept.length).toBeGreaterThan(0);
    });

    it("renders hero CTA buttons", () => {
        renderPricing();
        expect(screen.getByRole("link", {name: /Get the OSS Agent/i})).toHaveAttribute("href", expect.stringContaining("/docs/"));
    });

    it("renders feature list items for OSS tier", () => {
        renderPricing();
        const items = screen.getAllByText(/Unlimited MCP providers/i);
        expect(items.length).toBeGreaterThan(0);
    });
});
