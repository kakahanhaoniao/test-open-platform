<script setup lang="ts">
import { apps, appTypes } from '~/data/mock'

const searchQuery = ref('')
const selectedType = ref('all')

const filteredApps = computed(() => {
  let result = [...apps]

  if (selectedType.value !== 'all') {
    result = result.filter(a => a.type === selectedType.value)
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(a =>
      a.name.toLowerCase().includes(q)
      || a.description.toLowerCase().includes(q)
      || a.tags.some(t => t.toLowerCase().includes(q))
    )
  }

  return result
})

useHead({ title: '应用中心 - 奇安信AI开放平台' })
</script>

<template>
  <div class="p-6 md:p-8">
    <!-- Page header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">应用中心</h1>
      <p class="text-gray-500">基于AI安全能力构建的专业应用，开箱即用，快速提升安全运营效率</p>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl border border-gray-100 p-5 mb-6">
      <div class="flex flex-col lg:flex-row gap-4">
        <!-- Search -->
        <div class="flex-1 relative">
          <UIcon name="i-lucide-search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索应用名称、描述或标签..."
            class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all"
          >
        </div>

        <!-- Type filter -->
        <div class="flex flex-wrap gap-2">
          <button
            v-for="type in appTypes"
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
      </div>
    </div>

    <!-- Results count -->
    <div class="flex items-center justify-between mb-4">
      <p class="text-sm text-gray-400">共 {{ filteredApps.length }} 个应用</p>
    </div>

    <!-- App grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <AppCard
        v-for="app in filteredApps"
        :key="app.id"
        :app="app"
      />
    </div>

    <!-- Empty state -->
    <div
      v-if="filteredApps.length === 0"
      class="flex flex-col items-center justify-center py-20"
    >
      <UIcon name="i-lucide-search-x" class="w-12 h-12 text-gray-300 mb-4" />
      <p class="text-gray-400 text-lg mb-2">未找到匹配的应用</p>
      <p class="text-gray-300 text-sm">请尝试调整搜索条件或筛选类型</p>
    </div>
  </div>
</template>
