<script setup lang="ts">
import { models, modelTypes } from '~/data/mock'

const searchQuery = ref('')
const selectedType = ref('all')
const sortBy = ref('hot')

const filteredModels = computed(() => {
  let result = [...models]

  // Filter by type
  if (selectedType.value !== 'all') {
    result = result.filter(m => m.type === selectedType.value)
  }

  // Filter by search
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(m =>
      m.name.toLowerCase().includes(q)
      || m.description.toLowerCase().includes(q)
      || m.tags.some(t => t.toLowerCase().includes(q))
    )
  }

  // Sort
  if (sortBy.value === 'hot') {
    result.sort((a, b) => (b.hot ? 1 : 0) - (a.hot ? 1 : 0) || b.rating - a.rating)
  }
  else if (sortBy.value === 'rating') {
    result.sort((a, b) => b.rating - a.rating)
  }
  else if (sortBy.value === 'price-low') {
    result.sort((a, b) => a.pricingLevel - b.pricingLevel)
  }
  else if (sortBy.value === 'new') {
    result.sort((a, b) => (b.new ? 1 : 0) - (a.new ? 1 : 0))
  }

  return result
})

useHead({ title: '模型中心 - 奇安信AI开放平台' })
</script>

<template>
  <div class="p-6 md:p-8">
    <!-- Page header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">模型中心</h1>
      <p class="text-gray-500">探索奇安信AI安全模型，选择适合您业务场景的智能安全能力</p>
    </div>

    <!-- Filters bar -->
    <div class="bg-white rounded-xl border border-gray-100 p-5 mb-6">
      <div class="flex flex-col lg:flex-row gap-4">
        <!-- Search -->
        <div class="flex-1 relative">
          <UIcon name="i-lucide-search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索模型名称、描述或标签..."
            class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all"
          >
        </div>

        <!-- Type filter -->
        <div class="flex flex-wrap gap-2">
          <button
            v-for="type in modelTypes"
            :key="type.value"
            class="px-3 py-1.5 rounded-lg text-sm transition-all"
            :class="selectedType === type.value
              ? 'bg-primary-600 text-white font-medium'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'"
            @click="selectedType = type.value"
          >
            {{ type.label }}
          </button>
        </div>

        <!-- Sort -->
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-400">排序：</span>
          <select
            v-model="sortBy"
            class="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 focus:outline-none focus:border-primary-300"
          >
            <option value="hot">热门优先</option>
            <option value="rating">评分最高</option>
            <option value="price-low">价格最低</option>
            <option value="new">最新上线</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Results count -->
    <div class="flex items-center justify-between mb-4">
      <p class="text-sm text-gray-400">共 {{ filteredModels.length }} 个模型</p>
    </div>

    <!-- Model grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <ModelCard
        v-for="model in filteredModels"
        :key="model.id"
        :model="model"
      />
    </div>

    <!-- Empty state -->
    <div
      v-if="filteredModels.length === 0"
      class="flex flex-col items-center justify-center py-20"
    >
      <UIcon name="i-lucide-search-x" class="w-12 h-12 text-gray-300 mb-4" />
      <p class="text-gray-400 text-lg mb-2">未找到匹配的模型</p>
      <p class="text-gray-300 text-sm">请尝试调整搜索条件或筛选类型</p>
    </div>
  </div>
</template>
