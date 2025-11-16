<script setup lang="ts">
const { data: posts } = await useAsyncData('all-texts', () =>
  queryCollection('blog').order('date', 'DESC').all()
)

if (!posts.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Blog posts not found',
    fatal: true
  })
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// No transformation needed - use posts directly

useSeoMeta({
  title: 'AllTexts',
  description: 'List of all C&G texts sorted by date'
})
</script>

<template>
  <UPage>
    <UPageHeader class="mt-10">
      <div class="text-2xl">
        AllTexts
      </div>
      <div class="text-sm text-muted mt-2">
        List of all C&G texts sorted by date
      </div>
    </UPageHeader>
    <UPageSection
      :ui="{
        container: '!pt-0'
      }"
    >
      <div class="flex flex-col gap-0">
        <div
          v-for="(post, index) in posts"
          :key="index"
          class="flex items-center justify-between w-full py-3 border-b border-default last:border-b-0"
        >
          <ULink
            :to="post.path"
            :title="post.description || ''"
            class="flex-1 text-lg font-semibold text-highlighted hover:text-primary transition-colors cursor-pointer"
          >
            {{ post.title }}
          </ULink>
          <span
            v-if="post.date"
            class="text-xs text-muted ms-4 shrink-0"
          >
            {{ formatDate(post.date) }}
          </span>
        </div>
      </div>
    </UPageSection>
  </UPage>
</template>

