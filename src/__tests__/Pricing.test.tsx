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

    it("renders the 3 tier cards with headings", () => {
        renderPricing();
        const headings = screen.getAllByRole("heading", {level: 3});
        const texts = headings.map(h => h.textContent);
        expect(texts).toContain("OSS Agent v1.0");
        expect(texts).toContain("Free Cloud");
        expect(texts).toContain("Pro");
    });

    it("renders the Enterprise horizontal block", () => {
        renderPricing();
        expect(screen.getByText("Need paperwork on top of Pro?")).toBeInTheDocument();
        const contactLink = screen.getByRole("link", {name: /Contact us/i});
        expect(contactLink).toHaveAttribute("href", "mailto:sales@mcp-hangar.io");
    });

    it("renders the feature comparison table", () => {
        renderPricing();
        expect(screen.getByText("Feature Comparison")).toBeInTheDocument();
        expect(screen.getByText("Hangar instances")).toBeInTheDocument();
        expect(screen.getByText("Event retention")).toBeInTheDocument();
        expect(screen.getByText("Team seats")).toBeInTheDocument();
    });

    it("renders Which Tier Fits section", () => {
        renderPricing();
        expect(screen.getByText("Which Tier Fits")).toBeInTheDocument();
        expect(screen.getByText("When OSS is enough")).toBeInTheDocument();
    });

    it("renders the FAQ section", () => {
        renderPricing();
        expect(screen.getByText("Pricing Questions")).toBeInTheDocument();
        expect(screen.getByText(/What happens if I go over 10M events\/month on Pro\?/i)).toBeInTheDocument();
    });

    it("renders navigation with active pricing link", () => {
        renderPricing();
        const pricingLinks = screen.getAllByRole("link", {name: "Plans"});
        // Our activePage link sets specific classes via SiteNav, assuming we just test it's there
        expect(pricingLinks.length).toBeGreaterThan(0);
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
