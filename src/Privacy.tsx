import {SiteNav} from "./components/SiteNav";
import {SiteFooter} from "./components/SiteFooter";
import {SEO} from "./components/SEO";

export default function Privacy() {
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-300">
            <SEO
                title="Privacy Policy -- MCP Hangar"
                description="Privacy Policy for MCP Hangar. Learn how we handle your data."
                path="/privacy"
            />
            <SiteNav/>
            <main className="max-w-3xl mx-auto px-6 py-20">
                <h1 className="text-3xl font-bold text-zinc-100 mb-2">Privacy Policy</h1>
                <p className="text-sm text-zinc-500 mb-12">Last updated: May 12, 2026</p>

                <div className="space-y-10 text-sm leading-relaxed">
                    <section>
                        <h2 className="text-lg font-semibold text-zinc-100 mb-3">1. Data controller</h2>
                        <p>
                            The data controller is Marcin Pyrka, Poland (sole proprietor).
                            MCP Hangar is an open-source project operated from Poland.
                            For privacy-related questions,
                            contact us at <a href="mailto:privacy@mcp-hangar.io" className="text-emerald-400 hover:underline">privacy@mcp-hangar.io</a>.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-zinc-100 mb-3">2. What data we collect</h2>
                        <p>
                            We do not collect any personal data through this website.
                            Visiting mcp-hangar.io does not require you to provide any information.
                        </p>
                        <p className="mt-3">
                            We do <strong className="text-zinc-200">not</strong> use cookies, analytics, tracking pixels,
                            fingerprinting, or any form of behavioral tracking on this website.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-zinc-100 mb-3">3. Third-party processors</h2>
                        <p className="mb-3">We use the following services to operate this website:</p>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-zinc-800">
                                        <th className="py-2 pr-4 text-zinc-200">Service</th>
                                        <th className="py-2 pr-4 text-zinc-200">Purpose</th>
                                        <th className="py-2 text-zinc-200">Data processed</th>
                                    </tr>
                                </thead>
                                <tbody className="text-zinc-400">
                                    <tr className="border-b border-zinc-800/50">
                                        <td className="py-2 pr-4">Vercel (USA)</td>
                                        <td className="py-2 pr-4">Website hosting</td>
                                        <td className="py-2">IP address, request metadata (server logs)</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 pr-4">GitHub (USA)</td>
                                        <td className="py-2 pr-4">Source code hosting</td>
                                        <td className="py-2">Only if you interact with our repositories</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="mt-3">
                            Vercel and GitHub participate in the EU-US Data Privacy Framework (DPF).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-zinc-100 mb-3">4. Cookies and tracking</h2>
                        <p>
                            This website does <strong className="text-zinc-200">not</strong> set any cookies.
                            We do not use Google Analytics, Meta Pixel, or any other tracking service.
                            No cookie consent banner is needed because no cookies are used.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-zinc-100 mb-3">5. Data retention</h2>
                        <p>
                            Vercel server logs are retained per Vercel's data retention policy (typically 30 days).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-zinc-100 mb-3">6. Your rights (GDPR Art. 15-22)</h2>
                        <p className="mb-3">You have the right to:</p>
                        <ul className="list-disc pl-6 space-y-1">
                            <li>Access your personal data</li>
                            <li>Rectify inaccurate data</li>
                            <li>Request erasure ("right to be forgotten")</li>
                            <li>Restrict processing</li>
                            <li>Data portability</li>
                            <li>Object to processing</li>
                        </ul>
                        <p className="mt-3">
                            To exercise any of these rights, email{" "}
                            <a href="mailto:privacy@mcp-hangar.io" className="text-emerald-400 hover:underline">privacy@mcp-hangar.io</a>.
                            We will respond within 30 days.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-zinc-100 mb-3">7. Minimum age</h2>
                        <p>
                            This website is intended for users aged 16 or older.
                            We do not knowingly collect personal data from anyone under 16.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-zinc-100 mb-3">8. Supervisory authority</h2>
                        <p>
                            You have the right to lodge a complaint with a supervisory authority,
                            in particular in the EU/EEA member state of your residence.
                            For Poland, the supervisory authority is UODO (Urz&#261;d Ochrony Danych Osobowych).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-zinc-100 mb-3">9. Changes</h2>
                        <p>
                            We may update this policy from time to time. Changes will be posted on this page
                            with an updated revision date.
                        </p>
                    </section>
                </div>
            </main>
            <SiteFooter/>
        </div>
    );
}
