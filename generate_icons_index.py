import os

icons = [f[:-4] for f in os.listdir('packages/site/src/components/icons') if f.endswith('.tsx')]
with open('packages/site/src/components/Icons.tsx', 'w') as f:
    for icon in icons:
        f.write(f'export * from "./icons/{icon}";\n')

