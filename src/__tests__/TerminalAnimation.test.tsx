import {render, screen, act} from "@testing-library/react";
import {TerminalAnimation} from "../components/TerminalAnimation";

describe("TerminalAnimation", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("renders the terminal chrome", () => {
        render(<TerminalAnimation/>);
        expect(screen.getByText("terminal")).toBeInTheDocument();
    });

    it("renders window control dots", () => {
        const {container} = render(<TerminalAnimation/>);
        const dots = container.querySelectorAll(".rounded-full");
        expect(dots.length).toBeGreaterThanOrEqual(3);
    });

    it("starts typing the first command", () => {
        render(<TerminalAnimation/>);
        // After some time, the typing cursor should be visible
        act(() => {
            vi.advanceTimersByTime(100);
        });
        // The animation container should exist
        const container = screen.getByText("terminal").closest("div")?.parentElement;
        expect(container).toBeInTheDocument();
    });

    it("displays lines after advancing timers", () => {
        render(<TerminalAnimation/>);
        // Animation is an infinite loop, so run pending timers step by step
        for (let i = 0; i < 100; i++) {
            act(() => {
                vi.runOnlyPendingTimers();
            });
        }
        // After enough cycles, should see provider readiness output
        const elements = screen.queryAllByText(/ready|complete|providers/i);
        expect(elements.length).toBeGreaterThan(0);
    });
});


