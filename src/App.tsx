import { useState } from 'react'

function App() {
  const [copied, setCopied] = useState(false)

  const copyCommand = () => {
    navigator.clipboard.writeText('curl -sSL https://get.mcp-hangar.io | bash')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-zinc-950 to-zinc-950" />
      <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')] opacity-[0.03]" />

      {/* Content */}
      <div className="relative">
        {/* Nav */}
        <nav className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
              <span className="text-zinc-950 font-bold text-sm">H</span>
            </div>
            <span className="font-semibold">mcp-hangar</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <a href="https://mapyr.github.io/mcp-hangar/" className="text-zinc-400 hover:text-emerald-400 transition-colors duration-300">
              Docs
            </a>
            <a href="https://github.com/mapyr/mcp-hangar" className="text-zinc-400 hover:text-emerald-400 transition-colors duration-300 flex items-center gap-2">
              <GithubIcon />
              GitHub
            </a>
          </div>
        </nav>

        {/* Hero */}
        <div className="max-w-6xl mx-auto px-6 pt-24 pb-32">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-8 hover:bg-emerald-500/15 transition-all cursor-default">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              v0.2.3 — Now with lazy loading
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
              Production-grade
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400 bg-clip-text text-transparent">
                MCP Infrastructure
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-zinc-400 max-w-xl mx-auto mb-6">
              Run Model Context Protocol providers at scale. Lifecycle management,
              load balancing, observability, and enterprise governance — all in one package.
            </p>
            <p className="text-base text-zinc-500 max-w-xl mx-auto mb-10">
              Built for teams who need reliability. Zero config to start, infinitely configurable when you need it.
            </p>

            {/* Install command */}
            <div
              onClick={copyCommand}
              className="group inline-flex items-center gap-4 bg-zinc-900/80 backdrop-blur border border-zinc-800 hover:border-emerald-500/30 rounded-xl px-5 py-4 font-mono text-sm cursor-pointer transition-all duration-300 hover:bg-zinc-900 hover:shadow-lg hover:shadow-emerald-500/5 hover:-translate-y-0.5"
            >
              <span className="text-zinc-500">$</span>
              <span className="text-zinc-300">curl -sSL https://get.mcp-hangar.io | bash</span>
              <span className="text-zinc-600 group-hover:text-emerald-400 transition-colors ml-2">
                {copied ? <CheckIcon /> : <CopyIcon />}
              </span>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <a
                href="https://mapyr.github.io/mcp-hangar/getting-started/quickstart/"
                className="group inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-0.5"
              >
                Get Started
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  <ArrowIcon />
                </span>
              </a>
              <a
                href="https://pypi.org/project/mcp-hangar/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-semibold rounded-lg transition-all duration-300 hover:-translate-y-0.5"
              >
                <PythonIcon />
                PyPI Package
              </a>
            </div>
          </div>
        </div>

        {/* What's New */}
        <div className="max-w-6xl mx-auto px-6 pb-20">
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-6">What's New in v0.2</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 hover:border-emerald-500/25 hover:bg-emerald-500/10 transition-all duration-300">
              <span className="text-emerald-400 mt-0.5">✦</span>
              <div>
                <span className="text-zinc-200 font-medium">Lazy Loading</span>
                <p className="text-sm text-zinc-500 mt-1">Providers start on first request, not at boot time</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 hover:border-emerald-500/25 hover:bg-emerald-500/10 transition-all duration-300">
              <span className="text-emerald-400 mt-0.5">✦</span>
              <div>
                <span className="text-zinc-200 font-medium">Provider Groups</span>
                <p className="text-sm text-zinc-500 mt-1">Group multiple instances for high availability</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 hover:border-emerald-500/25 hover:bg-emerald-500/10 transition-all duration-300">
              <span className="text-emerald-400 mt-0.5">✦</span>
              <div>
                <span className="text-zinc-200 font-medium">YAML Config</span>
                <p className="text-sm text-zinc-500 mt-1">Declarative configuration with hot reload support</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="max-w-6xl mx-auto px-6 pb-32">
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-6">Core Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Feature
              icon={<LifecycleIcon />}
              title="Lifecycle Management"
              description="Automatic provider startup, health checks, graceful shutdown, and restart policies. Configure timeouts, retries, and startup order."
            />
            <Feature 
              icon={<LoadBalanceIcon />}
              title="Load Balancing"
              description="Round-robin and weighted distribution across provider instances. Automatic failover when instances become unhealthy."
            />
            <Feature 
              icon={<CircuitIcon />}
              title="Circuit Breaker"
              description="Prevent cascade failures with configurable thresholds. Auto-recovery with exponential backoff and half-open state testing."
            />
            <Feature 
              icon={<ObservabilityIcon />}
              title="Observability"
              description="OpenTelemetry traces for distributed debugging. Prometheus metrics, structured JSON logging, and Grafana dashboards."
            />
            <Feature
              icon={<RateLimitIcon />}
              title="Rate Limiting"
              description="Token bucket algorithm for precise throttling. Per-provider and global limits with configurable burst allowance."
            />
            <Feature
              icon={<GovernanceIcon />}
              title="Enterprise Governance"
              description="Tool allowlists and denylists, resource quotas, audit logging, and security policies for compliance requirements."
            />
          </div>
        </div>

        {/* Code preview */}
        <div className="max-w-6xl mx-auto px-6 pb-32">
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-2">Simple Configuration</h2>
            <p className="text-zinc-400">Define your providers in a single YAML file. No boilerplate required.</p>
          </div>
          <div className="bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all duration-300">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800">
              <div className="w-3 h-3 rounded-full bg-zinc-700" />
              <div className="w-3 h-3 rounded-full bg-zinc-700" />
              <div className="w-3 h-3 rounded-full bg-zinc-700" />
              <span className="text-xs text-zinc-500 ml-2">config.yaml</span>
            </div>
            <pre className="p-6 text-sm overflow-x-auto">
              <code>
                <Line><Keyword>providers</Keyword>:</Line>
                <Line>  <Keyword>math</Keyword>:</Line>
                <Line>    <Key>mode</Key>: <String>subprocess</String></Line>
                <Line>    <Key>command</Key>: [<String>python</String>, <String>-m</String>, <String>mcp_math.server</String>]</Line>
                <Line>    <Key>idle_ttl_s</Key>: <Num>180</Num></Line>
                <Line />
                <Line>  <Keyword>sqlite</Keyword>:</Line>
                <Line>    <Key>mode</Key>: <String>container</String></Line>
                <Line>    <Key>image</Key>: <String>ghcr.io/mapyr/mcp-sqlite:latest</String></Line>
                <Line>    <Key>volumes</Key>:</Line>
                <Line>      - <String>"/data:/data:rw"</String></Line>
                <Line>    <Key>idle_ttl_s</Key>: <Num>300</Num></Line>
              </code>
            </pre>
          </div>
        </div>

        {/* Contributing */}
        <div className="max-w-6xl mx-auto px-6 pb-32">
          <div className="relative rounded-2xl bg-gradient-to-b from-emerald-500/10 to-transparent border border-emerald-500/20 p-8 md:p-12 overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl" />

            <div className="relative text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 mb-6">
                <HeartIcon />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-zinc-100 mb-4">
                Open Source & Community Driven
              </h2>
              <p className="text-zinc-400 mb-8">
                MCP Hangar is MIT licensed and built in the open. We welcome contributions of all kinds —
                whether it's fixing bugs, improving docs, or proposing new features. Every contribution matters.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="https://mapyr.github.io/mcp-hangar/development/CONTRIBUTING/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold rounded-lg transition-all duration-300 hover:-translate-y-0.5"
                >
                  Read Contributing Guide
                </a>
                <a
                  href="https://github.com/mapyr/mcp-hangar/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-semibold rounded-lg transition-all duration-300 hover:-translate-y-0.5"
                >
                  <IssueIcon />
                  Good First Issues
                </a>
                <a
                  href="https://github.com/mapyr/mcp-hangar/stargazers"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-semibold rounded-lg transition-all duration-300 hover:-translate-y-0.5"
                >
                  <StarIcon />
                  Star on GitHub
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-zinc-800/50">
          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
              {/* Brand */}
              <div className="col-span-2 md:col-span-1">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                    <span className="text-zinc-950 font-bold text-xs">H</span>
                  </div>
                  <span className="font-semibold text-zinc-100">mcp-hangar</span>
                </div>
                <p className="text-sm text-zinc-500 mb-4">
                  Production-grade MCP infrastructure. Free and open source.
                </p>
                <div className="flex items-center gap-3">
                  <a href="https://github.com/mapyr/mcp-hangar" className="text-zinc-500 hover:text-emerald-400 transition-colors duration-300">
                    <GithubIcon />
                  </a>
                  <a href="https://pypi.org/project/mcp-hangar/" className="text-zinc-500 hover:text-emerald-400 transition-colors duration-300">
                    <PythonIcon />
                  </a>
                </div>
              </div>

              {/* Documentation */}
              <div>
                <h4 className="text-sm font-semibold text-zinc-300 mb-4">Documentation</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="https://mapyr.github.io/mcp-hangar/getting-started/quickstart/" className="text-zinc-500 hover:text-emerald-400 transition-colors duration-300">Quickstart</a></li>
                  <li><a href="https://mapyr.github.io/mcp-hangar/getting-started/installation/" className="text-zinc-500 hover:text-emerald-400 transition-colors duration-300">Installation</a></li>
                  <li><a href="https://mapyr.github.io/mcp-hangar/architecture/OVERVIEW/" className="text-zinc-500 hover:text-emerald-400 transition-colors duration-300">Architecture</a></li>
                  <li><a href="https://mapyr.github.io/mcp-hangar/guides/OBSERVABILITY/" className="text-zinc-500 hover:text-emerald-400 transition-colors duration-300">Guides</a></li>
                </ul>
              </div>

              {/* Community */}
              <div>
                <h4 className="text-sm font-semibold text-zinc-300 mb-4">Community</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="https://github.com/mapyr/mcp-hangar/issues" className="text-zinc-500 hover:text-emerald-400 transition-colors duration-300">Issues</a></li>
                  <li><a href="https://mapyr.github.io/mcp-hangar/development/CONTRIBUTING/" className="text-zinc-500 hover:text-emerald-400 transition-colors duration-300">Contributing</a></li>
                  <li><a href="https://mapyr.github.io/mcp-hangar/changelog/" className="text-zinc-500 hover:text-emerald-400 transition-colors duration-300">Changelog</a></li>
                  <li><a href="https://mapyr.github.io/mcp-hangar/security/" className="text-zinc-500 hover:text-emerald-400 transition-colors duration-300">Security</a></li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h4 className="text-sm font-semibold text-zinc-300 mb-4">Project</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="https://github.com/mapyr/mcp-hangar/blob/main/LICENSE" className="text-zinc-500 hover:text-emerald-400 transition-colors duration-300">MIT License</a></li>
                  <li><a href="https://mapyr.github.io/mcp-hangar/runbooks/RELEASE/" className="text-zinc-500 hover:text-emerald-400 transition-colors duration-300">Releases</a></li>
                  <li><a href="https://github.com/mapyr/mcp-hangar" className="text-zinc-500 hover:text-emerald-400 transition-colors duration-300">Source Code</a></li>
                </ul>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="pt-8 border-t border-zinc-800/50 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-600">
              <span>© 2026 mcp-hangar contributors. Released under MIT License.</span>
              <span>Made with ♥ for the MCP community</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

// Feature component
function Feature({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="group p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800/50 hover:border-emerald-500/20 hover:bg-zinc-900/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/5">
      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-300">
        {icon}
      </div>
      <h3 className="font-semibold text-zinc-100 mb-2 group-hover:text-emerald-50 transition-colors duration-300">{title}</h3>
      <p className="text-sm text-zinc-500 leading-relaxed group-hover:text-zinc-400 transition-colors duration-300">{description}</p>
    </div>
  )
}

// Code highlighting components
const Line = ({ children }: { children?: React.ReactNode }) => <div className="leading-relaxed">{children}</div>
const Keyword = ({ children }: { children: React.ReactNode }) => <span className="text-purple-400">{children}</span>
const Key = ({ children }: { children: React.ReactNode }) => <span className="text-zinc-400">{children}</span>
const String = ({ children }: { children: React.ReactNode }) => <span className="text-emerald-400">{children}</span>
const Num = ({ children }: { children: React.ReactNode }) => <span className="text-amber-400">{children}</span>

// Icons
const GithubIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
)

const CopyIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
)

const CheckIcon = () => (
  <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
)

const ArrowIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
)

const PythonIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.914 0C5.82 0 6.2 2.656 6.2 2.656l.007 2.752h5.814v.826H3.9S0 5.789 0 11.969c0 6.18 3.403 5.96 3.403 5.96h2.03v-2.867s-.109-3.42 3.35-3.42h5.766s3.24.052 3.24-3.148V3.202S18.28 0 11.913 0zM8.708 1.85c.578 0 1.046.47 1.046 1.052 0 .581-.468 1.051-1.046 1.051-.579 0-1.046-.47-1.046-1.051 0-.582.467-1.052 1.046-1.052z"/>
    <path d="M12.087 24c6.093 0 5.713-2.656 5.713-2.656l-.007-2.752h-5.814v-.826h8.123s3.9.445 3.9-5.735c0-6.18-3.404-5.96-3.404-5.96h-2.03v2.867s.11 3.42-3.349 3.42H9.453s-3.24-.052-3.24 3.148v5.292S5.72 24 12.087 24zm3.206-1.85c-.578 0-1.046-.47-1.046-1.052 0-.581.468-1.051 1.046-1.051.579 0 1.046.47 1.046 1.051 0 .582-.467 1.052-1.046 1.052z"/>
  </svg>
)

const LifecycleIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
)

const LoadBalanceIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
  </svg>
)

const CircuitIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
  </svg>
)

const ObservabilityIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
)

const RateLimitIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const GovernanceIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
)

const HeartIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
)

const IssueIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
  </svg>
)

const StarIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
  </svg>
)

export default App
