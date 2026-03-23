import {render, screen} from "@testing-library/react";
import {Step} from "../components/Step";

describe("Step", () => {
    it("renders step number, title, and description", () => {
        render(
            <Step number={1} title="Install" description="Run the installer">
                <code>curl install.sh</code>
            </Step>
        );
        expect(screen.getByText("1")).toBeInTheDocument();
        expect(screen.getByText("Install")).toBeInTheDocument();
        expect(screen.getByText("Run the installer")).toBeInTheDocument();
    });

    it("renders children content", () => {
        render(
            <Step number={2} title="Configure" description="Edit config">
                <span data-testid="child">child content</span>
            </Step>
        );
        expect(screen.getByTestId("child")).toBeInTheDocument();
    });

    it("renders connector line when not last step", () => {
        const {container} = render(
            <Step number={1} title="First" description="desc"/>
        );
        // The connector line div has bg-linear-to-b class
        const connector = container.querySelector("[class*='bg-linear']");
        expect(connector).toBeInTheDocument();
    });

    it("hides connector line when isLast is true", () => {
        const {container} = render(
            <Step number={4} title="Done" description="desc" isLast/>
        );
        const connector = container.querySelector("[class*='bg-linear']");
        expect(connector).not.toBeInTheDocument();
    });
});

