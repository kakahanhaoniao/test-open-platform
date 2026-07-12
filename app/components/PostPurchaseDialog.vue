<script setup lang="ts">
import type { Plan } from '~/data/mock'

const props = defineProps<{
  plan: Plan
  open: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const isPack = computed(() => props.plan.type === 'pack')
const isModelPlan = computed(() => props.plan.type === 'model-plan')
const isAppPlan = computed(() => props.plan.type === 'app-plan')

const dialogTitle = computed(() => {
  if (isModelPlan.value) return '接入指南 - 模型API'
  if (isAppPlan.value) return '接入指南 - 应用服务'
  return '购买成功'
})

const dialogIcon = computed(() => {
  if (isModelPlan.value) return 'i-lucide-code-2'
  if (isAppPlan.value) return 'i-lucide-puzzle'
  return 'i-lucide-check-circle'
})
</script>

<template>
  <UModal :open="open" @update:open="emit('close')">
    <template #content>
      <div class="p-6">
        <!-- Header -->
        <div class="flex items-center gap-3 mb-5">
          <div class="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
            <UIcon :name="dialogIcon" class="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 class="font-bold text-gray-900">{{ dialogTitle }}</h3>
            <p class="text-xs text-gray-400">{{ plan.name }} 已开通</p>
          </div>
        </div>

        <!-- Model Plan: API integration guide -->
        <div v-if="isModelPlan" class="space-y-4">
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="text-sm font-semibold text-gray-700 mb-2">Step 1: 创建 API Key</h4>
            <p class="text-xs text-gray-500 mb-2">前往控制台 > API Key管理，创建新的密钥</p>
            <div class="bg-white rounded border px-3 py-2 font-mono text-xs text-gray-600">
              sk-qax-xxxxxxxxxxxx
            </div>
          </div>
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="text-sm font-semibold text-gray-700 mb-2">Step 2: SDK 调用示例</h4>
            <div class="bg-gray-900 rounded-lg p-3 font-mono text-xs text-green-400 overflow-x-auto">
              <pre>import qax from '@qax/sdk'

const client = qax.init({
  apiKey: 'sk-qax-xxx',
  model: '{{ plan.targetId }}'
})

const resp = await client.chat({
  messages: [{ role: 'user', content: 'Hello' }]
})</pre>
            </div>
          </div>
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="text-sm font-semibold text-gray-700 mb-2">Step 3: API 端点</h4>
            <div class="bg-white rounded border px-3 py-2 font-mono text-xs text-gray-600">
              POST https://api.qax.ai{{ plan.targetId ? '/v1/chat/completions' : '/v1/inference' }}
            </div>
          </div>
        </div>

        <!-- App Plan: Webhook/SDK/iFrame steps -->
        <div v-if="isAppPlan" class="space-y-4">
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="text-sm font-semibold text-gray-700 mb-2">Step 1: 配置 Webhook 回调</h4>
            <p class="text-xs text-gray-500 mb-2">在应用设置中添加您的回调地址，接收事件通知</p>
            <div class="bg-white rounded border px-3 py-2 font-mono text-xs text-gray-600">
              https://your-domain.com/webhook/qax
            </div>
          </div>
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="text-sm font-semibold text-gray-700 mb-2">Step 2: SDK 集成</h4>
            <div class="bg-gray-900 rounded-lg p-3 font-mono text-xs text-green-400 overflow-x-auto">
              <pre>import { AppClient } from '@qax/sdk'

const app = new AppClient({
  appId: '{{ plan.targetId }}',
  apiKey: 'sk-qax-xxx'
})

const result = await app.execute({
  input: 'your input data'
})</pre>
            </div>
          </div>
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="text-sm font-semibold text-gray-700 mb-2">Step 3: iFrame 嵌入（可选）</h4>
            <div class="bg-gray-900 rounded-lg p-3 font-mono text-xs text-green-400 overflow-x-auto">
              <pre>&lt;iframe
  src="https://app.qax.ai/{{ plan.targetId }}?key=sk-qax-xxx"
  width="100%" height="600"
&gt;&lt;/iframe&gt;</pre>
            </div>
          </div>
        </div>

        <!-- Pack: Balance info + next steps -->
        <div v-if="isPack" class="space-y-4">
          <div class="bg-green-50 rounded-lg p-4">
            <div class="flex items-center gap-2 mb-2">
              <UIcon name="i-lucide-wallet" class="w-4 h-4 text-green-600" />
              <span class="text-sm font-semibold text-green-700">余额已到账</span>
            </div>
            <p class="text-xs text-green-600">充能包Token已添加至您的账户余额，可立即使用。</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="text-sm font-semibold text-gray-700 mb-3">推荐下一步</h4>
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-xs text-gray-600">
                <UIcon name="i-lucide-key" class="w-3.5 h-3.5 text-primary-500 shrink-0" />
                创建 API Key 开始调用模型
              </div>
              <div class="flex items-center gap-2 text-xs text-gray-600">
                <UIcon name="i-lucide-book-open" class="w-3.5 h-3.5 text-primary-500 shrink-0" />
                查看API文档了解调用方式
              </div>
              <div class="flex items-center gap-2 text-xs text-gray-600">
                <UIcon name="i-lucide-play" class="w-3.5 h-3.5 text-primary-500 shrink-0" />
                在Playground中在线体验
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex justify-end gap-3 mt-6">
          <UButton variant="ghost" color="neutral" @click="emit('close')">关闭</UButton>
          <UButton color="primary" @click="emit('close')">
            {{ isPack ? '前往控制台' : '查看文档' }}
          </UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>
