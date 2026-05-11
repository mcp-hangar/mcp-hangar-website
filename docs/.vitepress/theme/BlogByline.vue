<script setup lang="ts">
import { useData } from 'vitepress'

const { frontmatter } = useData()
</script>

<template>
  <p v-if="frontmatter.author || frontmatter.date" class="blog-byline">
    <span v-if="frontmatter.author">By {{ frontmatter.author }}</span>
    <span v-if="frontmatter.author && frontmatter.date"> · </span>
    <span v-if="frontmatter.date">{{ frontmatter.date }}</span>
  </p>
</template>

<style scoped>
.blog-byline {
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  margin-top: -1rem;
  margin-bottom: 2rem;
}
</style>
