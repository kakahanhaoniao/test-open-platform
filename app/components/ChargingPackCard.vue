<script setup lang="ts">
import type { ChargingPack } from '~/data/mock'

const props = defineProps<{
  pack: ChargingPack
}>()
</script>

<template>
  <div
    class="bg-white rounded-xl border overflow-hidden relative card-hover"
    :class="pack.popular ? 'border-primary-300 ring-2 ring-primary-100' : 'border-gray-100'"
  >
    <!-- Popular badge -->
    <div
      v-if="pack.popular"
      class="absolute top-0 right-0 bg-primary-600 text-white text-xs font-medium px-3 py-1 rounded-bl-lg"
    >
      最受欢迎
    </div>

    <div class="p-6">
      <!-- Pack name -->
      <h3 class="font-bold text-gray-900 text-lg mb-1">{{ pack.name }}</h3>
      <p class="text-sm text-gray-400 mb-4">{{ pack.tokens }}</p>

      <!-- Price -->
      <div class="mb-6">
        <div class="flex items-baseline gap-2">
          <span class="text-3xl font-bold text-gray-900">{{ pack.price }}</span>
          <span v-if="pack.originalPrice" class="text-sm text-gray-400 line-through">{{ pack.originalPrice }}</span>
        </div>
        <p class="text-xs text-gray-400 mt-1">{{ pack.unitPrice }}</p>
      </div>

      <!-- Features -->
      <ul class="space-y-2.5 mb-6">
        <li
          v-for="feature in pack.features"
          :key="feature"
          class="flex items-center gap-2 text-sm text-gray-600"
        >
          <UIcon name="i-lucide-check" class="w-4 h-4 text-primary-500 shrink-0" />
          {{ feature }}
        </li>
      </ul>

      <!-- CTA -->
      <UButton
        block
        :variant="pack.popular ? 'solid' : 'outline'"
        color="primary"
        size="lg"
      >
        {{ pack.popular ? '立即购买' : '选择套餐' }}
      </UButton>
    </div>
  </div>
</template>
