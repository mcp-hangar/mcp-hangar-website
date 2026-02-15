<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import CustomNav from './CustomNav.vue'

const { Layout } = DefaultTheme
</script>

<template>
  <div class="custom-layout">
    <CustomNav />
    <Layout>
      <template #nav-bar-title-before></template>
    </Layout>
  </div>
</template>

<style>
.custom-layout {
  min-height: 100vh;
}
</style>
