import {render} from "@testing-library/react";
import {StepList} from "../components/StepList";

describe("StepList", () => {
    it("renders an ordered list", () => {
        const {container} = render(
            <StepList>
                <li>Step 1</li>
                <li>Step 2</li>
            </StepList>
        );
        const ol = container.querySelector("ol");
        expect(ol).toBeInTheDocument();
        expect(ol?.children.length).toBe(2);
    });

    it("applies stagger-steps animation class", () => {
        const {container} = render(
            <StepList>
                <li>Step 1</li>
            </StepList>
        );
        const ol = container.querySelector("ol");
        expect(ol?.classList.contains("stagger-steps")).toBe(true);
    });
});

