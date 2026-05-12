import re
import os

def fix_script(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    content = content.replace('.querySelector(', '?.querySelector(')
    content = content.replace('?.innerText', '?.textContent')
    with open(filepath, 'w') as f:
        f.write(content)

fix_script('packages/site/src/components/sections/BuiltonOpenSource.astro')
fix_script('packages/site/src/components/sections/Hero.astro')

# also remove unused imports
def remove_unused(filepath, word):
    with open(filepath, 'r') as f:
        content = f.read()
    content = re.sub(rf'import\s+{{\s*{word}\s*}}\s+from.*?;\n', '', content)
    content = re.sub(rf'import\s+{{\s*[a-zA-Z0-9_]+,\s*{word}\s*}}\s+from', lambda m: m.group(0).replace(f', {word}', ''), content)
    content = re.sub(rf'import\s+{{\s*{word},\s*[a-zA-Z0-9_]+\s*}}\s+from', lambda m: m.group(0).replace(f'{word}, ', ''), content)
    with open(filepath, 'w') as f:
        f.write(content)

remove_unused('packages/site/src/components/sections/BuiltonOpenSource.astro', 'LINKS')
remove_unused('packages/site/src/components/sections/Hero.astro', 'INSTALL_COMMAND')
