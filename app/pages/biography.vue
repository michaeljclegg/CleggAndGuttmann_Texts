<template>
  <UPage v-if="page">
    <!-- <UPageHero
      :title="page.title"
      :description="page.description"
      :ui="{
        title: '!mx-0 text-left sm:text-[16px]',
        description: '!mx-0 text-left text-lg'
      }"
    /> -->
    <UPageHeader  class="text-2xl mt-12 ">
      SINGLE SHOWS / PROJECTS
    </UPageHeader>
    <UPageBody>
      <ContentRenderer
        v-if="pageWithBody?.body"
        :value="page"
        class="prose dark:prose-invert max-w-none mt-12"
      />
    </UPageBody>
    <template v-if="filteredTocLinks?.length" #right>
      <UContentToc  
      title=" " 
      color="primary"
      :links="filteredTocLinks"
      >
        <template #top>
          <button
            @click="scrollToTop"
            class="group relative text-sm font-semibold flex items-center justify-center focus-visible:outline-primary py-1 mt-4 text-primary hover:text-primary/80 transition-colors w-full cursor-pointer"
          >
            <UIcon name="lucide:arrow-up" class="size-4" />
          </button>
        </template>
      </UContentToc>
    </template>
  </UPage>
</template>

<script lang="ts" setup>
const { data: page } = await useAsyncData('biography', () => {
  return queryCollection('biography').first()
})

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Biography page not found',
    fatal: true
  })
}

// Type assertion for body property (markdown files have body property with toc)
const pageWithBody = computed(() => page.value as typeof page.value & { 
  body?: {
    toc?: {
      links?: Array<{ id: string; text: string; depth: number; children?: any[] }>
    }
  }
})

// Filter TOC links to show only years divisible by 5 (2025, 2020, 2015, etc.)
const filteredTocLinks = computed(() => {
  const links = pageWithBody.value?.body?.toc?.links
  if (!links) return []
  
  return links.filter(link => {
    // Extract year from text (e.g., "2025" from "2025")
    const yearMatch = link.text.match(/^\d{4}$/)
    if (!yearMatch) return false
    
    const year = parseInt(yearMatch[0], 10)
    // Only include years divisible by 5
    return year % 5 === 0
  })
})

// Scroll to top function
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

useSeoMeta({
  title: page.value?.title,
  ogTitle: page.value?.title,
  description: page.value?.description,
  ogDescription: page.value?.description
})
</script>
