<script setup lang="ts">
import type { App } from '~/data/mock'

const props = defineProps<{
  app: App
}>()

const typeButtonLabels: Record<string, string> = {
  'chat': '对话',
  'tool': '使用',
  'external-link': '访问',
  'showcase': '查看'
}
</script>

<template>
  <NuxtLink :to="`/apps/${app.id}`" class="block card-hover">
    <div class="bg-white rounded-xl border border-gray-100 overflow-hidden group">
      <div class="p-5">
        <!-- Header -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-3">
            <div
              class="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              :style="{ backgroundColor: app.typeColor + '12' }"
            >
              <UIcon :name="app.icon" class="w-5 h-5" :style="{ color: app.typeColor }" />
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 text-sm leading-tight">{{ app.name }}</h3>
              <div class="flex items-center gap-1.5 mt-1">
                <UIcon :name="app.typeIcon" class="w-3 h-3" :style="{ color: app.typeColor }" />
                <span class="text-[11px]" :style="{ color: app.typeColor }">{{ app.typeName }}</span>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-1.5">
            <span
              v-if="app.hot"
              class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-50 text-red-600"
            >
              <UIcon name="i-lucide-flame" class="w-3 h-3 mr-0.5" />
              热门
            </span>
            <span
              v-if="app.new"
              class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary-50 text-primary-600"
            >
              NEW
            </span>
          </div>
        </div>

        <!-- Description -->
        <p class="text-sm text-gray-500 line-clamp-2 mb-4">{{ app.description }}</p>

        <!-- Tags -->
        <div class="flex flex-wrap gap-1.5 mb-4">
          <span
            v-for="tag in app.tags.slice(0, 3)"
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
              <span class="text-xs font-medium text-gray-700">{{ app.rating }}</span>
            </div>
            <span class="text-xs text-gray-400">{{ app.useCount }}人使用</span>
          </div>
          <UButton
            size="xs"
            variant="soft"
            :style="{ color: app.typeColor }"
            class="group-hover:shadow-sm transition-shadow"
          >
            {{ typeButtonLabels[app.type] || '了解' }}
          </UButton>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
