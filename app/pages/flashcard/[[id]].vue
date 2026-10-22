<script setup lang="ts">
const route = useRoute()
const cardId = route.params.id as string | undefined
if (cardId) {
  navigateTo(`/flashcards/${cardId}`, { replace: true })
} else {
  navigateTo('/flashcards', { replace: true })
}
</script>

<template>
  <div class="py-24 flex items-center justify-center">
    <div class="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
</template>
