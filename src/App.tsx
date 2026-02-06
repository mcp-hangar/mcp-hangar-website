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
  CircuitIcon,
  ObservabilityIcon,
  HeartIcon,
  IssueIcon,
  StarIcon,
  RocketIcon,
  LayersIcon,
  BookOpenIcon,
  FileTextIcon,
  ParallelIcon,
  ServerStackIcon,
  ShieldCheckIcon,
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
              href="/docs/"
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
              v0.6.6 — Hot-reload • Cookbook • One-liner install
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
              The MCP
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400 bg-clip-text text-transparent">
                Control Plane
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-zinc-400 max-w-xl mx-auto mb-10">
              One interface for all your MCP providers. Parallel execution,
              lifecycle management, production ready.
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
                href="/docs/getting-started/quickstart/"
                className="group inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-0.5"
              >
                Get Started
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  <ArrowIcon />
                </span>
              </a>
              <a
                href="https://github.com/mapyr/mcp-hangar"
                className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-semibold rounded-lg transition-all duration-300 hover:-translate-y-0.5"
              >
                <GithubIcon />
                View on GitHub
              </a>
            </div>
          </div>
        </div>

        {/* What Hangar Does */}
        <div className="max-w-6xl mx-auto px-6 pb-20">
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-6">
            What Hangar Does
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 hover:border-emerald-500/25 hover:bg-emerald-500/10 transition-all duration-300">
              <span className="text-emerald-400 mt-0.5">⚡</span>
              <div>
                <span className="text-zinc-200 font-medium">Parallel Calls</span>
                <p className="text-sm text-zinc-500 mt-1">
                  15 tools, 2 providers, 380ms. Sequential would take 5+ seconds.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 hover:border-emerald-500/25 hover:bg-emerald-500/10 transition-all duration-300">
              <span className="text-emerald-400 mt-0.5">📁</span>
              <div>
                <span className="text-zinc-200 font-medium">One Config</span>
                <p className="text-sm text-zinc-500 mt-1">
                  All providers in one place. Subprocess, Docker, remote HTTP.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 hover:border-emerald-500/25 hover:bg-emerald-500/10 transition-all duration-300">
              <span className="text-emerald-400 mt-0.5">🔄</span>
              <div>
                <span className="text-zinc-200 font-medium">Zero Downtime</span>
                <p className="text-sm text-zinc-500 mt-1">
                  Hot-reload config. Change providers without restart.
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
              icon={<ParallelIcon />}
              title="Parallel Execution"
              description="Batch multiple tool calls across providers. Single-flight cold starts — provider initializes once, not N times. Automatic concurrency management."
            />
            <Feature
              icon={<LifecycleIcon />}
              title="Lifecycle Management"
              description="Lazy loading — providers start on first call. Automatic shutdown after idle TTL. Health monitoring keeps them alive when needed."
            />
            <Feature
              icon={<CircuitIcon />}
              title="Circuit Breaker"
              description="One failing provider doesn't kill your batch. Automatic isolation, exponential backoff recovery, graceful degradation."
            />
            <Feature
              icon={<ObservabilityIcon />}
              title="Observability"
              description="Correlation IDs across parallel calls. OpenTelemetry traces, Prometheus metrics. Debug batch execution, not black boxes."
            />
            <Feature
              icon={<ServerStackIcon />}
              title="Multi-Provider Orchestration"
              description="Local subprocess, Docker containers, remote HTTP — mix them in single batch. Unified interface, heterogeneous backends."
            />
            <Feature
              icon={<ShieldCheckIcon />}
              title="Production Ready"
              description="Battle-tested config patterns. Works in home lab with 2 providers. Works in enterprise with 50. Same API, same reliability."
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
              From install to first parallel call in 2 minutes.
            </p>
          </div>
          <TerminalAnimation />
        </div>

        {/* Benchmarks */}
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
                  <th className="text-left text-sm font-semibold text-zinc-300 px-6 py-4">Success Rate</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-zinc-800/30">
                  <td className="px-6 py-4 text-zinc-400">15 tools, 2 providers</td>
                  <td className="px-6 py-4 text-emerald-400 font-mono">380ms</td>
                  <td className="px-6 py-4 text-emerald-400 font-mono">100%</td>
                </tr>
                <tr className="border-b border-zinc-800/30">
                  <td className="px-6 py-4 text-zinc-400">Thundering herd (50 concurrent)</td>
                  <td className="px-6 py-4 text-emerald-400 font-mono">1.3s</td>
                  <td className="px-6 py-4 text-emerald-400 font-mono">100%</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-zinc-400">Cold start + batch</td>
                  <td className="px-6 py-4 text-emerald-400 font-mono">&lt;500ms</td>
                  <td className="px-6 py-4 text-emerald-400 font-mono">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-zinc-500 mt-4">
            Measured on production infrastructure. 2B time series, 1500+ services.
          </p>
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
              href="/docs/getting-started/quickstart/"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800/50 hover:border-emerald-500/20 hover:bg-zinc-900/50 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                <RocketIcon />
              </div>
              <h3 className="font-semibold text-zinc-100 mb-2">Getting Started</h3>
              <p className="text-sm text-zinc-400">From install to first parallel call in 2 minutes</p>
            </a>
            <a
              href="/docs/architecture/OVERVIEW/"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800/50 hover:border-emerald-500/20 hover:bg-zinc-900/50 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                <LayersIcon />
              </div>
              <h3 className="font-semibold text-zinc-100 mb-2">Architecture</h3>
              <p className="text-sm text-zinc-400">How single-flight and batch execution work under the hood</p>
            </a>
            <a
              href="/docs/guides/TESTING/"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800/50 hover:border-emerald-500/20 hover:bg-zinc-900/50 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                <BookOpenIcon />
              </div>
              <h3 className="font-semibold text-zinc-100 mb-2">Guides</h3>
              <p className="text-sm text-zinc-400">Claude Code integration, Docker providers, observability setup</p>
            </a>
            <a
              href="/docs/changelog/"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800/50 hover:border-emerald-500/20 hover:bg-zinc-900/50 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                <FileTextIcon />
              </div>
              <h3 className="font-semibold text-zinc-100 mb-2">Reference</h3>
              <p className="text-sm text-zinc-400">API reference, configuration options, troubleshooting</p>
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
                  href="/docs/development/CONTRIBUTING/"
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
                      href="/docs/getting-started/quickstart/"
                      className="text-zinc-500 hover:text-emerald-400 transition-colors duration-300"
                    >
                      Quickstart
                    </a>
                  </li>
                  <li>
                    <a
                      href="/docs/getting-started/installation/"
                      className="text-zinc-500 hover:text-emerald-400 transition-colors duration-300"
                    >
                      Installation
                    </a>
                  </li>
                  <li>
                    <a
                      href="/docs/architecture/OVERVIEW/"
                      className="text-zinc-500 hover:text-emerald-400 transition-colors duration-300"
                    >
                      Architecture
                    </a>
                  </li>
                  <li>
                    <a
                      href="/docs/guides/OBSERVABILITY/"
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
                      href="/docs/development/CONTRIBUTING/"
                      className="text-zinc-500 hover:text-emerald-400 transition-colors duration-300"
                    >
                      Contributing
                    </a>
                  </li>
                  <li>
                    <a
                      href="/docs/changelog/"
                      className="text-zinc-500 hover:text-emerald-400 transition-colors duration-300"
                    >
                      Changelog
                    </a>
                  </li>
                  <li>
                    <a
                      href="/docs/security/"
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
                      href="/docs/runbooks/RELEASE/"
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
