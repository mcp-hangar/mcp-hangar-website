import {render, screen} from "@testing-library/react";
import {CodeBlock} from "../components/CodeBlock";

describe("CodeBlock", () => {
    it("renders code content", () => {
        render(<CodeBlock>echo hello</CodeBlock>);
        expect(screen.getByText("echo hello")).toBeInTheDocument();
    });

    it("renders language label when provided", () => {
        render(<CodeBlock language="bash">echo hello</CodeBlock>);
        expect(screen.getByText("bash")).toBeInTheDocument();
    });

    it("omits language label when not provided", () => {
        const {container} = render(<CodeBlock>echo hello</CodeBlock>);
        // Only the code block, no language header
        const borders = container.querySelectorAll(".border-b");
        expect(borders.length).toBe(0);
    });

    it("renders inside a pre > code structure", () => {
        render(<CodeBlock language="yaml">key: value</CodeBlock>);
        const code = screen.getByText("key: value");
        expect(code.tagName).toBe("CODE");
        expect(code.closest("pre")).toBeInTheDocument();
    });
});

