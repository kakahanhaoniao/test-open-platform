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

const title = computed(() => props.module.props?.title || '使用场景')
const layout = computed(() => props.module.props?.layout || 'cards')

const defaultIcons = [
  'i-lucide-building-2',
  'i-lucide-shield',
  'i-lucide-monitor',
  'i-lucide-globe'
]

const defaultItems: Array<{ icon?: string; title: string; description: string; image?: string }> = [
  { icon: 'i-lucide-building-2', title: '企业安全运营', description: '提升SOC运营效率，实现告警自动研判与响应' },
  { icon: 'i-lucide-shield', title: '威胁检测防御', description: '精准识别APT攻击，自动提取IOC指标' },
  { icon: 'i-lucide-monitor', title: '安全合规审计', description: '自动化合规检查，生成整改建议报告' },
  { icon: 'i-lucide-globe', title: '态势感知分析', description: '全局安全态势可视化，实时威胁监控预警' }
]

const items = computed(() => {
  const raw = props.module.props?.items
  if (Array.isArray(raw) && raw.length) return raw as Array<{ icon?: string; title: string; description: string; image?: string }>
  return defaultItems
})
</script>

<template>
  <div :class="[spacingTop, spacingBottom, bgClass]">
    <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
      {{ title }}
    </h2>

    <!-- Cards layout: grid -->
    <div v-if="layout === 'cards'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="(item, i) in items"
        :key="i"
        class="p-6 rounded-xl border border-gray-100 bg-white hover:shadow-md transition-shadow text-center"
      >
        <img
          v-if="item.image"
          :src="item.image"
          :alt="item.title"
          class="w-full h-32 object-cover rounded-lg mb-4"
        >
        <div v-else class="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mx-auto mb-4">
          <UIcon :name="item.icon || defaultIcons[i % defaultIcons.length]" class="w-6 h-6 text-primary-600" />
        </div>
        <h3 class="font-semibold text-gray-900 mb-2">{{ item.title }}</h3>
        <p class="text-sm text-gray-500">{{ item.description }}</p>
      </div>
    </div>

    <!-- Carousel layout: horizontal scroll -->
    <div v-else class="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
      <div
        v-for="(item, i) in items"
        :key="i"
        class="min-w-[280px] snap-start p-6 rounded-xl border border-gray-100 bg-white hover:shadow-md transition-shadow shrink-0"
      >
        <img
          v-if="item.image"
          :src="item.image"
          :alt="item.title"
          class="w-full h-32 object-cover rounded-lg mb-4"
        >
        <div v-else class="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mb-4">
          <UIcon :name="item.icon || defaultIcons[i % defaultIcons.length]" class="w-6 h-6 text-primary-600" />
        </div>
        <h3 class="font-semibold text-gray-900 mb-2">{{ item.title }}</h3>
        <p class="text-sm text-gray-500">{{ item.description }}</p>
      </div>
    </div>
  </div>
</template>
