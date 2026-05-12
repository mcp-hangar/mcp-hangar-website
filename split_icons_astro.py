import re
import os

with open('src/components/Icons.tsx', 'r') as f:
    content = f.read()

parts = content.split('export const ')

os.makedirs('packages/site/src/components/icons', exist_ok=True)

for part in parts[1:]:
    name = part.split(' =')[0].strip()
    # Handle ({size = 24}: {size?: number})
    props_match = re.search(r'\((.*?)\)\s*=>\s*\(', part)
    
    astro_frontmatter = ''
    if props_match and 'size' in props_match.group(1):
        astro_frontmatter = '---\nconst { size = 24, class: className = "" } = Astro.props;\n---\n'
    else:
        astro_frontmatter = '---\nconst { class: className = "" } = Astro.props;\n---\n'
    
    # Extract just the SVG part
    svg_match = re.search(r'(<svg.*?</svg>)', part, re.DOTALL)
    if not svg_match:
        continue
    svg = svg_match.group(1)
    
    # Replace className with class in the SVG
    svg = svg.replace('className=', 'class=')
    
    # Replace {size} with {size} - Astro supports this directly if we use it, 
    # but in Astro variables are just injected. SVG in Astro uses {size} just like JSX.
    
    with open(f'packages/site/src/components/icons/{name}.astro', 'w') as f:
        f.write(astro_frontmatter + svg + '\n')

