<script setup lang="ts">
import { models, apps, modelPlans, appPlans, modelTypes, appTypes, getPlansForCapability } from '~/data/mock'
import type { Model, App } from '~/data/mock'

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
const currentPage = ref(1)
const pageSize = 12

// Quick preview slideover state
const previewOpen = ref(false)
const previewCapability = ref<Model | App | null>(null)
const previewType = ref<'model' | 'app'>('model')

// Hot search tags
const hotTags = ['安全大模型', '威胁检测', '代码安全', '漏洞分析', '合规检查', '数据安全']

// Subcategory tags for horizontal filter
const subcategoryTags = computed(() => {
  if (selectedType.value === 'model') {
    return modelTypes.filter(t => t.value !== 'all')
  }
  if (selectedType.value === 'app') {
    return appTypes.filter(t => t.value !== 'all')
  }
  // Combine both
  return [...modelTypes.filter(t => t.value !== 'all'), ...appTypes.filter(t => t.value !== 'all')]
})

// Unified capabilities list
const allCapabilities = computed(() => {
  const modelItems = models.map(m => ({ ...m, _type: 'model' as const }))
  const appItems = apps.map(a => ({ ...a, _type: 'app' as const }))
  return [...modelItems, ...appItems]
})

// Featured capabilities: top 2 by rating + call count
const featuredCapabilities = computed(() => {
  return allCapabilities.value
    .slice()
    .sort((a, b) => {
      // Sort by rating first, then by call count
      if (b.rating !== a.rating) return b.rating - a.rating
      return 0
    })
    .slice(0, 2)
})

// Get price tag for a capability
function getPriceTag(cap: any, type: 'model' | 'app'): string {
  const plans = getPlansForCapability(cap.id)
  const relevantPlans = type === 'model' ? plans.modelPlans : plans.appPlans
  if (relevantPlans.length > 0) {
    const lowest = relevantPlans.reduce((min: any, p: any) => p.price < min.price ? p : min, relevantPlans[0])
    const suffix = lowest.billingCycle === 'monthly' ? '/月' : lowest.billingCycle === 'annual' ? '/年' : ''
    return `¥${lowest.price}${suffix}`
  }
  return '按量计费'
}

// Get call count display
function getCallCount(cap: any, type: 'model' | 'app'): string {
  return type === 'model' ? (cap as Model).callCount : (cap as App).useCount
}

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
    result = result.slice().sort((a, b) => b.rating - a.rating)
  } else if (sortBy.value === 'newest') {
    result = result.slice().sort((a, b) => (b.new ? 1 : 0) - (a.new ? 1 : 0))
  } else if (sortBy.value === 'price') {
    result = result.slice().sort((a, b) => {
      const priceA = getLowestPrice(a.id, a._type)
      const priceB = getLowestPrice(b.id, b._type)
      return priceA - priceB
    })
  }

  return result
})

// Get lowest price for sorting
function getLowestPrice(capId: string, type: 'model' | 'app'): number {
  const plans = getPlansForCapability(capId)
  const relevantPlans = type === 'model' ? plans.modelPlans : plans.appPlans
  if (relevantPlans.length > 0) {
    return Math.min(...relevantPlans.map(p => p.price))
  }
  return 99999 // Put pay-per-use at the end
}

// Pagination
const totalPages = computed(() => Math.ceil(filteredCapabilities.value.length / pageSize))
const paginatedCapabilities = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredCapabilities.value.slice(start, start + pageSize)
})

// Type tab counts
const modelCount = computed(() => models.length)
const appCount = computed(() => apps.length)
const totalCount = computed(() => models.length + apps.length)

// Reset page when filters change
watch([selectedType, selectedCategory, searchQuery, sortBy], () => {
  currentPage.value = 1
})

// Quick preview handler
function openQuickPreview(cap: Model | App, type: 'model' | 'app') {
  previewCapability.value = cap
  previewType.value = type
  previewOpen.value = true
}

// Featured card gradients
const featuredGradients = [
  'from-primary-600 via-primary-500 to-violet-500',
  'from-red-500 via-rose-500 to-amber-500'
]

// Search input ref for focus
const searchInput = ref<HTMLInputElement | null>(null)

function fillSearch(tag: string) {
  searchQuery.value = tag
}
</script>

<template>
  <div>
    <!-- Search Hero Section -->
    <section class="relative bg-gradient-to-br from-primary-600 via-primary-700 to-violet-800 overflow-hidden">
      <!-- Background pattern -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-white/20 blur-3xl" />
        <div class="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-violet-300/20 blur-3xl" />
      </div>

      <div class="relative max-w-7xl mx-auto px-6 pt-12 pb-10">
        <!-- Title -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-white mb-2">能力市场</h1>
          <p class="text-primary-100 text-sm">发现和接入安全AI能力，模型与应用统一发现</p>
        </div>

        <!-- Search Input -->
        <div class="max-w-2xl mx-auto mb-5">
          <div class="relative">
            <UIcon name="i-lucide-search" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              ref="searchInput"
              v-model="searchQuery"
              type="text"
              placeholder="搜索 安全大模型、威胁检测、代码安全..."
              class="w-full h-12 pl-12 pr-4 rounded-2xl bg-white/95 backdrop-blur-sm text-sm text-gray-900 placeholder-gray-400 border-0 shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
            />
          </div>
        </div>

        <!-- Hot Tags -->
        <div class="flex items-center justify-center gap-2 flex-wrap">
          <span class="text-xs text-primary-200 mr-1">热门:</span>
          <button
            v-for="tag in hotTags"
            :key="tag"
            class="px-3 py-1 rounded-full text-xs font-medium bg-white/15 text-white hover:bg-white/25 transition-colors backdrop-blur-sm"
            @click="fillSearch(tag)"
          >
            {{ tag }}
          </button>
        </div>
      </div>
    </section>

    <!-- Type Tabs + Subcategory Scroll -->
    <section class="bg-white border-b border-gray-100 sticky top-0 z-20">
      <div class="max-w-7xl mx-auto px-6">
        <!-- Type Tabs -->
        <div class="flex items-center justify-between py-4">
          <div class="flex items-center gap-1 bg-gray-50 rounded-xl p-1">
            <button
              class="px-5 py-2 rounded-lg text-sm font-medium transition-all"
              :class="selectedType === 'all'
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'"
              @click="selectedType = 'all'; selectedCategory = ''"
            >
              全部
              <span class="ml-1 text-xs text-gray-400">{{ totalCount }}</span>
            </button>
            <button
              class="px-5 py-2 rounded-lg text-sm font-medium transition-all"
              :class="selectedType === 'model'
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'"
              @click="selectedType = 'model'; selectedCategory = ''"
            >
              模型
              <span class="ml-1 text-xs text-gray-400">{{ modelCount }}</span>
            </button>
            <button
              class="px-5 py-2 rounded-lg text-sm font-medium transition-all"
              :class="selectedType === 'app'
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'"
              @click="selectedType = 'app'; selectedCategory = ''"
            >
              应用
              <span class="ml-1 text-xs text-gray-400">{{ appCount }}</span>
            </button>
          </div>
        </div>

        <!-- Subcategory Scroll -->
        <div class="flex items-center gap-2 pb-3 overflow-x-auto scrollbar-hide">
          <button
            class="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all shrink-0"
            :class="!selectedCategory
              ? 'bg-primary-50 text-primary-700 font-semibold'
              : 'bg-gray-50 text-gray-500 hover:bg-gray-100'"
            @click="selectedCategory = ''"
          >
            全部
          </button>
          <button
            v-for="cat in subcategoryTags"
            :key="cat.value + cat.label"
            class="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all shrink-0"
            :class="selectedCategory === cat.label
              ? 'bg-primary-50 text-primary-700 font-semibold'
              : 'bg-gray-50 text-gray-500 hover:bg-gray-100'"
            @click="selectedCategory = selectedCategory === cat.label ? '' : cat.label"
          >
            {{ cat.label }}
          </button>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-6 py-8">
      <!-- Featured Recommendations (only when no search/filter) -->
      <div v-if="!searchQuery && !selectedCategory && currentPage === 1" class="grid grid-cols-2 gap-5 mb-8">
        <div
          v-for="(feat, idx) in featuredCapabilities"
          :key="feat.id"
          class="relative rounded-2xl overflow-hidden group cursor-pointer"
          @click="navigateTo(`/marketplace/${feat.id}`)"
        >
          <!-- Gradient Background -->
          <div
            class="absolute inset-0 bg-gradient-to-br"
            :class="featuredGradients[idx % featuredGradients.length]"
          />
          <!-- Decorative circles -->
          <div class="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10" />
          <div class="absolute -left-4 -bottom-4 w-24 h-24 rounded-full bg-white/5" />

          <div class="relative p-6 flex items-center gap-5">
            <!-- Icon -->
            <div class="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
              <UIcon :name="feat.icon" class="w-7 h-7 text-white" />
            </div>

            <!-- Info -->
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-white/60 text-xs font-medium">精选推荐:</span>
                <span class="text-white text-base font-bold truncate">{{ feat.name }}</span>
              </div>
              <div class="flex items-center gap-3 mb-2">
                <div class="flex items-center gap-1">
                  <UIcon name="i-lucide-star" class="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                  <span class="text-white text-sm font-semibold">{{ feat.rating }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <UIcon name="i-lucide-activity" class="w-3.5 h-3.5 text-white/60" />
                  <span class="text-white/80 text-xs">{{ getCallCount(feat, feat._type) }} {{ feat._type === 'model' ? '调用' : '用户' }}</span>
                </div>
              </div>
              <p class="text-white/70 text-xs line-clamp-1">{{ feat.description }}</p>
            </div>

            <!-- CTA Button -->
            <UButton
              label="快速接入"
              icon="i-lucide-arrow-right"
              size="sm"
              variant="solid"
              class="shrink-0 bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm"
              trailing
              @click.stop="void navigateTo(`/marketplace/${feat.id}`)"
            />
          </div>
        </div>
      </div>

      <!-- Sort Bar + Results Count -->
      <div class="flex items-center justify-between mb-5">
        <p class="text-sm text-gray-500">
          共 <span class="font-semibold text-gray-700">{{ filteredCapabilities.length }}</span> 个能力
        </p>
        <div class="flex items-center gap-1 bg-gray-50 rounded-lg p-0.5">
          <button
            class="px-3 py-1.5 rounded-md text-xs font-medium transition-all"
            :class="sortBy === 'popular' ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
            @click="sortBy = 'popular'"
          >
            热门
          </button>
          <button
            class="px-3 py-1.5 rounded-md text-xs font-medium transition-all"
            :class="sortBy === 'newest' ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
            @click="sortBy = 'newest'"
          >
            最新
          </button>
          <button
            class="px-3 py-1.5 rounded-md text-xs font-medium transition-all"
            :class="sortBy === 'price' ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
            @click="sortBy = 'price'"
          >
            价格
          </button>
        </div>
      </div>

      <!-- Capability Grid -->
      <div class="grid grid-cols-3 gap-4">
        <CapabilityCard
          v-for="cap in paginatedCapabilities"
          :key="cap.id"
          :capability="cap"
          :capability-type="cap._type"
          @quick-preview="openQuickPreview"
        />
      </div>

      <!-- Empty State -->
      <div v-if="!filteredCapabilities.length" class="text-center py-20">
        <UIcon name="i-lucide-search-x" class="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p class="text-gray-500 text-sm">未找到匹配的能力</p>
        <p class="text-gray-400 text-xs mt-1">尝试调整筛选条件或搜索关键词</p>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-8">
        <button
          class="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          <UIcon name="i-lucide-chevron-left" class="w-4 h-4" />
        </button>
        <template v-for="page in totalPages" :key="page">
          <button
            class="w-8 h-8 rounded-lg text-xs font-medium transition-all"
            :class="currentPage === page
              ? 'bg-primary-600 text-white shadow-sm'
              : 'text-gray-500 hover:bg-gray-50'"
            @click="currentPage = page"
          >
            {{ page }}
          </button>
        </template>
        <button
          class="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          <UIcon name="i-lucide-chevron-right" class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Quick Preview Slideover -->
    <USlideover
      v-model:open="previewOpen"
      side="right"
      :ui="{ content: 'max-w-[420px]' }"
    >
      <template #content>
        <div v-if="previewCapability" class="h-full flex flex-col">
          <!-- Header -->
          <div class="flex items-center justify-between p-5 border-b border-gray-100">
            <h3 class="text-base font-bold text-gray-900">快速预览</h3>
            <button
              class="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
              @click="previewOpen = false"
            >
              <UIcon name="i-lucide-x" class="w-5 h-5" />
            </button>
          </div>

          <!-- Body -->
          <div class="flex-1 overflow-y-auto p-5 space-y-5">
            <!-- Capability Icon + Name -->
            <div class="flex items-start gap-4">
              <div
                class="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                :class="previewType === 'model' ? 'bg-primary-50' : 'bg-accent-50'"
              >
                <UIcon
                  :name="previewCapability.icon"
                  class="w-7 h-7"
                  :class="previewType === 'model' ? 'text-primary-600' : 'text-accent-600'"
                />
              </div>
              <div class="min-w-0">
                <h4 class="text-lg font-bold text-gray-900">{{ previewCapability.name }}</h4>
                <div class="flex items-center gap-3 mt-1">
                  <div class="flex items-center gap-1">
                    <UIcon name="i-lucide-star" class="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span class="text-sm font-semibold text-gray-700">{{ previewCapability.rating }}</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <UIcon name="i-lucide-activity" class="w-3.5 h-3.5 text-gray-400" />
                    <span class="text-xs text-gray-500">{{ getCallCount(previewCapability, previewType) }} {{ previewType === 'model' ? '调用' : '用户' }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Description -->
            <p class="text-sm text-gray-600 leading-relaxed">
              {{ previewCapability.description }}
            </p>

            <!-- Tags -->
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="tag in previewCapability.tags"
                :key="tag"
                class="px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-50 text-gray-600"
              >
                {{ tag }}
              </span>
            </div>

            <!-- Price Info -->
            <div class="bg-gray-50 rounded-xl p-4 space-y-2">
              <h5 class="text-xs font-semibold text-gray-500 uppercase tracking-wide">定价</h5>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">{{ getPriceTag(previewCapability, previewType) }}</span>
                <span
                  v-if="previewType === 'model'"
                  class="text-xs text-gray-400"
                >
                  {{ (previewCapability as Model).pricing.input }}
                </span>
              </div>
            </div>

            <!-- Features -->
            <div class="space-y-2">
              <h5 class="text-xs font-semibold text-gray-500 uppercase tracking-wide">核心能力</h5>
              <div class="space-y-1.5">
                <div
                  v-for="feature in previewCapability.features.slice(0, 5)"
                  :key="feature"
                  class="flex items-center gap-2"
                >
                  <UIcon name="i-lucide-check-circle-2" class="w-4 h-4 text-green-500 shrink-0" />
                  <span class="text-sm text-gray-600">{{ feature }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer: 3 Action Buttons -->
          <div class="p-5 border-t border-gray-100 space-y-2.5">
            <button
              class="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white transition-colors"
              @click="navigateTo(`/marketplace/${previewCapability.id}`); previewOpen = false"
            >
              <UIcon name="i-lucide-play" class="w-5 h-5 shrink-0" />
              <div class="text-left">
                <div class="text-sm font-semibold">在线体验</div>
                <div class="text-[11px] text-green-100">打开Playground</div>
              </div>
            </button>
            <button
              class="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white transition-colors"
              @click="navigateTo(`/console/keys`); previewOpen = false"
            >
              <UIcon name="i-lucide-key" class="w-5 h-5 shrink-0" />
              <div class="text-left">
                <div class="text-sm font-semibold">立即接入</div>
                <div class="text-[11px] text-primary-200">获取API Key+SDK</div>
              </div>
            </button>
            <button
              class="w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-primary-200 hover:border-primary-300 bg-primary-50/50 hover:bg-primary-50 text-primary-700 transition-colors"
              @click="navigateTo(`/marketplace/${previewCapability.id}`); previewOpen = false"
            >
              <UIcon name="i-lucide-package" class="w-5 h-5 shrink-0" />
              <div class="text-left">
                <div class="text-sm font-semibold">购买套餐</div>
                <div class="text-[11px] text-primary-500">充能包/模型套餐/应用套餐</div>
              </div>
            </button>
          </div>
        </div>
      </template>
    </USlideover>
  </div>
</template>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
