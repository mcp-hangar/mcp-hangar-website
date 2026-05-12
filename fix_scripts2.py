import re

def rewrite_js(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Hero.astro
    if 'Hero.astro' in filepath:
        content = re.sub(r'<script>.*?</script>', '''
<script>
    const btn = document.getElementById('hero-copy-btn');
    if (btn) {
        btn.addEventListener('click', async () => {
            await navigator.clipboard.writeText('pip install mcp-hangar');
            const idle = btn.querySelector('.copy-idle');
            const success = btn.querySelector('.copy-success');
            if (idle && success) {
                idle.classList.add('hidden');
                success.classList.remove('hidden');
                setTimeout(() => {
                    idle.classList.remove('hidden');
                    success.classList.add('hidden');
                }, 2000);
            }
        });
    }
</script>''', content, flags=re.DOTALL)
        
    if 'BuiltonOpenSource.astro' in filepath:
        content = re.sub(r'<script>.*?</script>', '''
<script>
    const bosBtn = document.getElementById('bos-copy-btn');
    if (bosBtn) {
        bosBtn.addEventListener('click', async () => {
            const txtNode = bosBtn.querySelector('.text-zinc-300');
            const command = txtNode ? txtNode.textContent.trim() : '';
            await navigator.clipboard.writeText(command);
            const idle = bosBtn.querySelector('.bos-copy-idle');
            const success = bosBtn.querySelector('.bos-copy-success');
            if (idle && success) {
                idle.classList.add('hidden');
                success.classList.remove('hidden');
                setTimeout(() => {
                    idle.classList.remove('hidden');
                    success.classList.add('hidden');
                }, 2000);
            }
        });
        bosBtn.addEventListener('keydown', async (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                bosBtn.click();
            }
        });
    }
</script>''', content, flags=re.DOTALL)

    with open(filepath, 'w') as f:
        f.write(content)

rewrite_js('packages/site/src/components/sections/Hero.astro')
rewrite_js('packages/site/src/components/sections/BuiltonOpenSource.astro')

# PlansPreview.astro key removal
with open('packages/site/src/components/sections/PlansPreview.astro', 'r') as f:
    content = f.read()
content = re.sub(r'\s*key=\{[^\}]+\}', '', content)
with open('packages/site/src/components/sections/PlansPreview.astro', 'w') as f:
    f.write(content)

