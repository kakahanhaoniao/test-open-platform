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

const title = computed(() => props.module.props?.title || '优势对比')

const defaultItems = [
  { advantage: '智能AI驱动，自动化分析处理', traditional: '人工操作，效率低下' },
  { advantage: '实时响应，毫秒级延迟', traditional: '响应延迟，错失最佳时机' },
  { advantage: '持续学习，模型不断进化', traditional: '规则固化，无法适应新威胁' },
  { advantage: '云端部署，开箱即用', traditional: '本地部署，运维成本高' }
]

const items = computed(() => props.module.props?.items?.length ? props.module.props.items : defaultItems)
</script>

<template>
  <div :class="[spacingTop, spacingBottom, bgClass]">
    <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
      {{ title }}
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Our advantages -->
      <div class="space-y-4">
        <div class="flex items-center gap-2 mb-4">
          <div class="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
            <UIcon name="i-lucide-check" class="w-3.5 h-3.5 text-green-600" />
          </div>
          <span class="font-semibold text-green-700">我们的优势</span>
        </div>
        <div
          v-for="(item, i) in items"
          :key="'adv-' + i"
          class="flex items-start gap-3 p-4 rounded-lg bg-green-50 border border-green-100"
        >
          <UIcon name="i-lucide-check-circle" class="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
          <span class="text-sm text-green-800">{{ item.advantage }}</span>
        </div>
      </div>

      <!-- Traditional approach -->
      <div class="space-y-4">
        <div class="flex items-center gap-2 mb-4">
          <div class="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
            <UIcon name="i-lucide-x" class="w-3.5 h-3.5 text-gray-400" />
          </div>
          <span class="font-semibold text-gray-500">传统方式</span>
        </div>
        <div
          v-for="(item, i) in items"
          :key="'trad-' + i"
          class="flex items-start gap-3 p-4 rounded-lg bg-gray-50 border border-gray-100"
        >
          <UIcon name="i-lucide-x-circle" class="w-5 h-5 text-gray-300 shrink-0 mt-0.5" />
          <span class="text-sm text-gray-500">{{ item.traditional }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
