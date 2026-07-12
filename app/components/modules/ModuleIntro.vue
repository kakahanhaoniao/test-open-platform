<script setup lang="ts">
import type { TemplateModule } from '~/data/mock'
import MarkdownIt from 'markdown-it'

const props = defineProps<{
  module: TemplateModule
  capability: any
  capabilityType: 'model' | 'app'
}>()

const md = new MarkdownIt()

const spacingMap: Record<string, string> = {
  xs: 'py-2',
  sm: 'py-4',
  md: 'py-8',
  lg: 'py-12'
}

const backgroundMap: Record<string, string> = {
  white: 'bg-white',
  gray: 'bg-gray-50',
  'primary-light': 'bg-primary-50'
}

const spacingTop = computed(() => spacingMap[props.module.spacing?.top] || 'py-8')
const spacingBottom = computed(() => spacingMap[props.module.spacing?.bottom] || 'py-8')
const bgClass = computed(() => backgroundMap[props.module.background] || 'bg-white')

const title = computed(() => props.module.props?.title || '产品介绍')
const body = computed(() => props.module.props?.body || props.capability?.description || '')
const layout = computed(() => props.module.props?.layout || 'center')
const image = computed(() => props.module.props?.image || '')
</script>

<template>
  <div :class="[spacingTop, spacingBottom, bgClass]">
    <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
      {{ title }}
    </h2>

    <!-- Center layout -->
    <div v-if="layout === 'center'" class="max-w-3xl mx-auto">
      <ClientOnly>
        <div
          class="prose prose-gray max-w-none mb-6"
          v-html="md.render(body)"
        />
      </ClientOnly>
      <img
        v-if="image"
        :src="image"
        :alt="title"
        class="w-full rounded-xl shadow-sm mt-6"
      >
    </div>

    <!-- Left-right layout: text left + image right -->
    <div v-else-if="layout === 'left-right'" class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <div>
        <ClientOnly>
          <div
            class="prose prose-gray max-w-none"
            v-html="md.render(body)"
          />
        </ClientOnly>
      </div>
      <div v-if="image">
        <img
          :src="image"
          :alt="title"
          class="w-full rounded-xl shadow-sm"
        >
      </div>
      <div v-else class="flex items-center justify-center h-64 bg-gray-100 rounded-xl">
        <UIcon name="i-lucide-image" class="w-12 h-12 text-gray-300" />
      </div>
    </div>

    <!-- Right-left layout: image left + text right -->
    <div v-else-if="layout === 'right-left'" class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <div v-if="image" class="order-2 md:order-1">
        <img
          :src="image"
          :alt="title"
          class="w-full rounded-xl shadow-sm"
        />
      </div>
      <div v-else class="order-2 md:order-1 flex items-center justify-center h-64 bg-gray-100 rounded-xl">
        <UIcon name="i-lucide-image" class="w-12 h-12 text-gray-300" />
      </div>
      <div class="order-1 md:order-2">
        <ClientOnly>
          <div
            class="prose prose-gray max-w-none"
            v-html="md.render(body)"
          />
        </ClientOnly>
      </div>
    </div>
  </div>
</template>
