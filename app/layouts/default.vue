<template>
  <div class="min-h-screen flex flex-col">
    <Navigation />
    <main class="flex-1 py-12 min-h-[600px]">
      <UContainer>
        <slot />
      </UContainer>
    </main>
  </div>
</template>

<script setup lang="ts">
</script>
