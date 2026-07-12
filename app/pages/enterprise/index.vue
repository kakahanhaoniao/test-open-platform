<script setup lang="ts">
import { organization, members, currentUser } from '~/data/mock'

useHead({ title: '企业概览 - 奇安信AI开放平台' })

const previewMembers = members.slice(0, 5)

const activeMembers = members.filter(m => m.status === 'active').length
const pendingMembers = members.filter(m => m.status === 'pending').length

function getInitials(name: string): string {
  return name.slice(0, 1)
}

// Alerts (same data as console dashboard)
const alerts = [
  { id: 1, severity: 'red' as const, icon: 'i-lucide-alert-circle', message: '合规卫士接口返回500错误', time: '5分钟前' },
  { id: 2, severity: 'amber' as const, icon: 'i-lucide-alert-triangle', message: '安全大模型触发频率限制(429)', time: '23分钟前' },
  { id: 3, severity: 'amber' as const, icon: 'i-lucide-alert-triangle', message: '威胁检测模型请求频率超限', time: '1小时前' }
]

function getAlertColor(severity: 'red' | 'amber' | 'green') {
  if (severity === 'red') return { bg: 'bg-red-50', icon: 'text-red-500', border: 'border-red-100' }
  if (severity === 'amber') return { bg: 'bg-amber-50', icon: 'text-amber-500', border: 'border-amber-100' }
  return { bg: 'bg-green-50', icon: 'text-green-500', border: 'border-green-100' }
}

function getRoleBadgeClass(role: string): string {
  switch (role) {
    case 'admin': return 'bg-primary-50 text-primary-700'
    case 'developer': return 'bg-blue-50 text-blue-700'
    case 'finance': return 'bg-amber-50 text-amber-700'
    case 'readonly': return 'bg-gray-100 text-gray-600'
    default: return 'bg-gray-100 text-gray-600'
  }
}

function getStatusBadge(status: string): { class: string; label: string; dotClass: string } {
  switch (status) {
    case 'active':
      return { class: 'bg-green-50 text-green-600', label: '活跃', dotClass: 'bg-green-500' }
    case 'pending':
      return { class: 'bg-amber-50 text-amber-600', label: '待邀请', dotClass: 'bg-amber-500' }
    case 'disabled':
      return { class: 'bg-gray-100 text-gray-500', label: '已禁用', dotClass: 'bg-gray-400' }
    default:
      return { class: 'bg-gray-100 text-gray-500', label: status, dotClass: 'bg-gray-400' }
  }
}

const quickActions = [
  { label: '邀请成员', desc: '邀请新成员加入团队', icon: 'i-lucide-user-plus', to: '/enterprise/members', color: 'bg-primary-50 text-primary-600' },
  { label: '购买充能包', desc: '补充Token调用额度', icon: 'i-lucide-coins', to: '/enterprise/packs', color: 'bg-amber-50 text-amber-600' },
  { label: '查看监控', desc: '实时调用监控与告警', icon: 'i-lucide-activity', to: '/enterprise/monitor', color: 'bg-blue-50 text-blue-600' },
  { label: '管理设置', desc: '企业信息与告警配置', icon: 'i-lucide-settings', to: '/enterprise/settings', color: 'bg-gray-50 text-gray-600' }
]
</script>

<template>
  <div>
    <EnterpriseSidebar />
    <div class="ml-60 p-8 min-h-screen bg-[#FAFAFA]">
      <!-- Welcome Bar -->
      <div class="bg-white rounded-xl border border-gray-100 p-5 mb-6 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
            <UIcon name="i-lucide-building-2" class="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-lg font-bold text-gray-900">企业概览</h1>
              <span class="text-xs text-gray-400 font-normal">· {{ organization.name }}</span>
            </div>
            <div class="flex items-center gap-2 mt-1">
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-600">
                <span class="w-1.5 h-1.5 rounded-full bg-green-500" />
                服务正常
              </span>
              <span
                v-if="organization.verified"
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600"
              >
                <UIcon name="i-lucide-check-circle" class="w-3 h-3" />
                已认证
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 4 Stat Cards -->
      <div class="grid grid-cols-4 gap-4 mb-6">
        <!-- 成员数 -->
        <div class="bg-white rounded-xl border border-gray-100 p-5">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center">
              <UIcon name="i-lucide-users" class="w-4.5 h-4.5 text-primary-600" />
            </div>
            <span class="text-sm text-gray-500">成员数</span>
          </div>
          <div class="flex items-baseline gap-1">
            <span class="text-2xl font-bold text-gray-900">{{ organization.memberCount }}</span>
            <span class="text-sm text-gray-400">人</span>
          </div>
          <p class="text-xs text-gray-400 mt-1">活跃{{ activeMembers }}，待邀请{{ pendingMembers }}</p>
        </div>

        <!-- 活跃Key数 -->
        <div class="bg-white rounded-xl border border-gray-100 p-5">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
              <UIcon name="i-lucide-key" class="w-4.5 h-4.5 text-blue-600" />
            </div>
            <span class="text-sm text-gray-500">活跃Key数</span>
          </div>
          <div class="flex items-baseline gap-1">
            <span class="text-2xl font-bold text-gray-900">{{ organization.activeKeyCount }}</span>
            <span class="text-sm text-gray-400">个</span>
          </div>
        </div>

        <!-- 本月调用 -->
        <div class="bg-white rounded-xl border border-gray-100 p-5">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
              <UIcon name="i-lucide-activity" class="w-4.5 h-4.5 text-green-600" />
            </div>
            <span class="text-sm text-gray-500">本月调用</span>
          </div>
          <div class="flex items-baseline gap-1">
            <span class="text-2xl font-bold text-gray-900 font-mono">{{ organization.monthlyCalls.toLocaleString() }}</span>
            <span class="text-sm text-gray-400">次</span>
          </div>
        </div>

        <!-- 本月消耗 -->
        <div class="bg-white rounded-xl border border-gray-100 p-5">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
              <UIcon name="i-lucide-banknote" class="w-4.5 h-4.5 text-amber-600" />
            </div>
            <span class="text-sm text-gray-500">本月消耗</span>
          </div>
          <div class="flex items-baseline gap-1">
            <span class="text-2xl font-bold text-gray-900 font-mono">&yen;{{ organization.monthlyCost.toLocaleString() }}</span>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-4 gap-4 mb-6">
        <NuxtLink
          v-for="action in quickActions"
          :key="action.to"
          :to="action.to"
          class="bg-white rounded-xl border border-gray-100 p-5 card-hover group"
        >
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-lg flex items-center justify-center" :class="action.color">
              <UIcon :name="action.icon" class="w-5 h-5" />
            </div>
            <UIcon name="i-lucide-arrow-right" class="w-4 h-4 text-gray-300 ml-auto group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all duration-200" />
          </div>
          <p class="text-sm font-semibold text-gray-900 mb-1">{{ action.label }}</p>
          <p class="text-xs text-gray-400">{{ action.desc }}</p>
        </NuxtLink>
      </div>

      <!-- Two-column: Member Preview + Recent Alerts -->
      <div class="grid grid-cols-2 gap-6">
        <!-- Member Preview -->
        <div class="bg-white rounded-xl border border-gray-100 p-6">
          <div class="flex items-center justify-between mb-5">
            <div>
              <h3 class="font-semibold text-gray-900">成员预览</h3>
              <p class="text-xs text-gray-400 mt-0.5">团队成员活跃度概览</p>
            </div>
            <NuxtLink
              to="/enterprise/members"
              class="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              查看全部成员
              <UIcon name="i-lucide-arrow-right" class="w-4 h-4" />
            </NuxtLink>
          </div>
          <div class="space-y-3">
            <div
              v-for="member in previewMembers"
              :key="member.id"
              class="flex items-center gap-3 py-2"
            >
              <div
                class="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-medium"
                :class="{
                  'bg-primary-100 text-primary-700': member.role === 'admin',
                  'bg-blue-100 text-blue-700': member.role === 'developer',
                  'bg-amber-100 text-amber-700': member.role === 'finance',
                  'bg-gray-100 text-gray-600': member.role === 'readonly'
                }"
              >
                {{ getInitials(member.name) }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <span class="text-sm font-medium text-gray-900">{{ member.name }}</span>
                  <span
                    class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium"
                    :class="getRoleBadgeClass(member.role)"
                  >
                    {{ member.roleLabel }}
                  </span>
                </div>
                <p class="text-xs text-gray-400 mt-0.5 truncate">{{ member.email }}</p>
              </div>
              <div class="text-right shrink-0">
                <p class="text-sm font-medium text-gray-900 font-mono">&yen;{{ member.monthlyCost.toLocaleString() }}</p>
                <span
                  class="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium"
                  :class="getStatusBadge(member.status).class"
                >
                  <span
                    class="w-1 h-1 rounded-full mr-1"
                    :class="getStatusBadge(member.status).dotClass"
                  />
                  {{ getStatusBadge(member.status).label }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Alerts -->
        <div class="bg-white rounded-xl border border-gray-100 p-6">
          <div class="flex items-center justify-between mb-5">
            <div>
              <h3 class="font-semibold text-gray-900">异常告警</h3>
              <p class="text-xs text-gray-400 mt-0.5">最近服务异常与恢复通知</p>
            </div>
            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600">
              {{ alerts.filter(a => a.severity === 'red').length }} 严重
            </span>
          </div>
          <div class="space-y-3">
            <div
              v-for="alert in alerts"
              :key="alert.id"
              class="flex items-start gap-3 p-3 rounded-lg border"
              :class="getAlertColor(alert.severity).border"
              :style="{ backgroundColor: getAlertColor(alert.severity).bg }"
            >
              <UIcon :name="alert.icon" class="w-4 h-4 mt-0.5 shrink-0" :class="getAlertColor(alert.severity).icon" />
              <div class="flex-1 min-w-0">
                <p class="text-sm text-gray-900">{{ alert.message }}</p>
                <p class="text-xs text-gray-400 mt-0.5">{{ alert.time }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
