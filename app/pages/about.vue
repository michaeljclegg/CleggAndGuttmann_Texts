<script setup lang="ts">
const { data: page } = await useAsyncData('about', () => {
  return queryCollection('about').first()
})
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}

const { global } = useAppConfig()

// Extract URL from markdown link format [text](url)
const extractUrl = (markdownLink: string): string => {
  const match = markdownLink.match(/\[.*?\]\((.*?)\)/)
  return (match && match[1]) ? match[1] : '#'
}

// Extract text from markdown link format [text](url)
const extractText = (markdownLink: string): string => {
  const match = markdownLink.match(/\[(.*?)\]/)
  return (match && match[1]) ? match[1] : markdownLink
}

useSeoMeta({
  title: page.value?.seo?.title || page.value?.title,
  ogTitle: page.value?.seo?.title || page.value?.title,
  description: page.value?.seo?.description || page.value?.description,
  ogDescription: page.value?.seo?.description || page.value?.description
})
</script>

<template>
  <UPage v-if="page">
    <!-- <UPageHeader class="mt-12"
      :title="page.title"
      :description="page.description"
      orientation="vertical"
      :ui="{
        container: 'lg:flex sm:flex-row items-center',
        title: '!mx-0 text-left',
        description: '!mx-0 text-left',
        links: 'justify-start'
        
      }"
    > -->
    <UPageHeader class="mt-10">
      <div class="text-2xl text-gray-200">

        {{ page.title }}
      </div>
      <div class="text-[16px] whitespace-pre-line">
        {{ page.description }}
      </div>


   
    </UPageHeader>
    <UPageSection
      :ui="{
        container: '!pt-0 mt-2'
      }"
    >
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div v-if="(page as any).links && (page as any).links.length > 0" class="flex flex-col gap-2">
          <ULink
            v-for="(linkMarkdown, index) in (page as any).links"
            :key="index"
            :to="extractUrl(linkMarkdown)"
            target="_blank"
            external
            class="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            {{ extractText(linkMarkdown) }}
          </ULink>
        </div>
        <div class="flex flex-row justify-center lg:justify-end items-center">
          <NuxtImg
            v-for="(image, index) in page.images"
            :key="index"
            :src="image.src"
            :alt="image.alt"
            class="rounded-lg max-w-[70%]"
          />
        </div>
      </div>
      <USeparator v-if="(page as any).links && (page as any).links.length > 0" class="mt-2" />
    </UPageSection>
  </UPage>
</template>
