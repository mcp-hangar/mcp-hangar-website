import { useState } from "react";

interface CodeBlockProps {
    language?: string;
    children: string;
}

export function CodeBlock({language, children}: CodeBlockProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(children);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-zinc-900/60 backdrop-blur border border-zinc-800/50 rounded-xl overflow-hidden relative group">
            {language && (
                <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800/50">
                    <span className="text-xs text-zinc-500 font-mono">{language}</span>
                </div>
            )}
            <button
                onClick={handleCopy}
                className="absolute top-3 right-3 p-2 rounded bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Copy to clipboard"
            >
                {copied ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                )}
            </button>
            <pre className="p-4 overflow-x-auto">
                <code className="text-sm font-mono text-zinc-300 leading-relaxed">{children}</code>
            </pre>
        </div>
    );
}
