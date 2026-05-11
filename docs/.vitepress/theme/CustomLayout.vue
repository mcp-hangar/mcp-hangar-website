<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import CustomNav from './CustomNav.vue'
import BlogByline from './BlogByline.vue'

const { Layout } = DefaultTheme
</script>

<template>
  <div class="custom-layout">
    <CustomNav />
    <Layout>
      <template #nav-bar-title-before></template>
      <template #doc-before>
        <BlogByline />
      </template>
    </Layout>
  </div>
</template>

<style>
.custom-layout {
  min-height: 100vh;
}
</style>
