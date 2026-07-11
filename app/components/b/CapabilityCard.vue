<script setup lang="ts">
import type { Model, App } from '~/data/mock'

const props = defineProps<{
  capability: Model | App
  capabilityType: 'model' | 'app'
  featured?: boolean
}>()

const isModel = computed(() => props.capabilityType === 'model')

const typeBadge = computed(() => {
  if (isModel.value) return { label: '模型', color: 'bg-primary-100 text-primary-700' }
  const app = props.capability as App
  const map: Record<string, { label: string; color: string }> = {
    'external-link': { label: '平台应用', color: 'bg-accent-100 text-accent-700' },
    chat: { label: '对话助手', color: 'bg-blue-100 text-blue-700' },
    tool: { label: '工具', color: 'bg-amber-100 text-amber-700' },
    showcase: { label: '展示', color: 'bg-rose-100 text-rose-700' }
  }
  return map[app.type] || { label: '应用', color: 'bg-accent-100 text-accent-700' }
})

const actionLabel = computed(() => {
  if (isModel.value) return '体验'
  const app = props.capability as App
  if (app.type === 'external-link') return '使用'
  if (app.type === 'chat') return '对话'
  if (app.type === 'tool') return '使用'
  if (app.type === 'showcase') return '查看'
  return '了解'
})

const actionIcon = computed(() => {
  if (isModel.value) return 'i-lucide-play'
  const app = props.capability as App
  if (app.type === 'chat') return 'i-lucide-message-circle'
  if (app.type === 'showcase') return 'i-lucide-eye'
  return 'i-lucide-arrow-right'
})

const statLabel = computed(() => isModel.value ? '调用' : '用户')
const statValue = computed(() => {
  return isModel.value
    ? (props.capability as Model).callCount
    : (props.capability as App).useCount
})

const pricingText = computed(() => {
  if (!isModel.value) return ''
  const model = props.capability as Model
  return model.pricing.input
})

const hotOrNew = computed(() => {
  if (props.capability.hot) return { label: 'HOT', color: 'bg-red-500 text-white' }
  if (props.capability.new) return { label: 'NEW', color: 'bg-primary-500 text-white' }
  return null
})
</script>

<template>
  <NuxtLink :to="`/b/marketplace/${capability.id}`" class="block">
    <div
      class="group relative bg-white rounded-2xl border border-gray-100 p-5 card-hover"
      :class="featured ? 'md:p-6' : ''"
    >
      <!-- Hot/New Badge -->
      <div v-if="hotOrNew" class="absolute top-3 right-3">
        <span
          class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold"
          :class="hotOrNew.color"
        >
          {{ hotOrNew.label }}
        </span>
      </div>

      <!-- Type Badge + Rating -->
      <div class="flex items-center justify-between mb-4">
        <span
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
          :class="typeBadge.color"
        >
          {{ typeBadge.label }}
        </span>
        <div class="flex items-center gap-1 text-amber-500">
          <UIcon name="i-lucide-star" class="w-3.5 h-3.5 fill-amber-400" />
          <span class="text-xs font-semibold text-gray-700">{{ capability.rating }}</span>
        </div>
      </div>

      <!-- Icon + Name -->
      <div class="flex items-start gap-3.5 mb-3">
        <div
          class="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          :class="isModel ? 'bg-primary-50' : 'bg-accent-50'"
        >
          <UIcon
            :name="capability.icon"
            class="w-5.5 h-5.5"
            :class="isModel ? 'text-primary-600' : 'text-accent-600'"
          />
        </div>
        <div class="min-w-0">
          <h3 class="text-sm font-bold text-gray-900 group-hover:text-primary-700 transition-colors truncate">
            {{ capability.name }}
          </h3>
          <p class="text-xs text-gray-500 mt-0.5">{{ isModel ? (capability as Model).typeName : (capability as App).typeName }}</p>
        </div>
      </div>

      <!-- Description -->
      <p class="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-2">
        {{ capability.description }}
      </p>

      <!-- Tags -->
      <div class="flex flex-wrap gap-1.5 mb-4">
        <span
          v-for="tag in capability.tags.slice(0, 3)"
          :key="tag"
          class="px-2 py-0.5 rounded-md text-[10px] font-medium bg-gray-50 text-gray-500"
        >
          {{ tag }}
        </span>
      </div>

      <!-- Bottom Stats + Action -->
      <div class="flex items-center justify-between pt-3 border-t border-gray-50">
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-1">
            <UIcon name="i-lucide-activity" class="w-3 h-3 text-gray-400" />
            <span class="text-[11px] text-gray-500">{{ statValue }} {{ statLabel }}</span>
          </div>
          <template v-if="isModel">
            <div class="flex items-center gap-1">
              <UIcon name="i-lucide-coins" class="w-3 h-3 text-gray-400" />
              <span class="text-[11px] text-gray-500">{{ pricingText }}</span>
            </div>
          </template>
        </div>
        <UButton
          :label="actionLabel"
          :icon="actionIcon"
          size="xs"
          :color="isModel ? 'primary' : 'accent'"
          variant="subtle"
          trailing
          class="shrink-0"
        />
      </div>
    </div>
  </NuxtLink>
</template>
