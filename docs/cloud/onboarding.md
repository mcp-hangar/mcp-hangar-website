# Onboarding

Get started with Hangar Cloud in under 5 minutes.

## Step 1: Create Your Account

Sign up at [app.mcp-hangar.io/signup](https://app.mcp-hangar.io/signup). You can start with the free Pro trial — no credit card required.

After signing up you will land on an empty fleet dashboard. Time to connect your first agent.

## Step 2: Install the Agent

If you haven't already, install the open-source `mcp-hangar` agent on your machine:

```bash
curl -sSL https://mcp-hangar.io/install.sh | bash
mcp-hangar init -y
```

See the [OSS Installation Guide](/docs/oss/getting-started/installation) for alternative installation methods.

## Step 3: Connect to Cloud

Generate a connection token in the Hangar Cloud dashboard under **Settings → Agent Tokens**, then configure your agent:

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

## Step 4: Explore the Dashboard

Once connected, you can:

- View provider health and tool inventory
- Browse the real-time audit trail
- See top callers and error rates
- Configure policies (Pro and Enterprise plans)

## Next Steps

- [Dashboard Guide](/docs/cloud/dashboard) — Learn the fleet overview UI
- [Teams & Roles](/docs/cloud/teams) — Invite your team
- [Agent Connection](/docs/cloud/agent-connection) — Advanced agent configuration

