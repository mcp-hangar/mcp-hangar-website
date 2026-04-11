import {vi} from "vitest";
import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {MemoryRouter} from "react-router-dom";
import App from "../App";

// Mock clipboard API
Object.assign(navigator, {
    clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
    },
});

function renderApp() {
    return render(
        <MemoryRouter>
            <App/>
        </MemoryRouter>
    );
}

describe("App", () => {
    it("renders the application", () => {
        renderApp();
        const elements = screen.getAllByText("mcp-hangar");
        expect(elements.length).toBeGreaterThan(0);
    });

    it("renders navigation links", () => {
        renderApp();
        const docsLinks = screen.getAllByRole("link", {name: /docs/i});
        expect(docsLinks.length).toBeGreaterThan(0);
    });

    it("displays OSS badge", () => {
        renderApp();
        expect(screen.getByText(/v1\.0 Open Source — MIT License/)).toBeInTheDocument();
    });

    it("renders the install command", () => {
        renderApp();
        const elements = screen.getAllByText(/pip install mcp-hangar/);
        expect(elements.length).toBeGreaterThan(0);
    });

    it("copies install command to clipboard on click", async () => {
        const user = userEvent.setup();
        renderApp();
        const writeTextSpy = vi.spyOn(navigator.clipboard, "writeText");
        const installButton = screen.getByRole("button", {name: /copy pip install command/i});
        await user.click(installButton);
        expect(writeTextSpy).toHaveBeenCalledWith("pip install mcp-hangar");
        writeTextSpy.mockRestore();
    });

    it("copies install command via keyboard Enter", async () => {
        const user = userEvent.setup();
        renderApp();
        const writeTextSpy = vi.spyOn(navigator.clipboard, "writeText");
        const installButton = screen.getByRole("button", {name: /copy pip install command/i});
        installButton.focus();
        await user.keyboard("{Enter}");
        expect(writeTextSpy).toHaveBeenCalledWith("pip install mcp-hangar");
        writeTextSpy.mockRestore();
    });

    it("copies install command via keyboard Space", async () => {
        const user = userEvent.setup();
        renderApp();
        const writeTextSpy = vi.spyOn(navigator.clipboard, "writeText");
        const installButton = screen.getByRole("button", {name: /copy pip install command/i});
        installButton.focus();
        await user.keyboard(" ");
        expect(writeTextSpy).toHaveBeenCalledWith("pip install mcp-hangar");
        writeTextSpy.mockRestore();
    });

    it("renders key sections", () => {
        renderApp();
        expect(screen.getByText("Why Hangar")).toBeInTheDocument();
        expect(screen.getByText("Built for real problems")).toBeInTheDocument();
        expect(screen.getByText("Benchmarks")).toBeInTheDocument();
    });

    it("renders Enterprise features and OSS Agent feature sections", () => {
        renderApp();
        expect(screen.getByText("Enterprise features (coming soon)")).toBeInTheDocument();
        expect(screen.getByText("Open-Source Agent")).toBeInTheDocument();
    });

    it("renders Cloud dashboard section", () => {
        renderApp();
        const matches = screen.getAllByText("Cloud dashboard");
        expect(matches.length).toBeGreaterThan(0);
    });

    it("renders pricing preview", () => {
        renderApp();
        expect(screen.getByText("Open Source vs Cloud")).toBeInTheDocument();
    });

    it("renders Built on Open Source section", () => {
        renderApp();
        expect(screen.getByText("Built on Open Source")).toBeInTheDocument();
    });

    it("renders footer with copyright", () => {
        renderApp();
        expect(screen.getByText(/© 2026 MCP Hangar/)).toBeInTheDocument();
    });
});
