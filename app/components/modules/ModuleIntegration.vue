<script setup lang="ts">
import type { TemplateModule } from '~/data/mock'

const props = defineProps<{
  module: TemplateModule
  capability: any
  capabilityType: 'model' | 'app'
}>()

const spacingMap: Record<string, string> = {
  xs: 'py-2',
  sm: 'py-4',
  md: 'py-8',
  lg: 'py-12'
}

const backgroundMap: Record<string, string> = {
  white: 'bg-white',
  gray: 'bg-gray-50',
  'primary-light': 'bg-primary-50'
}

const spacingTop = computed(() => spacingMap[props.module.spacing?.top] || 'py-8')
const spacingBottom = computed(() => spacingMap[props.module.spacing?.bottom] || 'py-8')
const bgClass = computed(() => backgroundMap[props.module.background] || 'bg-white')

const title = computed(() => props.module.props?.title || '接入指南')
const useDefault = computed(() => props.module.props?.useDefault === true)

// Default 3-step integration
const defaultSteps = computed(() => [
  {
    icon: 'i-lucide-key',
    title: '创建API Key',
    description: '在控制台创建API密钥，获取访问凭证',
    link: '/console/keys/create',
    code: ''
  },
  {
    icon: 'i-lucide-terminal',
    title: '安装SDK',
    description: '通过npm安装奇安信AI SDK',
    link: '',
    code: 'npm install @qax/ai-sdk'
  },
  {
    icon: 'i-lucide-code-2',
    title: '调用API',
    description: '使用SDK调用AI安全能力接口',
    link: '',
    code: `import { QaxAI } from '@qax/ai-sdk'\n\nconst client = new QaxAI({ apiKey: 'your-api-key' })\nconst result = await client.chat({\n  model: '${props.capability?.id || 'model-id'}',\n  messages: [{ role: 'user', content: '你好' }]\n})`
  }
])

const steps = computed(() => {
  if (useDefault.value) {
    return defaultSteps.value
  }
  const raw = props.module.props?.steps
  if (Array.isArray(raw) && raw.length) return raw as Array<{ icon?: string; title: string; description: string; link?: string; code?: string }>
  return []
})

function copyCode(code: string) {
  navigator.clipboard.writeText(code)
}
</script>

<template>
  <div :class="[spacingTop, spacingBottom, bgClass]">
    <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
      {{ title }}
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        v-for="(step, i) in steps"
        :key="i"
        class="relative p-6 rounded-xl border border-gray-100 bg-white"
      >
        <!-- Step number -->
        <div class="absolute -top-3 -left-1 w-7 h-7 rounded-full bg-primary-600 text-white text-xs font-bold flex items-center justify-center">
          {{ i + 1 }}
        </div>

        <div class="flex items-center gap-3 mb-4 mt-1">
          <div class="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
            <UIcon :name="step.icon || 'i-lucide-circle-dot'" class="w-5 h-5 text-primary-600" />
          </div>
          <h3 class="font-semibold text-gray-900">{{ step.title }}</h3>
        </div>

        <p class="text-sm text-gray-500 mb-4">{{ step.description }}</p>

        <!-- Code block -->
        <div v-if="step.code" class="relative">
          <pre class="bg-gray-900 text-gray-100 text-xs rounded-lg p-4 overflow-x-auto"><code>{{ step.code }}</code></pre>
          <button
            class="absolute top-2 right-2 p-1.5 rounded-md bg-white/10 hover:bg-white/20 transition-colors"
            title="复制代码"
            @click="copyCode(step.code)"
          >
            <UIcon name="i-lucide-copy" class="w-3.5 h-3.5 text-gray-400" />
          </button>
        </div>

        <!-- Link -->
        <NuxtLink
          v-if="step.link"
          :to="step.link"
          class="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium mt-3"
        >
          {{ step.title }}
          <UIcon name="i-lucide-arrow-right" class="w-3.5 h-3.5" />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
