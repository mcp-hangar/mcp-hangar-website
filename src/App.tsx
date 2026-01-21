function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-6 py-24">
        <div className="space-y-8">
          {/* Logo/Title */}
          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tight">
              mcp-hangar
            </h1>
            <p className="text-xl text-zinc-400">
              Production-grade registry for MCP providers
            </p>
          </div>

          {/* Install command */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 font-mono text-sm">
            <span className="text-zinc-500">$</span>{" "}
            <span className="text-green-400">curl</span>{" "}
            <span className="text-zinc-300">-sSL https://get.mcp-hangar.io | bash</span>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-8">
            <Feature 
              title="Lazy Loading" 
              description="Tools visible immediately, containers start on first use"
            />
            <Feature 
              title="Circuit Breaker" 
              description="Automatic failure detection and recovery"
            />
            <Feature 
              title="Provider Groups" 
              description="Load balancing with automatic failover"
            />
            <Feature 
              title="Observability" 
              description="OpenTelemetry, Prometheus, Grafana ready"
            />
          </div>

          {/* Links */}
          <div className="flex gap-6 pt-8 text-sm">
            <a 
              href="https://github.com/mapyr/mcp-hangar" 
              className="text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              GitHub →
            </a>
            <a 
              href="https://mapyr.github.io/mcp-hangar/" 
              className="text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              Documentation →
            </a>
            <a 
              href="https://pypi.org/project/mcp-hangar/" 
              className="text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              PyPI →
            </a>
          </div>

          {/* Version */}
          <div className="pt-16 text-sm text-zinc-600">
            v0.1.2 · MIT License
          </div>
        </div>
      </div>
    </div>
  )
}

function Feature({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg p-4">
      <h3 className="font-semibold text-zinc-100">{title}</h3>
      <p className="text-sm text-zinc-500 mt-1">{description}</p>
    </div>
  )
}

export default App
