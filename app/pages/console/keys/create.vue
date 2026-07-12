<script setup lang="ts">
import { models } from '~/data/mock'

const keyName = ref('')
const ipWhitelist = ref('')
const rateLimit = ref(100)
const rateLimitPeriod = ref('minute')
const selectedModels = ref<string[]>([])
const showSuccess = ref(false)
const newKey = ref('sk-qax-f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7')

const modelGroups = computed(() => {
  const groups: Record<string, typeof models> = {}
  for (const model of models) {
    if (!groups[model.typeName]) {
      groups[model.typeName] = []
    }
    groups[model.typeName]!.push(model)
  }
  return groups
})

function toggleModel(id: string) {
  const idx = selectedModels.value.indexOf(id)
  if (idx >= 0) {
    selectedModels.value.splice(idx, 1)
  } else {
    selectedModels.value.push(id)
  }
}

function selectAll() {
  selectedModels.value = models.map(m => m.id)
}

function deselectAll() {
  selectedModels.value = []
}

function handleCreate() {
  if (!keyName.value.trim()) return
  showSuccess.value = true
}

async function copyNewKey() {
  try {
    await navigator.clipboard.writeText(newKey.value)
  } catch {
    // fallback
  }
}
</script>

<template>
  <div>
    <ConsoleSidebar />
    <div class="ml-60 p-8">
      <!-- Header -->
      <div class="flex items-center gap-3 mb-8">
        <NuxtLink
          to="/console/keys"
          class="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <UIcon name="i-lucide-arrow-left" class="w-5 h-5 text-gray-400" />
        </NuxtLink>
        <div>
          <h1 class="text-xl font-bold text-gray-900">创建API Key</h1>
          <p class="text-sm text-gray-400 mt-1">配置新密钥的名称、权限与安全策略</p>
        </div>
      </div>

      <!-- Form -->
      <div class="max-w-3xl space-y-6">
        <!-- Key Name -->
        <div class="bg-white rounded-xl border border-gray-100 p-6">
          <h3 class="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <UIcon name="i-lucide-tag" class="w-4 h-4 text-primary-500" />
            基本信息
          </h3>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Key名称</label>
            <input
              v-model="keyName"
              type="text"
              placeholder="例如：生产环境密钥"
              class="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
            />
            <p class="text-xs text-gray-400 mt-1.5">为Key取一个易于辨识的名称，方便后续管理</p>
          </div>
        </div>

        <!-- Permission Config -->
        <div class="bg-white rounded-xl border border-gray-100 p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-semibold text-gray-900 flex items-center gap-2">
              <UIcon name="i-lucide-shield" class="w-4 h-4 text-primary-500" />
              权限配置
            </h3>
            <div class="flex items-center gap-2">
              <button
                class="text-xs px-2.5 py-1 rounded-md text-primary-600 hover:bg-primary-50 transition-colors"
                @click="selectAll"
              >
                全选
              </button>
              <button
                class="text-xs px-2.5 py-1 rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
                @click="deselectAll"
              >
                清除
              </button>
            </div>
          </div>
          <p class="text-xs text-gray-400 mb-4">选择此Key可以访问的模型和应用</p>

          <div class="space-y-4">
            <div
              v-for="(groupModels, typeName) in modelGroups"
              :key="typeName"
            >
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">{{ typeName }}</p>
              <div class="grid grid-cols-2 gap-2">
                <label
                  v-for="model in groupModels"
                  :key="model.id"
                  class="flex items-center gap-2.5 p-2.5 rounded-lg border transition-all cursor-pointer"
                  :class="selectedModels.includes(model.id)
                    ? 'border-primary-300 bg-primary-50/50'
                    : 'border-gray-100 hover:border-gray-200'"
                >
                  <input
                    type="checkbox"
                    :checked="selectedModels.includes(model.id)"
                    class="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    @change="toggleModel(model.id)"
                  />
                  <UIcon :name="model.icon" class="w-4 h-4 text-gray-400" />
                  <span class="text-sm text-gray-700">{{ model.name }}</span>
                </label>
              </div>
            </div>
          </div>

          <div v-if="selectedModels.length > 0" class="mt-4 pt-4 border-t border-gray-100">
            <p class="text-xs text-gray-400">
              已选择 <span class="text-primary-600 font-medium">{{ selectedModels.length }}</span> 个模型
            </p>
          </div>
        </div>

        <!-- IP Whitelist -->
        <div class="bg-white rounded-xl border border-gray-100 p-6">
          <h3 class="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <UIcon name="i-lucide-globe" class="w-4 h-4 text-primary-500" />
            IP白名单
          </h3>
          <textarea
            v-model="ipWhitelist"
            rows="3"
            placeholder="每行一个IP或CIDR范围，例如：&#10;192.168.1.0/24&#10;10.0.0.1"
            class="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none"
          />
          <p class="text-xs text-gray-400 mt-1.5">留空表示不限制IP访问，建议生产环境配置白名单</p>
        </div>

        <!-- Rate Limiting -->
        <div class="bg-white rounded-xl border border-gray-100 p-6">
          <h3 class="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <UIcon name="i-lucide-gauge" class="w-4 h-4 text-primary-500" />
            调用限制
          </h3>
          <div class="flex items-center gap-4">
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-2">请求频率限制</label>
              <div class="flex items-center gap-3">
                <input
                  v-model.number="rateLimit"
                  type="number"
                  min="1"
                  class="w-32 px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                />
                <span class="text-sm text-gray-500">次/</span>
                <select
                  v-model="rateLimitPeriod"
                  class="px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                >
                  <option value="minute">分钟</option>
                  <option value="hour">小时</option>
                  <option value="day">天</option>
                </select>
              </div>
            </div>
          </div>
          <p class="text-xs text-gray-400 mt-3">超过限制的请求将返回429状态码</p>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-3 pt-2">
          <UButton
            :disabled="!keyName.trim()"
            class="bg-primary-600 hover:bg-primary-700 text-white px-8"
            @click="handleCreate"
          >
            创建Key
          </UButton>
          <NuxtLink
            to="/console/keys"
            class="px-6 py-2.5 rounded-lg text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            取消
          </NuxtLink>
        </div>
      </div>

      <!-- Success Dialog -->
      <div
        v-if="showSuccess"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50"
        @click.self="showSuccess = false"
      >
        <div class="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <UIcon name="i-lucide-check-circle" class="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900">Key创建成功</h3>
              <p class="text-sm text-gray-400">请立即复制并妥善保管</p>
            </div>
          </div>

          <div class="bg-red-50 border border-red-100 rounded-lg p-4 mb-4 flex items-start gap-3">
            <UIcon name="i-lucide-alert-triangle" class="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p class="text-sm font-medium text-red-800">重要提示</p>
              <p class="text-xs text-red-600 mt-1">此Key仅显示一次，关闭后无法再次查看完整Key值。请立即复制并保存到安全位置。</p>
            </div>
          </div>

          <div class="bg-gray-900 rounded-lg p-4 mb-6">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs text-gray-400">API Key</span>
              <button
                class="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1 transition-colors"
                @click="copyNewKey"
              >
                <UIcon name="i-lucide-copy" class="w-3.5 h-3.5" />
                复制
              </button>
            </div>
            <code class="text-sm font-mono text-green-400 break-all">{{ newKey }}</code>
          </div>

          <div class="flex items-center gap-3">
            <UButton
              class="bg-primary-600 hover:bg-primary-700 text-white flex-1"
              @click="copyNewKey"
            >
              复制并关闭
            </UButton>
            <button
              class="px-6 py-2.5 rounded-lg text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              @click="showSuccess = false"
            >
              稍后再说
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
