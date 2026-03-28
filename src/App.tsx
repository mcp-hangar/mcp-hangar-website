import {useState} from "react";
import {preconnect} from "react-dom";
import {Link} from "react-router-dom";
import {Feature} from "./components/Feature";
import {Step} from "./components/Step";
import {StepList} from "./components/StepList";
import {CodeBlock} from "./components/CodeBlock";
import {Badge} from "./components/Badge";
import {Button} from "./components/Button";
import {SiteNav} from "./components/SiteNav";
import {SiteFooter} from "./components/SiteFooter";
import {
    GithubIcon,
    CopyIcon,
    CheckIcon,
    ArrowIcon,
    LifecycleIcon,
    CircuitIcon,
    ObservabilityIcon,
    HeartIcon,
    IssueIcon,
    StarIcon,
    RocketIcon,
    BookOpenIcon,
    FileTextIcon,
    ParallelIcon,
    ServerStackIcon,
    ShieldCheckIcon,
    LockIcon,
    FilterIcon,
    DashboardIcon,
    GroupIcon,
    IdentityIcon,
    AuditIcon,
    K8sIcon,
    BehavioralIcon,
    EyeIcon,
    SlidersIcon,
    ScaleIcon,
    BoltIcon,
    SparklesIcon,
    CubeIcon,
    CloudIcon,
} from "./components/Icons";
import {CLOUD_APP_URL, INSTALL_COMMAND} from "./config";


function App() {
    const [copied, setCopied] = useState(false);

    preconnect("https://fonts.googleapis.com");
    preconnect("https://fonts.gstatic.com", {crossOrigin: "anonymous"});

    const copyCommand = () => {
        navigator.clipboard.writeText(INSTALL_COMMAND);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            copyCommand();
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
            {/* Background effects */}
            <div
                className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-900/20 via-zinc-950 to-zinc-950"/>
            <div
                className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')] opacity-[0.03]"/>

            <div className="relative">
                {/* ── Nav ──────────────────────────────────────────── */}
                <SiteNav activePage="home"/>

                {/* ── Hero ─────────────────────────────────────────── */}
                <div className="max-w-6xl mx-auto px-6 pt-24 pb-32">
                    <div className="max-w-3xl mx-auto text-center">
                        <Badge className="animate-fade-in mb-8">Cloud — Free tier available</Badge>

                        <h1 className="animate-slide-up text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
                            MCP Governance
                            <br/>
                            <span className="bg-gradient-to-r from-sky-400 via-sky-300 to-teal-400 bg-clip-text text-transparent">
                                Platform
                            </span>
                        </h1>

                        <p className="text-2xl text-zinc-300 mb-4">
                            See every MCP call. Control every tool. Ship with confidence.
                        </p>

                        <p className="text-lg text-zinc-500 max-w-xl mx-auto mb-10">
                            Managed cloud platform + open-source agent. Runtime security, identity propagation, compliance-grade audit trail.
                        </p>

                        <div className="flex flex-wrap justify-center gap-4">
                            <Button href={`${CLOUD_APP_URL}/signup`} variant="primary" withArrow>
                                Start Free
                            </Button>
                            <Button href="/docs/oss/getting-started/quickstart" variant="secondary">
                                Self-host with OSS
                            </Button>
                            <Button href="https://github.com/mcp-hangar/mcp-hangar" variant="secondary" external>
                                <GithubIcon/> GitHub
                            </Button>
                        </div>
                    </div>
                </div>

                {/* ── Value Props ──────────────────────────────────── */}
                <div className="max-w-6xl mx-auto px-6 pb-20">
                    <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-6">
                        Why Hangar
                    </h2>
                    <div className="stagger-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-sky-500/5 border border-sky-500/10 hover:border-sky-500/25 hover:bg-sky-500/10 transition-all duration-300">
                            <span className="text-sky-400 mt-0.5 shrink-0"><EyeIcon/></span>
                            <div>
                                <span className="text-zinc-200 font-medium">Visibility</span>
                                <p className="text-sm text-zinc-500 mt-1">
                                    See every tool call across your fleet. Agent health, provider state, caller identity.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-sky-500/5 border border-sky-500/10 hover:border-sky-500/25 hover:bg-sky-500/10 transition-all duration-300">
                            <span className="text-sky-400 mt-0.5 shrink-0"><SlidersIcon/></span>
                            <div>
                                <span className="text-zinc-200 font-medium">Control</span>
                                <p className="text-sm text-zinc-500 mt-1">
                                    Enforce policies in real time. Allow/deny tools, rate limits, execution timeouts.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-sky-500/5 border border-sky-500/10 hover:border-sky-500/25 hover:bg-sky-500/10 transition-all duration-300">
                            <span className="text-sky-400 mt-0.5 shrink-0"><ScaleIcon/></span>
                            <div>
                                <span className="text-zinc-200 font-medium">Compliance</span>
                                <p className="text-sm text-zinc-500 mt-1">
                                    Identity-aware audit trail. CEF export for SOC2 and EU AI Act. SIEM integrations.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 hover:border-emerald-500/25 hover:bg-emerald-500/10 transition-all duration-300">
                            <span className="text-emerald-400 mt-0.5 shrink-0"><BoltIcon/></span>
                            <div>
                                <span className="text-zinc-200 font-medium">Performance</span>
                                <p className="text-sm text-zinc-500 mt-1">
                                    15 tools, 2 providers, 380ms. Parallel execution with sub-ms proxy overhead.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── How It Works (diagram) ──────────────────────── */}
                <div className="max-w-4xl mx-auto px-6 pb-20">
                    <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-6 text-center">
                        How It Works
                    </h2>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 py-8">
                        <div className="flex flex-col items-center gap-2 p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 min-w-[180px]">
                            <span className="text-zinc-400"><SparklesIcon/></span>
                            <span className="text-zinc-200 font-medium text-sm">AI Agents</span>
                            <span className="text-zinc-500 text-xs">Claude, GPT, custom</span>
                        </div>
                        <div className="text-zinc-600 text-2xl">→</div>
                        <div className="flex flex-col items-center gap-2 p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 min-w-[180px]">
                            <span className="text-emerald-400"><CubeIcon/></span>
                            <span className="text-emerald-400 font-medium text-sm">mcp-hangar agent</span>
                            <span className="text-zinc-500 text-xs">OSS · your infrastructure</span>
                        </div>
                        <div className="text-zinc-600 text-2xl">→</div>
                        <div className="flex flex-col items-center gap-2 p-6 rounded-2xl bg-sky-500/10 border border-sky-500/20 min-w-[180px]">
                            <span className="text-sky-400"><CloudIcon/></span>
                            <span className="text-sky-400 font-medium text-sm">Hangar Cloud</span>
                            <span className="text-zinc-500 text-xs">dashboard · audit · policies</span>
                        </div>
                    </div>
                    <p className="text-center text-sm text-zinc-500 mt-2">
                        The agent runs on your infrastructure and proxies all MCP calls. Cloud adds visibility, governance, and team features.
                    </p>
                </div>

                {/* ── Cloud Platform Features (sky accent) ────────── */}
                <div id="features" className="max-w-6xl mx-auto px-6 pb-20">
                    <div className="flex items-center gap-3 mb-6">
                        <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">
                            Cloud Platform
                        </h2>
                        <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30">
                            Cloud
                        </span>
                    </div>
                    <div className="stagger-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Feature
                            icon={<DashboardIcon/>}
                            title="Web Dashboard"
                            description="Fleet overview, audit log viewer, policy management, top callers widget. Full web UI for your MCP infrastructure."
                            accentColor="sky"
                        />
                        <Feature
                            icon={<IdentityIcon/>}
                            title="Identity Propagation"
                            description="Track every caller from tool invocation to audit log. HTTP header and JWT extraction, contextvar binding, end-to-end identity chain."
                            accentColor="sky"
                        />
                        <Feature
                            icon={<AuditIcon/>}
                            title="Audit Trail"
                            description="Identity-aware audit records with queryable REST API. Caller, severity, and time range filters. CEF compliance export."
                            accentColor="sky"
                        />
                        <Feature
                            icon={<BehavioralIcon/>}
                            title="Behavioral Profiling"
                            description="Network behavioral baselines, deviation detection, tool schema drift monitoring. Enterprise-grade runtime analysis."
                            accentColor="sky"
                        />
                        <Feature
                            icon={<K8sIcon/>}
                            title="K8s Operator"
                            description="MCPProvider and MCPProviderGroup CRDs. Validating admission webhook, leader election, health probes. Deploy with Helm."
                            accentColor="sky"
                        />
                        <Feature
                            icon={<ShieldCheckIcon/>}
                            title="K8s Enforcement"
                            description="Kubernetes operator with validating webhooks, NetworkPolicy generation, capability verification, and violation signals."
                            accentColor="sky"
                        />
                    </div>
                </div>

                {/* ── OSS Agent Features (emerald accent) ─────────── */}
                <div className="max-w-6xl mx-auto px-6 pb-32">
                    <div className="flex items-center gap-3 mb-6">
                        <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">
                            Open-Source Agent
                        </h2>
                        <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            Open Source
                        </span>
                    </div>
                    <div className="stagger-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Feature
                            icon={<ParallelIcon/>}
                            title="Parallel Execution"
                            description="Two-level concurrency control. Global limit (50) + per-provider limit (10). Automatic backpressure and fair scheduling."
                        />
                        <Feature
                            icon={<LockIcon/>}
                            title="Security & Access Control"
                            description="Constant-time auth validation, exponential rate limiting, JWT lifetime enforcement, zero-downtime key rotation."
                        />
                        <Feature
                            icon={<FilterIcon/>}
                            title="Tool Access Filtering"
                            description="Config-driven tool visibility with glob patterns. Deny delete_* tools or allow only read_* operations per provider."
                        />
                        <Feature
                            icon={<LifecycleIcon/>}
                            title="Lifecycle Management"
                            description="Lazy loading — providers start on first call. Automatic shutdown after idle TTL. Health monitoring keeps them alive."
                        />
                        <Feature
                            icon={<CircuitIcon/>}
                            title="Circuit Breaker"
                            description="One failing provider doesn't kill your batch. Automatic isolation, exponential backoff recovery, graceful degradation."
                        />
                        <Feature
                            icon={<ObservabilityIcon/>}
                            title="Observability"
                            description="Correlation IDs across parallel calls. OpenTelemetry traces, Prometheus metrics. Debug batch execution, not black boxes."
                        />
                        <Feature
                            icon={<ServerStackIcon/>}
                            title="Multi-Provider Orchestration"
                            description="Local subprocess, Docker containers, remote HTTP — mix in single batch. Unified interface, heterogeneous backends."
                        />
                        <Feature
                            icon={<GroupIcon/>}
                            title="Provider Groups"
                            description="Load balancing, failover, and health tracking across provider pools. Round-robin, weighted, and priority-based routing."
                        />
                    </div>
                </div>

                {/* ── Quick Start ──────────────────────────────────── */}
                <div className="max-w-6xl mx-auto px-6 pb-32">
                    <div className="mb-10">
                        <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                            Quick Start
                        </h2>
                        <p className="text-zinc-400 text-lg">
                            From install to first parallel call in 2 minutes.
                        </p>
                    </div>

                    <div className="max-w-3xl">
                        <StepList>
                            <Step
                                number={1}
                                title="Install the agent"
                                description="One command. Works on macOS and Linux. Installs the binary and adds it to your PATH."
                            >
                                <CodeBlock language="bash">{`curl -sSL https://mcp-hangar.io/install.sh | bash`}</CodeBlock>
                            </Step>

                            <Step
                                number={2}
                                title="Configure providers"
                                description="The wizard detects your runtimes, lets you pick providers, and configures Claude Desktop automatically."
                            >
                                <CodeBlock language="yaml">{`# ~/.config/mcp-hangar/config.yaml
providers:
  filesystem:
    mode: subprocess
    command: [npx, -y, "@anthropic/mcp-server-filesystem"]
    args: [/Users/you/Documents]
    idle_ttl_s: 300

  fetch:
    mode: subprocess
    command: [npx, -y, "@anthropic/mcp-server-fetch"]
    idle_ttl_s: 300

  memory:
    mode: subprocess
    command: [npx, -y, "@anthropic/mcp-server-memory"]
    idle_ttl_s: 300`}</CodeBlock>
                            </Step>

                            <Step
                                number={3}
                                title="Connect to cloud (optional)"
                                description="Add your cloud token to stream audit events and metrics to the Hangar Cloud dashboard."
                            >
                                <CodeBlock language="yaml">{`# Add to config.yaml
cloud:
  enabled: true
  token: "hngr_agt_..."
  endpoint: "https://api.mcp-hangar.io"`}</CodeBlock>
                            </Step>

                            <Step
                                number={4}
                                title="Start the server"
                                description="Launch the agent. Providers come online, cloud connection is established."
                            >
                                <CodeBlock language="bash">{`$ mcp-hangar serve
🚀 Starting MCP Hangar...
  ● filesystem  ready  (245ms)
  ● fetch       ready  (189ms)
  ● memory      ready  (156ms)
  ☁ cloud       connected (api.mcp-hangar.io)
→ 3 providers ready | 12 tools | parallel execution enabled`}</CodeBlock>
                            </Step>

                            <Step
                                number={5}
                                title="You're ready"
                                description="Restart Claude Desktop. Your tools are available with parallel execution, health monitoring, and circuit breakers — all out of the box."
                                isLast
                            >
                                <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                    <span className="text-emerald-400 text-lg">✓</span>
                                    <span className="text-emerald-300 font-medium">3 providers ready · 12 tools · cloud connected</span>
                                </div>
                            </Step>
                        </StepList>
                    </div>
                </div>

                {/* ── Benchmarks ───────────────────────────────────── */}
                <div className="max-w-6xl mx-auto px-6 pb-32">
                    <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-6">
                        Benchmarks
                    </h2>
                    <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl overflow-hidden">
                        <table className="w-full">
                            <thead>
                            <tr className="border-b border-zinc-800/50">
                                <th className="text-left text-sm font-semibold text-zinc-300 px-6 py-4">Scenario</th>
                                <th className="text-left text-sm font-semibold text-zinc-300 px-6 py-4">Time</th>
                                <th className="text-left text-sm font-semibold text-zinc-300 px-6 py-4">Notes</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr className="border-b border-zinc-800/30">
                                <td className="px-6 py-4 text-zinc-400">Full proxy path (p50 / p99)</td>
                                <td className="px-6 py-4 text-emerald-400 font-mono">0.21ms / 0.24ms</td>
                                <td className="px-6 py-4 text-emerald-400 font-mono">20x under 5ms target</td>
                            </tr>
                            <tr className="border-b border-zinc-800/30">
                                <td className="px-6 py-4 text-zinc-400">Policy engine (1,000 policies)</td>
                                <td className="px-6 py-4 text-emerald-400 font-mono">6.5&micro;s</td>
                                <td className="px-6 py-4 text-emerald-400 font-mono">100%</td>
                            </tr>
                            <tr className="border-b border-zinc-800/30">
                                <td className="px-6 py-4 text-zinc-400">Event buffer with WAL persist</td>
                                <td className="px-6 py-4 text-emerald-400 font-mono">158&micro;s</td>
                                <td className="px-6 py-4 text-emerald-400 font-mono">100%</td>
                            </tr>
                            <tr className="border-b border-zinc-800/30">
                                <td className="px-6 py-4 text-zinc-400">15 tools, 2 providers (parallel)</td>
                                <td className="px-6 py-4 text-emerald-400 font-mono">380ms</td>
                                <td className="px-6 py-4 text-emerald-400 font-mono">100%</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 text-zinc-400">Domain event mapping</td>
                                <td className="px-6 py-4 text-emerald-400 font-mono">5.3&micro;s</td>
                                <td className="px-6 py-4 text-emerald-400 font-mono">100%</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <p className="text-sm text-zinc-500 mt-4">
                        Measured via pytest-benchmark (Python) and Go benchmark suite. Full results in the v1.0 benchmark report.
                    </p>
                </div>

                {/* ── Dashboard Preview (sky accent) ───────────────── */}
                <div className="max-w-6xl mx-auto px-6 pb-32">
                    <div
                        className="relative rounded-2xl bg-gradient-to-b from-sky-500/10 to-transparent border border-sky-500/20 p-8 md:p-12 overflow-hidden">
                        <div
                            className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-sky-500/20 rounded-full blur-3xl"/>

                        <div className="relative">
                            <div className="flex items-center gap-3 mb-2">
                                <div
                                    className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/30 text-sky-400">
                                    <DashboardIcon/>
                                </div>
                                <h2 className="text-2xl md:text-3xl font-bold text-zinc-100">
                                    Dashboard & Audit Trail
                                </h2>
                                <span
                                    className="ml-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30">
                                    Cloud
                                </span>
                            </div>
                            <p className="text-zinc-400 mb-8 max-w-2xl">
                                Full web interface for managing your MCP infrastructure. Fleet-wide visibility, compliance-grade audit log, and policy management across all clusters.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div>
                                    <h3 className="text-lg font-semibold text-zinc-200 mb-3">Monitor</h3>
                                    <ul className="space-y-2 text-zinc-400">
                                        <li className="flex items-start gap-2">
                                            <span className="text-sky-400 mt-1">&#x2022;</span>
                                            <span>Fleet overview with agent health and MCP server inventory</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-sky-400 mt-1">&#x2022;</span>
                                            <span>Top callers widget with call/error counts per user</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-sky-400 mt-1">&#x2022;</span>
                                            <span>Live metrics charts and provider state distribution</span>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-zinc-200 mb-3">Audit</h3>
                                    <ul className="space-y-2 text-zinc-400">
                                        <li className="flex items-start gap-2">
                                            <span className="text-sky-400 mt-1">&#x2022;</span>
                                            <span>Identity-aware audit log with caller tracking</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-sky-400 mt-1">&#x2022;</span>
                                            <span>Filter by provider, event type, severity, caller</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-sky-400 mt-1">&#x2022;</span>
                                            <span>CEF compliance export for SOC2 and EU AI Act</span>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-zinc-200 mb-3">Manage</h3>
                                    <ul className="space-y-2 text-zinc-400">
                                        <li className="flex items-start gap-2">
                                            <span className="text-sky-400 mt-1">&#x2022;</span>
                                            <span>Start, stop, and inspect providers across clusters</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-sky-400 mt-1">&#x2022;</span>
                                            <span>Policy editor with real-time push to agents</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-sky-400 mt-1">&#x2022;</span>
                                            <span>RBAC and tool access policy configuration</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                <a
                                    href={`${CLOUD_APP_URL}/signup`}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-zinc-950 font-semibold rounded-lg transition-all duration-300 hover:-translate-y-0.5"
                                >
                                    Try the Dashboard
                                </a>
                                <a
                                    href="/docs/cloud/dashboard"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-semibold rounded-lg transition-all duration-300 hover:-translate-y-0.5"
                                >
                                    Dashboard Docs
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Pricing Preview ──────────────────────────────── */}
                <div className="max-w-6xl mx-auto px-6 pb-32">
                    <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-6">
                        Open Source vs Cloud
                    </h2>
                    <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                            <tr className="border-b border-zinc-800/50">
                                <th className="text-left font-semibold text-zinc-300 px-6 py-4"/>
                                <th className="text-center font-semibold text-emerald-400 px-6 py-4">Free<br/><span className="font-normal text-zinc-500">$0 · cloud</span></th>
                                <th className="text-center font-semibold text-sky-400 px-6 py-4">Pro<br/><span className="font-normal text-zinc-500">$49/seat/mo</span></th>
                                <th className="text-center font-semibold text-amber-400 px-6 py-4">Enterprise<br/><span className="font-normal text-zinc-500">Custom</span></th>
                            </tr>
                            </thead>
                            <tbody>
                            {[
                                {f: "Hangar instances",        c: "1",       p: "Unlimited", e: "Unlimited"},
                                {f: "Event retention",         c: "7 days",  p: "30 days",   e: "Unlimited"},
                                {f: "Team seats",              c: "1",       p: "5+",        e: "Unlimited"},
                                {f: "Dashboard & audit trail", c: true,      p: true,        e: true},
                                {f: "Policy editor",           c: false,     p: true,        e: true},
                                {f: "CEF compliance export",   c: false,     p: true,        e: true},
                                {f: "SSO / SAML",              c: false,     p: false,       e: true},
                                {f: "Uptime SLA",              c: false,     p: false,       e: true},
                            ].map((row, i) => (
                                <tr key={i} className="border-b border-zinc-800/30 last:border-b-0">
                                    <td className="px-6 py-3 text-zinc-400">{row.f}</td>
                                    <td className="px-6 py-3 text-center">
                                        {typeof row.c === "boolean"
                                            ? (row.c ? <span className="text-emerald-400">✓</span> : <span className="text-zinc-600">—</span>)
                                            : <span className="text-zinc-300">{row.c}</span>}
                                    </td>
                                    <td className="px-6 py-3 text-center">
                                        {typeof row.p === "boolean"
                                            ? (row.p ? <span className="text-sky-400">✓</span> : <span className="text-zinc-600">—</span>)
                                            : <span className="text-zinc-300">{row.p}</span>}
                                    </td>
                                    <td className="px-6 py-3 text-center">
                                        {typeof row.e === "boolean"
                                            ? (row.e ? <span className="text-amber-400">✓</span> : <span className="text-zinc-600">—</span>)
                                            : <span className="text-zinc-300">{row.e}</span>}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="text-center mt-6">
                        <Link
                            to="/pricing"
                            className="inline-flex items-center gap-2 text-sky-400 hover:text-sky-300 transition-colors font-medium"
                        >
                            See full pricing & feature comparison
                            <ArrowIcon/>
                        </Link>
                    </div>
                </div>

                {/* ── Production Security (amber accent) ──────────── */}
                <div className="max-w-6xl mx-auto px-6 pb-32">
                    <div
                        className="relative rounded-2xl bg-gradient-to-b from-amber-500/10 to-transparent border border-amber-500/20 p-8 md:p-12 overflow-hidden">
                        <div
                            className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl"/>

                        <div className="relative">
                            <div className="flex items-center gap-3 mb-6">
                                <div
                                    className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
                                    <LockIcon/>
                                </div>
                                <h2 className="text-2xl md:text-3xl font-bold text-zinc-100">
                                    Production Security Built-In
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div>
                                    <h3 className="text-lg font-semibold text-zinc-200 mb-3">Authentication</h3>
                                    <ul className="space-y-2 text-zinc-400">
                                        <li className="flex items-start gap-2">
                                            <span className="text-amber-400 mt-1">&#x2022;</span>
                                            <span>API keys with bcrypt hashing, prefix lookup, automatic expiration</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-amber-400 mt-1">&#x2022;</span>
                                            <span>JWT/OIDC integration with JWKS validation and SSO support</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-amber-400 mt-1">&#x2022;</span>
                                            <span>Identity propagation: track callers from HTTP header to audit log</span>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-zinc-200 mb-3">Hardening</h3>
                                    <ul className="space-y-2 text-zinc-400">
                                        <li className="flex items-start gap-2">
                                            <span className="text-amber-400 mt-1">&#x2022;</span>
                                            <span>Agent TLS with custom CA and mTLS support</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-amber-400 mt-1">&#x2022;</span>
                                            <span>Tool access filtering with allow/deny lists and glob patterns</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-amber-400 mt-1">&#x2022;</span>
                                            <span>Capability declaration and runtime verification</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Documentation ────────────────────────────────── */}
                <div className="max-w-6xl mx-auto px-6 pb-32">
                    <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-6">
                        Documentation
                    </h2>
                    <p className="text-zinc-400 mb-8 max-w-2xl">
                        Everything you need to get started — cloud platform docs and open-source agent reference.
                    </p>
                    <div className="stagger-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <a
                            href="/docs/cloud/"
                            className="group p-6 rounded-2xl bg-sky-500/5 border border-sky-500/10 hover:border-sky-500/25 hover:bg-sky-500/10 transition-all duration-300 hover:-translate-y-1"
                        >
                            <div
                                className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-4">
                                <DashboardIcon/>
                            </div>
                            <h3 className="font-semibold text-zinc-100 mb-2">Cloud Docs</h3>
                            <p className="text-sm text-zinc-400">Onboarding, dashboard, teams, billing, agent connection</p>
                        </a>
                        <a
                            href="/docs/oss/getting-started/quickstart"
                            className="group p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800/50 hover:border-emerald-500/20 hover:bg-zinc-900/50 transition-all duration-300 hover:-translate-y-1"
                        >
                            <div
                                className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                                <RocketIcon/>
                            </div>
                            <h3 className="font-semibold text-zinc-100 mb-2">Getting Started</h3>
                            <p className="text-sm text-zinc-400">Install the agent and make your first parallel call</p>
                        </a>
                        <a
                            href="/docs/oss/cookbook/"
                            className="group p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800/50 hover:border-emerald-500/20 hover:bg-zinc-900/50 transition-all duration-300 hover:-translate-y-1"
                        >
                            <div
                                className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                                <BookOpenIcon/>
                            </div>
                            <h3 className="font-semibold text-zinc-100 mb-2">Cookbook</h3>
                            <p className="text-sm text-zinc-400">13 recipes from zero to production</p>
                        </a>
                        <a
                            href="/docs/oss/reference/configuration"
                            className="group p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800/50 hover:border-emerald-500/20 hover:bg-zinc-900/50 transition-all duration-300 hover:-translate-y-1"
                        >
                            <div
                                className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                                <FileTextIcon/>
                            </div>
                            <h3 className="font-semibold text-zinc-100 mb-2">Reference</h3>
                            <p className="text-sm text-zinc-400">Configuration, CLI, REST API, MCP tools</p>
                        </a>
                    </div>
                </div>

                {/* ── Built on Open Source ─────────────────────────── */}
                <div className="max-w-6xl mx-auto px-6 pb-32">
                    <div
                        className="relative rounded-2xl bg-gradient-to-b from-emerald-500/10 to-transparent border border-emerald-500/20 p-8 md:p-12 overflow-hidden">
                        <div
                            className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl"/>

                        <div className="relative text-center max-w-2xl mx-auto">
                            <div
                                className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 mb-6">
                                <HeartIcon/>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-zinc-100 mb-4">
                                Built on Open Source
                            </h2>
                            <p className="text-zinc-400 mb-6">
                                The <code className="text-emerald-400 bg-zinc-800/50 px-1.5 py-0.5 rounded text-sm">mcp-hangar</code> agent
                                is MIT-licensed and always will be. Run it locally, on your servers, or in Kubernetes — no cloud account required.
                                The platform adds managed infrastructure, team collaboration, and enterprise compliance on top.
                            </p>

                            {/* Install command */}
                            <div
                                onClick={copyCommand}
                                onKeyDown={handleKeyDown}
                                role="button"
                                tabIndex={0}
                                aria-label={copied ? "Installation command copied" : "Copy installation command to clipboard"}
                                className="group inline-flex items-center gap-4 bg-zinc-900/80 backdrop-blur border border-zinc-800 hover:border-emerald-500/30 rounded-xl px-5 py-4 font-mono text-sm cursor-pointer transition-all duration-300 hover:bg-zinc-900 hover:shadow-lg hover:shadow-emerald-500/5 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-zinc-950 mb-8"
                            >
                                <span className="text-zinc-500">$</span>
                                <span className="text-zinc-300">
                                    curl -sSL https://mcp-hangar.io/install.sh | bash
                                </span>
                                <span className="text-zinc-600 group-hover:text-emerald-400 transition-colors ml-2">
                                    {copied ? <CheckIcon/> : <CopyIcon/>}
                                </span>
                            </div>

                            <div className="flex flex-wrap justify-center gap-4">
                                <a
                                    href="/docs/oss/development/CONTRIBUTING"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold rounded-lg transition-all duration-300 hover:-translate-y-0.5"
                                >
                                    Contributing Guide
                                </a>
                                <a
                                    href="https://github.com/mcp-hangar/mcp-hangar/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-semibold rounded-lg transition-all duration-300 hover:-translate-y-0.5"
                                >
                                    <IssueIcon/>
                                    Good First Issues
                                </a>
                                <a
                                    href="https://github.com/mcp-hangar/mcp-hangar/stargazers"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-semibold rounded-lg transition-all duration-300 hover:-translate-y-0.5"
                                >
                                    <StarIcon/>
                                    Star on GitHub
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Footer ───────────────────────────────────────── */}
                <SiteFooter/>
            </div>
        </div>
    );
}

export default App;
