import {render} from "@testing-library/react";
import {
    GithubIcon, CopyIcon, CheckIcon, ArrowIcon, PythonIcon,
    LifecycleIcon, CircuitIcon, ObservabilityIcon, HeartIcon,
    IssueIcon, StarIcon, RocketIcon, LayersIcon, BookOpenIcon,
    FileTextIcon, ParallelIcon, ServerStackIcon, ShieldCheckIcon,
    LockIcon, FilterIcon, DashboardIcon, RestApiIcon, WebSocketIcon,
    LogStreamIcon, GroupIcon, IdentityIcon, AuditIcon, K8sIcon,
    BehavioralIcon, EyeIcon, SlidersIcon, ScaleIcon, BoltIcon,
    SparklesIcon, CubeIcon, CloudIcon, HangarLogoMark, HangarLogoMarkLight,
} from "../components/Icons";

const allIcons = [
    ["GithubIcon", GithubIcon],
    ["CopyIcon", CopyIcon],
    ["CheckIcon", CheckIcon],
    ["ArrowIcon", ArrowIcon],
    ["PythonIcon", PythonIcon],
    ["LifecycleIcon", LifecycleIcon],
    ["CircuitIcon", CircuitIcon],
    ["ObservabilityIcon", ObservabilityIcon],
    ["HeartIcon", HeartIcon],
    ["IssueIcon", IssueIcon],
    ["StarIcon", StarIcon],
    ["RocketIcon", RocketIcon],
    ["LayersIcon", LayersIcon],
    ["BookOpenIcon", BookOpenIcon],
    ["FileTextIcon", FileTextIcon],
    ["ParallelIcon", ParallelIcon],
    ["ServerStackIcon", ServerStackIcon],
    ["ShieldCheckIcon", ShieldCheckIcon],
    ["LockIcon", LockIcon],
    ["FilterIcon", FilterIcon],
    ["DashboardIcon", DashboardIcon],
    ["RestApiIcon", RestApiIcon],
    ["WebSocketIcon", WebSocketIcon],
    ["LogStreamIcon", LogStreamIcon],
    ["GroupIcon", GroupIcon],
    ["IdentityIcon", IdentityIcon],
    ["AuditIcon", AuditIcon],
    ["K8sIcon", K8sIcon],
    ["BehavioralIcon", BehavioralIcon],
    ["EyeIcon", EyeIcon],
    ["SlidersIcon", SlidersIcon],
    ["ScaleIcon", ScaleIcon],
    ["BoltIcon", BoltIcon],
    ["SparklesIcon", SparklesIcon],
    ["CubeIcon", CubeIcon],
    ["CloudIcon", CloudIcon],
] as const;

describe("Icons", () => {
    it.each(allIcons)("%s renders an SVG element", (_name, Icon) => {
        const {container} = render(<Icon/>);
        expect(container.querySelector("svg")).toBeInTheDocument();
    });

    describe("HangarLogoMark", () => {
        it("renders at default size", () => {
            const {container} = render(<HangarLogoMark/>);
            const svg = container.querySelector("svg")!;
            expect(svg).toBeInTheDocument();
            expect(svg.getAttribute("width")).toBe("24");
            expect(svg.getAttribute("height")).toBe("24");
        });

        it("accepts custom size prop", () => {
            const {container} = render(<HangarLogoMark size={48}/>);
            const svg = container.querySelector("svg")!;
            expect(svg.getAttribute("width")).toBe("48");
        });

        it("has aria-hidden for decorative use", () => {
            const {container} = render(<HangarLogoMark/>);
            expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
        });
    });

    describe("HangarLogoMarkLight", () => {
        it("renders at default size", () => {
            const {container} = render(<HangarLogoMarkLight/>);
            const svg = container.querySelector("svg")!;
            expect(svg).toBeInTheDocument();
            expect(svg.getAttribute("width")).toBe("24");
        });

        it("accepts custom size prop", () => {
            const {container} = render(<HangarLogoMarkLight size={36}/>);
            const svg = container.querySelector("svg")!;
            expect(svg.getAttribute("width")).toBe("36");
        });
    });
});

