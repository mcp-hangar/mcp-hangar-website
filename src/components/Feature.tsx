import {ReactNode} from "react";

interface FeatureProps {
    icon: ReactNode;
    title: string;
    description: string;
}

export function Feature({icon, title, description}: FeatureProps) {
    return (
        <div
            className="group p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800/50 hover:border-emerald-500/20 hover:bg-zinc-900/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/5">
            <div
                className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-300">
                {icon}
            </div>
            <h3 className="font-semibold text-zinc-100 mb-2 group-hover:text-emerald-50 transition-colors duration-300">
                {title}
            </h3>
            <p className="text-sm text-zinc-500 leading-relaxed group-hover:text-zinc-400 transition-colors duration-300">
                {description}
            </p>
        </div>
    );
}
