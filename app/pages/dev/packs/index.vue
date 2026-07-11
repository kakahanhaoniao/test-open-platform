<script setup lang="ts">
import { chargingPacks } from '~/data/mock'

const purchaseHistory = [
  { time: '2026-07-08 14:30', packName: '专业包', tokens: '500万Token', amount: '¥399', status: 'success' as const },
  { time: '2026-06-15 10:20', packName: '体验包', tokens: '100万Token', amount: '¥99', status: 'success' as const },
  { time: '2026-05-22 09:15', packName: '企业包', tokens: '2000万Token', amount: '¥1,499', status: 'success' as const },
  { time: '2026-04-10 16:45', packName: '专业包', tokens: '500万Token', amount: '¥399', status: 'success' as const },
  { time: '2026-03-01 11:30', packName: '体验包', tokens: '100万Token', amount: '¥99', status: 'expired' as const }
]

const usageTrend = [
  { month: '2月', used: 180 },
  { month: '3月', used: 320 },
  { month: '4月', used: 450 },
  { month: '5月', used: 520 },
  { month: '6月', used: 680 },
  { month: '7月', used: 550 }
]

const maxUsage = Math.max(...usageTrend.map(d => d.used))
</script>

<template>
  <div>
    <DevSidebar />
    <div class="ml-60 p-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-xl font-bold text-gray-900">充能包管理</h1>
        <p class="text-sm text-gray-400 mt-1">管理Token余额，购买充能包，查看使用记录</p>
      </div>

      <!-- Balance Card -->
      <div class="deep-block rounded-xl p-6 mb-6 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div class="relative">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-white/60 text-sm mb-1">当前余额</p>
              <div class="flex items-baseline gap-2">
                <span class="text-4xl font-bold text-white font-mono">4,850,000</span>
                <span class="text-white/40 text-sm">Token</span>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="text-right">
                <p class="text-white/40 text-xs mb-0.5">已使用</p>
                <p class="text-white font-mono text-lg">10,150,000</p>
              </div>
              <div class="w-px h-10 bg-white/10" />
              <div class="text-right">
                <p class="text-white/40 text-xs mb-0.5">过期时间</p>
                <p class="text-white text-lg">2026-12-31</p>
              </div>
            </div>
          </div>
          <div class="mt-4">
            <div class="flex items-center justify-between text-xs text-white/40 mb-1.5">
              <span>使用进度</span>
              <span class="font-mono">67.7%</span>
            </div>
            <div class="h-2 bg-white/10 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-primary-400 to-primary-500 rounded-full transition-all duration-1000" style="width: 67.7%" />
            </div>
          </div>
        </div>
      </div>

      <!-- Usage Trend + Purchase -->
      <div class="grid grid-cols-3 gap-6 mb-6">
        <!-- Usage Trend Chart -->
        <div class="col-span-1 bg-white rounded-xl border border-gray-100 p-6">
          <h3 class="font-semibold text-gray-900 mb-1">使用趋势</h3>
          <p class="text-xs text-gray-400 mb-6">近6月Token消耗(万)</p>
          <div class="flex items-end gap-3 h-36">
            <div
              v-for="item in usageTrend"
              :key="item.month"
              class="flex-1 flex flex-col items-center gap-2"
            >
              <span class="text-xs font-mono text-gray-400">{{ item.used }}</span>
              <div
                class="w-full rounded-t-md bg-gradient-to-t from-primary-600 to-primary-400"
                :style="{ height: `${(item.used / maxUsage) * 110}px` }"
              />
              <span class="text-xs text-gray-400">{{ item.month }}</span>
            </div>
          </div>
        </div>

        <!-- Purchase Section -->
        <div class="col-span-2">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-semibold text-gray-900">购买充能包</h3>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div
              v-for="pack in chargingPacks"
              :key="pack.id"
              class="bg-white rounded-xl border p-5 card-hover relative"
              :class="pack.popular ? 'border-primary-300 ring-1 ring-primary-100' : 'border-gray-100'"
            >
              <!-- Popular badge -->
              <div
                v-if="pack.popular"
                class="absolute -top-2.5 left-4 px-2.5 py-0.5 rounded-full bg-primary-600 text-white text-[10px] font-medium"
              >
                最受欢迎
              </div>

              <div class="flex items-start justify-between mb-3">
                <div>
                  <p class="font-bold text-gray-900 text-lg">{{ pack.name }}</p>
                  <p class="text-xs text-gray-400 mt-0.5">{{ pack.tokens }}</p>
                </div>
                <div class="text-right">
                  <p class="text-2xl font-bold gradient-text">{{ pack.price }}</p>
                  <p class="text-xs text-gray-400 mt-0.5">{{ pack.unitPrice }}</p>
                </div>
              </div>

              <div v-if="pack.originalPrice" class="mb-3">
                <span class="text-xs text-gray-400 line-through">{{ pack.originalPrice }}</span>
              </div>

              <div class="space-y-1.5 mb-4">
                <div
                  v-for="feature in pack.features"
                  :key="feature"
                  class="flex items-center gap-2 text-xs text-gray-500"
                >
                  <UIcon name="i-lucide-check" class="w-3.5 h-3.5 text-green-500 shrink-0" />
                  {{ feature }}
                </div>
              </div>

              <button
                class="w-full py-2 rounded-lg text-sm font-medium transition-all duration-200"
                :class="pack.popular
                  ? 'bg-primary-600 hover:bg-primary-700 text-white'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'"
              >
                购买
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Purchase History -->
      <div class="bg-white rounded-xl border border-gray-100 p-6">
        <h3 class="font-semibold text-gray-900 mb-5">购买记录</h3>
        <table class="w-full">
          <thead>
            <tr class="text-xs text-gray-400 border-b border-gray-100">
              <th class="text-left py-3 font-medium">时间</th>
              <th class="text-left py-3 font-medium">充能包类型</th>
              <th class="text-left py-3 font-medium">Token数</th>
              <th class="text-left py-3 font-medium">金额</th>
              <th class="text-left py-3 font-medium">状态</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(record, idx) in purchaseHistory"
              :key="idx"
              class="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
            >
              <td class="py-3 text-xs font-mono text-gray-500">{{ record.time }}</td>
              <td class="py-3 text-sm font-medium text-gray-900">{{ record.packName }}</td>
              <td class="py-3 text-sm font-mono text-gray-600">{{ record.tokens }}</td>
              <td class="py-3 text-sm font-mono text-gray-900 font-medium">{{ record.amount }}</td>
              <td class="py-3">
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                  :class="record.status === 'success'
                    ? 'bg-green-50 text-green-600'
                    : 'bg-gray-100 text-gray-500'"
                >
                  {{ record.status === 'success' ? '已完成' : '已过期' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
