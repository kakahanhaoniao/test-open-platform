<script setup lang="ts">
import { models, apps, activities } from '~/data/mock'

useHead({
  title: '能力市场 - 奇安信AI开放平台',
  meta: [
    { name: 'description', content: '浏览奇安信AI开放平台全部安全能力' }
  ]
})

// Filter state
const selectedType = ref('all')
const selectedCategory = ref('')
const searchQuery = ref('')
const sortBy = ref('popular')

// Pinned promotions (shown at top of marketplace)
const pinnedPromos = computed(() => activities.filter(a => a.hot).slice(0, 2))

// Unified capabilities list
const allCapabilities = computed(() => {
  const modelItems = models.map(m => ({ ...m, _type: 'model' as const }))
  const appItems = apps.map(a => ({ ...a, _type: 'app' as const }))
  return [...modelItems, ...appItems]
})

// Filtered capabilities
const filteredCapabilities = computed(() => {
  let result = allCapabilities.value

  // Type filter
  if (selectedType.value === 'model') {
    result = result.filter(c => c._type === 'model')
  } else if (selectedType.value === 'app') {
    result = result.filter(c => c._type === 'app')
  }

  // Category filter
  if (selectedCategory.value) {
    result = result.filter(c => {
      if (c._type === 'model') {
        return (c as any).typeName === selectedCategory.value
      }
      return (c as any).typeName === selectedCategory.value
    })
  }

  // Search filter
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.tags.some(t => t.toLowerCase().includes(q))
    )
  }

  // Sort
  if (sortBy.value === 'popular') {
    result = result.sort((a, b) => b.rating - a.rating)
  } else if (sortBy.value === 'newest') {
    result = result.sort((a, b) => (b.new ? 1 : 0) - (a.new ? 1 : 0))
  }

  return result
})

// Type tab counts
const modelCount = computed(() => models.length)
const appCount = computed(() => apps.length)
const totalCount = computed(() => models.length + apps.length)
</script>

<template>
  <div class="min-h-screen bg-[#FAFAFA]">
    <BTopNav />

    <!-- Marketplace Header -->
    <section class="bg-white border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-6 pt-8 pb-6">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">能力市场</h1>
            <p class="text-sm text-gray-500 mt-1">浏览全部安全AI能力，模型与应用统一发现</p>
          </div>
          <div class="flex items-center gap-3">
            <USelect
              v-model="sortBy"
              :items="[
                { label: '最热门', value: 'popular' },
                { label: '最新上线', value: 'newest' }
              ]"
              size="sm"
              icon="i-lucide-arrow-up-down"
              class="w-36"
            />
          </div>
        </div>

        <!-- Type Tabs -->
        <div class="flex items-center gap-1 bg-gray-50 rounded-xl p-1 w-fit">
          <button
            class="px-5 py-2 rounded-lg text-sm font-medium transition-all"
            :class="selectedType === 'all'
              ? 'bg-white text-primary-700 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'"
            @click="selectedType = 'all'"
          >
            全部
            <span class="ml-1 text-xs text-gray-400">{{ totalCount }}</span>
          </button>
          <button
            class="px-5 py-2 rounded-lg text-sm font-medium transition-all"
            :class="selectedType === 'model'
              ? 'bg-white text-primary-700 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'"
            @click="selectedType = 'model'"
          >
            模型
            <span class="ml-1 text-xs text-gray-400">{{ modelCount }}</span>
          </button>
          <button
            class="px-5 py-2 rounded-lg text-sm font-medium transition-all"
            :class="selectedType === 'app'
              ? 'bg-white text-primary-700 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'"
            @click="selectedType = 'app'"
          >
            应用
            <span class="ml-1 text-xs text-gray-400">{{ appCount }}</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-6 py-8">
      <div class="flex gap-8">
        <!-- Filter Sidebar -->
        <BMarketplaceFilters
          v-model:selected-category="selectedCategory"
          v-model:selected-type="selectedType"
          v-model:search-query="searchQuery"
        />

        <!-- Main Grid -->
        <div class="flex-1 min-w-0 space-y-6">
          <!-- Pinned Promotions -->
          <div v-if="pinnedPromos.length && !searchQuery" class="grid grid-cols-2 gap-4">
            <NuxtLink
              v-for="promo in pinnedPromos"
              :key="promo.id"
              to="/b/promotions"
              class="group"
            >
              <div
                class="relative rounded-xl p-4 overflow-hidden flex items-center gap-3 h-[80px]"
                :class="`bg-gradient-to-r ${promo.gradient}`"
              >
                <div class="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-white/10" />
                <div class="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                  <UIcon :name="promo.icon" class="w-4.5 h-4.5 text-white" />
                </div>
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-2">
                    <span class="text-white text-sm font-bold">{{ promo.title }}</span>
                    <span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-white/20 text-white">{{ promo.discountText }}</span>
                  </div>
                  <p class="text-white/70 text-xs truncate">{{ promo.subtitle }}</p>
                </div>
                <UIcon name="i-lucide-chevron-right" class="w-4 h-4 text-white/50 group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>
            </NuxtLink>
          </div>

          <!-- Results count -->
          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-500">
              找到 <span class="font-semibold text-gray-700">{{ filteredCapabilities.length }}</span> 个能力
            </p>
          </div>

          <!-- Capability Grid -->
          <div class="grid grid-cols-3 gap-4">
            <BCapabilityCard
              v-for="cap in filteredCapabilities"
              :key="cap.id"
              :capability="cap"
              :capability-type="cap._type"
            />
          </div>

          <!-- Empty State -->
          <div v-if="!filteredCapabilities.length" class="text-center py-20">
            <UIcon name="i-lucide-search-x" class="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p class="text-gray-500 text-sm">未找到匹配的能力</p>
            <p class="text-gray-400 text-xs mt-1">尝试调整筛选条件或搜索关键词</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
