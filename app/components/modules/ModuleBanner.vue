<script setup lang="ts">
import type { TemplateModule } from '~/data/mock'

const props = defineProps<{
  module: TemplateModule
  capability: any
  capabilityType: 'model' | 'app'
}>()

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
const subtitle = computed(() => props.module.props?.subtitle || props.capability?.description || '')
const gradient = computed(() => props.module.props?.gradient || 'from-primary-600 to-primary-400')
const backgroundImage = computed(() => props.module.props?.backgroundImage || '')
const badge = computed(() => props.module.props?.badge || '')
const ctaText = computed(() => props.module.props?.ctaText || '立即体验')
const ctaLink = computed(() => props.module.props?.ctaLink || '#')
</script>

<template>
  <div :class="[spacingTop, spacingBottom, bgClass]">
    <div
      class="relative overflow-hidden rounded-2xl min-h-[200px] flex items-center"
      :class="backgroundImage ? '' : `bg-gradient-to-r ${gradient}`"
    >
      <img
        v-if="backgroundImage"
        :src="backgroundImage"
        :alt="title"
        class="absolute inset-0 w-full h-full object-cover"
      >
      <div class="absolute inset-0 bg-black/30" />

      <div class="relative z-10 px-8 py-12 md:px-12 md:py-16 w-full">
        <span
          v-if="badge"
          class="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium mb-4"
        >
          {{ badge }}
        </span>

        <h2 class="text-3xl md:text-4xl font-bold text-white mb-3">
          {{ title }}
        </h2>

        <p class="text-white/80 text-lg max-w-2xl mb-6">
          {{ subtitle }}
        </p>

        <UButton
          v-if="ctaText"
          :to="ctaLink"
          size="lg"
          class="bg-white text-primary-700 hover:bg-white/90 font-semibold"
          trailing-icon="i-lucide-arrow-right"
        >
          {{ ctaText }}
        </UButton>
      </div>
    </div>
  </div>
</template>
