<script setup lang="ts">
import { models, apps, activities, chargingPacks } from '~/data/mock'

useHead({ title: '数据看板 - 奇安信AI运营后台' })

const stats = [
  { label: '模型总数', value: models.length, icon: 'i-lucide-brain', color: 'bg-primary-50 text-primary-600' },
  { label: '应用总数', value: apps.length, icon: 'i-lucide-layout-grid', color: 'bg-accent-50 text-accent-600' },
  { label: '活跃活动', value: activities.filter(a => a.hot).length, icon: 'i-lucide-flame', color: 'bg-red-50 text-red-600' },
  { label: '本月收入', value: '¥128,560', icon: 'i-lucide-banknote', color: 'bg-green-50 text-green-600' },
  { label: 'API调用量', value: '2,847万', icon: 'i-lucide-activity', color: 'bg-blue-50 text-blue-600' },
  { label: '注册用户数', value: '15,832', icon: 'i-lucide-users', color: 'bg-amber-50 text-amber-600' }
]

const chartBars = [
  { label: '1月', value: 65 },
  { label: '2月', value: 78 },
  { label: '3月', value: 52 },
  { label: '4月', value: 90 },
  { label: '5月', value: 85 },
  { label: '6月', value: 95 },
  { label: '7月', value: 100 }
]

const recentOrders = [
  { id: 'ORD-20260711001', user: '张三', type: '充能包', amount: '¥399', status: '已完成', time: '2026-07-11 14:32' },
  { id: 'ORD-20260711002', user: '李四', type: '模型调用', amount: '¥128', status: '处理中', time: '2026-07-11 13:15' },
  { id: 'ORD-20260710003', user: '王五', type: '充能包', amount: '¥1,499', status: '已完成', time: '2026-07-10 18:45' },
  { id: 'ORD-20260710004', user: '赵六', type: '应用订阅', amount: '¥99', status: '已退款', time: '2026-07-10 11:22' },
  { id: 'ORD-20260709005', user: '孙七', type: '模型调用', amount: '¥56', status: '已完成', time: '2026-07-09 09:30' }
]

const recentActivities = [
  { title: '夏季安全嘉年华活动上线', time: '2小时前', type: '活动' },
  { title: '威胁检测模型V3审核通过', time: '3小时前', type: '模型' },
  { title: 'AI代码审计助手新增上线', time: '5小时前', type: '应用' },
  { title: '企业包充能包价格调整', time: '1天前', type: '定价' },
  { title: '钓鱼识别模型参数更新', time: '1天前', type: '模型' }
]

function getStatusClass(status: string) {
  if (status === '已完成') return 'bg-green-50 text-green-700'
  if (status === '处理中') return 'bg-amber-50 text-amber-700'
  if (status === '已退款') return 'bg-gray-50 text-gray-600'
  return 'bg-gray-50 text-gray-600'
}

function getActivityTypeColor(type: string) {
  if (type === '活动') return 'bg-primary-50 text-primary-600'
  if (type === '模型') return 'bg-blue-50 text-blue-600'
  if (type === '应用') return 'bg-accent-50 text-accent-600'
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
          <h1 class="text-2xl font-bold text-gray-900 mb-1">数据看板</h1>
          <p class="text-gray-500 text-sm">平台运营数据概览与实时监控</p>
        </div>

        <!-- Stats row -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="bg-white rounded-xl border border-gray-100 p-4 card-hover"
          >
            <div class="flex items-center justify-between mb-3">
              <div :class="['w-9 h-9 rounded-lg flex items-center justify-center', stat.color]">
                <UIcon :name="stat.icon" class="w-5 h-5" />
              </div>
            </div>
            <p class="text-2xl font-bold text-gray-900 mb-1">{{ stat.value }}</p>
            <p class="text-xs text-gray-400">{{ stat.label }}</p>
          </div>
        </div>

        <!-- Chart + Recent Activities -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <!-- Chart placeholder -->
          <div class="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-base font-semibold text-gray-900">API调用量趋势</h2>
              <div class="flex items-center gap-2 text-xs text-gray-400">
                <span class="w-3 h-3 rounded-sm bg-primary-500 inline-block"></span>
                调用量(万次)
              </div>
            </div>
            <div class="flex items-end gap-3 h-48">
              <div
                v-for="bar in chartBars"
                :key="bar.label"
                class="flex-1 flex flex-col items-center gap-2"
              >
                <div class="w-full relative group">
                  <div
                    class="w-full rounded-t-md bg-gradient-to-t from-primary-600 to-primary-400 transition-all duration-300 group-hover:from-primary-700 group-hover:to-primary-500"
                    :style="{ height: (bar.value / 100 * 160) + 'px' }"
                  />
                  <div class="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    {{ bar.value }}
                  </div>
                </div>
                <span class="text-xs text-gray-400">{{ bar.label }}</span>
              </div>
            </div>
          </div>

          <!-- Recent activities -->
          <div class="bg-white rounded-xl border border-gray-100 p-6">
            <h2 class="text-base font-semibold text-gray-900 mb-4">最近动态</h2>
            <div class="space-y-4">
              <div
                v-for="(act, idx) in recentActivities"
                :key="idx"
                class="flex items-start gap-3"
              >
                <div :class="['px-2 py-0.5 rounded text-xs font-medium shrink-0 mt-0.5', getActivityTypeColor(act.type)]">
                  {{ act.type }}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm text-gray-700 truncate">{{ act.title }}</p>
                  <p class="text-xs text-gray-400 mt-0.5">{{ act.time }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent orders table -->
        <div class="bg-white rounded-xl border border-gray-100 p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-base font-semibold text-gray-900">最近订单</h2>
            <NuxtLink to="/admin/orders" class="text-sm text-primary-600 hover:text-primary-700 transition-colors">
              查看全部 &rarr;
            </NuxtLink>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-gray-100">
                  <th class="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">订单号</th>
                  <th class="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">用户</th>
                  <th class="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">类型</th>
                  <th class="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">金额</th>
                  <th class="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">状态</th>
                  <th class="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">时间</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="order in recentOrders"
                  :key="order.id"
                  class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                >
                  <td class="py-3 px-4 text-sm text-gray-700 font-mono">{{ order.id }}</td>
                  <td class="py-3 px-4 text-sm text-gray-700">{{ order.user }}</td>
                  <td class="py-3 px-4 text-sm text-gray-600">{{ order.type }}</td>
                  <td class="py-3 px-4 text-sm text-gray-900 font-medium">{{ order.amount }}</td>
                  <td class="py-3 px-4">
                    <span :class="['px-2 py-0.5 rounded-full text-xs font-medium', getStatusClass(order.status)]">
                      {{ order.status }}
                    </span>
                  </td>
                  <td class="py-3 px-4 text-sm text-gray-400">{{ order.time }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
