import {type ReactNode} from "react";

interface StepProps {
    number: number;
    title: string;
    description: string;
    children?: ReactNode;
    isLast?: boolean;
}

export function Step({number, title, description, children, isLast = false}: StepProps) {
    return (
        <li className="relative flex gap-6">
            {/* Left column: number badge + connector line */}
            <div className="flex flex-col items-center">
                <div
                    className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold text-sm shrink-0 shadow-lg shadow-emerald-500/5"
                >
                    {number}
                </div>
                {!isLast && (
                    <div className="w-px flex-1 bg-linear-to-b from-emerald-500/30 to-emerald-500/5 mt-3"/>
                )}
            </div>

            {/* Right column: content */}
            <div className={`${isLast ? 'pb-0' : 'pb-12'} flex-1 min-w-0`}>
                <h3 className="text-lg font-semibold text-zinc-100 mb-2 mt-1.5">
                    {title}
                </h3>
                <p className="text-zinc-400 mb-4 leading-relaxed">
                    {description}
                </p>
                {children && (
                    <div className="mt-4">
                        {children}
                    </div>
                )}
            </div>
        </li>
    );
}



