import re
import os

with open('src/App.tsx', 'r') as f:
    content = f.read()

# find all sections using regex
# Look for `{/* ──` and split by it
sections_raw = re.split(r'\{\/\* ── (.+?) ──.*?\*\/\}', content)

# sections_raw[0] is everything before the first section
# then alternating: name, content, name, content...
sections = []
for i in range(1, len(sections_raw), 2):
    name = sections_raw[i].strip()
    # simplify name
    name_clean = re.sub(r'[^a-zA-Z0-9]', '', name)
    section_content = sections_raw[i+1]
    sections.append((name_clean, section_content))

os.makedirs('packages/site/src/components/sections', exist_ok=True)

# we need a list of all available icons in icons dir
icon_files = [f[:-6] for f in os.listdir('packages/site/src/components/icons') if f.endswith('.astro')]

for name, html in sections:
    if name in ['Nav', 'Footer']:
        continue # we already have these as layout/separate components
        
    html = html.replace('className=', 'class=')
    
    # Hero needs special handling for copy
    if name == 'Hero':
        html = re.sub(r'onClick=\{copyCommand\}', 'id="hero-copy-btn"', html)
        html = re.sub(r'\{copied \? \(.*?\) : \(.*?\)\}', '''
        <span class="copy-idle">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
        </span>
        <span class="copy-success hidden">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
        </span>
        ''', html, flags=re.DOTALL)
        
        script = """
<script>
    const btn = document.getElementById('hero-copy-btn');
    if (btn) {
        btn.addEventListener('click', async () => {
            await navigator.clipboard.writeText('pip install mcp-hangar');
            btn.querySelector('.copy-idle').classList.add('hidden');
            btn.querySelector('.copy-success').classList.remove('hidden');
            setTimeout(() => {
                btn.querySelector('.copy-idle').classList.remove('hidden');
                btn.querySelector('.copy-success').classList.add('hidden');
            }, 2000);
        });
    }
</script>
"""
        html += script

    # Now let's build the imports
    imports = []
    
    # check standard components
    for comp in ['Badge', 'Button', 'Feature', 'StepList', 'Step']:
        if f'<{comp}' in html:
            imports.append(f'import {comp} from "../{comp}.astro";')
            
    if '<CodeBlock' in html:
        imports.append(f'import {{ CodeBlock }} from "../CodeBlock.tsx";')
        
    for icon in icon_files:
        if f'<{icon}' in html:
            imports.append(f'import {icon} from "../icons/{icon}.astro";')
            
    if 'INSTALL_COMMAND' in html or 'LINKS' in html:
        imports.append(f'import {{ INSTALL_COMMAND, LINKS }} from "../../config";')
        # Also replace {LINKS...} to {LINKS...} which works natively in Astro
        
    # In Astro we can use icon as slot: <Feature><LockIcon slot="icon"/></Feature>
    # React code did <Feature icon={<LockIcon />} />
    # We must rewrite that.
    html = re.sub(r'icon=\{<([A-Za-z0-9]+)\s*/>\}', r'>\n        <\1 slot="icon" />\n    </Feature>', html)
    # Wait, the closing tag of Feature in React might have been self-closing <Feature ... />
    # We need to change <Feature ... /> to <Feature ...> <Icon slot="icon" /> </Feature>
    # Let's do a more robust regex for this
    
    def replace_feature(match):
        attrs = match.group(1)
        icon_match = re.search(r'icon=\{<([A-Za-z0-9]+)\s*/>\}', attrs)
        if icon_match:
            icon_name = icon_match.group(1)
            attrs = re.sub(r'icon=\{<[A-Za-z0-9]+\s*/>\}', '', attrs)
            return f'<Feature {attrs}>\n    <{icon_name} slot="icon" />\n</Feature>'
        return match.group(0)
        
    html = re.sub(r'<Feature\s+([^>]*?)/>', replace_feature, html)

    frontmatter = '---\n' + '\n'.join(imports) + '\n---\n'
    
    with open(f'packages/site/src/components/sections/{name}.astro', 'w') as f:
        f.write(frontmatter + html.strip() + '\n')

    print(f"Created {name}.astro")

