<script setup lang="ts">
const isInitialLoading = useState('isInitialLoading', () => true)
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage :page-key="route => route.fullPath" />
    </NuxtLayout>
  </UApp>
</template>

<style>
/* Global styles can go here if needed */
</style>