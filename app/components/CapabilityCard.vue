<script setup lang="ts">
import type { Model, App, Plan } from '~/data/mock'
import { modelPlans, appPlans, getPlansForCapability } from '~/data/mock'
import { useFavorites } from '~/composables/useFavorites'

const props = defineProps<{
  capability: Model | App
  capabilityType: 'model' | 'app'
  featured?: boolean
}>()

const emit = defineEmits<{
  quickPreview: [capability: Model | App, type: 'model' | 'app']
}>()

const isModel = computed(() => props.capabilityType === 'model')

// Favorites via composable (persisted to localStorage)
const { toggleFavorite: toggleFav, isFavorite } = useFavorites()

// Price tag: find lowest plan price for this capability
const priceTag = computed(() => {
  const plans = getPlansForCapability(props.capability.id)
  const relevantPlans = isModel.value ? plans.modelPlans : plans.appPlans
  if (relevantPlans.length > 0) {
    const lowest = relevantPlans.reduce((min, p) => p.price < min.price ? p : min, relevantPlans[0]!)
    const suffix = lowest.billingCycle === 'monthly' ? '/月' : lowest.billingCycle === 'annual' ? '/年' : ''
    return `¥${lowest.price}${suffix}`
  }
  // For models without plans, show pay-per-use
  if (isModel.value) return '按量计费'
  // For apps without plans, show free or pay-per-use
  return '按量计费'
})

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

const hotOrNew = computed(() => {
  if (props.capability.hot) return { label: 'HOT', color: 'bg-red-500 text-white' }
  if (props.capability.new) return { label: 'NEW', color: 'bg-primary-500 text-white' }
  return null
})

function onToggleFavorite(e: Event) {
  e.preventDefault()
  e.stopPropagation()
  toggleFav(props.capability.id)
}

function onQuickPreview(e: Event) {
  e.preventDefault()
  e.stopPropagation()
  emit('quickPreview', props.capability, props.capabilityType)
}
</script>

<template>
  <NuxtLink :to="`/marketplace/${capability.id}`" class="block">
    <div
      class="group relative bg-white rounded-2xl border border-gray-100 p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_40px_-8px_rgba(109,40,217,0.18)]"
    >
      <!-- Top Row: Hot/New Badge + Favorite -->
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <span
            v-if="hotOrNew"
            class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold"
            :class="hotOrNew.color"
          >
            {{ hotOrNew.label }}
          </span>
          <span
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
            :class="typeBadge.color"
          >
            {{ typeBadge.label }}
          </span>
        </div>
        <button
          class="p-1.5 rounded-lg hover:bg-gray-50 transition-colors"
          :class="isFavorite(capability.id) ? 'text-red-500' : 'text-gray-300 hover:text-red-400'"
          @click="onToggleFavorite"
        >
          <UIcon
            :name="isFavorite(capability.id) ? 'i-lucide-heart' : 'i-lucide-heart'"
            class="w-4 h-4"
            :class="isFavorite(capability.id) ? 'fill-red-500' : ''"
          />
        </button>
      </div>

      <!-- Icon + Name + Price Tag -->
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
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2">
            <h3 class="text-sm font-bold text-gray-900 group-hover:text-primary-700 transition-colors truncate">
              {{ capability.name }}
            </h3>
          </div>
          <div class="flex items-center gap-2 mt-0.5">
            <p class="text-xs text-gray-500">{{ isModel ? (capability as Model).typeName : (capability as App).typeName }}</p>
            <!-- Price Tag -->
            <span class="text-[11px] font-semibold text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded">
              {{ priceTag }}
            </span>
          </div>
        </div>
      </div>

      <!-- Description -->
      <p class="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">
        {{ capability.description }}
      </p>

      <!-- Tags -->
      <div class="flex flex-wrap gap-1.5 mb-3">
        <span
          v-for="tag in capability.tags.slice(0, 3)"
          :key="tag"
          class="px-2 py-0.5 rounded-md text-[10px] font-medium bg-gray-50 text-gray-500"
        >
          {{ tag }}
        </span>
      </div>

      <!-- Bottom: Rating + Call Count Micro-badge + Quick Preview -->
      <div class="flex items-center justify-between pt-3 border-t border-gray-50">
        <div class="flex items-center gap-3">
          <!-- Rating -->
          <div class="flex items-center gap-1 text-amber-500">
            <UIcon name="i-lucide-star" class="w-3.5 h-3.5 fill-amber-400" />
            <span class="text-xs font-semibold text-gray-700">{{ capability.rating }}</span>
          </div>
          <!-- Call Count Micro-badge -->
          <div class="flex items-center gap-1">
            <UIcon name="i-lucide-activity" class="w-3 h-3 text-gray-400" />
            <span class="text-[11px] text-gray-500">{{ statValue }} {{ statLabel }}</span>
          </div>
        </div>
        <!-- Quick Preview + Action (visible on hover) -->
        <div class="flex items-center gap-1.5">
          <button
            class="p-1.5 rounded-lg text-gray-300 hover:text-primary-600 hover:bg-primary-50 transition-all opacity-0 group-hover:opacity-100"
            title="快速预览"
            @click="onQuickPreview"
          >
            <UIcon name="i-lucide-eye" class="w-4 h-4" />
          </button>
          <UButton
            :label="actionLabel"
            :icon="actionIcon"
            size="xs"
            :color="isModel ? 'primary' : 'secondary'"
            variant="subtle"
            trailing
            class="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
          />
        </div>
      </div>

      <!-- Hover Action Bar (slides up on hover) -->
      <div
        class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent pt-8 pb-3 px-5 rounded-b-2xl translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto"
      >
        <div class="flex items-center justify-between">
          <span class="text-[11px] font-semibold text-primary-600">{{ priceTag }}</span>
          <div class="flex items-center gap-2">
            <button
              class="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
              title="快速预览"
              @click="onQuickPreview"
            >
              <UIcon name="i-lucide-eye" class="w-4 h-4" />
            </button>
            <UButton
              :label="actionLabel"
              :icon="actionIcon"
              size="xs"
              :color="isModel ? 'primary' : 'secondary'"
              variant="solid"
              trailing
            />
          </div>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
