import {render, screen, within} from "@testing-library/react";
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
        // h1 contains both "Start free." and "Scale when ready."
        const heading = screen.getByRole("heading", {level: 1});
        expect(heading).toHaveTextContent(/Start free/i);
        expect(heading).toHaveTextContent(/Scale when ready/i);
    });

    it("renders all three tier cards with headings", () => {
        renderPricing();
        const tierHeadings = screen.getAllByRole("heading", {level: 3});
        const tierNames = tierHeadings.map(h => h.textContent);
        expect(tierNames).toContain("Free");
        expect(tierNames).toContain("Pro");
        expect(tierNames).toContain("Enterprise");
    });

    it("shows correct pricing", () => {
        renderPricing();
        expect(screen.getByText("$0")).toBeInTheDocument();
        expect(screen.getByText("$49")).toBeInTheDocument();
        // "Custom" appears in tier price
        const customTexts = screen.getAllByText("Custom");
        expect(customTexts.length).toBeGreaterThan(0);
    });

    it("renders CTA buttons for each tier", () => {
        renderPricing();
        expect(screen.getByRole("link", {name: /Start for Free/i})).toHaveAttribute("href", expect.stringContaining("/signup"));
        expect(screen.getByRole("link", {name: /Start Free Trial/i})).toHaveAttribute("href", expect.stringContaining("plan=pro"));
        expect(screen.getByRole("link", {name: /Contact Sales/i})).toHaveAttribute("href", expect.stringContaining("contact-sales"));
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
        const cells7days = screen.getAllByText("7 days");
        expect(cells7days.length).toBeGreaterThan(0);
        const cells30days = screen.getAllByText("30 days");
        expect(cells30days.length).toBeGreaterThan(0);
    });

    it("renders 'Most Popular' badge on Pro tier", () => {
        renderPricing();
        expect(screen.getByText("Most Popular")).toBeInTheDocument();
    });

    it("renders upgrade trigger cards", () => {
        renderPricing();
        expect(screen.getByText(/When to upgrade Free → Pro/)).toBeInTheDocument();
        expect(screen.getByText(/When to upgrade Pro → Enterprise/)).toBeInTheDocument();
        expect(screen.getByText(/OSS agent always free/)).toBeInTheDocument();
    });

    it("renders the self-host callout section", () => {
        renderPricing();
        const heading = screen.getByRole("heading", {name: /Prefer to self-host/i});
        expect(heading).toBeInTheDocument();
        expect(screen.getByRole("link", {name: /OSS Agent Docs/i})).toBeInTheDocument();
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

    it("links to OSS quickstart docs", () => {
        renderPricing();
        const link = screen.getByRole("link", {name: /standalone/i});
        expect(link).toHaveAttribute("href", expect.stringContaining("/docs/oss/"));
    });

    it("renders feature list items with check icons", () => {
        renderPricing();
        // Each tier has a feature list — check that at least one feature mentions Hangar
        const items = screen.getAllByText(/Hangar instance/i);
        expect(items.length).toBeGreaterThan(0);
    });
});
