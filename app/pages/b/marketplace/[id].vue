<script setup lang="ts">
import { models, apps, getModelById, getAppById } from '~/data/mock'

const route = useRoute()
const id = computed(() => route.params.id as string)

// Find the capability - check models first, then apps
const modelData = computed(() => getModelById(id.value))
const appData = computed(() => getAppById(id.value))

const capability = computed(() => modelData.value || appData.value)
const capabilityType = computed<'model' | 'app'>(() => modelData.value ? 'model' : 'app')

// Set page title
useHead({
  title: capability.value ? `${capability.value.name} - 奇安信AI开放平台` : '能力详情 - 奇安信AI开放平台'
})

// Related capabilities (same type or category)
const relatedCapabilities = computed(() => {
  if (!capability.value) return []
  if (capabilityType.value === 'model') {
    return models
      .filter(m => m.id !== id.value && m.type === modelData.value?.type)
      .slice(0, 3)
      .map(m => ({ ...m, _type: 'model' as const }))
  }
  return apps
    .filter(a => a.id !== id.value && a.type === appData.value?.type)
    .slice(0, 3)
    .map(a => ({ ...a, _type: 'app' as const }))
})
</script>

<template>
  <div class="min-h-screen bg-[#FAFAFA]">
    <BTopNav />

    <div v-if="capability" class="max-w-7xl mx-auto px-6 py-8">
      <!-- Breadcrumb -->
      <div class="flex items-center gap-2 text-xs text-gray-400 mb-6">
        <NuxtLink to="/b" class="hover:text-primary-600 transition-colors">首页</NuxtLink>
        <UIcon name="i-lucide-chevron-right" class="w-3 h-3" />
        <NuxtLink to="/b/marketplace" class="hover:text-primary-600 transition-colors">能力市场</NuxtLink>
        <UIcon name="i-lucide-chevron-right" class="w-3 h-3" />
        <span class="text-gray-600">{{ capability.name }}</span>
      </div>

      <!-- Detail Component -->
      <BCapabilityDetail
        :capability="capability"
        :capability-type="capabilityType"
      />

      <!-- Related Capabilities -->
      <div v-if="relatedCapabilities.length" class="mt-12">
        <h2 class="text-lg font-bold text-gray-900 mb-5">相关能力</h2>
        <div class="grid grid-cols-4 gap-4">
          <BCapabilityCard
            v-for="cap in relatedCapabilities"
            :key="cap.id"
            :capability="cap"
            :capability-type="cap._type"
          />
        </div>
      </div>
    </div>

    <!-- Not Found -->
    <div v-else class="max-w-7xl mx-auto px-6 py-20 text-center">
      <UIcon name="i-lucide-search-x" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h2 class="text-xl font-bold text-gray-900 mb-2">未找到该能力</h2>
      <p class="text-sm text-gray-500 mb-6">该能力可能已下线或ID不正确</p>
      <UButton
        label="返回能力市场"
        icon="i-lucide-arrow-left"
        color="primary"
        to="/b/marketplace"
      />
    </div>
  </div>
</template>
