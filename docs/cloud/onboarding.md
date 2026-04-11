# Onboarding

::: warning LAUNCHING SEPTEMBER 2026
The cloud dashboard is not yet available. You can install and use the OSS agent today — it works fully standalone. This page describes the onboarding flow that will be available at launch.
:::

## Today: Install the OSS Agent

The open-source `mcp-hangar` agent is production-ready and runs without a cloud account:

```bash
curl -sSL https://mcp-hangar.io/install.sh | bash
mcp-hangar init -y
mcp-hangar serve
```

See the [OSS Quick Start](/oss/getting-started/quickstart) for full instructions.

## At Launch: Connect to Cloud

When Hangar Cloud launches in September 2026, connecting will take under 5 minutes:

### Step 1: Create Your Account

Sign up at [app.mcp-hangar.io](https://app.mcp-hangar.io). Early access members get 3 months of Pro free.

### Step 2: Generate a Token

In the cloud dashboard, navigate to **Settings → Agent Tokens** and create a connection token.

### Step 3: Connect the Agent

Add the `cloud` section to your existing agent configuration:

```yaml
# ~/.config/mcp-hangar/config.yaml
cloud:
  enabled: true
  token: "hngr_agt_..."
  endpoint: "https://api.mcp-hangar.io"
```

Restart the agent:

```bash
mcp-hangar serve
```

Within seconds your agent will appear in the fleet dashboard.

### Step 4: Explore the Dashboard

Once connected, you can:

- View provider health and tool inventory
- Browse the real-time audit trail
- See top callers and error rates
- Configure policies (Pro and Enterprise plans)

## Want to be ready at launch?

[Join early access →](https://app.mcp-hangar.io/early-access)

## Next Steps

- [OSS Agent Docs](/oss/) — Get started with the agent today
- [Dashboard Guide](/cloud/dashboard) — Preview the cloud dashboard features
- [Agent Connection](/cloud/agent-connection) — Detailed connection configuration

