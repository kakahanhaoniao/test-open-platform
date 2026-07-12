<script setup lang="ts">
import type { TemplateModule } from '~/data/mock'
import { models, apps } from '~/data/mock'

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

const title = computed(() => props.module.props?.title || '相关能力')
const maxCount = computed(() => props.module.props?.maxCount || 4)

const relatedCapabilities = computed(() => {
  const ids = props.module.props?.ids

  if (ids?.length) {
    // Look up by IDs
    const result: any[] = []
    for (const id of ids) {
      const model = models.find(m => m.id === id)
      if (model) {
        result.push({ ...model, _type: 'model' })
      }
      const app = apps.find(a => a.id === id)
      if (app) {
        result.push({ ...app, _type: 'app' })
      }
    }
    return result.slice(0, maxCount.value)
  }

  // Auto-match by tags
  const currentTags = props.capability?.tags || []
  if (!currentTags.length) {
    // Fallback: return first few from opposite list or same list
    if (props.capabilityType === 'model') {
      return apps.slice(0, maxCount.value).map(a => ({ ...a, _type: 'app' }))
    }
    return models.slice(0, maxCount.value).map(m => ({ ...m, _type: 'model' }))
  }

  const scored: { item: any; score: number; type: 'model' | 'app' }[] = []

  for (const model of models) {
    if (model.id === props.capability?.id) continue
    const overlap = model.tags.filter((t: string) => currentTags.includes(t)).length
    if (overlap > 0) {
      scored.push({ item: model, score: overlap, type: 'model' })
    }
  }

  for (const app of apps) {
    if (app.id === props.capability?.id) continue
    const overlap = app.tags.filter((t: string) => currentTags.includes(t)).length
    if (overlap > 0) {
      scored.push({ item: app, score: overlap, type: 'app' })
    }
  }

  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, maxCount.value).map(s => ({ ...s.item, _type: s.type }))
})

function getLink(cap: any): string {
  return cap._type === 'model' ? `/models/${cap.id}` : `/apps/${cap.id}`
}
</script>

<template>
  <div :class="[spacingTop, spacingBottom, bgClass]">
    <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
      {{ title }}
    </h2>

    <div v-if="relatedCapabilities.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <NuxtLink
        v-for="(cap, i) in relatedCapabilities"
        :key="i"
        :to="getLink(cap)"
        class="p-4 rounded-xl border border-gray-100 bg-white hover:shadow-md transition-shadow group"
      >
        <div class="flex items-center gap-3 mb-2">
          <div class="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center">
            <UIcon :name="cap.icon || 'i-lucide-box'" class="w-4.5 h-4.5 text-primary-600" />
          </div>
          <div class="min-w-0">
            <h3 class="font-medium text-gray-900 text-sm truncate group-hover:text-primary-600 transition-colors">
              {{ cap.name }}
            </h3>
            <span class="text-xs text-gray-400">
              {{ cap._type === 'model' ? '模型' : '应用' }}
            </span>
          </div>
        </div>
        <p class="text-xs text-gray-500 line-clamp-2">{{ cap.description }}</p>
      </NuxtLink>
    </div>

    <!-- Empty state -->
    <div v-else class="text-center py-12 text-gray-400">
      <UIcon name="i-lucide-box" class="w-10 h-10 mx-auto mb-3 opacity-50" />
      <p>暂无相关能力</p>
    </div>
  </div>
</template>
