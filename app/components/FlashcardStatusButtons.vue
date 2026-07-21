<script setup lang="ts">
defineEmits<{
  (e: 'action', actionTaken: string, newStatus?: string): void
}>()
</script>

<template>
  <div class="bg-gray-50 dark:bg-gray-950 p-3 rounded-xl border border-gray-100 dark:border-gray-800/60 space-y-2">
    <div class="flex gap-2">
      <button @click="$emit('action', 'MARKED_AS_LEARNED', 'LEARNED')"
        class="flex-1 py-2.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-xl transition-all">
        Learned
      </button>
      <button @click="$emit('action', 'MARKED_AS_KEEP_TESTING')"
        class="flex-1 py-2.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-xl transition-all">
        Keep Testing
      </button>
    </div>
    <div class="flex justify-center gap-2">
      <button @click="$emit('action', 'MARKED_AS_PARKED', 'PARKED')"
        class="px-6 py-2 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 text-amber-600 dark:text-amber-400 text-[10px] font-bold rounded-xl transition-all">
        Park
      </button>
      <button @click="$emit('action', 'MARKED_AS_DELETED', 'DELETED')"
        class="px-6 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 text-[10px] font-bold rounded-xl transition-all">
        Delete
      </button>
    </div>
  </div>
</template>
