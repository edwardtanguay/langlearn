<script setup lang="ts">
const { isAdmin, fetchRole } = useCurrentUser()
const role = await fetchRole()
navigateTo(role === 'admin' ? '/flashcard' : '/member', { replace: true })
</script>

<template>
  <div class="py-24 flex items-center justify-center">
    <div class="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
</template>
