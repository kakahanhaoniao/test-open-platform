<script setup lang="ts">
import { modelTypes, appTypes } from '~/data/mock'

const props = defineProps<{
  selectedCategory: string
  selectedType: string
  searchQuery: string
}>()

const emit = defineEmits<{
  'update:selectedCategory': [value: string]
  'update:selectedType': [value: string]
  'update:searchQuery': [value: string]
}>()

const typeOptions = [
  { label: '全部', value: 'all' },
  { label: '模型', value: 'model' },
  { label: '应用', value: 'app' }
]

const priceRanges = [
  { label: '不限', value: 'all' },
  { label: '¥0.02/千Token以下', value: 'low' },
  { label: '¥0.02-0.06/千Token', value: 'mid' },
  { label: '¥0.06/千Token以上', value: 'high' }
]

const selectedPriceRange = ref('all')

// Combine model types and app types for category filter
const allCategories = computed(() => {
  const cats = new Set<string>()
  modelTypes.forEach(t => { if (t.value !== 'all') cats.add(t.label) })
  appTypes.forEach(t => { if (t.value !== 'all') cats.add(t.label) })
  return Array.from(cats)
})
</script>

<template>
  <aside class="w-64 shrink-0 space-y-6">
    <!-- Search -->
    <div>
      <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">搜索</h4>
      <UInput
        :model-value="searchQuery"
        icon="i-lucide-search"
        placeholder="搜索能力..."
        size="sm"
        class="w-full"
        @update:model-value="emit('update:searchQuery', $event)"
      />
    </div>

    <!-- Type Filter -->
    <div>
      <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">类型</h4>
      <div class="space-y-1">
        <button
          v-for="opt in typeOptions"
          :key="opt.value"
          class="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all"
          :class="selectedType === opt.value
            ? 'bg-primary-50 text-primary-700 font-medium'
            : 'text-gray-600 hover:bg-gray-50'"
          @click="emit('update:selectedType', opt.value)"
        >
          <span>{{ opt.label }}</span>
          <UIcon
            v-if="selectedType === opt.value"
            name="i-lucide-check"
            class="w-3.5 h-3.5 text-primary-600"
          />
        </button>
      </div>
    </div>

    <!-- Category Filter -->
    <div>
      <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">分类</h4>
      <div class="space-y-1 max-h-64 overflow-y-auto pr-1">
        <button
          class="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all"
          :class="!selectedCategory
            ? 'bg-primary-50 text-primary-700 font-medium'
            : 'text-gray-600 hover:bg-gray-50'"
          @click="emit('update:selectedCategory', '')"
        >
          <span>全部分类</span>
          <UIcon
            v-if="!selectedCategory"
            name="i-lucide-check"
            class="w-3.5 h-3.5 text-primary-600"
          />
        </button>
        <button
          v-for="cat in allCategories"
          :key="cat"
          class="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all"
          :class="selectedCategory === cat
            ? 'bg-primary-50 text-primary-700 font-medium'
            : 'text-gray-600 hover:bg-gray-50'"
          @click="emit('update:selectedCategory', cat)"
        >
          <span>{{ cat }}</span>
          <UIcon
            v-if="selectedCategory === cat"
            name="i-lucide-check"
            class="w-3.5 h-3.5 text-primary-600"
          />
        </button>
      </div>
    </div>

    <!-- Price Range (only relevant for models) -->
    <div v-if="selectedType === 'model' || selectedType === 'all'">
      <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">价格区间</h4>
      <div class="space-y-1">
        <button
          v-for="range in priceRanges"
          :key="range.value"
          class="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all"
          :class="selectedPriceRange === range.value
            ? 'bg-primary-50 text-primary-700 font-medium'
            : 'text-gray-600 hover:bg-gray-50'"
          @click="selectedPriceRange = range.value"
        >
          <span>{{ range.label }}</span>
          <UIcon
            v-if="selectedPriceRange === range.value"
            name="i-lucide-check"
            class="w-3.5 h-3.5 text-primary-600"
          />
        </button>
      </div>
    </div>

    <!-- Reset -->
    <UButton
      label="重置筛选"
      icon="i-lucide-rotate-ccw"
      variant="ghost"
      color="neutral"
      size="sm"
      block
      class="text-gray-400"
      @click="emit('update:selectedCategory', ''); emit('update:selectedType', 'all'); emit('update:searchQuery', ''); selectedPriceRange = 'all'"
    />
  </aside>
</template>
