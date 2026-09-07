import { afterEach, describe, it, expect, vi } from "vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { CodeBlock } from "../components/CodeBlock";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("CodeBlock", () => {
  it("copies rendered slot content rather than coercing a React element", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    render(
      <CodeBlock>
        <span>pip install mcp-hangar</span>
      </CodeBlock>
    );
    await act(async () =>
      fireEvent.click(screen.getByRole("button", { name: "Copy to clipboard" }))
    );
    expect(writeText).toHaveBeenCalledWith("pip install mcp-hangar");
  });

  it("copies the exact code and resets the success indicator", async () => {
    vi.useFakeTimers();
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    render(<CodeBlock>{"echo hello\nsecond line"}</CodeBlock>);
    const button = screen.getByRole("button", { name: "Copy to clipboard" });
    await act(async () => fireEvent.click(button));
    expect(writeText).toHaveBeenCalledWith("echo hello\nsecond line");
    expect(button.querySelector("polyline")).not.toBeNull();
    act(() => vi.advanceTimersByTime(2000));
    expect(button.querySelector("polyline")).toBeNull();
  });

  it("handles clipboard denial and allows retry", async () => {
    const writeText = vi
      .fn()
      .mockRejectedValueOnce(new Error("denied"))
      .mockResolvedValueOnce(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    render(<CodeBlock>echo hello</CodeBlock>);
    const button = screen.getByRole("button", { name: "Copy to clipboard" });
    await act(async () => fireEvent.click(button));
    expect(button.querySelector("polyline")).toBeNull();
    await act(async () => fireEvent.click(button));
    expect(button.querySelector("polyline")).not.toBeNull();
  });

  it("renders code content", () => {
    render(<CodeBlock>echo hello</CodeBlock>);
    expect(screen.getByText("echo hello")).toBeInTheDocument();
  });

  it("renders language label when provided", () => {
    render(<CodeBlock language="bash">echo hello</CodeBlock>);
    expect(screen.getByText("bash")).toBeInTheDocument();
  });

  it("omits language label when not provided", () => {
    const { container } = render(<CodeBlock>echo hello</CodeBlock>);
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
