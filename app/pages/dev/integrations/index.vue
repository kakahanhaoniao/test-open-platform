<script setup lang="ts">
import { apps } from '~/data/mock'

const webhookUrl = ref('')
const webhookSecret = ref('')
const webhookEvents = ref<string[]>([])

const eventTypes = [
  { id: 'call.success', label: '调用成功', description: 'API调用成功完成时触发' },
  { id: 'call.failed', label: '调用失败', description: 'API调用失败时触发' },
  { id: 'balance.low', label: '余额不足', description: 'Token余额低于阈值时触发' },
  { id: 'key.created', label: 'Key创建', description: '新API Key创建时触发' },
  { id: 'key.disabled', label: 'Key禁用', description: 'API Key被禁用时触发' },
  { id: 'rate_limit.hit', label: '频率限制', description: '触发API频率限制时触发' }
]

function toggleEvent(id: string) {
  const idx = webhookEvents.value.indexOf(id)
  if (idx >= 0) {
    webhookEvents.value.splice(idx, 1)
  } else {
    webhookEvents.value.push(id)
  }
}

const activeIntegrations = [
  {
    id: 1,
    name: '智能安全运营中心',
    icon: 'i-lucide-monitor-dot',
    status: 'active' as const,
    lastSync: '2分钟前',
    callsToday: 1247,
    type: '对话应用'
  },
  {
    id: 2,
    name: '威胁情报助手',
    icon: 'i-lucide-message-circle-warning',
    status: 'active' as const,
    lastSync: '15分钟前',
    callsToday: 856,
    type: '对话应用'
  },
  {
    id: 3,
    name: '漏洞扫描工具',
    icon: 'i-lucide-search',
    status: 'inactive' as const,
    lastSync: '3天前',
    callsToday: 0,
    type: '工具应用'
  },
  {
    id: 4,
    name: 'AI代码审计助手',
    icon: 'i-lucide-code-2',
    status: 'active' as const,
    lastSync: '1小时前',
    callsToday: 423,
    type: '对话应用'
  }
]

const integrationSteps = [
  {
    step: 1,
    title: '获取API Key',
    description: '在API Key管理页面创建新的密钥，选择需要的模型权限',
    code: '# 在开发者控制台创建API Key\nAPI_KEY="sk-qax-your-api-key"'
  },
  {
    step: 2,
    title: '安装SDK',
    description: '选择您常用的编程语言，安装对应的SDK',
    code: 'pip install qax-ai-sdk'
  },
  {
    step: 3,
    title: '初始化客户端',
    description: '使用API Key初始化客户端，配置基础参数',
    code: `from qax_ai import QAXClient

client = QAXClient(
    api_key="${API_KEY}",
    base_url="https://api.qianxin.ai"
)`
  },
  {
    step: 4,
    title: '调用API',
    description: '根据业务需求调用对应的API接口',
    code: `response = client.chat.completions.create(
    model="qax-security-llm",
    messages=[
        {"role": "system", "content": "你是安全专家"},
        {"role": "user", "content": "分析此安全事件"}
    ],
    temperature=0.7
)

print(response.choices[0].message.content)`
  },
  {
    step: 5,
    title: '配置Webhook',
    description: '设置Webhook接收事件通知，实时监控API调用状态',
    code: `# Webhook配置示例
webhook_config = {
    "url": "https://your-app.com/webhook",
    "events": ["call.success", "call.failed"],
    "secret": "your-webhook-secret"
}

client.webhooks.create(webhook_config)`
  }
]
</script>

<template>
  <div>
    <DevSidebar />
    <div class="ml-60 p-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-xl font-bold text-gray-900">应用集成</h1>
        <p class="text-sm text-gray-400 mt-1">管理应用集成、配置Webhook与接入指南</p>
      </div>

      <!-- Active Integrations -->
      <div class="mb-8">
        <h2 class="font-semibold text-gray-900 mb-4">已集成应用</h2>
        <div class="grid grid-cols-2 gap-4">
          <div
            v-for="integration in activeIntegrations"
            :key="integration.id"
            class="bg-white rounded-xl border border-gray-100 p-5 card-hover"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                  <UIcon :name="integration.icon" class="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p class="font-medium text-gray-900 text-sm">{{ integration.name }}</p>
                  <p class="text-xs text-gray-400">{{ integration.type }}</p>
                </div>
              </div>
              <span
                class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                :class="integration.status === 'active'
                  ? 'bg-green-50 text-green-600'
                  : 'bg-gray-100 text-gray-500'"
              >
                <span
                  class="w-1.5 h-1.5 rounded-full mr-1.5"
                  :class="integration.status === 'active' ? 'bg-green-500' : 'bg-gray-400'"
                />
                {{ integration.status === 'active' ? '运行中' : '已停止' }}
              </span>
            </div>
            <div class="flex items-center justify-between text-xs">
              <div class="flex items-center gap-4">
                <span class="text-gray-400">
                  最近同步: <span class="text-gray-600">{{ integration.lastSync }}</span>
                </span>
                <span class="text-gray-400">
                  今日调用: <span class="text-gray-600 font-mono">{{ integration.callsToday.toLocaleString() }}</span>
                </span>
              </div>
              <button class="text-primary-600 hover:text-primary-700 font-medium">
                配置
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Webhook Configuration -->
      <div class="bg-white rounded-xl border border-gray-100 p-6 mb-8">
        <div class="flex items-center gap-2 mb-5">
          <UIcon name="i-lucide-webhook" class="w-5 h-5 text-primary-500" />
          <h2 class="font-semibold text-gray-900">Webhook 配置</h2>
        </div>

        <div class="grid grid-cols-2 gap-6">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Webhook URL</label>
              <input
                v-model="webhookUrl"
                type="url"
                placeholder="https://your-app.com/webhook"
                class="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Secret Key</label>
              <div class="flex items-center gap-2">
                <input
                  v-model="webhookSecret"
                  type="text"
                  placeholder="用于验证Webhook签名"
                  class="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                />
                <button class="px-3 py-2.5 rounded-lg border border-gray-200 text-xs text-gray-500 hover:bg-gray-50 transition-colors">
                  生成
                </button>
              </div>
              <p class="text-xs text-gray-400 mt-1.5">用于验证Webhook请求的签名密钥</p>
            </div>

            <UButton class="bg-primary-600 hover:bg-primary-700 text-white">
              保存配置
            </UButton>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">事件类型</label>
            <div class="space-y-2">
              <label
                v-for="event in eventTypes"
                :key="event.id"
                class="flex items-start gap-3 p-2.5 rounded-lg border transition-all cursor-pointer"
                :class="webhookEvents.includes(event.id)
                  ? 'border-primary-200 bg-primary-50/30'
                  : 'border-gray-100 hover:border-gray-200'"
              >
                <input
                  type="checkbox"
                  :checked="webhookEvents.includes(event.id)"
                  class="w-4 h-4 mt-0.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  @change="toggleEvent(event.id)"
                />
                <div>
                  <p class="text-sm font-medium text-gray-700">{{ event.label }}</p>
                  <p class="text-xs text-gray-400">{{ event.description }}</p>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Integration Guide -->
      <div class="bg-white rounded-xl border border-gray-100 p-6">
        <div class="flex items-center gap-2 mb-6">
          <UIcon name="i-lucide-book-open" class="w-5 h-5 text-primary-500" />
          <h2 class="font-semibold text-gray-900">接入指南</h2>
        </div>

        <div class="space-y-6">
          <div
            v-for="step in integrationSteps"
            :key="step.step"
            class="flex gap-5"
          >
            <!-- Step number -->
            <div class="shrink-0">
              <div class="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center">
                <span class="text-white text-sm font-bold">{{ step.step }}</span>
              </div>
              <div
                v-if="step.step < integrationSteps.length"
                class="w-px h-full bg-primary-200 mx-auto mt-2"
              />
            </div>

            <!-- Step content -->
            <div class="flex-1 pb-6">
              <h3 class="font-medium text-gray-900 mb-1">{{ step.title }}</h3>
              <p class="text-sm text-gray-400 mb-3">{{ step.description }}</p>
              <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre class="font-mono text-xs text-gray-300 whitespace-pre-wrap">{{ step.code }}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
