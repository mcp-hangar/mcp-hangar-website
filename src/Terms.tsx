import {SiteNav} from "./components/SiteNav";
import {SiteFooter} from "./components/SiteFooter";
import {SEO} from "./components/SEO";

export default function Terms() {
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-300">
            <SEO
                title="Terms of Service -- MCP Hangar"
                description="Terms of Service governing the use of the MCP Hangar website."
                path="/terms"
            />
            <SiteNav/>
            <main className="max-w-3xl mx-auto px-6 py-20">
                <h1 className="text-3xl font-bold text-zinc-100 mb-2">Terms of Service</h1>
                <p className="text-sm text-zinc-500 mb-12">Last updated: May 12, 2026</p>

                <div className="space-y-10 text-sm leading-relaxed">
                    <section>
                        <h2 className="text-lg font-semibold text-zinc-100 mb-3">1. Operator</h2>
                        <p>
                            This website is operated by Marcin Pyrka, Poland (sole proprietor).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-zinc-100 mb-3">2. Scope</h2>
                        <p>
                            These terms govern your use of the mcp-hangar.io website.
                            The open-source MCP Hangar agent is licensed separately under the
                            MIT License and is not subject to these terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-zinc-100 mb-3">3. Website use</h2>
                        <p>
                            You may browse this website freely. We reserve the right to modify or
                            discontinue the website at any time without notice.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-zinc-100 mb-3">4. Open-source software</h2>
                        <p>
                            The MCP Hangar agent (<code className="text-emerald-400">mcp-hangar</code> on PyPI) is provided under the
                            MIT License. See the <a href="https://github.com/mcp-hangar/mcp-hangar/blob/main/LICENSE" className="text-emerald-400 hover:underline">LICENSE</a> file for full terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-zinc-100 mb-3">5. Disclaimer</h2>
                        <p>
                            This website and all software are provided <strong className="text-zinc-200">"as is"</strong> without
                            warranty of any kind, express or implied, including but not limited to the warranties
                            of merchantability, fitness for a particular purpose, and non-infringement.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-zinc-100 mb-3">6. Limitation of liability</h2>
                        <p>
                            In no event shall the MCP Hangar contributors be liable for any claim, damages, or
                            other liability arising from the use of this website or any related software,
                            whether in contract, tort, or otherwise.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-zinc-100 mb-3">7. Governing law</h2>
                        <p>
                            These terms are governed by and construed in accordance with the laws of Poland,
                            without regard to conflict of law provisions. For EU consumers, mandatory consumer
                            protection laws of your country of residence apply.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-zinc-100 mb-3">8. Changes</h2>
                        <p>
                            We may update these terms from time to time. Changes will be posted on this page
                            with an updated revision date. Continued use of the website after changes
                            constitutes acceptance.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-zinc-100 mb-3">9. Contact</h2>
                        <p>
                            Questions about these terms? Email{" "}
                            <a href="mailto:legal@mcp-hangar.io" className="text-emerald-400 hover:underline">legal@mcp-hangar.io</a>.
                        </p>
                    </section>
                </div>
            </main>
            <SiteFooter/>
        </div>
    );
}
