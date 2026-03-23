interface CodeBlockProps {
    language?: string;
    children: string;
}

export function CodeBlock({language, children}: CodeBlockProps) {
    return (
        <div className="bg-zinc-900/60 backdrop-blur border border-zinc-800/50 rounded-xl overflow-hidden">
            {language && (
                <div className="flex items-center px-4 py-2 border-b border-zinc-800/50">
                    <span className="text-xs text-zinc-500 font-mono">{language}</span>
                </div>
            )}
            <pre className="p-4 overflow-x-auto">
                <code className="text-sm font-mono text-zinc-300 leading-relaxed">{children}</code>
            </pre>
        </div>
    );
}

