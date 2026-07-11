<script setup lang="ts">
import { models, apps, activities } from '~/data/mock'

useHead({ title: '模板配置 - 奇安信AI运营后台' })

interface TemplateItem {
  id: string
  name: string
  type: 'model' | 'app' | 'activity'
  typeName: string
  typeColor: string
  typeIcon: string
  lastModified: string
  editPath: string
  icon: string
}

const templates: TemplateItem[] = [
  ...models.map(m => ({
    id: m.id,
    name: m.name,
    type: 'model' as const,
    typeName: '模型模板',
    typeColor: '#7C3AED',
    typeIcon: 'i-lucide-brain',
    lastModified: '2026-07-10',
    editPath: `/admin/models/${m.id}/template`,
    icon: m.icon
  })),
  ...apps.map(a => ({
    id: a.id,
    name: a.name,
    type: 'app' as const,
    typeName: '应用模板',
    typeColor: '#14B8A6',
    typeIcon: 'i-lucide-layout-grid',
    lastModified: '2026-07-09',
    editPath: `/admin/apps/${a.id}/template`,
    icon: a.icon
  })),
  ...activities.map(a => ({
    id: a.id,
    name: a.title,
    type: 'activity' as const,
    typeName: '活动模板',
    typeColor: '#EF4444',
    typeIcon: 'i-lucide-flame',
    lastModified: '2026-07-08',
    editPath: `/admin/activities/${a.id}/template`,
    icon: a.icon
  }))
]

const filterType = ref('all')

const filteredTemplates = computed(() => {
  if (filterType.value === 'all') return templates
  return templates.filter(t => t.type === filterType.value)
})

function getTypeBadgeStyle(type: string) {
  if (type === 'model') return 'bg-primary-50 text-primary-600'
  if (type === 'app') return 'bg-accent-50 text-accent-600'
  if (type === 'activity') return 'bg-red-50 text-red-600'
  return 'bg-gray-50 text-gray-600'
}
</script>

<template>
  <div class="min-h-screen bg-[#FAFAFA]">
    <AdminSidebar />
    <div class="ml-60">
      <div class="p-6 md:p-8">
        <!-- Page header -->
        <div class="mb-8">
          <h1 class="text-2xl font-bold text-gray-900 mb-1">模板配置</h1>
          <p class="text-gray-500 text-sm">集中管理所有详情页模板的配置与预览</p>
        </div>

        <!-- Filter tabs -->
        <div class="flex items-center gap-2 mb-6">
          <button
            class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            :class="filterType === 'all' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'"
            @click="filterType = 'all'"
          >
            全部模板 ({{ templates.length }})
          </button>
          <button
            class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            :class="filterType === 'model' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'"
            @click="filterType = 'model'"
          >
            模型模板 ({{ templates.filter(t => t.type === 'model').length }})
          </button>
          <button
            class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            :class="filterType === 'app' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'"
            @click="filterType = 'app'"
          >
            应用模板 ({{ templates.filter(t => t.type === 'app').length }})
          </button>
          <button
            class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            :class="filterType === 'activity' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'"
            @click="filterType = 'activity'"
          >
            活动模板 ({{ templates.filter(t => t.type === 'activity').length }})
          </button>
        </div>

        <!-- Template grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <NuxtLink
            v-for="template in filteredTemplates"
            :key="template.id"
            :to="template.editPath"
            class="bg-white rounded-xl border border-gray-100 overflow-hidden card-hover group"
          >
            <!-- Preview thumbnail -->
            <div class="h-32 relative overflow-hidden" :style="{ background: `linear-gradient(135deg, ${template.typeColor}15, ${template.typeColor}05)` }">
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-14 h-14 rounded-xl flex items-center justify-center" :style="{ backgroundColor: template.typeColor + '20' }">
                  <UIcon :name="template.icon" class="w-8 h-8" :style="{ color: template.typeColor }" />
                </div>
              </div>
              <!-- Type badge -->
              <div class="absolute top-3 left-3">
                <span :class="['px-2 py-0.5 rounded text-xs font-medium', getTypeBadgeStyle(template.type)]">
                  {{ template.typeName }}
                </span>
              </div>
              <!-- Edit overlay -->
              <div class="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all flex items-center justify-center">
                <span class="opacity-0 group-hover:opacity-100 transition-opacity text-white bg-primary-600/90 px-3 py-1.5 rounded-lg text-xs font-medium">
                  编辑模板
                </span>
              </div>
            </div>
            <!-- Card body -->
            <div class="p-4">
              <h3 class="text-sm font-semibold text-gray-900 mb-1 truncate">{{ template.name }}</h3>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-1.5 text-xs text-gray-400">
                  <UIcon name="i-lucide-clock" class="w-3 h-3" />
                  <span>{{ template.lastModified }}</span>
                </div>
                <UIcon name="i-lucide-arrow-right" class="w-4 h-4 text-gray-300 group-hover:text-primary-500 transition-colors" />
              </div>
            </div>
          </NuxtLink>
        </div>

        <!-- Empty state -->
        <div
          v-if="filteredTemplates.length === 0"
          class="flex flex-col items-center justify-center py-20"
        >
          <UIcon name="i-lucide-palette" class="w-12 h-12 text-gray-300 mb-4" />
          <p class="text-gray-400 text-lg mb-2">暂无模板</p>
          <p class="text-gray-300 text-sm">该分类下暂无配置的模板</p>
        </div>
      </div>
    </div>
  </div>
</template>
