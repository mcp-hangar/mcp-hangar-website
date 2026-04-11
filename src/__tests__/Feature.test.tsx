import {render, screen} from "@testing-library/react";
import {Feature} from "../components/Feature";

describe("Feature", () => {
    it("renders title and description", () => {
        render(
            <Feature
                icon={<span data-testid="icon">IC</span>}
                title="Test Feature"
                description="A test description"
            />
        );
        expect(screen.getByText("Test Feature")).toBeInTheDocument();
        expect(screen.getByText("A test description")).toBeInTheDocument();
    });

    it("renders the icon", () => {
        render(
            <Feature
                icon={<span data-testid="icon">IC</span>}
                title="Title"
                description="Desc"
            />
        );
        expect(screen.getByTestId("icon")).toBeInTheDocument();
    });

    it("defaults to emerald accent", () => {
        const {container} = render(
            <Feature icon={<span>IC</span>} title="T" description="D"/>
        );
        const iconBox = container.querySelector("[class*='emerald']");
        expect(iconBox).toBeInTheDocument();
    });

    it("applies sky accent when specified", () => {
        const {container} = render(
            <Feature icon={<span>IC</span>} title="T" description="D" accentColor="sky"/>
        );
        const iconBox = container.querySelector("[class*='sky']");
        expect(iconBox).toBeInTheDocument();
    });
});
