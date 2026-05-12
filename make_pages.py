import re

def convert_tsx_to_astro(filename, title, desc, path):
    with open(f'src/{filename}.tsx', 'r') as f:
        content = f.read()

    # Extract the main tag content
    main_match = re.search(r'(<main.*?</main>)', content, re.DOTALL)
    if not main_match:
        return
    
    main_html = main_match.group(1)
    # Replace className with class
    main_html = main_html.replace('className=', 'class=')
    
    # For Terms, we need to enforce MIT only and remove BSL. 
    # Just in case, I'll do it manually afterwards if needed, but the prompt says:
    # "terms.astro MUST reference MIT only — NO BSL, NO "Business Source", NO dual-license prose."
    if filename == 'Terms':
        main_html = re.sub(r'Business Source License.*', 'MIT License.', main_html, flags=re.IGNORECASE)
        main_html = re.sub(r'BSL.*', 'MIT License.', main_html, flags=re.IGNORECASE)
        main_html = re.sub(r'dual-license.*', '', main_html, flags=re.IGNORECASE)

    astro_content = f"""---
import Base from '../layouts/Base.astro';
import SiteNav from '../components/SiteNav.astro';
import SiteFooter from '../components/SiteFooter.astro';
---

<Base title="{title}" description="{desc}" path="{path}">
    <div class="min-h-screen flex flex-col">
        <SiteNav />
        {main_html}
        <div class="mt-auto">
            <SiteFooter />
        </div>
    </div>
</Base>
"""
    with open(f'packages/site/src/pages/{filename.lower()}.astro', 'w') as f:
        f.write(astro_content)

convert_tsx_to_astro('Privacy', 'Privacy Policy -- MCP Hangar', 'Privacy Policy for MCP Hangar. Learn how we handle your data.', '/privacy')
convert_tsx_to_astro('Terms', 'Terms of Service -- MCP Hangar', 'Terms of Service governing the use of the MCP Hangar website.', '/terms')

