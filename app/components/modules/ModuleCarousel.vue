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

const title = computed(() => props.module.props?.title || '')
const autoplay = computed(() => props.module.props?.autoplay || false)

const defaultItems = [
  { image: '', title: '安全运营中心', description: 'AI驱动的智能安全运营', link: '#' },
  { image: '', title: '威胁检测分析', description: '深度威胁识别与响应', link: '#' },
  { image: '', title: '合规审计报告', description: '自动化合规检查与报告', link: '#' }
]

const items = computed(() => props.module.props?.items?.length ? props.module.props.items : defaultItems)

const scrollContainer = ref<HTMLElement | null>(null)
const currentIndex = ref(0)

function scrollTo(index: number) {
  if (!scrollContainer.value) return
  const clamped = Math.max(0, Math.min(index, items.value.length - 1))
  currentIndex.value = clamped
  const child = scrollContainer.value.children[clamped] as HTMLElement
  if (child) {
    child.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }
}

function prev() {
  scrollTo(currentIndex.value - 1)
}

function next() {
  scrollTo(currentIndex.value + 1)
}

let autoplayTimer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  if (autoplay.value && items.value.length > 1) {
    autoplayTimer = setInterval(() => {
      const nextIndex = (currentIndex.value + 1) % items.value.length
      scrollTo(nextIndex)
    }, 4000)
  }
})

onUnmounted(() => {
  if (autoplayTimer) {
    clearInterval(autoplayTimer)
  }
})
</script>

<template>
  <div :class="[spacingTop, spacingBottom, bgClass]">
    <div class="flex items-center justify-between mb-6">
      <h2 v-if="title" class="text-2xl md:text-3xl font-bold text-gray-900">
        {{ title }}
      </h2>
      <div class="flex gap-2">
        <UButton
          variant="outline"
          size="sm"
          icon="i-lucide-chevron-left"
          :disabled="currentIndex === 0"
          @click="prev"
        />
        <UButton
          variant="outline"
          size="sm"
          icon="i-lucide-chevron-right"
          :disabled="currentIndex === items.length - 1"
          @click="next"
        />
      </div>
    </div>

    <div
      ref="scrollContainer"
      class="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4"
    >
      <NuxtLink
        v-for="(item, i) in items"
        :key="i"
        :to="item.link || '#'"
        class="min-w-[320px] snap-start shrink-0 rounded-xl border border-gray-100 bg-white overflow-hidden hover:shadow-md transition-shadow group"
      >
        <div v-if="item.image" class="w-full h-48 overflow-hidden">
          <img
            :src="item.image"
            :alt="item.title"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          >
        </div>
        <div v-else class="w-full h-48 bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
          <UIcon name="i-lucide-image" class="w-10 h-10 text-primary-300" />
        </div>
        <div class="p-5">
          <h3 class="font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
            {{ item.title }}
          </h3>
          <p class="text-sm text-gray-500">{{ item.description }}</p>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
