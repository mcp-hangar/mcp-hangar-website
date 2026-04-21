import {render, screen} from "@testing-library/react";
import {MemoryRouter} from "react-router-dom";
import {HelmetProvider} from "react-helmet-async";
import Pricing from "../Pricing";

function renderPricing() {
    return render(
        <HelmetProvider>
            <MemoryRouter initialEntries={["/pricing"]}>
                <Pricing/>
            </MemoryRouter>
        </HelmetProvider>
    );
}

describe("Pricing", () => {
    it("renders the page heading", () => {
        renderPricing();
        const heading = screen.getByRole("heading", {level: 1});
        expect(heading).toHaveTextContent(/Agent v1.0 is here/i);
    });

    it("renders all tier cards with headings", () => {
        renderPricing();
        const tierHeadings = screen.getAllByRole("heading", {level: 3});
        const tierNames = tierHeadings.map(h => h.textContent);
        expect(tierNames).toContain("OSS Agent v1.0");
        expect(tierNames).toContain("Pro");
        expect(tierNames).toContain("Enterprise");
    });

    it("renders CTA buttons for each tier", () => {
        renderPricing();
        const waitlistLinks = screen.getAllByRole("link", {name: /Join Waitlist/i});
        expect(waitlistLinks.length).toBeGreaterThan(0);
    });

    it("renders the feature comparison table", () => {
        renderPricing();
        expect(screen.getByText("Feature Comparison")).toBeInTheDocument();
        expect(screen.getByText("Hangar instances")).toBeInTheDocument();
        expect(screen.getByText("Event retention")).toBeInTheDocument();
        expect(screen.getByText("Team seats")).toBeInTheDocument();
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
        const pricingLinks = screen.getAllByRole("link", {name: "Plans"});
        const activeLink = pricingLinks.find(el => el.classList.contains("text-sky-400"));
        expect(activeLink).toBeDefined();
    });

    it("shows September 2026 launch date", () => {
        renderPricing();
        const sept = screen.getAllByText(/September 2026/);
        expect(sept.length).toBeGreaterThan(0);
    });

    it("renders hero CTA buttons", () => {
        renderPricing();
        const installLinks = screen.getAllByRole("link", {name: /Install v1.0/i});
        expect(installLinks[0]).toHaveAttribute("href", expect.stringContaining("/docs/"));
    });
});
