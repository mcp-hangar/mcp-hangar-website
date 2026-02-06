import {vi} from "vitest";
import {render, screen} from "@testing-library/react";
import App from "../App";

// Mock clipboard API
Object.assign(navigator, {
    clipboard: {
        writeText: vi.fn(),
    },
});

describe("App", () => {
    it("renders the application", () => {
        render(<App/>);
        const elements = screen.getAllByText("mcp-hangar");
        expect(elements.length).toBeGreaterThan(0);
    });

    it("renders navigation links", () => {
        render(<App/>);
        const docsLinks = screen.getAllByRole("link", {name: /docs/i});
        expect(docsLinks.length).toBeGreaterThan(0);
    });

    it("displays version badge", () => {
        render(<App/>);
        expect(screen.getByText(/v0\.6\.0/i)).toBeInTheDocument();
    });

    it("renders the install command", () => {
        render(<App/>);
        expect(
            screen.getByText(/curl -sSL https:\/\/get\.mcp-hangar\.io/)
        ).toBeInTheDocument();
    });
});
