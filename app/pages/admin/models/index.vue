<script setup lang="ts">
import { models, modelTypes } from '~/data/mock'

useHead({ title: '模型管理 - 奇安信AI运营后台' })

const searchQuery = ref('')
const selectedType = ref('all')
const selectedStatus = ref('all')

const modelStatuses = [
  { value: 'all', label: '全部状态' },
  { value: 'online', label: '上线' },
  { value: 'offline', label: '下线' },
  { value: 'reviewing', label: '审核中' }
]

// Assign mock statuses to models
const modelAdminData = models.map((m, i) => ({
  ...m,
  status: i < 6 ? 'online' : (i < 8 ? 'offline' : 'reviewing'),
  callCountNum: [1280, 860, 520, 380, 720, 290, 670, 280, 340, 2100][i]
}))

const filteredModels = computed(() => {
  let result = [...modelAdminData]
  if (selectedType.value !== 'all') {
    result = result.filter(m => m.type === selectedType.value)
  }
  if (selectedStatus.value !== 'all') {
    result = result.filter(m => m.status === selectedStatus.value)
  }
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(m =>
      m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q)
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
</script>

<template>
  <div class="min-h-screen bg-[#FAFAFA]">
    <AdminSidebar />
    <div class="ml-60">
      <div class="p-6 md:p-8">
        <!-- Page header -->
        <div class="flex items-center justify-between mb-8">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 mb-1">模型管理</h1>
            <p class="text-gray-500 text-sm">管理平台所有AI安全模型的上下线与配置</p>
          </div>
          <button class="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
            <UIcon name="i-lucide-plus" class="w-4 h-4" />
            新增模型
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
                placeholder="搜索模型名称..."
                class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all"
              >
            </div>

            <!-- Type filter -->
            <select
              v-model="selectedType"
              class="px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 focus:outline-none focus:border-primary-300"
            >
              <option value="all">全部类型</option>
              <option v-for="t in modelTypes.filter(t => t.value !== 'all')" :key="t.value" :value="t.value">
                {{ t.label }}
              </option>
            </select>

            <!-- Status filter -->
            <select
              v-model="selectedStatus"
              class="px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 focus:outline-none focus:border-primary-300"
            >
              <option v-for="s in modelStatuses" :key="s.value" :value="s.value">
                {{ s.label }}
              </option>
            </select>
          </div>
        </div>

        <!-- Results count -->
        <div class="flex items-center justify-between mb-4">
          <p class="text-sm text-gray-400">共 {{ filteredModels.length }} 个模型</p>
        </div>

        <!-- Table -->
        <div class="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="bg-gray-50/80">
                  <th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">模型名称</th>
                  <th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">类型</th>
                  <th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">参数量</th>
                  <th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                  <th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">调用量</th>
                  <th class="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="model in filteredModels"
                  :key="model.id"
                  class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                >
                  <td class="py-4 px-4">
                    <div class="flex items-center gap-3">
                      <div class="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                        <UIcon :name="model.icon" class="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p class="text-sm font-medium text-gray-900">{{ model.name }}</p>
                        <p class="text-xs text-gray-400">{{ model.provider }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="py-4 px-4">
                    <span class="px-2 py-0.5 rounded text-xs font-medium" :style="{ backgroundColor: model.typeColor + '15', color: model.typeColor }">
                      {{ model.typeName }}
                    </span>
                  </td>
                  <td class="py-4 px-4 text-sm text-gray-600">{{ model.parameters }}</td>
                  <td class="py-4 px-4">
                    <span :class="['px-2 py-0.5 rounded-full text-xs font-medium', getStatusBadge(model.status)]">
                      {{ getStatusLabel(model.status) }}
                    </span>
                  </td>
                  <td class="py-4 px-4 text-sm text-gray-600">{{ model.callCountNum }}万+</td>
                  <td class="py-4 px-4">
                    <div class="flex items-center justify-end gap-2">
                      <button class="px-2 py-1 text-xs text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors">
                        编辑
                      </button>
                      <button
                        v-if="model.status === 'online'"
                        class="px-2 py-1 text-xs text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        下线
                      </button>
                      <button
                        v-else-if="model.status === 'offline'"
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
                        :to="`/admin/models/${model.id}/template`"
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
          v-if="filteredModels.length === 0"
          class="flex flex-col items-center justify-center py-20"
        >
          <UIcon name="i-lucide-search-x" class="w-12 h-12 text-gray-300 mb-4" />
          <p class="text-gray-400 text-lg mb-2">未找到匹配的模型</p>
          <p class="text-gray-300 text-sm">请尝试调整搜索条件或筛选类型</p>
        </div>
      </div>
    </div>
  </div>
</template>
