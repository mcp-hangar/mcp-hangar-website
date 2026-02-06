# Deployment

## How it works

1. **Push to `main`** → Vercel auto-deploys
2. **Docs fetched at build time** from `mapyr/mcp-hangar` repo

## Automatic Docs Refresh

Docs are fetched fresh during each Vercel build. To trigger rebuild when main repo docs change:

### Option 1: Trigger from main repo

Add to `mcp-hangar` repo workflow (e.g., when docs change):

```yaml
- name: Trigger website rebuild
  uses: peter-evans/repository-dispatch@v2
  with:
    token: ${{ secrets.WEBSITE_REPO_TOKEN }}
    repository: mapyr/mcp-hangar-website
    event-type: docs-updated
```

Requires: PAT with `repo` scope as `WEBSITE_REPO_TOKEN` secret in main repo.

### Option 2: Scheduled

`rebuild-docs.yml` runs daily at 4 AM UTC.

### Option 3: Manual

Go to Actions → "Rebuild on Docs Update" → Run workflow.

## Local Development

```bash
npm run dev        # Main site on :5173
npm run dev:docs   # Docs on :5173/docs/
npm run build      # Full build
npm run preview    # Preview build
```

