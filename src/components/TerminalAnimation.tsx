import {useState, useEffect} from "react";

const terminalLines = [
    {
        text: "$ curl -sSL https://mcp-hangar.io/install.sh | bash",
        type: "command",
        delay: 30,
    },
    {text: "⚡ Installing MCP Hangar...", type: "status", delay: 0},
    {text: "✓ Installation complete!", type: "success", delay: 0},
    {text: "", type: "empty", delay: 0},
    {text: "$ mcp-hangar init", type: "command", delay: 40},
    {text: "? Select providers: filesystem, fetch, memory", type: "prompt", delay: 0},
    {text: "✓ Created config.yaml with 3 providers", type: "success", delay: 0},
    {text: "", type: "empty", delay: 0},
    {text: "$ mcp-hangar serve", type: "command", delay: 40},
    {text: "🚀 Starting MCP Hangar...", type: "status", delay: 0},
    {text: "  ● filesystem ready (245ms)", type: "provider", delay: 0},
    {text: "  ● fetch ready (189ms)", type: "provider", delay: 0},
    {text: "  ● memory ready (156ms)", type: "provider", delay: 0},
    {text: "→ 3 providers ready | 12 tools | parallel execution enabled", type: "result", delay: 0},
];

export function TerminalAnimation() {
    const [displayedLines, setDisplayedLines] = useState<
        { text: string; type: string }[]
    >([]);
    const [currentLineIndex, setCurrentLineIndex] = useState(0);
    const [currentCharIndex, setCurrentCharIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(true);

    useEffect(() => {
        if (currentLineIndex >= terminalLines.length) {
            setIsTyping(false);
            const restartTimer = setTimeout(() => {
                setDisplayedLines([]);
                setCurrentLineIndex(0);
                setCurrentCharIndex(0);
                setIsTyping(true);
            }, 4000);
            return () => clearTimeout(restartTimer);
        }

        const currentLine = terminalLines[currentLineIndex];

        if (currentLine.delay === 0 || currentLine.type === "empty") {
            const timer = setTimeout(() => {
                setDisplayedLines((prev) => [
                    ...prev,
                    {text: currentLine.text, type: currentLine.type},
                ]);
                setCurrentLineIndex((prev) => prev + 1);
                setCurrentCharIndex(0);
            }, 300);
            return () => clearTimeout(timer);
        }

        if (currentCharIndex < currentLine.text.length) {
            const timer = setTimeout(() => {
                setCurrentCharIndex((prev) => prev + 1);
            }, currentLine.delay);
            return () => clearTimeout(timer);
        } else {
            const timer = setTimeout(() => {
                setDisplayedLines((prev) => [
                    ...prev,
                    {text: currentLine.text, type: currentLine.type},
                ]);
                setCurrentLineIndex((prev) => prev + 1);
                setCurrentCharIndex(0);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [currentLineIndex, currentCharIndex]);

    const getLineClassName = (type: string) => {
        switch (type) {
            case "command":
                return "text-zinc-100";
            case "success":
                return "text-emerald-400";
            case "output":
                return "text-zinc-400";
            case "status":
                return "text-zinc-400";
            case "provider":
                return "text-emerald-400";
            case "prompt":
                return "text-cyan-400";
            case "result":
                return "text-amber-400 font-semibold";
            case "yaml":
                return "text-zinc-400 pl-4";
            case "json":
                return "text-sky-400 text-xs";
            case "comment":
                return "text-zinc-500";
            default:
                return "text-zinc-400";
        }
    };

    const renderLine = (line: { text: string; type: string }, index: number) => {
        if (line.type === "empty") return <div key={index} className="h-4"/>;

        if (line.type === "command") {
            return (
                <div key={index} className={getLineClassName(line.type)}>
                    <span className="text-emerald-500">$</span>
                    {line.text.slice(1)}
                </div>
            );
        }

        if (line.type === "comment") {
            return (
                <div key={index} className={getLineClassName(line.type)}>
                    <span className="text-emerald-500">$</span>
                    {line.text.slice(1)}
                </div>
            );
        }

        if (line.type === "provider") {
            return (
                <div key={index} className={getLineClassName(line.type)}>
                    {line.text}
                </div>
            );
        }

        if (line.type === "prompt") {
            return (
                <div key={index} className={getLineClassName(line.type)}>
                    <span className="text-cyan-500">?</span>
                    {line.text.slice(1)}
                </div>
            );
        }

        if (line.type === "status") {
            return (
                <div key={index} className={getLineClassName(line.type)}>
                    {line.text}
                </div>
            );
        }

        return (
            <div key={index} className={getLineClassName(line.type)}>
                {line.text}
            </div>
        );
    };

    const currentLine = terminalLines[currentLineIndex];
    const typingText =
        currentLine?.delay > 0 ? currentLine.text.slice(0, currentCharIndex) : "";

    return (
        <div
            className="bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all duration-300">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800">
                <div className="w-3 h-3 rounded-full bg-red-500/80"/>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"/>
                <div className="w-3 h-3 rounded-full bg-green-500/80"/>
                <span className="text-xs text-zinc-500 ml-2">terminal</span>
            </div>
            <div className="p-6 font-mono text-sm min-h-[280px]">
                {displayedLines.map((line, index) => renderLine(line, index))}
                {isTyping && currentLine?.delay > 0 && (
                    <div className="text-zinc-100">
                        <span className="text-emerald-500">$</span>
                        {typingText.slice(1)}
                        <span className="inline-block w-2 h-4 bg-emerald-400 ml-0.5 animate-pulse"/>
                    </div>
                )}
            </div>
        </div>
    );
}
