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

const title = computed(() => props.module.props?.title || '相关资源')
const columns = computed(() => props.module.props?.columns || 3)

const defaultItems = [
  { image: '', title: 'API文档', description: '详细的接口调用说明与示例', link: '#' },
  { image: '', title: '快速入门', description: '5分钟快速接入指南', link: '#' },
  { image: '', title: '最佳实践', description: '行业应用案例与解决方案', link: '#' }
]

const items = computed(() => props.module.props?.items?.length ? props.module.props.items : defaultItems)

const gridCols = computed(() => {
  switch (columns.value) {
    case 2: return 'grid-cols-1 md:grid-cols-2'
    case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
    default: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
  }
})
</script>

<template>
  <div :class="[spacingTop, spacingBottom, bgClass]">
    <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
      {{ title }}
    </h2>

    <div :class="['grid gap-6', gridCols]">
      <NuxtLink
        v-for="(item, i) in items"
        :key="i"
        :to="item.link || '#'"
        class="rounded-xl border border-gray-100 bg-white overflow-hidden hover:shadow-md transition-shadow group"
      >
        <div v-if="item.image" class="w-full h-40 overflow-hidden">
          <img
            :src="item.image"
            :alt="item.title"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          >
        </div>
        <div v-else class="w-full h-40 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <UIcon name="i-lucide-file-text" class="w-8 h-8 text-gray-300" />
        </div>
        <div class="p-4">
          <h3 class="font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
            {{ item.title }}
          </h3>
          <p class="text-sm text-gray-500 line-clamp-2">{{ item.description }}</p>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
