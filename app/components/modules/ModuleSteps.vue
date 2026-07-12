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

const title = computed(() => props.module.props?.title || '使用步骤')
const direction = computed(() => props.module.props?.direction || 'vertical')

const defaultIcons = [
  'i-lucide-rocket',
  'i-lucide-settings',
  'i-lucide-play',
  'i-lucide-check-circle'
]

const defaultItems = [
  { icon: 'i-lucide-rocket', title: '注册账号', description: '创建奇安信AI开放平台账号' },
  { icon: 'i-lucide-key', title: '获取API Key', description: '在控制台创建API密钥' },
  { icon: 'i-lucide-code-2', title: '接入调用', description: '使用SDK或HTTP接口接入' },
  { icon: 'i-lucide-check-circle', title: '开始使用', description: '体验AI安全能力' }
]

const items = computed(() => {
  const raw = props.module.props?.items
  if (Array.isArray(raw) && raw.length) return raw as Array<{ icon?: string; title: string; description: string }>
  return defaultItems
})
</script>

<template>
  <div :class="[spacingTop, spacingBottom, bgClass]">
    <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
      {{ title }}
    </h2>

    <!-- Vertical steps -->
    <div v-if="direction === 'vertical'" class="relative">
      <div
        v-for="(item, i) in items"
        :key="i"
        class="flex gap-4 relative pb-8 last:pb-0"
      >
        <!-- Connecting line -->
        <div class="flex flex-col items-center">
          <div class="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-bold shrink-0 z-10">
            {{ i + 1 }}
          </div>
          <div v-if="i < items.length - 1" class="w-0.5 flex-1 bg-primary-200 mt-2" />
        </div>
        <!-- Content -->
        <div class="pt-1.5">
          <div class="flex items-center gap-2 mb-1">
            <UIcon :name="item.icon || defaultIcons[i % defaultIcons.length]" class="w-4 h-4 text-primary-600" />
            <h3 class="font-semibold text-gray-900">{{ item.title }}</h3>
          </div>
          <p class="text-sm text-gray-500">{{ item.description }}</p>
        </div>
      </div>
    </div>

    <!-- Horizontal steps -->
    <div v-else class="relative">
      <div class="flex items-start">
        <div
          v-for="(item, i) in items"
          :key="i"
          class="flex-1 relative"
        >
          <div class="flex flex-col items-center text-center">
            <div class="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-bold z-10">
              {{ i + 1 }}
            </div>
            <div class="flex items-center gap-1.5 mt-3 mb-1">
              <UIcon :name="item.icon || defaultIcons[i % defaultIcons.length]" class="w-4 h-4 text-primary-600" />
              <h3 class="font-semibold text-gray-900 text-sm">{{ item.title }}</h3>
            </div>
            <p class="text-xs text-gray-500 max-w-[160px]">{{ item.description }}</p>
          </div>
          <!-- Connecting line -->
          <div
            v-if="i < items.length - 1"
            class="absolute top-5 left-[calc(50%+20px)] right-[calc(-50%+20px)] h-0.5 bg-primary-200"
          />
        </div>
      </div>
    </div>
  </div>
</template>
