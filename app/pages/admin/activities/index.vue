<script setup lang="ts">
import { activities } from '~/data/mock'

useHead({ title: '活动管理 - 奇安信AI运营后台' })

const searchQuery = ref('')

const activityAdminData = activities.map((a, i) => {
  const now = new Date('2026-07-11')
  const start = new Date(a.startDate)
  const end = new Date(a.endDate)
  let status = 'ongoing'
  if (now < start) status = 'upcoming'
  else if (now > end) status = 'ended'
  return { ...a, adminStatus: status }
})

const filteredActivities = computed(() => {
  let result = [...activityAdminData]
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(a =>
      a.title.toLowerCase().includes(q) || a.subtitle.toLowerCase().includes(q)
    )
  }
  return result
})

function getStatusBadge(status: string) {
  if (status === 'ongoing') return 'bg-green-50 text-green-700'
  if (status === 'upcoming') return 'bg-amber-50 text-amber-700'
  if (status === 'ended') return 'bg-gray-100 text-gray-500'
  return 'bg-gray-50 text-gray-600'
}

function getStatusLabel(status: string) {
  if (status === 'ongoing') return '进行中'
  if (status === 'upcoming') return '未开始'
  if (status === 'ended') return '已结束'
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
            <h1 class="text-2xl font-bold text-gray-900 mb-1">活动管理</h1>
            <p class="text-gray-500 text-sm">管理平台营销活动的创建、配置与上下线</p>
          </div>
          <button class="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
            <UIcon name="i-lucide-plus" class="w-4 h-4" />
            创建活动
          </button>
        </div>

        <!-- Filter bar -->
        <div class="bg-white rounded-xl border border-gray-100 p-5 mb-6">
          <div class="flex flex-col lg:flex-row gap-4">
            <div class="flex-1 relative">
              <UIcon name="i-lucide-search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="搜索活动名称..."
                class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all"
              >
            </div>
          </div>
        </div>

        <!-- Results count -->
        <div class="flex items-center justify-between mb-4">
          <p class="text-sm text-gray-400">共 {{ filteredActivities.length }} 个活动</p>
        </div>

        <!-- Table -->
        <div class="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="bg-gray-50/80">
                  <th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">活动名称</th>
                  <th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">折扣</th>
                  <th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                  <th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">时间范围</th>
                  <th class="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="activity in filteredActivities"
                  :key="activity.id"
                  class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                >
                  <td class="py-4 px-4">
                    <div class="flex items-center gap-3">
                      <div class="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                        <UIcon :name="activity.icon" class="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p class="text-sm font-medium text-gray-900">{{ activity.title }}</p>
                        <p class="text-xs text-gray-400">{{ activity.subtitle }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="py-4 px-4">
                    <span class="px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-600">
                      {{ activity.discount }}
                    </span>
                  </td>
                  <td class="py-4 px-4">
                    <span :class="['px-2 py-0.5 rounded-full text-xs font-medium', getStatusBadge(activity.adminStatus)]">
                      {{ getStatusLabel(activity.adminStatus) }}
                    </span>
                  </td>
                  <td class="py-4 px-4">
                    <p class="text-sm text-gray-600">{{ activity.startDate }} ~ {{ activity.endDate }}</p>
                  </td>
                  <td class="py-4 px-4">
                    <div class="flex items-center justify-end gap-2">
                      <button class="px-2 py-1 text-xs text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors">
                        编辑
                      </button>
                      <button
                        v-if="activity.adminStatus === 'ongoing'"
                        class="px-2 py-1 text-xs text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        结束
                      </button>
                      <button
                        v-if="activity.adminStatus === 'upcoming'"
                        class="px-2 py-1 text-xs text-gray-500 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                      >
                        提前开始
                      </button>
                      <NuxtLink
                        :to="`/admin/activities/${activity.id}/template`"
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
          v-if="filteredActivities.length === 0"
          class="flex flex-col items-center justify-center py-20"
        >
          <UIcon name="i-lucide-search-x" class="w-12 h-12 text-gray-300 mb-4" />
          <p class="text-gray-400 text-lg mb-2">未找到匹配的活动</p>
          <p class="text-gray-300 text-sm">请尝试调整搜索条件</p>
        </div>
      </div>
    </div>
  </div>
</template>
