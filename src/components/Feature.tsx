import {type ReactNode} from "react";

interface FeatureProps {
    icon: ReactNode;
    title: string;
    description: string;
    accentColor?: "emerald" | "sky";
}

const accents = {
    emerald: {
        border: "hover:border-emerald-500/20",
        shadow: "hover:shadow-emerald-500/5",
        iconBg: "bg-emerald-500/10 border-emerald-500/20",
        iconHover: "group-hover:bg-emerald-500/20",
        iconText: "text-emerald-400",
        titleHover: "group-hover:text-emerald-50",
    },
    sky: {
        border: "hover:border-sky-500/20",
        shadow: "hover:shadow-sky-500/5",
        iconBg: "bg-sky-500/10 border-sky-500/20",
        iconHover: "group-hover:bg-sky-500/20",
        iconText: "text-sky-400",
        titleHover: "group-hover:text-sky-50",
    },
};

export function Feature({icon, title, description, accentColor = "emerald"}: FeatureProps) {
    const a = accents[accentColor];
    return (
        <div
            className={`group p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800/50 ${a.border} hover:bg-zinc-900/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${a.shadow}`}>
            <div
                className={`w-10 h-10 rounded-xl ${a.iconBg} border flex items-center justify-center ${a.iconText} mb-4 group-hover:scale-110 ${a.iconHover} transition-all duration-300`}>
                {icon}
            </div>
            <h3 className={`font-semibold text-zinc-100 mb-2 ${a.titleHover} transition-colors duration-300`}>
                {title}
            </h3>
            <p className="text-sm text-zinc-500 leading-relaxed group-hover:text-zinc-400 transition-colors duration-300">
                {description}
            </p>
        </div>
    );
}
