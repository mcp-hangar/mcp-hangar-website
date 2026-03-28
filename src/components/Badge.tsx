interface BadgeProps {
    children: string;
    pulse?: boolean;
    className?: string;
}

/** Status badge with optional animated pulse dot — used in hero/nav announcements. */
export function Badge({children, pulse = true, className = ""}: BadgeProps) {
    return (
        <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-sm cursor-default hover:bg-sky-500/15 transition-all ${className}`}
            role="status"
            aria-label={children}
        >
            {pulse && <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" aria-hidden="true"/>}
            {children}
        </div>
    );
}

