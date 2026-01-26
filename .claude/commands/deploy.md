Run pre-deployment checks for MCP Hangar website.

Production Readiness Checklist:

1. **Build Verification**
   ```bash
   npm run build
   npm run preview  # Test production build locally
   ```

2. **Code Quality**
   ```bash
   npm run lint  # Must pass with 0 errors
   ```

3. **Content Audit**
   - [ ] All external links work (GitHub, PyPI, docs)
   - [ ] Install script URL is correct (https://get.mcp-hangar.io)
   - [ ] Version numbers are current
   - [ ] No placeholder text or "TODO" comments
   - [ ] OG meta tags are correct in index.html

4. **Visual QA**
   - [ ] Terminal animation plays smoothly
   - [ ] All hover states work
   - [ ] No console errors in browser
   - [ ] Responsive at mobile/tablet/desktop
   - [ ] Fonts load correctly (Space Grotesk, JetBrains Mono)

5. **Performance**
   - [ ] No unnecessary dependencies added
   - [ ] Build output size is reasonable (<500KB for JS)
   - [ ] Images/SVGs are optimized

6. **Vercel Config** (if deploying to Vercel)
   - [ ] vercel.json redirects configured
   - [ ] install.sh redirect works for get.mcp-hangar.io
   - [ ] SPA routing configured correctly

After all checks pass:
- Review git diff to ensure only intended changes are included
- Create meaningful commit message
- Push to main branch (Vercel auto-deploys)
- Verify production deployment at https://mcp-hangar.io
