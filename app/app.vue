<script setup lang="ts">
const isInitialLoading = useState('isInitialLoading', () => true)
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<style>
/* Global styles can go here if needed */
</style>