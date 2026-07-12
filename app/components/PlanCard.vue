<script setup lang="ts">
import type { Plan } from '~/data/mock'

const props = defineProps<{
  plan: Plan
}>()

const emit = defineEmits<{
  buy: [plan: Plan]
}>()

function formatTokens(tokens: number): string {
  if (tokens < 0) return '无限'
  if (tokens >= 100000000) return (tokens / 100000000).toFixed(0) + '亿'
  if (tokens >= 10000) return (tokens / 10000).toFixed(0) + '万'
  return tokens.toLocaleString()
}

function formatCalls(calls: number): string {
  if (calls >= 10000) return (calls / 10000).toFixed(0) + '万'
  return calls.toLocaleString()
}

const billingCycleLabel = computed(() => {
  switch (props.plan.billingCycle) {
    case 'monthly': return '/月'
    case 'annual': return '/年'
    case 'one-time': return ''
    default: return ''
  }
})

const includedLabel = computed(() => {
  if (props.plan.type === 'pack' && props.plan.includedTokens) {
    return `${formatTokens(props.plan.includedTokens)}Token`
  }
  if (props.plan.type === 'model-plan' && props.plan.includedTokens) {
    return `${formatTokens(props.plan.includedTokens)}Token/月`
  }
  if (props.plan.type === 'app-plan' && props.plan.includedCalls) {
    return `${formatCalls(props.plan.includedCalls)}次调用/月`
  }
  return ''
})

const displayBadge = computed(() => {
  if (props.plan.badge) return props.plan.badge
  if (props.plan.popular) return '推荐'
  return ''
})

const gradientBg = computed(() => {
  if (props.plan.gradient) return `bg-gradient-to-br ${props.plan.gradient}`
  return ''
})
</script>

<template>
  <div
    class="rounded-xl border p-5 card-hover relative overflow-hidden"
    :class="[
      gradientBg ? `${gradientBg} border-transparent` : 'bg-white border-gray-100',
      plan.popular && !gradientBg ? 'border-primary-300 ring-1 ring-primary-100' : ''
    ]"
  >
    <!-- Badge -->
    <div
      v-if="displayBadge"
      class="absolute -top-2.5 left-4 px-2.5 py-0.5 rounded-full text-white text-[10px] font-medium"
      :class="gradientBg ? 'bg-white/20' : 'bg-primary-600'"
    >
      {{ displayBadge }}
    </div>

    <!-- Icon + Name -->
    <div class="flex items-start gap-3 mb-3">
      <div
        class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
        :class="gradientBg ? 'bg-white/20' : 'bg-primary-50'"
      >
        <UIcon :name="plan.icon" class="w-5 h-5" :class="gradientBg ? 'text-white' : 'text-primary-600'" />
      </div>
      <div class="flex-1 min-w-0">
        <p class="font-bold text-lg truncate" :class="gradientBg ? 'text-white' : 'text-gray-900'">{{ plan.name }}</p>
        <p v-if="plan.description" class="text-xs mt-0.5 truncate" :class="gradientBg ? 'text-white/70' : 'text-gray-400'">{{ plan.description }}</p>
      </div>
    </div>

    <!-- Included amount -->
    <div v-if="includedLabel" class="mb-3">
      <span
        class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium"
        :class="gradientBg ? 'bg-white/20 text-white' : 'bg-primary-50 text-primary-700'"
      >
        {{ includedLabel }}
      </span>
    </div>

    <!-- Price -->
    <div class="mb-3">
      <div class="flex items-baseline gap-1">
        <span class="text-sm" :class="gradientBg ? 'text-white/60' : 'text-gray-400'">¥</span>
        <span class="text-2xl font-bold" :class="gradientBg ? 'text-white' : 'gradient-text'">{{ plan.price.toLocaleString() }}</span>
        <span class="text-xs" :class="gradientBg ? 'text-white/60' : 'text-gray-400'">{{ billingCycleLabel }}</span>
      </div>
      <div v-if="plan.originalPrice" class="mt-0.5">
        <span class="text-xs line-through" :class="gradientBg ? 'text-white/40' : 'text-gray-400'">¥{{ plan.originalPrice.toLocaleString() }}</span>
      </div>
    </div>

    <!-- Features -->
    <div class="space-y-1.5 mb-4">
      <div
        v-for="feature in plan.features"
        :key="feature"
        class="flex items-center gap-2 text-xs"
        :class="gradientBg ? 'text-white/80' : 'text-gray-500'"
      >
        <UIcon name="i-lucide-check" class="w-3.5 h-3.5 shrink-0" :class="gradientBg ? 'text-white/60' : 'text-green-500'" />
        {{ feature }}
      </div>
    </div>

    <!-- Buy button -->
    <button
      class="w-full py-2 rounded-lg text-sm font-medium transition-all duration-200"
      :class="gradientBg
        ? 'bg-white/20 hover:bg-white/30 text-white border border-white/30'
        : plan.popular
          ? 'bg-primary-600 hover:bg-primary-700 text-white'
          : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'"
      @click="emit('buy', plan)"
    >
      购买
    </button>
  </div>
</template>
