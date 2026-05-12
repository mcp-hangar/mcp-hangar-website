import re

with open('packages/site/src/components/sections/BuiltonOpenSource.astro', 'r') as f:
    html = f.read()

# Replace React event handlers and copied state with vanilla JS class toggle
html = re.sub(r'onClick=\{copyCommand\}', 'id="bos-copy-btn"', html)
html = re.sub(r'onKeyDown=\{handleKeyDown\}', '', html)
html = re.sub(r'aria-label=\{copied \? .*?\}', 'aria-label="Copy pip install command to clipboard"', html)
html = re.sub(r'\{copied \? <CheckIcon/> : <CopyIcon/>\}', '''
<span class="bos-copy-idle"><CopyIcon/></span>
<span class="bos-copy-success hidden"><CheckIcon/></span>
''', html)

script = """
<script>
    const bosBtn = document.getElementById('bos-copy-btn');
    if (bosBtn) {
        bosBtn.addEventListener('click', async () => {
            const command = bosBtn.querySelector('.text-zinc-300').innerText.trim();
            await navigator.clipboard.writeText(command);
            bosBtn.querySelector('.bos-copy-idle').classList.add('hidden');
            bosBtn.querySelector('.bos-copy-success').classList.remove('hidden');
            setTimeout(() => {
                bosBtn.querySelector('.bos-copy-idle').classList.remove('hidden');
                bosBtn.querySelector('.bos-copy-success').classList.add('hidden');
            }, 2000);
        });
        bosBtn.addEventListener('keydown', async (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                bosBtn.click();
            }
        });
    }
</script>
"""

with open('packages/site/src/components/sections/BuiltonOpenSource.astro', 'w') as f:
    f.write(html + script)
