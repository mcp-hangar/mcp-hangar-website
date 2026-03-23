import {vi} from "vitest";
import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";

// Mock clipboard API
Object.assign(navigator, {
    clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
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
        const badges = screen.getAllByText(/v0\.12\.0/i);
        expect(badges.length).toBeGreaterThan(0);
    });

    it("renders the install command", () => {
        render(<App/>);
        expect(
            screen.getByText(/curl -sSL https:\/\/mcp-hangar\.io\/install\.sh/)
        ).toBeInTheDocument();
    });

    it("copies install command to clipboard on click", async () => {
        const user = userEvent.setup();
        render(<App/>);
        const writeTextSpy = vi.spyOn(navigator.clipboard, "writeText");
        const installButton = screen.getByRole("button", {name: /copy installation command/i});
        await user.click(installButton);
        expect(writeTextSpy).toHaveBeenCalledWith(
            "curl -sSL https://mcp-hangar.io/install.sh | bash"
        );
        writeTextSpy.mockRestore();
    });

    it("renders core feature sections", () => {
        render(<App/>);
        expect(screen.getByText("What Hangar Does")).toBeInTheDocument();
        expect(screen.getByText("Core Features")).toBeInTheDocument();
        expect(screen.getByText("Benchmarks")).toBeInTheDocument();
    });

    it("renders Dashboard UI highlight section", () => {
        render(<App/>);
        expect(screen.getByText("Dashboard UI")).toBeInTheDocument();
        expect(screen.getByText(/NEW in v0\.12\.0/)).toBeInTheDocument();
    });

    it("renders footer with copyright", () => {
        render(<App/>);
        expect(screen.getByText(/© 2026 mcp-hangar contributors/)).toBeInTheDocument();
    });
});
