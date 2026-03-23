import {type ReactNode} from "react";

interface StepListProps {
    children: ReactNode;
}

export function StepList({children}: StepListProps) {
    return (
        <ol className="stagger-steps list-none p-0 m-0">
            {children}
        </ol>
    );
}

