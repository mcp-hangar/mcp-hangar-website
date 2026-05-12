import os
import re

for filename in os.listdir('packages/site/src/components/sections'):
    if not filename.endswith('.astro'):
        continue
        
    filepath = os.path.join('packages/site/src/components/sections', filename)
    with open(filepath, 'r') as f:
        html = f.read()

    # The broken pattern looks like:
    # <Feature
    #     >
    # <DashboardIcon slot="icon" />
    # </Feature>
    # title="..."
    # description="..."
    # accentColor="sky"
    # />
    
    # Let's fix it by matching the broken block and restructuring it
    def fix_feature(match):
        icon_name = match.group(1)
        attrs = match.group(2)
        return f'<Feature {attrs}>\n    <{icon_name} slot="icon" />\n</Feature>'
        
    html = re.sub(r'<Feature\s*>\s*<([A-Za-z0-9]+)\s+slot="icon"\s*/>\s*</Feature>([\s\S]*?)/>', fix_feature, html)
    
    with open(filepath, 'w') as f:
        f.write(html)
        
