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
      <!-- Logo -->
      <a :href="'/' + ''" class="nav-logo" @click.prevent="goHome">
        <svg class="logo-mark" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M5 10a7 4 0 0 1 14 0"/>
          <line x1="5"  y1="10" x2="5"  y2="19"/>
          <line x1="19" y1="10" x2="19" y2="19"/>
          <line x1="5"  y1="15" x2="19" y2="15"/>
          <line x1="5"  y1="19" x2="19" y2="19"/>
        </svg>
        <span class="logo-text">mcp-hangar</span>
      </a>

      <!-- Links -->
      <div class="nav-links">
        <a href="/" class="nav-link">Product</a>
        <a href="/plans" class="nav-link">Plans</a>
        <a href="/docs/oss/" class="nav-link">Docs</a>
        <a href="/docs/blog/" class="nav-link">Blog</a>
        <a href="/waitlist" class="nav-link">Cloud Waitlist</a>
        <a href="https://github.com/mcp-hangar/mcp-hangar" class="nav-cta">GitHub</a>
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

.logo-mark {
  color: #34d399; /* emerald-400 */
  flex-shrink: 0;
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

.nav-cta {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: #0ea5e9;
  color: #09090b;
  font-weight: 600;
  font-size: 0.875rem;
  border-radius: 0.5rem;
  text-decoration: none;
  transition: all 0.3s;
}

.nav-cta:hover {
  background-color: #38bdf8;
  transform: translateY(-1px);
}
</style>
