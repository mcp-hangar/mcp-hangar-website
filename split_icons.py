import re
import os

with open('src/components/Icons.tsx', 'r') as f:
    content = f.read()

# Match export const ... = () => ( ... );
# We can just split by 'export const '
parts = content.split('export const ')

os.makedirs('packages/site/src/components/icons', exist_ok=True)

for part in parts[1:]: # skip first empty part
    name = part.split(' =')[0].strip()
    with open(f'packages/site/src/components/icons/{name}.tsx', 'w') as f:
        f.write('export const ' + part)

