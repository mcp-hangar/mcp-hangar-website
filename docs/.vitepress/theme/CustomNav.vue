<script setup lang="ts">
import {useData} from 'vitepress'

const {isDark} = useData()

// Navigate to root (main site), bypassing VitePress router
const goHome = () => {
  window.location.href = '/'
}
</script>

<template>
  <nav class="custom-nav">
    <div class="nav-container">
      <!-- Logo - link to main site (not /docs/) -->
      <a :href="'/' + ''" class="nav-logo" @click.prevent="goHome">
        <div class="logo-icon">
          <span>H</span>
        </div>
        <span class="logo-text">mcp-hangar</span>
      </a>

      <!-- Links -->
      <div class="nav-links">
        <a href="/docs/" class="nav-link">Docs</a>
        <a href="https://github.com/mapyr/mcp-hangar" class="nav-link nav-link-github" target="_blank" rel="noopener">
          <svg class="github-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          GitHub
        </a>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.custom-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(9, 9, 11, 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid #27272a;
}

.nav-container {
  max-width: 72rem; /* max-w-6xl */
  margin: 0 auto;
  padding: 1.5rem; /* py-6 px-6 */
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem; /* gap-2 */
  text-decoration: none;
  color: #fafafa;
}

.logo-icon {
  width: 2rem; /* w-8 */
  height: 2rem; /* h-8 */
  border-radius: 0.5rem; /* rounded-lg */
  background: linear-gradient(to bottom right, #34d399, #059669); /* from-emerald-400 to-emerald-600 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-icon span {
  color: #09090b; /* text-zinc-950 */
  font-weight: 700; /* font-bold */
  font-size: 0.875rem; /* text-sm */
}

.logo-text {
  font-weight: 600; /* font-semibold */
  color: #fafafa;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem; /* gap-6 */
  font-size: 0.875rem; /* text-sm */
}

.nav-link {
  color: #a1a1aa; /* text-zinc-400 */
  text-decoration: none;
  transition: color 0.3s; /* duration-300 */
}

.nav-link:hover {
  color: #34d399; /* hover:text-emerald-400 */
}

.nav-link-github {
  display: flex;
  align-items: center;
  gap: 0.5rem; /* gap-2 */
}

.github-icon {
  width: 1rem; /* w-4 */
  height: 1rem; /* h-4 */
}
</style>
