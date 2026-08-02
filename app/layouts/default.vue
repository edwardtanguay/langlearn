<template>
  <div class="min-h-screen flex flex-col relative pb-10">
    <Navigation />
    <main class="flex-1 py-12 min-h-[600px]">
      <UContainer>
        <slot />
      </UContainer>
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
</script>
