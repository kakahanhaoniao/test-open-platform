<script setup lang="ts">
useHead({ title: '订单管理 - 奇安信AI运营后台' })

const dateRange = ref('')
const statusFilter = ref('all')
const typeFilter = ref('all')

const statusOptions = [
  { value: 'all', label: '全部状态' },
  { value: 'completed', label: '已完成' },
  { value: 'processing', label: '处理中' },
  { value: 'refunded', label: '已退款' },
  { value: 'cancelled', label: '已取消' }
]

const typeOptions = [
  { value: 'all', label: '全部类型' },
  { value: 'charging-pack', label: '充能包' },
  { value: 'model', label: '模型调用' },
  { value: 'app', label: '应用订阅' }
]

const orders = [
  { id: 'ORD-20260711001', user: '张三', email: 'zhangsan@company.com', type: 'charging-pack', typeName: '充能包', detail: '专业包 500万Token', amount: '¥399', status: 'completed', time: '2026-07-11 14:32:18' },
  { id: 'ORD-20260711002', user: '李四', email: 'lisi@corp.cn', type: 'model', typeName: '模型调用', detail: '安全大模型调用', amount: '¥128', status: 'processing', time: '2026-07-11 13:15:42' },
  { id: 'ORD-20260710003', user: '王五', email: 'wangwu@tech.io', type: 'charging-pack', typeName: '充能包', detail: '企业包 2000万Token', amount: '¥1,499', status: 'completed', time: '2026-07-10 18:45:33' },
  { id: 'ORD-20260710004', user: '赵六', email: 'zhaoliu@sec.com', type: 'app', typeName: '应用订阅', detail: '智能安全运营中心', amount: '¥99', status: 'refunded', time: '2026-07-10 11:22:07' },
  { id: 'ORD-20260709005', user: '孙七', email: 'sunqi@dev.net', type: 'model', typeName: '模型调用', detail: '威胁检测模型V3', amount: '¥56', status: 'completed', time: '2026-07-09 09:30:55' },
  { id: 'ORD-20260709006', user: '周八', email: 'zhouba@info.cn', type: 'charging-pack', typeName: '充能包', detail: '体验包 100万Token', amount: '¥99', status: 'completed', time: '2026-07-09 08:12:44' },
  { id: 'ORD-20260708007', user: '吴九', email: 'wujiu@safe.org', type: 'app', typeName: '应用订阅', detail: '威胁情报助手', amount: '¥199', status: 'completed', time: '2026-07-08 16:48:21' },
  { id: 'ORD-20260708008', user: '郑十', email: 'zhengshi@cyber.com', type: 'model', typeName: '模型调用', detail: '漏洞分析专家', amount: '¥32', status: 'cancelled', time: '2026-07-08 14:33:19' },
  { id: 'ORD-20260707009', user: '陈明', email: 'chenming@data.cn', type: 'charging-pack', typeName: '充能包', detail: '无限包', amount: '¥4,999', status: 'completed', time: '2026-07-07 10:05:37' },
  { id: 'ORD-20260707010', user: '林华', email: 'linhua@sec.io', type: 'model', typeName: '模型调用', detail: '代码安全扫描模型', amount: '¥78', status: 'processing', time: '2026-07-07 09:22:15' },
  { id: 'ORD-20260706011', user: '黄强', email: 'huangqiang@it.com', type: 'app', typeName: '应用订阅', detail: '漏洞扫描工具', amount: '¥149', status: 'completed', time: '2026-07-06 17:55:42' },
  { id: 'ORD-20260706012', user: '刘芳', email: 'liufang@corp.cn', type: 'charging-pack', typeName: '充能包', detail: '专业包 500万Token', amount: '¥399', status: 'refunded', time: '2026-07-06 11:18:33' }
]

const filteredOrders = computed(() => {
  let result = [...orders]
  if (statusFilter.value !== 'all') {
    result = result.filter(o => o.status === statusFilter.value)
  }
  if (typeFilter.value !== 'all') {
    result = result.filter(o => o.type === typeFilter.value)
  }
  return result
})

function getStatusBadge(status: string) {
  if (status === 'completed') return 'bg-green-50 text-green-700'
  if (status === 'processing') return 'bg-amber-50 text-amber-700'
  if (status === 'refunded') return 'bg-gray-100 text-gray-500'
  if (status === 'cancelled') return 'bg-red-50 text-red-600'
  return 'bg-gray-50 text-gray-600'
}

function getStatusLabel(status: string) {
  if (status === 'completed') return '已完成'
  if (status === 'processing') return '处理中'
  if (status === 'refunded') return '已退款'
  if (status === 'cancelled') return '已取消'
  return status
}

function getTypeBadge(type: string) {
  if (type === 'charging-pack') return 'bg-primary-50 text-primary-600'
  if (type === 'model') return 'bg-blue-50 text-blue-600'
  if (type === 'app') return 'bg-accent-50 text-accent-600'
  return 'bg-gray-50 text-gray-600'
}

// Summary stats
const totalRevenue = computed(() => {
  return orders.filter(o => o.status === 'completed').reduce((sum, o) => {
    const amount = parseFloat(o.amount.replace(/[¥,]/g, ''))
    return sum + amount
  }, 0)
})

const completedCount = computed(() => orders.filter(o => o.status === 'completed').length)
const processingCount = computed(() => orders.filter(o => o.status === 'processing').length)
const refundedCount = computed(() => orders.filter(o => o.status === 'refunded').length)
</script>

<template>
  <div class="min-h-screen bg-[#FAFAFA]">
    <AdminSidebar />
    <div class="ml-60">
      <div class="p-6 md:p-8">
        <!-- Page header -->
        <div class="mb-8">
          <h1 class="text-2xl font-bold text-gray-900 mb-1">订单管理</h1>
          <p class="text-gray-500 text-sm">查看与管理平台所有订单记录</p>
        </div>

        <!-- Summary stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-white rounded-xl border border-gray-100 p-4">
            <p class="text-xs text-gray-400 mb-1">总收入(已完成)</p>
            <p class="text-xl font-bold text-gray-900">¥{{ totalRevenue.toLocaleString() }}</p>
          </div>
          <div class="bg-white rounded-xl border border-gray-100 p-4">
            <p class="text-xs text-gray-400 mb-1">已完成订单</p>
            <p class="text-xl font-bold text-green-600">{{ completedCount }}</p>
          </div>
          <div class="bg-white rounded-xl border border-gray-100 p-4">
            <p class="text-xs text-gray-400 mb-1">处理中订单</p>
            <p class="text-xl font-bold text-amber-600">{{ processingCount }}</p>
          </div>
          <div class="bg-white rounded-xl border border-gray-100 p-4">
            <p class="text-xs text-gray-400 mb-1">已退款</p>
            <p class="text-xl font-bold text-gray-500">{{ refundedCount }}</p>
          </div>
        </div>

        <!-- Filter bar -->
        <div class="bg-white rounded-xl border border-gray-100 p-5 mb-6">
          <div class="flex flex-col lg:flex-row gap-4">
            <div class="flex-1 relative">
              <UIcon name="i-lucide-calendar" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                v-model="dateRange"
                type="text"
                placeholder="选择日期范围 (如: 2026-07-01 ~ 2026-07-11)"
                class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all"
              >
            </div>
            <select
              v-model="statusFilter"
              class="px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 focus:outline-none focus:border-primary-300"
            >
              <option v-for="s in statusOptions" :key="s.value" :value="s.value">{{ s.label }}</option>
            </select>
            <select
              v-model="typeFilter"
              class="px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 focus:outline-none focus:border-primary-300"
            >
              <option v-for="t in typeOptions" :key="t.value" :value="t.value">{{ t.label }}</option>
            </select>
          </div>
        </div>

        <!-- Results count -->
        <div class="flex items-center justify-between mb-4">
          <p class="text-sm text-gray-400">共 {{ filteredOrders.length }} 条订单</p>
        </div>

        <!-- Table -->
        <div class="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="bg-gray-50/80">
                  <th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">订单号</th>
                  <th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">用户</th>
                  <th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">类型</th>
                  <th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">详情</th>
                  <th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">金额</th>
                  <th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                  <th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">时间</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="order in filteredOrders"
                  :key="order.id"
                  class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                >
                  <td class="py-3.5 px-4 text-sm text-gray-700 font-mono">{{ order.id }}</td>
                  <td class="py-3.5 px-4">
                    <div>
                      <p class="text-sm text-gray-700">{{ order.user }}</p>
                      <p class="text-xs text-gray-400">{{ order.email }}</p>
                    </div>
                  </td>
                  <td class="py-3.5 px-4">
                    <span :class="['px-2 py-0.5 rounded text-xs font-medium', getTypeBadge(order.type)]">
                      {{ order.typeName }}
                    </span>
                  </td>
                  <td class="py-3.5 px-4 text-sm text-gray-600">{{ order.detail }}</td>
                  <td class="py-3.5 px-4 text-sm text-gray-900 font-medium">{{ order.amount }}</td>
                  <td class="py-3.5 px-4">
                    <span :class="['px-2 py-0.5 rounded-full text-xs font-medium', getStatusBadge(order.status)]">
                      {{ getStatusLabel(order.status) }}
                    </span>
                  </td>
                  <td class="py-3.5 px-4 text-sm text-gray-400">{{ order.time }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Empty state -->
        <div
          v-if="filteredOrders.length === 0"
          class="flex flex-col items-center justify-center py-20"
        >
          <UIcon name="i-lucide-inbox" class="w-12 h-12 text-gray-300 mb-4" />
          <p class="text-gray-400 text-lg mb-2">暂无匹配的订单</p>
          <p class="text-gray-300 text-sm">请尝试调整筛选条件</p>
        </div>
      </div>
    </div>
  </div>
</template>
