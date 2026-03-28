import {Link} from "react-router-dom";
import {HangarLogoMark} from "./Icons";
import {CLOUD_APP_URL} from "../config";

export type ActivePage = "home" | "pricing" | "docs" | "blog";

interface SiteNavProps {
    activePage?: ActivePage;
}

const navLinkBase = "text-zinc-400 hover:text-emerald-400 transition-colors duration-300";
const navLinkActive = "text-sky-400";

/** Top navigation bar — shared across all marketing pages. */
export function SiteNav({activePage}: SiteNavProps) {
    return (
        <nav
            className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between"
            aria-label="Main navigation"
        >
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5">
                <span className="text-emerald-400">
                    <HangarLogoMark size={28}/>
                </span>
                <span className="font-semibold">mcp-hangar</span>
            </Link>

            {/* Links */}
            <div className="flex items-center gap-6 text-sm">
                <a
                    href="/#features"
                    className={activePage === "home" ? navLinkActive : navLinkBase}
                >
                    Product
                </a>
                <Link
                    to="/pricing"
                    className={activePage === "pricing" ? navLinkActive : navLinkBase}
                >
                    Pricing
                </Link>
                <a
                    href="/docs/"
                    className={activePage === "docs" ? navLinkActive : navLinkBase}
                >
                    Docs
                </a>
                <a
                    href="/docs/blog/"
                    className={activePage === "blog" ? navLinkActive : navLinkBase}
                >
                    Blog
                </a>
                <a href={CLOUD_APP_URL} className={navLinkBase}>
                    Sign In
                </a>
                <a
                    href={`${CLOUD_APP_URL}/signup`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-zinc-950 font-semibold rounded-lg transition-all duration-300 hover:-translate-y-0.5"
                >
                    Start Free
                </a>
            </div>
        </nav>
    );
}

