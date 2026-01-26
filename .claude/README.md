# Claude Code Configuration for MCP Hangar Website

This directory contains Claude Code configuration files that customize how Claude behaves when working on this project.

## Files Overview

### `managed-settings.json`
Permissions and security settings. Defines:
- **Allowed commands**: Safe npm/git operations
- **Denied commands**: Destructive operations that could wreck things
- **Tool permissions**: Which Claude tools can be used
- **Directory restrictions**: Where Claude can read/write

Think of this as your firewall rules for the AI.

### `commands/*.md`
Custom slash commands for common workflows:
- `/feature [description]` - Add a new feature card to the landing page
- `/release [version]` - Update version numbers across the site
- `/responsive [section]` - Check and fix responsive design issues
- `/deploy` - Run pre-deployment checklist

Use these in Claude Code by typing `/` and selecting from the menu.

## Usage

### In Claude Code Session

```bash
# Start Claude Code in the project directory
cc

# Use a slash command
/deploy

# Or just chat normally - Claude reads CLAUDE.md automatically
"add a new feature for hot-reloading providers"
```

### Modifying Configuration

- **Add new slash commands**: Create `.md` files in `commands/` directory
- **Update project context**: Edit `../CLAUDE.md` (keep it concise!)
- **Change permissions**: Edit `managed-settings.json` (be careful!)

## Best Practices

1. **Keep CLAUDE.md under 500 lines** - Claude can only follow ~150-200 instructions reliably
2. **Use progressive disclosure** - Tell Claude where to find info, not all the info upfront
3. **Slash commands for repetitive tasks** - DRY principle applies to prompts too
4. **Review permissions quarterly** - Make sure denied commands are still relevant

## Security Notes

This config is **intentionally restrictive**:
- No arbitrary network access (curl/wget blocked)
- No destructive file operations (rm -rf denied)
- Limited to source code directories
- 14-day transcript retention (not forever)

If Claude needs to do something blocked, you'll be prompted to approve it manually.

## Version

Last updated: 2026-01-26
Claude Code version: 2.x
Config schema: v1.0
