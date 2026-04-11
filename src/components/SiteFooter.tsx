import {Link} from "react-router-dom";
import {HangarLogoMark} from "./Icons";
import {LINKS} from "../config";

/** Site-wide footer — shared across all marketing pages. */
export function SiteFooter() {
    return (
        <footer className="border-t border-zinc-800/50">
            <div className="max-w-6xl mx-auto px-6 py-16">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-emerald-400">
                                <HangarLogoMark size={22}/>
                            </span>
                            <span className="font-semibold text-zinc-100">mcp-hangar</span>
                        </div>
                        <p className="text-sm text-zinc-500 leading-relaxed mb-4">
                            MCP governance platform. Cloud managed or self-hosted.
                        </p>
                        <a
                            href={LINKS.ossQuickstart}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold rounded-lg transition-all duration-300 hover:-translate-y-0.5 text-sm"
                        >
                            Install v1.0
                        </a>
                    </div>

                    {/* Product */}
                    <div>
                        <h4 className="text-sm font-semibold text-zinc-300 mb-4">Product</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="/#features" className="text-zinc-500 hover:text-emerald-400 transition-colors duration-300">Features</a></li>
                            <li><Link to="/plans" className="text-zinc-500 hover:text-emerald-400 transition-colors duration-300">Plans</Link></li>
                            <li><Link to="/waitlist" className="text-zinc-500 hover:text-emerald-400 transition-colors duration-300">Cloud Waitlist</Link></li>
                        </ul>
                    </div>

                    {/* Documentation */}
                    <div>
                        <h4 className="text-sm font-semibold text-zinc-300 mb-4">Documentation</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="/docs/oss/" className="text-zinc-500 hover:text-emerald-400 transition-colors duration-300">OSS Agent Docs</a></li>
                            <li><a href="/docs/oss/cookbook/" className="text-zinc-500 hover:text-emerald-400 transition-colors duration-300">Cookbook</a></li>
                            <li><a href="/docs/oss/reference/configuration" className="text-zinc-500 hover:text-emerald-400 transition-colors duration-300">Configuration</a></li>
                        </ul>
                    </div>

                    {/* Community */}
                    <div>
                        <h4 className="text-sm font-semibold text-zinc-300 mb-4">Community</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="/docs/blog/" className="text-zinc-500 hover:text-emerald-400 transition-colors duration-300">Blog</a></li>
                            <li><a href="https://github.com/mcp-hangar/mcp-hangar" className="text-zinc-500 hover:text-emerald-400 transition-colors duration-300">GitHub</a></li>
                            <li><a href="/docs/oss/development/CONTRIBUTING" className="text-zinc-500 hover:text-emerald-400 transition-colors duration-300">Contributing</a></li>
                            <li><a href="/docs/oss/changelog" className="text-zinc-500 hover:text-emerald-400 transition-colors duration-300">Changelog</a></li>
                            <li><a href="/docs/oss/security" className="text-zinc-500 hover:text-emerald-400 transition-colors duration-300">Security</a></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-zinc-800/50 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-600">
                    <span>© 2026 MCP Hangar. Agent released under MIT License.</span>
                    <span>Made with ♥ for the MCP community</span>
                </div>
            </div>
        </footer>
    );
}

