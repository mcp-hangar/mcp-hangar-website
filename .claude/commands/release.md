Update MCP Hangar version to: $ARGUMENTS

Tasks:
1. Update the version badge in the hero section (currently shows "v0.4.0 — Full Rebrand & Control Plane")
2. Update the terminal animation success message (currently "✓ mcp-hangar installed (v0.4.0)")
3. Update package.json version if applicable
4. Consider updating the "What's New" section with relevant release highlights

After updating:
- Verify all version references are consistent
- Check that the install script URL still works (https://get.mcp-hangar.io)
- Run `npm run build` to ensure production build succeeds
- Visually verify the badge and terminal animation display correctly
