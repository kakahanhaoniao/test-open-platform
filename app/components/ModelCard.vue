<script setup lang="ts">
import type { Model } from '~/data/mock'

const props = defineProps<{
  model: Model
  compact?: boolean
}>()

const pricingLabels = ['经济', '标准', '旗舰']
const pricingColors = ['text-green-600', 'text-amber-600', 'text-primary-600']
</script>

<template>
  <NuxtLink :to="`/models/${model.id}`" class="block card-hover">
    <div class="bg-white rounded-xl border border-gray-100 overflow-hidden relative group">
      <!-- Left color stripe -->
      <div
        class="absolute left-0 top-0 bottom-0 w-1 transition-all duration-200 group-hover:w-1.5"
        :style="{ backgroundColor: model.typeColor }"
      />

      <div class="p-5 pl-6">
        <!-- Header row -->
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
              :style="{ backgroundColor: model.typeColor + '15' }"
            >
              <UIcon :name="model.icon" class="w-5 h-5" :style="{ color: model.typeColor }" />
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 text-sm leading-tight">{{ model.name }}</h3>
              <p class="text-xs text-gray-400 mt-0.5">{{ model.provider }}</p>
            </div>
          </div>
          <div class="flex items-center gap-1.5">
            <span
              v-if="model.hot"
              class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-50 text-red-600"
            >
              <UIcon name="i-lucide-flame" class="w-3 h-3 mr-0.5" />
              热门
            </span>
            <span
              v-if="model.new"
              class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary-50 text-primary-600"
            >
              NEW
            </span>
          </div>
        </div>

        <!-- Type badge + params -->
        <div class="flex items-center gap-2 mb-3">
          <span
            class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium"
            :style="{ backgroundColor: model.typeColor + '10', color: model.typeColor }"
          >
            {{ model.typeName }}
          </span>
          <span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-50 text-gray-600">
            {{ model.parameters }}
          </span>
        </div>

        <!-- Description -->
        <p v-if="!compact" class="text-sm text-gray-500 line-clamp-2 mb-4">{{ model.description }}</p>

        <!-- Tags -->
        <div v-if="!compact" class="flex flex-wrap gap-1.5 mb-4">
          <span
            v-for="tag in model.tags.slice(0, 3)"
            :key="tag"
            class="px-2 py-0.5 rounded text-[11px] text-gray-400 bg-gray-50"
          >
            {{ tag }}
          </span>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between pt-3 border-t border-gray-50">
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-1">
              <UIcon name="i-lucide-star" class="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span class="text-xs font-medium text-gray-700">{{ model.rating }}</span>
            </div>
            <span class="text-xs text-gray-400">{{ model.callCount }}次调用</span>
          </div>
          <div class="flex items-center gap-1">
            <span class="text-xs" :class="pricingColors[model.pricingLevel - 1]">
              {{ pricingLabels[model.pricingLevel - 1] }}
            </span>
            <UIcon name="i-lucide-chevron-right" class="w-3.5 h-3.5 text-gray-300 group-hover:text-primary-500 transition-colors" />
          </div>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
