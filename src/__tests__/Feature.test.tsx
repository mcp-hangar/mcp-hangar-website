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
});

