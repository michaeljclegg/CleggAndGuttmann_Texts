<script setup lang="ts">
defineProps<{
  src: string
  alt?: string
}>()
</script>

<template>
  <NuxtImg
    :src="src"
    :alt="alt || ''"
    class="rounded-lg w-full max-h-[35vh] object-contain mx-auto my-4"
  />
</template>

