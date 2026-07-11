<script setup lang="ts">
import { models } from '~/data/mock'

const copiedKey = ref<string | null>(null)

const apiKeys = [
  {
    id: 'key-1',
    name: '生产环境密钥',
    key: 'sk-qax-a8f3e2d1c4b5a6f7e8d9c0b1a2f3e4d5',
    createdAt: '2026-05-15 10:23:45',
    lastUsed: '2分钟前',
    status: 'active' as const,
    models: ['qax-security-llm', 'threat-detect-v3', 'code-security-scan'],
    apps: ['智能安全运营中心']
  },
  {
    id: 'key-2',
    name: '测试环境密钥',
    key: 'sk-qax-b7e6d5c4a3f2e1d0c9b8a7f6e5d4c3b2',
    createdAt: '2026-06-01 14:30:22',
    lastUsed: '3小时前',
    status: 'active' as const,
    models: ['qax-security-llm', 'vuln-analyzer-pro'],
    apps: ['AI代码审计助手']
  },
  {
    id: 'key-3',
    name: 'CI/CD 管道密钥',
    key: 'sk-qax-c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1',
    createdAt: '2026-06-10 09:15:33',
    lastUsed: '1天前',
    status: 'active' as const,
    models: ['code-security-scan'],
    apps: []
  },
  {
    id: 'key-4',
    name: '数据分析密钥',
    key: 'sk-qax-d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0',
    createdAt: '2026-04-20 16:45:10',
    lastUsed: '7天前',
    status: 'disabled' as const,
    models: ['log-analyzer', 'data-guard-llm'],
    apps: []
  },
  {
    id: 'key-5',
    name: '旧版集成密钥',
    key: 'sk-qax-e4f3d2c1b0a9f8e7d6c5b4a3f2e1d0c9',
    createdAt: '2026-03-01 08:00:00',
    lastUsed: '30天前',
    status: 'disabled' as const,
    models: ['qax-security-llm'],
    apps: ['威胁情报助手']
  }
]

function maskKey(key: string) {
  return key.substring(0, 12) + '...' + key.substring(key.length - 4)
}

async function copyKey(key: string) {
  try {
    await navigator.clipboard.writeText(key)
    copiedKey.value = key
    setTimeout(() => {
      copiedKey.value = null
    }, 2000)
  } catch {
    // fallback
  }
}

function getModelName(id: string) {
  const model = models.find(m => m.id === id)
  return model ? model.name : id
}
</script>

<template>
  <div>
    <DevSidebar />
    <div class="ml-60 p-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-xl font-bold text-gray-900">API Key 管理</h1>
          <p class="text-sm text-gray-400 mt-1">管理您的API密钥，配置访问权限与安全策略</p>
        </div>
        <UButton
          to="/dev/keys/create"
          icon="i-lucide-plus"
          class="bg-primary-600 hover:bg-primary-700 text-white"
        >
          创建API Key
        </UButton>
      </div>

      <!-- Key List -->
      <div class="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table class="w-full">
          <thead>
            <tr class="text-xs text-gray-400 border-b border-gray-100 bg-gray-50/50">
              <th class="text-left py-3 px-5 font-medium">Key名称</th>
              <th class="text-left py-3 px-5 font-medium">Key值</th>
              <th class="text-left py-3 px-5 font-medium">关联模型/应用</th>
              <th class="text-left py-3 px-5 font-medium">创建时间</th>
              <th class="text-left py-3 px-5 font-medium">最后使用</th>
              <th class="text-left py-3 px-5 font-medium">状态</th>
              <th class="text-left py-3 px-5 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="key in apiKeys"
              :key="key.id"
              class="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
            >
              <td class="py-4 px-5">
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-key" class="w-4 h-4 text-primary-500" />
                  <span class="text-sm font-medium text-gray-900">{{ key.name }}</span>
                </div>
              </td>
              <td class="py-4 px-5">
                <div class="flex items-center gap-2">
                  <code class="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-600">{{ maskKey(key.key) }}</code>
                  <button
                    class="p-1 rounded hover:bg-gray-100 transition-colors"
                    title="复制Key"
                    @click="copyKey(key.key)"
                  >
                    <UIcon
                      :name="copiedKey === key.key ? 'i-lucide-check' : 'i-lucide-copy'"
                      class="w-3.5 h-3.5"
                      :class="copiedKey === key.key ? 'text-green-500' : 'text-gray-400'"
                    />
                  </button>
                </div>
              </td>
              <td class="py-4 px-5">
                <div class="flex flex-wrap gap-1 max-w-xs">
                  <span
                    v-for="modelId in key.models.slice(0, 2)"
                    :key="modelId"
                    class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-primary-50 text-primary-700 font-medium"
                  >
                    {{ getModelName(modelId) }}
                  </span>
                  <span
                    v-if="key.models.length > 2"
                    class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-gray-100 text-gray-500 font-medium"
                  >
                    +{{ key.models.length - 2 }}
                  </span>
                  <span
                    v-for="app in key.apps.slice(0, 1)"
                    :key="app"
                    class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-accent-50 text-accent-700 font-medium"
                  >
                    {{ app }}
                  </span>
                </div>
              </td>
              <td class="py-4 px-5 text-xs text-gray-400 font-mono">{{ key.createdAt }}</td>
              <td class="py-4 px-5 text-xs text-gray-400">{{ key.lastUsed }}</td>
              <td class="py-4 px-5">
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                  :class="key.status === 'active'
                    ? 'bg-green-50 text-green-600'
                    : 'bg-gray-100 text-gray-500'"
                >
                  <span
                    class="w-1.5 h-1.5 rounded-full mr-1.5"
                    :class="key.status === 'active' ? 'bg-green-500' : 'bg-gray-400'"
                  />
                  {{ key.status === 'active' ? '启用' : '禁用' }}
                </span>
              </td>
              <td class="py-4 px-5">
                <div class="flex items-center gap-2">
                  <button
                    class="text-xs px-2.5 py-1 rounded-md transition-colors"
                    :class="key.status === 'active'
                      ? 'text-amber-600 hover:bg-amber-50'
                      : 'text-green-600 hover:bg-green-50'"
                  >
                    {{ key.status === 'active' ? '禁用' : '启用' }}
                  </button>
                  <button class="text-xs px-2.5 py-1 rounded-md text-red-500 hover:bg-red-50 transition-colors">
                    删除
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Tips -->
      <div class="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-100 flex items-start gap-3">
        <UIcon name="i-lucide-alert-triangle" class="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <p class="text-sm font-medium text-amber-800">安全提示</p>
          <p class="text-xs text-amber-600 mt-1">请妥善保管您的API Key，不要在客户端代码或公开仓库中暴露。如怀疑Key泄露，请立即禁用并创建新的Key。</p>
        </div>
      </div>
    </div>
  </div>
</template>
