<script setup lang="ts">
import { apps, appTypes } from '~/data/mock'

useHead({ title: '应用管理 - 奇安信AI运营后台' })

const searchQuery = ref('')
const selectedType = ref('all')
const selectedStatus = ref('all')

const appStatuses = [
  { value: 'all', label: '全部状态' },
  { value: 'online', label: '上线' },
  { value: 'offline', label: '下线' },
  { value: 'reviewing', label: '审核中' }
]

// Assign mock statuses and type labels to apps
const appAdminData = apps.map((a, i) => ({
  ...a,
  status: i < 5 ? 'online' : (i < 7 ? 'offline' : 'reviewing'),
  useCountNum: [56, 38, 92, 28, 63, 47, 32, 28][i],
  typeLabel: a.type === 'chat' ? '对话' : a.type === 'tool' ? '工具' : a.type === 'showcase' ? '展示' : '外链'
}))

const filteredApps = computed(() => {
  let result = [...appAdminData]
  if (selectedType.value !== 'all') {
    result = result.filter(a => a.type === selectedType.value)
  }
  if (selectedStatus.value !== 'all') {
    result = result.filter(a => a.status === selectedStatus.value)
  }
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(a =>
      a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q)
    )
  }
  return result
})

function getStatusBadge(status: string) {
  if (status === 'online') return 'bg-green-50 text-green-700'
  if (status === 'offline') return 'bg-gray-100 text-gray-500'
  if (status === 'reviewing') return 'bg-amber-50 text-amber-700'
  return 'bg-gray-50 text-gray-600'
}

function getStatusLabel(status: string) {
  if (status === 'online') return '上线'
  if (status === 'offline') return '下线'
  if (status === 'reviewing') return '审核中'
  return status
}

function getTypeBadge(type: string) {
  if (type === 'chat') return 'bg-primary-50 text-primary-600'
  if (type === 'tool') return 'bg-amber-50 text-amber-600'
  if (type === 'showcase') return 'bg-green-50 text-green-600'
  if (type === 'external-link') return 'bg-blue-50 text-blue-600'
  return 'bg-gray-50 text-gray-600'
}
</script>

<template>
  <div class="min-h-screen bg-[#FAFAFA]">
    <AdminSidebar />
    <div class="ml-60">
      <div class="p-6 md:p-8">
        <!-- Page header -->
        <div class="flex items-center justify-between mb-8">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 mb-1">应用管理</h1>
            <p class="text-gray-500 text-sm">管理平台所有应用的上下线与配置</p>
          </div>
          <button class="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
            <UIcon name="i-lucide-plus" class="w-4 h-4" />
            新增应用
          </button>
        </div>

        <!-- Filter bar -->
        <div class="bg-white rounded-xl border border-gray-100 p-5 mb-6">
          <div class="flex flex-col lg:flex-row gap-4">
            <!-- Search -->
            <div class="flex-1 relative">
              <UIcon name="i-lucide-search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="搜索应用名称..."
                class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all"
              >
            </div>

            <!-- Type filter -->
            <select
              v-model="selectedType"
              class="px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 focus:outline-none focus:border-primary-300"
            >
              <option value="all">全部类型</option>
              <option v-for="t in appTypes.filter(t => t.value !== 'all')" :key="t.value" :value="t.value">
                {{ t.label }}
              </option>
            </select>

            <!-- Status filter -->
            <select
              v-model="selectedStatus"
              class="px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 focus:outline-none focus:border-primary-300"
            >
              <option v-for="s in appStatuses" :key="s.value" :value="s.value">
                {{ s.label }}
              </option>
            </select>
          </div>
        </div>

        <!-- Results count -->
        <div class="flex items-center justify-between mb-4">
          <p class="text-sm text-gray-400">共 {{ filteredApps.length }} 个应用</p>
        </div>

        <!-- Table -->
        <div class="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="bg-gray-50/80">
                  <th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">应用名称</th>
                  <th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">应用类型</th>
                  <th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                  <th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">使用量</th>
                  <th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">评分</th>
                  <th class="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="app in filteredApps"
                  :key="app.id"
                  class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                >
                  <td class="py-4 px-4">
                    <div class="flex items-center gap-3">
                      <div class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" :style="{ backgroundColor: app.typeColor + '15' }">
                        <UIcon :name="app.icon" class="w-5 h-5" :style="{ color: app.typeColor }" />
                      </div>
                      <div>
                        <p class="text-sm font-medium text-gray-900">{{ app.name }}</p>
                        <p class="text-xs text-gray-400 line-clamp-1 max-w-[200px]">{{ app.description }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="py-4 px-4">
                    <span :class="['px-2 py-0.5 rounded text-xs font-medium', getTypeBadge(app.type)]">
                      {{ app.typeLabel }}
                    </span>
                  </td>
                  <td class="py-4 px-4">
                    <span :class="['px-2 py-0.5 rounded-full text-xs font-medium', getStatusBadge(app.status)]">
                      {{ getStatusLabel(app.status) }}
                    </span>
                  </td>
                  <td class="py-4 px-4 text-sm text-gray-600">{{ app.useCountNum }}万+</td>
                  <td class="py-4 px-4">
                    <div class="flex items-center gap-1">
                      <UIcon name="i-lucide-star" class="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span class="text-sm text-gray-700">{{ app.rating }}</span>
                    </div>
                  </td>
                  <td class="py-4 px-4">
                    <div class="flex items-center justify-end gap-2">
                      <button class="px-2 py-1 text-xs text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors">
                        编辑
                      </button>
                      <button
                        v-if="app.status === 'online'"
                        class="px-2 py-1 text-xs text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        下线
                      </button>
                      <button
                        v-else-if="app.status === 'offline'"
                        class="px-2 py-1 text-xs text-gray-500 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                      >
                        上架
                      </button>
                      <button
                        v-else
                        class="px-2 py-1 text-xs text-gray-500 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                      >
                        通过
                      </button>
                      <NuxtLink
                        :to="`/admin/apps/${app.id}/template`"
                        class="px-2 py-1 text-xs text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded transition-colors"
                      >
                        配置详情页
                      </NuxtLink>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
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
    </div>
  </div>
</template>
