<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'

defineProps<{
  page: IndexCollectionItem
}>()
</script>

<template>
  <UPageSection
    :title="page.about.title"
    :ui="{
      container: '!p-0',
      title: 'text-left text-xl sm:text-xl lg:text-2xl font-medium',
      description: 'text-left mt-3 text-sm sm:text-md lg:text-sm text-muted whitespace-pre-line'
    }"
  >
    <template #description>
      <div class="text-left mt-3 text-sm sm:text-md lg:text-sm text-muted whitespace-pre-line">
        {{ page.about.description }}
      </div>
    </template>
  </UPageSection>
</template>

<style scoped>

</style>
