<script setup lang="ts">
import { currentUser, organization, models } from '~/data/mock'

useHead({ title: '个人设置 - 奇安信AI开放平台' })

// Personal info form
const formName = ref(currentUser.name)
const formPhone = ref('13800138000')

// Password form
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

// Security settings
const twoFactorEnabled = ref(false)

// Notification preferences
const emailNotification = ref(true)
const lowBalanceAlert = ref(true)
const apiErrorAlert = ref(false)

// API preferences
const defaultModel = ref('qax-security-llm')
const defaultTemperature = ref(0.7)

// Enterprise exit confirm
const showExitConfirm = ref(false)

// Devices
const devices = [
  { id: 1, name: 'MacBook Pro - Chrome', location: '北京', time: '当前设备', isCurrent: true },
  { id: 2, name: 'iPhone 15 - Safari', location: '北京', time: '2天前', isCurrent: false },
  { id: 3, name: 'Windows PC - Edge', location: '上海', time: '1周前', isCurrent: false }
]

const roleLabels: Record<string, string> = {
  admin: '管理员',
  developer: '开发者',
  finance: '财务',
  readonly: '只读'
}
</script>

<template>
  <div>
    <ConsoleSidebar />
    <div class="ml-60 p-8 min-h-screen bg-[#FAFAFA]">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-xl font-bold text-gray-900">个人设置</h1>
        <p class="text-sm text-gray-400 mt-1">管理您的账户信息与偏好</p>
      </div>

      <div class="space-y-6 max-w-3xl">
        <!-- 个人信息 Section -->
        <div class="bg-white rounded-xl border border-gray-100 p-6">
          <h2 class="text-base font-semibold text-gray-900 mb-6">个人信息</h2>

          <!-- Avatar -->
          <div class="flex items-center gap-5 mb-6">
            <div class="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
              <span class="text-2xl font-bold text-primary-600">张</span>
            </div>
            <button
              class="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              更换头像
            </button>
          </div>

          <!-- Form Fields -->
          <div class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">姓名</label>
              <input
                v-model="formName"
                type="text"
                class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">邮箱</label>
              <input
                :value="currentUser.email"
                type="email"
                readonly
                class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-gray-50 text-gray-500 cursor-not-allowed focus:outline-none"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">手机号</label>
              <div class="flex">
                <span
                  class="inline-flex items-center px-3 py-2 rounded-l-lg border border-r-0 border-gray-200 bg-gray-50 text-sm text-gray-500"
                >
                  +86
                </span>
                <input
                  v-model="formPhone"
                  type="tel"
                  class="flex-1 px-3 py-2 rounded-r-lg border border-gray-200 text-sm focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
                />
              </div>
            </div>
          </div>

          <div class="mt-6">
            <button
              class="px-5 py-2 rounded-lg text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white transition-colors"
            >
              保存修改
            </button>
          </div>
        </div>

        <!-- 安全设置 Section -->
        <div class="bg-white rounded-xl border border-gray-100 p-6">
          <h2 class="text-base font-semibold text-gray-900 mb-6">安全设置</h2>

          <!-- Change Password -->
          <div class="mb-6">
            <h3 class="text-sm font-medium text-gray-700 mb-4">修改密码</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm text-gray-600 mb-1.5">当前密码</label>
                <input
                  v-model="currentPassword"
                  type="password"
                  placeholder="请输入当前密码"
                  class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
                />
              </div>
              <div>
                <label class="block text-sm text-gray-600 mb-1.5">新密码</label>
                <input
                  v-model="newPassword"
                  type="password"
                  placeholder="请输入新密码"
                  class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
                />
              </div>
              <div>
                <label class="block text-sm text-gray-600 mb-1.5">确认新密码</label>
                <input
                  v-model="confirmPassword"
                  type="password"
                  placeholder="请再次输入新密码"
                  class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
                />
              </div>
            </div>
            <button
              class="mt-4 px-5 py-2 rounded-lg text-sm font-medium border border-primary-200 text-primary-600 hover:bg-primary-50 transition-colors"
            >
              修改密码
            </button>
          </div>

          <!-- Two-Factor Auth -->
          <div class="flex items-center justify-between py-4 border-t border-gray-100">
            <div>
              <h3 class="text-sm font-medium text-gray-700">两步验证</h3>
              <p class="text-xs text-gray-400 mt-0.5">通过手机验证码增强账户安全性</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input v-model="twoFactorEnabled" type="checkbox" class="sr-only peer" />
              <div
                class="w-10 h-5.5 rounded-full transition-colors duration-200 peer-focus:ring-2 peer-focus:ring-primary-100"
                :class="twoFactorEnabled ? 'bg-primary-600' : 'bg-gray-200'"
              >
                <div
                  class="absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-transform duration-200"
                  :class="twoFactorEnabled ? 'translate-x-4.5' : 'translate-x-0'"
                />
              </div>
            </label>
          </div>

          <!-- Device Management -->
          <div class="pt-4 border-t border-gray-100">
            <h3 class="text-sm font-medium text-gray-700 mb-4">登录设备管理</h3>
            <div class="space-y-3">
              <div
                v-for="device in devices"
                :key="device.id"
                class="flex items-center justify-between py-3 px-4 rounded-lg bg-gray-50/30 hover:bg-gray-50 transition-colors"
              >
                <div class="flex items-center gap-3">
                  <UIcon name="i-lucide-monitor" class="w-4 h-4 text-gray-400" />
                  <div>
                    <p class="text-sm text-gray-900">{{ device.name }}</p>
                    <p class="text-xs text-gray-400">{{ device.location }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <span
                    v-if="device.isCurrent"
                    class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-600"
                  >
                    当前设备
                  </span>
                  <span v-else class="text-xs text-gray-400">{{ device.time }}</span>
                  <button
                    v-if="!device.isCurrent"
                    class="text-xs text-red-500 hover:text-red-600 transition-colors"
                  >
                    移除
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 通知偏好 Section -->
        <div class="bg-white rounded-xl border border-gray-100 p-6">
          <h2 class="text-base font-semibold text-gray-900 mb-6">通知偏好</h2>
          <div class="space-y-0">
            <!-- Email Notification -->
            <div class="flex items-center justify-between py-4">
              <div>
                <h3 class="text-sm font-medium text-gray-700">邮件通知</h3>
                <p class="text-xs text-gray-400 mt-0.5">接收平台重要通知与更新邮件</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input v-model="emailNotification" type="checkbox" class="sr-only peer" />
                <div
                  class="w-10 h-5.5 rounded-full transition-colors duration-200 peer-focus:ring-2 peer-focus:ring-primary-100"
                  :class="emailNotification ? 'bg-primary-600' : 'bg-gray-200'"
                >
                  <div
                    class="absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-transform duration-200"
                    :class="emailNotification ? 'translate-x-4.5' : 'translate-x-0'"
                  />
                </div>
              </label>
            </div>

            <!-- Low Balance Alert -->
            <div class="flex items-center justify-between py-4 border-t border-gray-100">
              <div>
                <h3 class="text-sm font-medium text-gray-700">余额不足告警</h3>
                <p class="text-xs text-gray-400 mt-0.5">Token余额低于阈值时发送告警</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input v-model="lowBalanceAlert" type="checkbox" class="sr-only peer" />
                <div
                  class="w-10 h-5.5 rounded-full transition-colors duration-200 peer-focus:ring-2 peer-focus:ring-primary-100"
                  :class="lowBalanceAlert ? 'bg-primary-600' : 'bg-gray-200'"
                >
                  <div
                    class="absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-transform duration-200"
                    :class="lowBalanceAlert ? 'translate-x-4.5' : 'translate-x-0'"
                  />
                </div>
              </label>
            </div>

            <!-- API Error Alert -->
            <div class="flex items-center justify-between py-4 border-t border-gray-100">
              <div>
                <h3 class="text-sm font-medium text-gray-700">API异常告警</h3>
                <p class="text-xs text-gray-400 mt-0.5">API调用异常或错误率升高时发送告警</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input v-model="apiErrorAlert" type="checkbox" class="sr-only peer" />
                <div
                  class="w-10 h-5.5 rounded-full transition-colors duration-200 peer-focus:ring-2 peer-focus:ring-primary-100"
                  :class="apiErrorAlert ? 'bg-primary-600' : 'bg-gray-200'"
                >
                  <div
                    class="absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-transform duration-200"
                    :class="apiErrorAlert ? 'translate-x-4.5' : 'translate-x-0'"
                  />
                </div>
              </label>
            </div>
          </div>
        </div>

        <!-- API偏好 Section -->
        <div class="bg-white rounded-xl border border-gray-100 p-6">
          <h2 class="text-base font-semibold text-gray-900 mb-6">API偏好</h2>
          <div class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">默认模型</label>
              <select
                v-model="defaultModel"
                class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 bg-white"
              >
                <option
                  v-for="model in models"
                  :key="model.id"
                  :value="model.id"
                >
                  {{ model.name }}
                </option>
              </select>
            </div>
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="text-sm font-medium text-gray-700">默认温度</label>
                <span class="text-sm font-mono text-primary-600">{{ defaultTemperature.toFixed(1) }}</span>
              </div>
              <input
                v-model.number="defaultTemperature"
                type="range"
                min="0"
                max="1"
                step="0.1"
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
              <div class="flex justify-between text-xs text-gray-400 mt-1">
                <span>精确 (0)</span>
                <span>创意 (1)</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 关联企业 Section (only for enterprise users) -->
        <div
          v-if="currentUser.isEnterprise"
          class="bg-white rounded-xl border border-gray-100 p-6 border-l-4 border-l-primary-600"
        >
          <h2 class="text-base font-semibold text-gray-900 mb-6">关联企业</h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-500">企业名称</span>
              <span class="text-sm font-medium text-gray-900">{{ organization.name }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-500">角色</span>
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary-700"
              >
                {{ currentUser.role ? roleLabels[currentUser.role] : '-' }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-500">加入时间</span>
              <span class="text-sm text-gray-900">2025-08-15</span>
            </div>
          </div>

          <!-- Exit confirm area -->
          <div class="mt-6 pt-4 border-t border-gray-100">
            <div v-if="!showExitConfirm">
              <button
                class="px-5 py-2 rounded-lg text-sm font-medium border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                @click="showExitConfirm = true"
              >
                退出企业
              </button>
            </div>
            <div v-else class="flex items-center gap-3">
              <p class="text-sm text-red-600">确定要退出企业吗？</p>
              <button
                class="px-4 py-1.5 rounded-lg text-sm font-medium bg-red-600 hover:bg-red-700 text-white transition-colors"
              >
                确认退出
              </button>
              <button
                class="px-4 py-1.5 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                @click="showExitConfirm = false"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
