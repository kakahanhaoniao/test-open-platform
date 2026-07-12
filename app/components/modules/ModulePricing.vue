<script setup lang="ts">
import type { TemplateModule } from '~/data/mock'
import { models, apps, chargingPacks, modelPlans, appPlans, getPlansForCapability } from '~/data/mock'

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

const title = computed(() => props.module.props?.title || '定价方案')
const useDefault = computed(() => props.module.props?.useDefault === true)

// Default pricing from capability data
const capabilityPricing = computed(() => {
  if (props.capabilityType === 'model') {
    return props.capability?.pricing || null
  }
  return null
})

const plansData = computed(() => {
  if (useDefault.value) {
    return getPlansForCapability(props.capability?.id || '')
  }
  return { packs: [], modelPlans: [], appPlans: [] }
})

// Custom plans from module props
const customPlans = computed(() => props.module.props?.plans || [])

// All plans to display
const displayPlans = computed(() => {
  if (!useDefault.value) {
    return customPlans.value
  }
  const result: any[] = []
  // Add token packs
  result.push(...plansData.value.packs)
  // Add model/app specific plans
  result.push(...plansData.value.modelPlans)
  result.push(...plansData.value.appPlans)
  return result
})

function formatPrice(price: number): string {
  if (price >= 10000) {
    return `¥${(price / 10000).toFixed(0)}万`
  }
  return `¥${price.toLocaleString()}`
}

function getBillingLabel(cycle: string): string {
  switch (cycle) {
    case 'one-time': return '一次性'
    case 'monthly': return '/月'
    case 'annual': return '/年'
    default: return ''
  }
}
</script>

<template>
  <div :class="[spacingTop, spacingBottom, bgClass]">
    <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
      {{ title }}
    </h2>

    <!-- Per-token pricing for models -->
    <div v-if="useDefault && capabilityPricing" class="mb-8 p-6 rounded-xl bg-gradient-to-r from-primary-50 to-primary-100/50 border border-primary-100">
      <h3 class="font-semibold text-primary-800 mb-3">按量计费</h3>
      <div class="flex flex-wrap gap-6">
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-arrow-down-circle" class="w-5 h-5 text-primary-600" />
          <span class="text-sm text-primary-700">输入：</span>
          <span class="font-semibold text-primary-900">{{ capabilityPricing.input }}</span>
        </div>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-arrow-up-circle" class="w-5 h-5 text-primary-600" />
          <span class="text-sm text-primary-700">输出：</span>
          <span class="font-semibold text-primary-900">{{ capabilityPricing.output }}</span>
        </div>
      </div>
    </div>

    <!-- Plans grid -->
    <div v-if="displayPlans.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="(plan, i) in displayPlans"
        :key="plan.id || i"
        class="relative p-6 rounded-xl border bg-white"
        :class="plan.popular ? 'border-primary-300 ring-1 ring-primary-100' : 'border-gray-100'"
      >
        <!-- Popular badge -->
        <span
          v-if="plan.popular"
          class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-primary-600 text-white text-xs font-medium"
        >
          推荐
        </span>

        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
            <UIcon :name="plan.icon || 'i-lucide-tag'" class="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h3 class="font-semibold text-gray-900">{{ plan.name }}</h3>
            <p class="text-xs text-gray-500">{{ plan.description }}</p>
          </div>
        </div>

        <div class="mb-4">
          <span class="text-2xl font-bold text-gray-900">{{ formatPrice(plan.price) }}</span>
          <span class="text-sm text-gray-500">{{ getBillingLabel(plan.billingCycle) }}</span>
          <span v-if="plan.originalPrice" class="ml-2 text-sm text-gray-400 line-through">
            {{ formatPrice(plan.originalPrice) }}
          </span>
        </div>

        <ul class="space-y-2 mb-6">
          <li
            v-for="(feature, fi) in plan.features"
            :key="fi"
            class="flex items-center gap-2 text-sm text-gray-600"
          >
            <UIcon name="i-lucide-check" class="w-4 h-4 text-green-500 shrink-0" />
            {{ feature }}
          </li>
        </ul>

        <UButton
          :variant="plan.popular ? 'solid' : 'outline'"
          block
          class="font-medium"
        >
          {{ plan.popular ? '立即购买' : '选择方案' }}
        </UButton>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="text-center py-12 text-gray-400">
      <UIcon name="i-lucide-tag" class="w-10 h-10 mx-auto mb-3 opacity-50" />
      <p>暂无定价方案</p>
    </div>
  </div>
</template>
