<script setup lang="ts">
import { currentUser, organization } from '~/data/mock'

useHead({ title: '企业设置 - 奇安信AI开放平台' })

const isAdmin = computed(() => currentUser.role === 'admin')

// Basic info form
const orgName = ref(organization.name)
const orgIndustry = ref(organization.industry)
const orgScale = ref(organization.scale)

const industryOptions = [
  '网络安全',
  '金融',
  '互联网',
  '制造业',
  '政府',
  '教育',
  '医疗',
  '其他'
]

const scaleOptions = [
  '1-50人',
  '50-100人',
  '100-200人',
  '200-500人',
  '500-1000人',
  '1000人以上'
]

// Default member role
const defaultRole = ref('developer')
const roleOptions = [
  { value: 'developer', label: '开发者' },
  { value: 'finance', label: '财务' },
  { value: 'readonly', label: '只读' }
]

// API rate limits
const rateLimitPerMember = ref(60)

// Notification settings
const lowBalanceAlert = ref(true)
const lowBalanceThreshold = ref(500)
const apiErrorAlert = ref(true)
const memberJoinNotify = ref(true)

// Save handler
const saving = ref(false)
async function handleSave() {
  saving.value = true
  await new Promise(resolve => setTimeout(resolve, 800))
  saving.value = false
}
</script>

<template>
  <div>
    <EnterpriseSidebar />
    <div class="ml-60 p-8 min-h-screen bg-[#FAFAFA]">
      <!-- Non-admin access denied -->
      <template v-if="!isAdmin">
        <div class="flex flex-col items-center justify-center py-32">
          <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <UIcon name="i-lucide-lock" class="w-8 h-8 text-gray-400" />
          </div>
          <h2 class="text-lg font-semibold text-gray-900 mb-2">仅管理员可访问</h2>
          <p class="text-sm text-gray-400">此页面仅对企业管理员开放，请联系管理员获取权限</p>
        </div>
      </template>

      <!-- Admin content -->
      <template v-else>
        <!-- Page Header -->
        <div class="mb-8">
          <h1 class="text-xl font-bold text-gray-900">企业设置</h1>
          <p class="text-sm text-gray-400 mt-1">管理企业基本信息、成员权限与通知策略</p>
        </div>

        <!-- Basic Info -->
        <div class="bg-white rounded-xl border border-gray-100 p-6 mb-6">
          <h3 class="font-semibold text-gray-900 mb-5">基本信息</h3>
          <div class="space-y-5 max-w-2xl">
            <!-- Org Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">企业名称</label>
              <input
                v-model="orgName"
                type="text"
                class="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-primary-300 focus:ring-2 focus:ring-primary-100 text-sm text-gray-900 outline-none transition-all duration-200"
              />
            </div>

            <!-- Industry -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">行业</label>
              <select
                v-model="orgIndustry"
                class="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-primary-300 focus:ring-2 focus:ring-primary-100 text-sm text-gray-900 outline-none transition-all duration-200 bg-white appearance-none"
              >
                <option v-for="opt in industryOptions" :key="opt" :value="opt">{{ opt }}</option>
              </select>
            </div>

            <!-- Scale -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">规模</label>
              <select
                v-model="orgScale"
                class="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-primary-300 focus:ring-2 focus:ring-primary-100 text-sm text-gray-900 outline-none transition-all duration-200 bg-white appearance-none"
              >
                <option v-for="opt in scaleOptions" :key="opt" :value="opt">{{ opt }}</option>
              </select>
            </div>

            <!-- Verified status -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">认证状态</label>
              <div class="flex items-center gap-2">
                <span
                  v-if="organization.verified"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600"
                >
                  <UIcon name="i-lucide-check-circle" class="w-3.5 h-3.5" />
                  已认证
                </span>
                <span
                  v-else
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-600"
                >
                  <UIcon name="i-lucide-clock" class="w-3.5 h-3.5" />
                  待认证
                </span>
              </div>
            </div>

            <div class="pt-2">
              <button
                class="px-5 py-2.5 rounded-lg text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white transition-all duration-200"
                :disabled="saving"
                @click="handleSave"
              >
                {{ saving ? '保存中...' : '保存' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Default Member Role -->
        <div class="bg-white rounded-xl border border-gray-100 p-6 mb-6">
          <h3 class="font-semibold text-gray-900 mb-1">新成员默认角色</h3>
          <p class="text-xs text-gray-400 mb-5">新加入企业的成员将自动分配此角色</p>
          <div class="space-y-3">
            <label
              v-for="opt in roleOptions"
              :key="opt.value"
              class="flex items-center gap-3 cursor-pointer"
            >
              <div class="relative">
                <input
                  v-model="defaultRole"
                  type="radio"
                  :value="opt.value"
                  class="sr-only"
                />
                <div
                  class="w-5 h-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center"
                  :class="defaultRole === opt.value
                    ? 'border-primary-600 bg-primary-600'
                    : 'border-gray-300 bg-white'"
                >
                  <div
                    v-if="defaultRole === opt.value"
                    class="w-2 h-2 rounded-full bg-white"
                  />
                </div>
              </div>
              <span class="text-sm text-gray-700">{{ opt.label }}</span>
            </label>
          </div>
        </div>

        <!-- API Rate Limits -->
        <div class="bg-white rounded-xl border border-gray-100 p-6 mb-6">
          <h3 class="font-semibold text-gray-900 mb-1">API调用限制</h3>
          <p class="text-xs text-gray-400 mb-5">设置企业成员的API调用频率上限</p>
          <div class="space-y-5 max-w-md">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">每人调用频率上限</label>
              <div class="flex items-center gap-3">
                <input
                  v-model.number="rateLimitPerMember"
                  type="number"
                  min="10"
                  max="300"
                  class="w-32 px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-primary-300 focus:ring-2 focus:ring-primary-100 text-sm text-gray-900 outline-none transition-all duration-200 font-mono"
                />
                <span class="text-sm text-gray-400">次/分钟</span>
              </div>
              <div class="mt-3">
                <input
                  type="range"
                  :value="rateLimitPerMember"
                  min="10"
                  max="300"
                  step="10"
                  class="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-primary-600"
                  @input="rateLimitPerMember = Number(($event.target as HTMLInputElement).value)"
                />
                <div class="flex items-center justify-between text-xs text-gray-400 mt-1">
                  <span>10</span>
                  <span>300</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Notification Settings -->
        <div class="bg-white rounded-xl border border-gray-100 p-6 mb-6">
          <h3 class="font-semibold text-gray-900 mb-1">通知设置</h3>
          <p class="text-xs text-gray-400 mb-5">配置企业通知与告警策略</p>
          <div class="space-y-5 max-w-lg">
            <!-- Low balance alert -->
            <div>
              <div class="flex items-center justify-between mb-3">
                <div>
                  <p class="text-sm font-medium text-gray-700">余额不足告警</p>
                  <p class="text-xs text-gray-400 mt-0.5">余额低于阈值时发送告警通知</p>
                </div>
                <button
                  class="relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  :class="lowBalanceAlert ? 'bg-primary-600' : 'bg-gray-200'"
                  @click="lowBalanceAlert = !lowBalanceAlert"
                >
                  <span
                    class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200"
                    :class="lowBalanceAlert ? 'translate-x-5' : 'translate-x-0'"
                  />
                </button>
              </div>
              <div v-if="lowBalanceAlert" class="flex items-center gap-2 pl-1">
                <label class="text-xs text-gray-500">阈值</label>
                <input
                  v-model.number="lowBalanceThreshold"
                  type="number"
                  class="w-28 px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-300 focus:ring-2 focus:ring-primary-100 text-sm text-gray-900 outline-none transition-all duration-200 font-mono"
                />
                <span class="text-xs text-gray-400">万Token</span>
              </div>
            </div>

            <!-- API error alert -->
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-700">API异常告警</p>
                <p class="text-xs text-gray-400 mt-0.5">API调用异常时发送告警通知</p>
              </div>
              <button
                class="relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-100"
                :class="apiErrorAlert ? 'bg-primary-600' : 'bg-gray-200'"
                @click="apiErrorAlert = !apiErrorAlert"
              >
                <span
                  class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200"
                  :class="apiErrorAlert ? 'translate-x-5' : 'translate-x-0'"
                />
              </button>
            </div>

            <!-- Member join notification -->
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-700">成员加入通知</p>
                <p class="text-xs text-gray-400 mt-0.5">有新成员加入企业时发送通知</p>
              </div>
              <button
                class="relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-100"
                :class="memberJoinNotify ? 'bg-primary-600' : 'bg-gray-200'"
                @click="memberJoinNotify = !memberJoinNotify"
              >
                <span
                  class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200"
                  :class="memberJoinNotify ? 'translate-x-5' : 'translate-x-0'"
                />
              </button>
            </div>
          </div>
        </div>

        <!-- Danger Zone -->
        <div class="bg-white rounded-xl border-2 border-red-200 p-6">
          <h3 class="font-semibold text-red-600 mb-1">危险操作</h3>
          <p class="text-xs text-gray-400 mb-5">以下操作不可逆，请谨慎操作</p>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-900">解散企业</p>
              <p class="text-xs text-gray-400 mt-0.5">解散后将删除所有企业数据，此操作不可恢复。如需解散企业，请联系平台客服。</p>
            </div>
            <div class="relative group">
              <button
                class="px-4 py-2 rounded-lg text-sm font-medium bg-red-50 text-red-300 cursor-not-allowed border border-red-100"
                disabled
              >
                解散企业
              </button>
              <div class="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                请联系客服
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
