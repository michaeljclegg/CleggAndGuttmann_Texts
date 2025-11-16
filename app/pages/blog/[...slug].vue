<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import { mapContentNavigation } from '@nuxt/ui/utils/content'
import { findPageBreadcrumb } from '@nuxt/content/utils'

const route = useRoute()

const { data: page } = await useAsyncData(route.path, () =>
  queryCollection('blog').path(route.path).first()
)
if (!page.value) throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
const { data: surround } = await useAsyncData(`${route.path}-surround`, () =>
  queryCollectionItemSurroundings('blog', route.path, {
    fields: ['description']
  })
)

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation', ref([]))
const blogNavigation = computed(() => navigation.value.find(item => item.path === '/blog')?.children || [])

const breadcrumb = computed(() => mapContentNavigation(findPageBreadcrumb(blogNavigation?.value, page.value?.path)).map(({ icon, ...link }) => link))

if (page.value.image) {
  defineOgImage({ url: page.value.image })
} else {
  defineOgImageComponent('Blog', {
    headline: breadcrumb.value.map(item => item.label).join(' > ')
  }, {
    fonts: ['Geist:400', 'Geist:600']
  })
}

const title = page.value?.seo?.title || page.value?.title
const description = page.value?.seo?.description || page.value?.description

useSeoMeta({
  title,
  description,
  ogDescription: description,
  ogTitle: title
})

const articleLink = computed(() => `${window?.location}`)

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Type assertion for body property (markdown files have body property with toc)
const pageWithBody = computed(() => page.value as typeof page.value & { 
  body?: {
    toc?: {
      links?: Array<{ id: string; text: string; depth: number; children?: any[] }>
    }
  },
  toc?: boolean | string
})

// Check if TOC should be displayed (frontmatter toc field must be true or 'true')
const shouldShowToc = computed(() => {
  const tocValue = page.value?.toc
  if (tocValue === false || tocValue === 'false') return false
  if (tocValue === true || tocValue === 'true') return true
  // Default to showing if toc field is not set (backward compatibility)
  return true
})

// Scroll to top function
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}
</script>

<template>
  <UMain class="mt-20 px-2">
    <UContainer class="relative min-h-screen">
      <UPage v-if="page">
        <ULink
          to="/blog"
          class="text-sm flex items-center gap-1"
        >
          <UIcon name="lucide:chevron-left" />
          Blog
        </ULink>
        <div class="flex flex-col gap-3 mt-8">
          <div class="flex text-xs text-muted items-center justify-center gap-2">
            <span v-if="page.date">
              {{ formatDate(page.date) }}
            </span>
            <span v-if="page.date && page.minRead">
              -
            </span>
            <span v-if="page.minRead">
              {{ page.minRead }} MIN READ
            </span>
          </div>
          <NuxtImg
            :src="page.image"
            :alt="page.title"
            class="rounded-lg w-full max-h-[35vh] object-contain mx-auto"
          />
          <h1 class="text-4xl text-center font-medium max-w-3xl mx-auto mt-4">
            {{ page.title }}
          </h1>
          <p class="text-muted text-center max-w-2xl mx-auto">
            {{ page.description }}
          </p>
          <div class="flex items-center justify-center gap-2 mt-2">
            <UUser
              orientation="vertical"
              color="neutral"
              variant="outline"
              class="justify-center items-center text-center"
              v-bind="page.author"
            />
          </div>
        </div>
        <UPageBody class="max-w-3xl mx-auto">
          <ContentRenderer
            v-if="page.body"
            :value="page"
          />

          <div class="flex items-center justify-end gap-2 text-sm text-muted">
            <UButton
              size="sm"
              variant="link"
              color="neutral"
              label="Copy link"
              @click="copyToClipboard(articleLink, 'Article link copied to clipboard')"
            />
          </div>
          <UContentSurround :surround />
        </UPageBody>
        <template v-if="shouldShowToc && pageWithBody?.body?.toc?.links?.length" #right>
          <div class="w-[130%]">
            <UContentToc  
              title=" " 
             
            color="primary"
              :links="pageWithBody.body.toc.links"
              :ui="{
                link: 'text-xs',
                linkText: 'text-xs',
                root: 'overflow-hidden',
                content: 'overflow-hidden'
              }"
            >
            <template #top>
              <button
                @click="scrollToTop"
                class="group relative text-xs font-semibold flex items-center justify-center focus-visible:outline-primary py-1 mt-4 text-neutral hover:text-neutral/80 transition-colors w-full cursor-pointer"
              >
                <UIcon name="lucide:arrow-up" class="size-3" />
              </button>
            </template>
            <template #link="{ link }">
              <a
                :href="`#${link.id}`"
                :title="link.text"
                class="group relative text-xs flex items-center focus-visible:outline-primary py-1 text-neutral hover:text-neutral/80 transition-colors"
              >
                <span class="truncate">{{ link.text }}</span>
              </a>
            </template>
          </UContentToc>
          </div>
        </template>
      </UPage>
    </UContainer>
  </UMain>
</template>
