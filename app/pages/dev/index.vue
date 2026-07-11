<script setup lang="ts">
import { models } from '~/data/mock'

const weeklyData = [
  { day: '周一', calls: 2840 },
  { day: '周二', calls: 3520 },
  { day: '周三', calls: 4120 },
  { day: '周四', calls: 3890 },
  { day: '周五', calls: 4650 },
  { day: '周六', calls: 2100 },
  { day: '周日', calls: 1820 }
]

const maxCalls = Math.max(...weeklyData.map(d => d.calls))

const recentCalls = [
  { id: 1, model: '奇安信安全大模型', endpoint: '/v1/chat/completions', status: '成功', latency: '234ms', time: '2分钟前', tokens: 1520 },
  { id: 2, model: '威胁检测模型 V3', endpoint: '/v1/threat/detect', status: '成功', latency: '189ms', time: '5分钟前', tokens: 890 },
  { id: 3, model: '漏洞分析专家', endpoint: '/v1/vuln/analyze', status: '成功', latency: '312ms', time: '12分钟前', tokens: 2340 },
  { id: 4, model: '合规卫士', endpoint: '/v1/compliance/check', status: '失败', latency: '5210ms', time: '18分钟前', tokens: 0 },
  { id: 5, model: '代码安全扫描模型', endpoint: '/v1/code/scan', status: '成功', latency: '276ms', time: '25分钟前', tokens: 1870 }
]
</script>

<template>
  <div>
    <DevSidebar />
    <div class="ml-60">
      <!-- Welcome Banner -->
      <div class="deep-block px-8 pt-8 pb-10">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-white mb-2">欢迎回来，开发者</h1>
            <p class="text-white/60 text-sm">您的API服务运行正常，以下是今日概览</p>
          </div>
          <div class="flex items-center gap-3">
            <div class="px-3 py-1.5 rounded-full bg-green-500/20 text-green-400 text-xs font-medium flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-green-400 badge-pulse" />
              服务正常
            </div>
          </div>
        </div>
      </div>

      <div class="px-8 -mt-6 pb-8 space-y-6">
        <!-- Top Stats -->
        <div class="grid grid-cols-4 gap-4">
          <div class="bg-white rounded-xl border border-gray-100 p-5 card-hover">
            <div class="flex items-center justify-between mb-3">
              <div class="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                <UIcon name="i-lucide-activity" class="w-5 h-5 text-primary-600" />
              </div>
              <span class="text-xs text-green-500 font-medium">+12.5%</span>
            </div>
            <p class="text-2xl font-bold text-gray-900 font-mono">2,847,520</p>
            <p class="text-xs text-gray-400 mt-1">API调用总量</p>
          </div>

          <div class="bg-white rounded-xl border border-gray-100 p-5 card-hover">
            <div class="flex items-center justify-between mb-3">
              <div class="w-10 h-10 rounded-lg bg-accent-50 flex items-center justify-center">
                <UIcon name="i-lucide-calendar" class="w-5 h-5 text-accent-600" />
              </div>
              <span class="text-xs text-green-500 font-medium">+8.3%</span>
            </div>
            <p class="text-2xl font-bold text-gray-900 font-mono">22,940</p>
            <p class="text-xs text-gray-400 mt-1">本月调用</p>
          </div>

          <div class="bg-white rounded-xl border border-gray-100 p-5 card-hover">
            <div class="flex items-center justify-between mb-3">
              <div class="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                <UIcon name="i-lucide-coins" class="w-5 h-5 text-amber-600" />
              </div>
              <span class="text-xs text-red-400 font-medium">-5.2%</span>
            </div>
            <p class="text-2xl font-bold text-gray-900 font-mono">4,850,000</p>
            <p class="text-xs text-gray-400 mt-1">充能包余额(Token)</p>
          </div>

          <div class="bg-white rounded-xl border border-gray-100 p-5 card-hover">
            <div class="flex items-center justify-between mb-3">
              <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <UIcon name="i-lucide-key" class="w-5 h-5 text-blue-600" />
              </div>
              <span class="text-xs text-green-500 font-medium">+2</span>
            </div>
            <p class="text-2xl font-bold text-gray-900 font-mono">5</p>
            <p class="text-xs text-gray-400 mt-1">活跃Key数</p>
          </div>
        </div>

        <!-- Usage Chart + Quick Links -->
        <div class="grid grid-cols-3 gap-6">
          <!-- Bar Chart Placeholder -->
          <div class="col-span-2 bg-white rounded-xl border border-gray-100 p-6">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h3 class="font-semibold text-gray-900">近7日调用趋势</h3>
                <p class="text-xs text-gray-400 mt-0.5">每日API调用次数统计</p>
              </div>
              <div class="flex items-center gap-4 text-xs text-gray-400">
                <span class="flex items-center gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-sm bg-primary-500" />
                  调用量
                </span>
              </div>
            </div>
            <div class="flex items-end gap-3 h-40">
              <div
                v-for="item in weeklyData"
                :key="item.day"
                class="flex-1 flex flex-col items-center gap-2"
              >
                <span class="text-xs font-mono text-gray-500">{{ item.calls.toLocaleString() }}</span>
                <div
                  class="w-full rounded-t-md bg-gradient-to-t from-primary-600 to-primary-400 transition-all duration-500"
                  :style="{ height: `${(item.calls / maxCalls) * 120}px` }"
                />
                <span class="text-xs text-gray-400">{{ item.day }}</span>
              </div>
            </div>
          </div>

          <!-- Quick Links -->
          <div class="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
            <h3 class="font-semibold text-gray-900">快速操作</h3>
            <NuxtLink
              to="/dev/keys/create"
              class="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-primary-200 hover:bg-primary-50/50 transition-all duration-200 group"
            >
              <div class="w-9 h-9 rounded-lg bg-primary-100 flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                <UIcon name="i-lucide-plus" class="w-4 h-4 text-primary-600" />
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">创建API Key</p>
                <p class="text-xs text-gray-400">生成新的API密钥</p>
              </div>
            </NuxtLink>

            <NuxtLink
              to="/dev/docs"
              class="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-primary-200 hover:bg-primary-50/50 transition-all duration-200 group"
            >
              <div class="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <UIcon name="i-lucide-book-open" class="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">查看文档</p>
                <p class="text-xs text-gray-400">API接入文档与SDK</p>
              </div>
            </NuxtLink>

            <NuxtLink
              to="/dev/packs"
              class="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-primary-200 hover:bg-primary-50/50 transition-all duration-200 group"
            >
              <div class="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                <UIcon name="i-lucide-coins" class="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">购买充能包</p>
                <p class="text-xs text-gray-400">充值Token额度</p>
              </div>
            </NuxtLink>

            <NuxtLink
              to="/dev/stats"
              class="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-primary-200 hover:bg-primary-50/50 transition-all duration-200 group"
            >
              <div class="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <UIcon name="i-lucide-bar-chart-3" class="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">调用统计</p>
                <p class="text-xs text-gray-400">查看详细调用数据</p>
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- Recent API Calls -->
        <div class="bg-white rounded-xl border border-gray-100 p-6">
          <div class="flex items-center justify-between mb-5">
            <div>
              <h3 class="font-semibold text-gray-900">最近API调用</h3>
              <p class="text-xs text-gray-400 mt-0.5">最近5条API调用记录</p>
            </div>
            <NuxtLink
              to="/dev/stats"
              class="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
            >
              查看全部
              <UIcon name="i-lucide-arrow-right" class="w-3.5 h-3.5" />
            </NuxtLink>
          </div>
          <table class="w-full">
            <thead>
              <tr class="text-xs text-gray-400 border-b border-gray-100">
                <th class="text-left py-3 font-medium">模型</th>
                <th class="text-left py-3 font-medium">接口</th>
                <th class="text-left py-3 font-medium">状态</th>
                <th class="text-left py-3 font-medium">延迟</th>
                <th class="text-left py-3 font-medium">Token</th>
                <th class="text-left py-3 font-medium">时间</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="call in recentCalls"
                :key="call.id"
                class="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
              >
                <td class="py-3 text-sm text-gray-900 font-medium">{{ call.model }}</td>
                <td class="py-3 text-xs font-mono text-gray-500">{{ call.endpoint }}</td>
                <td class="py-3">
                  <span
                    class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                    :class="call.status === '成功'
                      ? 'bg-green-50 text-green-600'
                      : 'bg-red-50 text-red-600'"
                  >
                    {{ call.status }}
                  </span>
                </td>
                <td class="py-3 text-xs font-mono text-gray-500">{{ call.latency }}</td>
                <td class="py-3 text-xs font-mono text-gray-500">{{ call.tokens.toLocaleString() }}</td>
                <td class="py-3 text-xs text-gray-400">{{ call.time }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
