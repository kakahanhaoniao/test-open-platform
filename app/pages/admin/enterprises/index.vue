<script setup lang="ts">
import { adminEnterprises } from '~/data/mock'

useHead({ title: '企业客户管理 - 奇安信AI运营后台' })

const searchQuery = ref('')
const selectedStatus = ref('all')
const selectedIndustry = ref('all')
const selectedScale = ref('all')

const statusOptions = [
  { value: 'all', label: '全部' },
  { value: 'active', label: '已认证' },
  { value: 'pending', label: '待认证' },
  { value: 'disabled', label: '已禁用' }
]

const industryOptions = [
  { value: 'all', label: '全部' },
  { value: '网络安全', label: '网络安全' },
  { value: '金融', label: '金融' },
  { value: '能源', label: '能源' },
  { value: '政府', label: '政府' },
  { value: '制造', label: '制造' },
  { value: '通信', label: '通信' },
  { value: '医疗', label: '医疗' },
  { value: '教育', label: '教育' }
]

const scaleOptions = [
  { value: 'all', label: '全部' },
  { value: '50人以下', label: '100人以下' },
  { value: '100-500人', label: '100-500人' },
  { value: '500人以上', label: '500人以上' }
]

const totalEnterprises = adminEnterprises.length
const verifiedCount = adminEnterprises.filter(e => e.status === 'active').length
const newThisMonth = adminEnterprises.filter(e => {
  const created = new Date(e.createdAt)
  const now = new Date()
  return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
}).length
const pendingCount = adminEnterprises.filter(e => e.status === 'pending').length

const filteredEnterprises = computed(() => {
  let result = [...adminEnterprises]
  if (selectedStatus.value !== 'all') {
    result = result.filter(e => e.status === selectedStatus.value)
  }
  if (selectedIndustry.value !== 'all') {
    result = result.filter(e => e.industry === selectedIndustry.value)
  }
  if (selectedScale.value !== 'all') {
    result = result.filter(e => {
      if (selectedScale.value === '50人以下') return e.scale === '50人以下' || e.scale === '50-100人'
      if (selectedScale.value === '100-500人') return e.scale === '100-200人' || e.scale === '200-500人'
      if (selectedScale.value === '500人以上') return e.scale === '500-1000人' || e.scale === '1000人以上'
      return true
    })
  }
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(e =>
      e.name.toLowerCase().includes(q) ||
      e.industry.toLowerCase().includes(q) ||
      e.contactName.toLowerCase().includes(q)
    )
  }
  return result
})

function getStatusBadge(status: string) {
  if (status === 'active') return 'bg-green-50 text-green-700'
  if (status === 'pending') return 'bg-amber-50 text-amber-700'
  if (status === 'disabled') return 'bg-red-50 text-red-700'
  return 'bg-gray-50 text-gray-600'
}

function getStatusLabel(status: string) {
  if (status === 'active') return '已认证'
  if (status === 'pending') return '待认证'
  if (status === 'disabled') return '已禁用'
  return status
}

function formatCost(cost: number) {
  return `¥${cost.toLocaleString()}`
}

function formatTokens(tokens: number) {
  if (tokens >= 100000000) return `${(tokens / 100000000).toFixed(1)}亿`
  if (tokens >= 10000) return `${(tokens / 10000).toFixed(0)}万`
  return tokens.toLocaleString()
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
            <h1 class="text-2xl font-bold text-gray-900 mb-1">企业客户管理</h1>
            <p class="text-gray-500 text-sm">管理平台企业客户、审核认证与用量监控</p>
          </div>
        </div>

        <!-- Stat cards -->
        <div class="grid grid-cols-4 gap-5 mb-8">
          <!-- 企业总数 -->
          <div class="bg-white rounded-xl border border-gray-100 p-5">
            <div class="flex items-center gap-4">
              <div class="w-11 h-11 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                <UIcon name="i-lucide-building-2" class="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">企业总数</p>
                <p class="text-2xl font-bold text-gray-900">{{ totalEnterprises }}</p>
              </div>
            </div>
          </div>

          <!-- 已认证 -->
          <div class="bg-white rounded-xl border border-gray-100 p-5">
            <div class="flex items-center gap-4">
              <div class="w-11 h-11 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                <UIcon name="i-lucide-badge-check" class="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">已认证</p>
                <p class="text-2xl font-bold text-gray-900">{{ verifiedCount }}</p>
              </div>
            </div>
          </div>

          <!-- 本月新增 -->
          <div class="bg-white rounded-xl border border-gray-100 p-5">
            <div class="flex items-center gap-4">
              <div class="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                <UIcon name="i-lucide-user-plus" class="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">本月新增</p>
                <p class="text-2xl font-bold text-gray-900">{{ newThisMonth }}</p>
              </div>
            </div>
          </div>

          <!-- 待审核 -->
          <div class="bg-white rounded-xl border border-gray-100 p-5">
            <div class="flex items-center gap-4">
              <div class="w-11 h-11 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                <UIcon name="i-lucide-clock" class="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">待审核</p>
                <p class="text-2xl font-bold text-gray-900">{{ pendingCount }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Search + filters -->
        <div class="bg-white rounded-xl border border-gray-100 p-5 mb-6">
          <div class="flex flex-col lg:flex-row gap-4">
            <!-- Search -->
            <div class="flex-1 relative">
              <UIcon name="i-lucide-search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="搜索企业名、行业、联系人..."
                class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all"
              >
            </div>

            <!-- Status filter -->
            <select
              v-model="selectedStatus"
              class="px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 focus:outline-none focus:border-primary-300"
            >
              <option value="all">认证状态: 全部</option>
              <option v-for="s in statusOptions.filter(s => s.value !== 'all')" :key="s.value" :value="s.value">
                {{ s.label }}
              </option>
            </select>

            <!-- Industry filter -->
            <select
              v-model="selectedIndustry"
              class="px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 focus:outline-none focus:border-primary-300"
            >
              <option value="all">行业: 全部</option>
              <option v-for="ind in industryOptions.filter(i => i.value !== 'all')" :key="ind.value" :value="ind.value">
                {{ ind.label }}
              </option>
            </select>

            <!-- Scale filter -->
            <select
              v-model="selectedScale"
              class="px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 focus:outline-none focus:border-primary-300"
            >
              <option v-for="sc in scaleOptions" :key="sc.value" :value="sc.value">
                规模: {{ sc.label }}
              </option>
            </select>
          </div>
        </div>

        <!-- Results count -->
        <div class="flex items-center justify-between mb-4">
          <p class="text-sm text-gray-400">共 {{ filteredEnterprises.length }} 家企业</p>
        </div>

        <!-- Enterprise table -->
        <div class="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="bg-gray-50/80">
                  <th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">企业名称</th>
                  <th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">行业</th>
                  <th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">规模</th>
                  <th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">成员数</th>
                  <th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">月消耗</th>
                  <th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">充能包余额</th>
                  <th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">认证状态</th>
                  <th class="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="enterprise in filteredEnterprises"
                  :key="enterprise.id"
                  class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                >
                  <td class="py-4 px-4">
                    <NuxtLink
                      :to="`/admin/enterprises/${enterprise.id}`"
                      class="flex items-center gap-3 group"
                    >
                      <div class="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                        <UIcon name="i-lucide-building-2" class="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p class="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors">{{ enterprise.name }}</p>
                        <p class="text-xs text-gray-400">{{ enterprise.contactName }}</p>
                      </div>
                    </NuxtLink>
                  </td>
                  <td class="py-4 px-4 text-sm text-gray-600">{{ enterprise.industry }}</td>
                  <td class="py-4 px-4 text-sm text-gray-600">{{ enterprise.scale }}</td>
                  <td class="py-4 px-4 text-sm text-gray-600">{{ enterprise.memberCount }}人</td>
                  <td class="py-4 px-4 text-sm text-gray-900 font-medium">{{ formatCost(enterprise.monthlyCost) }}</td>
                  <td class="py-4 px-4 text-sm text-gray-600">{{ formatTokens(enterprise.packBalance) }}</td>
                  <td class="py-4 px-4">
                    <span :class="['px-2 py-0.5 rounded-full text-xs font-medium', getStatusBadge(enterprise.status)]">
                      {{ getStatusLabel(enterprise.status) }}
                    </span>
                  </td>
                  <td class="py-4 px-4">
                    <div class="flex items-center justify-end gap-2">
                      <NuxtLink
                        :to="`/admin/enterprises/${enterprise.id}`"
                        class="px-2 py-1 text-xs text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded transition-colors"
                      >
                        查看
                      </NuxtLink>
                      <button
                        v-if="enterprise.status === 'pending'"
                        class="px-2 py-1 text-xs text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors"
                      >
                        审核
                      </button>
                      <button
                        v-if="enterprise.status === 'active'"
                        class="px-2 py-1 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        禁用
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Empty state -->
        <div
          v-if="filteredEnterprises.length === 0"
          class="flex flex-col items-center justify-center py-20"
        >
          <UIcon name="i-lucide-search-x" class="w-12 h-12 text-gray-300 mb-4" />
          <p class="text-gray-400 text-lg mb-2">未找到匹配的企业</p>
          <p class="text-gray-300 text-sm">请尝试调整搜索条件或筛选类型</p>
        </div>
      </div>
    </div>
  </div>
</template>
