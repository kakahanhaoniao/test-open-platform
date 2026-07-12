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

const title = computed(() => props.module.props?.title || '核心特性')
const layout = computed(() => props.module.props?.layout || 'grid')

const defaultIcons = [
  'i-lucide-shield-check',
  'i-lucide-zap',
  'i-lucide-brain',
  'i-lucide-lock',
  'i-lucide-bar-chart-3',
  'i-lucide-globe'
]

const items = computed(() => {
  if (props.module.props?.items?.length) {
    return props.module.props.items
  }
  // Generate from capability data
  const features = props.capability?.features || props.capability?.tags || []
  return features.slice(0, 6).map((f: string, i: number) => ({
    icon: defaultIcons[i % defaultIcons.length],
    title: f,
    description: ''
  }))
})
</script>

<template>
  <div :class="[spacingTop, spacingBottom, bgClass]">
    <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
      {{ title }}
    </h2>

    <!-- Grid layout: 3 columns -->
    <div v-if="layout === 'grid'" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        v-for="(item, i) in items"
        :key="i"
        class="p-6 rounded-xl border border-gray-100 bg-white hover:shadow-md transition-shadow"
      >
        <div class="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center mb-4">
          <UIcon :name="item.icon || 'i-lucide-star'" class="w-5 h-5 text-primary-600" />
        </div>
        <h3 class="font-semibold text-gray-900 mb-2">{{ item.title }}</h3>
        <p v-if="item.description" class="text-sm text-gray-500">{{ item.description }}</p>
      </div>
    </div>

    <!-- List layout: vertical -->
    <div v-else class="space-y-4">
      <div
        v-for="(item, i) in items"
        :key="i"
        class="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-white"
      >
        <div class="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0 mt-0.5">
          <UIcon :name="item.icon || 'i-lucide-star'" class="w-4 h-4 text-primary-600" />
        </div>
        <div>
          <h3 class="font-semibold text-gray-900 mb-1">{{ item.title }}</h3>
          <p v-if="item.description" class="text-sm text-gray-500">{{ item.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
