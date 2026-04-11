import {type ReactNode} from "react";
import {ArrowIcon} from "./Icons";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
    href: string;
    children: ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    withArrow?: boolean;
    className?: string;
    /** Render as <a target="_blank"> for external links */
    external?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
    primary:   "bg-sky-500 hover:bg-sky-400 text-zinc-950 hover:shadow-lg hover:shadow-sky-500/25",
    secondary: "bg-zinc-800 hover:bg-zinc-700 text-zinc-100",
    ghost:     "bg-transparent border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-zinc-100",
};

const sizeClasses: Record<ButtonSize, string> = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
};

export function Button({
    href,
    children,
    variant = "secondary",
    size = "md",
    withArrow = false,
    className = "",
    external = false,
}: ButtonProps) {
    const base =
        "group inline-flex items-center gap-2 font-semibold rounded-lg transition-all duration-300 hover:-translate-y-0.5";
    const classes = `${base} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

    const content = (
        <>
            {children}
            {withArrow && (
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                    <ArrowIcon/>
                </span>
            )}
        </>
    );

    if (external) {
        return (
            <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
                {content}
            </a>
        );
    }

    return (
        <a href={href} className={classes}>
            {content}
        </a>
    );
}

