import {useState, type FormEvent} from "react";
import {CheckIcon} from "./Icons";

interface InlineWaitlistFormProps {
    source?: string;
}

export function InlineWaitlistForm({source = "inline"}: InlineWaitlistFormProps) {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError("");

        if (!email || !email.includes("@")) {
            setError("Enter a valid email address.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/waitlist", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email, plan: "free", source}),
            });

            const data: {error?: string} = await res.json();

            if (!res.ok) {
                setError(data.error ?? "Something went wrong. Please try again.");
                return;
            }

            setSubmitted(true);
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    if (submitted) {
        return (
            <div className="flex items-center gap-2 text-emerald-400 text-sm">
                <span className="shrink-0 [&_svg]:w-4 [&_svg]:h-4"><CheckIcon/></span>
                <span>You're on the list. We'll reach out first.</span>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 w-full max-w-sm">
            <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                aria-label="Work email for early access"
                className="flex-1 px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 placeholder:text-zinc-600 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
            />
            <button
                type="submit"
                disabled={loading}
                className="px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-zinc-950 font-semibold text-sm rounded-lg transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 whitespace-nowrap"
            >
                {loading ? "..." : "Get notified — Early June"}
            </button>
            {error && (
                <p className="text-xs text-red-400 sm:col-span-2 mt-1">{error}</p>
            )}
        </form>
    );
}
