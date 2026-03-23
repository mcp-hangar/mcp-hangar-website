import {render, screen} from "@testing-library/react";
import ErrorBoundary from "../components/ErrorBoundary";

function ThrowingChild() {
    throw new Error("Test explosion");
}

function GoodChild() {
    return <div>All good</div>;
}

describe("ErrorBoundary", () => {
    // Suppress React error boundary console.error in tests
    const originalError = console.error;
    beforeAll(() => {
        console.error = (...args: unknown[]) => {
            if (typeof args[0] === "string" && args[0].includes("Error caught by boundary")) return;
            if (typeof args[0] === "string" && args[0].includes("The above error")) return;
            originalError.call(console, ...args);
        };
    });
    afterAll(() => {
        console.error = originalError;
    });

    it("renders children when no error", () => {
        render(
            <ErrorBoundary>
                <GoodChild/>
            </ErrorBoundary>
        );
        expect(screen.getByText("All good")).toBeInTheDocument();
    });

    it("renders error UI when child throws", () => {
        render(
            <ErrorBoundary>
                <ThrowingChild/>
            </ErrorBoundary>
        );
        expect(screen.getByText("Something went wrong")).toBeInTheDocument();
        expect(screen.getByText("Reload Page")).toBeInTheDocument();
    });

    it("shows error details in expandable section", () => {
        render(
            <ErrorBoundary>
                <ThrowingChild/>
            </ErrorBoundary>
        );
        expect(screen.getByText("Error details")).toBeInTheDocument();
        expect(screen.getByText(/Test explosion/)).toBeInTheDocument();
    });

    it("renders custom fallback when provided", () => {
        render(
            <ErrorBoundary fallback={<div>Custom fallback</div>}>
                <ThrowingChild/>
            </ErrorBoundary>
        );
        expect(screen.getByText("Custom fallback")).toBeInTheDocument();
    });
});

