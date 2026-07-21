<script setup lang="ts">
const modelValue = defineModel<number>({ required: true })

defineEmits<{
  (e: 'save-rank'): void
}>()
</script>

<template>
  <div class="bg-gray-50 dark:bg-gray-950 p-4 rounded-xl border border-gray-100 dark:border-gray-800/60">
    <input
      v-model.number="modelValue"
      @input="$emit('save-rank')"
      type="range" min="0" max="5" step="0.00001"
      class="w-full h-3 rounded-full appearance-none cursor-pointer bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 custom-slider"
    />
  </div>
</template>

<style scoped>
/* Custom slider thumb */
.custom-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background-color: white;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0,0,0,0.5);
}
.custom-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background-color: white;
  border: none;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0,0,0,0.5);
}
</style>
