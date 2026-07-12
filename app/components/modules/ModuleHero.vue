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

const title = computed(() => props.module.props?.title || props.capability?.name || '')
const description = computed(() => props.module.props?.description || '')
const buttons = computed(() => props.module.props?.buttons || [])
const bgStyle = computed(() => props.module.props?.bgStyle || 'light')
</script>

<template>
  <div :class="[spacingTop, spacingBottom, bgClass]">
    <div
      class="text-center max-w-3xl mx-auto px-4"
      :class="{
        'text-white': bgStyle === 'dark',
        'text-gray-900': bgStyle !== 'dark'
      }"
    >
      <h2 class="text-3xl md:text-4xl font-bold mb-4">
        {{ title }}
      </h2>

      <ClientOnly>
        <div
          v-if="description"
          class="text-lg mb-8 prose max-w-none mx-auto"
          :class="bgStyle === 'dark' ? 'text-white/70 prose-invert' : 'text-gray-600'"
          v-html="md.render(description)"
        />
      </ClientOnly>

      <div v-if="buttons.length" class="flex flex-wrap justify-center gap-4">
        <UButton
          v-for="(btn, i) in buttons"
          :key="i"
          :to="btn.link || '#'"
          :variant="btn.style === 'outline' ? 'outline' : 'solid'"
          size="lg"
          :class="{
            'bg-primary-600 hover:bg-primary-700 text-white': btn.style !== 'outline',
            'border-primary-300 text-primary-600 hover:bg-primary-50': btn.style === 'outline' && bgStyle !== 'dark',
            'border-white/30 text-white hover:bg-white/10': btn.style === 'outline' && bgStyle === 'dark'
          }"
          trailing-icon="i-lucide-arrow-right"
        >
          {{ btn.text }}
        </UButton>
      </div>
    </div>
  </div>
</template>
