import { useState } from "react";
import { Feature } from "./components/Feature";
import { TerminalAnimation } from "./components/TerminalAnimation";
import {
  GithubIcon,
  CopyIcon,
  CheckIcon,
  ArrowIcon,
  PythonIcon,
  LifecycleIcon,
  LoadBalanceIcon,
  CircuitIcon,
  ObservabilityIcon,
  RateLimitIcon,
  GovernanceIcon,
  HeartIcon,
  IssueIcon,
  StarIcon,
  RocketIcon,
  LayersIcon,
  BookOpenIcon,
  FileTextIcon,
} from "./components/Icons";

function App() {
  const [copied, setCopied] = useState(false);

  const copyCommand = () => {
    navigator.clipboard.writeText("curl -sSL https://get.mcp-hangar.io | bash");
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
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-zinc-950 to-zinc-950" />
      <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')] opacity-[0.03]" />

      {/* Content */}
      <div className="relative">
        {/* Nav */}
        <nav className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between" aria-label="Main navigation">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center" aria-hidden="true">
              <span className="text-zinc-950 font-bold text-sm">H</span>
            </div>
            <span className="font-semibold">mcp-hangar</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <a
              href="https://mapyr.github.io/mcp-hangar/"
              className="text-zinc-400 hover:text-emerald-400 transition-colors duration-300"
            >
              Docs
            </a>
            <a
              href="https://github.com/mapyr/mcp-hangar"
              className="text-zinc-400 hover:text-emerald-400 transition-colors duration-300 flex items-center gap-2"
            >
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
              v0.5.0 — Batch Invocations
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
              Run Model Context Protocol providers at scale. Lifecycle
              management, load balancing, observability, and enterprise
              governance — all in one package.
            </p>
            <p className="text-base text-zinc-500 max-w-xl mx-auto mb-10">
              Built for teams who need reliability. Zero config to start,
              infinitely configurable when you need it.
            </p>

            {/* Install command */}
            <div
              onClick={copyCommand}
              onKeyDown={handleKeyDown}
              role="button"
              tabIndex={0}
              aria-label={copied ? "Installation command copied" : "Copy installation command to clipboard"}
              className="group inline-flex items-center gap-4 bg-zinc-900/80 backdrop-blur border border-zinc-800 hover:border-emerald-500/30 rounded-xl px-5 py-4 font-mono text-sm cursor-pointer transition-all duration-300 hover:bg-zinc-900 hover:shadow-lg hover:shadow-emerald-500/5 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-zinc-950"
            >
              <span className="text-zinc-500">$</span>
              <span className="text-zinc-300">
                curl -sSL https://get.mcp-hangar.io | bash
              </span>
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
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-6">
            What's New in v0.5
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 hover:border-emerald-500/25 hover:bg-emerald-500/10 transition-all duration-300">
              <span className="text-emerald-400 mt-0.5">✦</span>
              <div>
                <span className="text-zinc-200 font-medium">Batch Invocations</span>
                <p className="text-sm text-zinc-500 mt-1">
                  New{" "}
                  <code className="text-emerald-400/80">hangar_batch()</code>{" "}
                  for parallel tool execution with configurable concurrency
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 hover:border-emerald-500/25 hover:bg-emerald-500/10 transition-all duration-300">
              <span className="text-emerald-400 mt-0.5">✦</span>
              <div>
                <span className="text-zinc-200 font-medium">
                  SingleFlight Pattern
                </span>
                <p className="text-sm text-zinc-500 mt-1">
                  Cold start deduplication — one provider starts once, not N times
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 hover:border-emerald-500/25 hover:bg-emerald-500/10 transition-all duration-300">
              <span className="text-emerald-400 mt-0.5">✦</span>
              <div>
                <span className="text-zinc-200 font-medium">Batch Metrics</span>
                <p className="text-sm text-zinc-500 mt-1">
                  New Prometheus metrics for batch size, duration, concurrency, and truncations
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="max-w-6xl mx-auto px-6 pb-32">
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-6">
            Core Features
          </h2>
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
              title="Authentication & RBAC"
              description="API Key and JWT/OIDC authentication, role-based access control, audit logging with event sourcing, and tenant isolation."
            />
          </div>
        </div>

        {/* Quick Start */}
        <div className="max-w-6xl mx-auto px-6 pb-32">
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              Quick Start
            </h2>
            <p className="text-zinc-400">
              From install to first tool call in under a minute.
            </p>
          </div>
          <TerminalAnimation />
        </div>

        {/* Documentation */}
        <div className="max-w-6xl mx-auto px-6 pb-32">
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-6">
            Documentation
          </h2>
          <p className="text-zinc-400 mb-8 max-w-2xl">
            Everything you need to get started and make the most of MCP Hangar.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="https://mapyr.github.io/mcp-hangar/getting-started/quickstart/"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800/50 hover:border-emerald-500/20 hover:bg-zinc-900/50 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                <RocketIcon />
              </div>
              <h3 className="font-semibold text-zinc-100 mb-2">Getting Started</h3>
              <p className="text-sm text-zinc-400">Installation, setup, and first steps</p>
            </a>
            <a
              href="https://mapyr.github.io/mcp-hangar/architecture/OVERVIEW/"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800/50 hover:border-emerald-500/20 hover:bg-zinc-900/50 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                <LayersIcon />
              </div>
              <h3 className="font-semibold text-zinc-100 mb-2">Architecture</h3>
              <p className="text-sm text-zinc-400">System design, event sourcing, ADRs</p>
            </a>
            <a
              href="https://mapyr.github.io/mcp-hangar/guides/TESTING/"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800/50 hover:border-emerald-500/20 hover:bg-zinc-900/50 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                <BookOpenIcon />
              </div>
              <h3 className="font-semibold text-zinc-100 mb-2">Guides</h3>
              <p className="text-sm text-zinc-400">Testing, containers, auth, Kubernetes</p>
            </a>
            <a
              href="https://mapyr.github.io/mcp-hangar/changelog/"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800/50 hover:border-emerald-500/20 hover:bg-zinc-900/50 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                <FileTextIcon />
              </div>
              <h3 className="font-semibold text-zinc-100 mb-2">Reference</h3>
              <p className="text-sm text-zinc-400">Changelog, security, contributing</p>
            </a>
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
                MCP Hangar is MIT licensed and built in the open. We welcome
                contributions of all kinds — whether it's fixing bugs, improving
                docs, or proposing new features. Every contribution matters.
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
                  <span className="font-semibold text-zinc-100">
                    mcp-hangar
                  </span>
                </div>
                <p className="text-sm text-zinc-500 mb-4">
                  Production-grade MCP infrastructure. Free and open source.
                </p>
                <div className="flex items-center gap-3">
                  <a
                    href="https://github.com/mapyr/mcp-hangar"
                    className="text-zinc-500 hover:text-emerald-400 transition-colors duration-300"
                  >
                    <GithubIcon />
                  </a>
                  <a
                    href="https://pypi.org/project/mcp-hangar/"
                    className="text-zinc-500 hover:text-emerald-400 transition-colors duration-300"
                  >
                    <PythonIcon />
                  </a>
                </div>
              </div>

              {/* Documentation */}
              <div>
                <h4 className="text-sm font-semibold text-zinc-300 mb-4">
                  Documentation
                </h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a
                      href="https://mapyr.github.io/mcp-hangar/getting-started/quickstart/"
                      className="text-zinc-500 hover:text-emerald-400 transition-colors duration-300"
                    >
                      Quickstart
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://mapyr.github.io/mcp-hangar/getting-started/installation/"
                      className="text-zinc-500 hover:text-emerald-400 transition-colors duration-300"
                    >
                      Installation
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://mapyr.github.io/mcp-hangar/architecture/OVERVIEW/"
                      className="text-zinc-500 hover:text-emerald-400 transition-colors duration-300"
                    >
                      Architecture
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://mapyr.github.io/mcp-hangar/guides/OBSERVABILITY/"
                      className="text-zinc-500 hover:text-emerald-400 transition-colors duration-300"
                    >
                      Guides
                    </a>
                  </li>
                </ul>
              </div>

              {/* Community */}
              <div>
                <h4 className="text-sm font-semibold text-zinc-300 mb-4">
                  Community
                </h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a
                      href="https://github.com/mapyr/mcp-hangar/issues"
                      className="text-zinc-500 hover:text-emerald-400 transition-colors duration-300"
                    >
                      Issues
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://mapyr.github.io/mcp-hangar/development/CONTRIBUTING/"
                      className="text-zinc-500 hover:text-emerald-400 transition-colors duration-300"
                    >
                      Contributing
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://mapyr.github.io/mcp-hangar/changelog/"
                      className="text-zinc-500 hover:text-emerald-400 transition-colors duration-300"
                    >
                      Changelog
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://mapyr.github.io/mcp-hangar/security/"
                      className="text-zinc-500 hover:text-emerald-400 transition-colors duration-300"
                    >
                      Security
                    </a>
                  </li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h4 className="text-sm font-semibold text-zinc-300 mb-4">
                  Project
                </h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a
                      href="https://github.com/mapyr/mcp-hangar/blob/main/LICENSE"
                      className="text-zinc-500 hover:text-emerald-400 transition-colors duration-300"
                    >
                      MIT License
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://mapyr.github.io/mcp-hangar/runbooks/RELEASE/"
                      className="text-zinc-500 hover:text-emerald-400 transition-colors duration-300"
                    >
                      Releases
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/mapyr/mcp-hangar"
                      className="text-zinc-500 hover:text-emerald-400 transition-colors duration-300"
                    >
                      Source Code
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="pt-8 border-t border-zinc-800/50 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-600">
              <span>
                © 2026 mcp-hangar contributors. Released under MIT License.
              </span>
              <span>Made with ♥ for the MCP community</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
