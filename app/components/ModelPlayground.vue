<script setup lang="ts">
import type { Model } from '~/data/mock'

const props = defineProps<{
  model: Model
}>()

const inputText = ref('')
const outputText = ref('')
const loading = ref(false)
const activeTab = ref('chat')

const samplePrompts = [
  '分析这个IP地址的威胁等级：192.168.1.100',
  '如何检测SQL注入攻击？',
  '解读CVE-2024-1234漏洞的影响范围',
  '生成一份等保2.0三级合规检查清单'
]

function handleSend() {
  if (!inputText.value.trim()) return
  loading.value = true
  // Simulate AI response
  setTimeout(() => {
    outputText.value = `基于${props.model.name}的分析结果：\n\n针对您的问题"${inputText.value}"，经过深度安全知识推理，分析如下：\n\n1. **威胁评估**：根据当前安全态势分析，该目标存在中等风险等级。\n\n2. **关联情报**：关联到3个已知威胁组织活动，最近一次活跃时间为2026年7月。\n\n3. **处置建议**：建议立即采取以下措施：\n   - 加强访问控制策略\n   - 部署入侵检测规则\n   - 更新安全防护策略\n\n4. **风险评分**：7.2/10 (HIGH)\n\n> 以上分析基于${props.model.typeName}模型，仅供参考，请结合实际情况综合判断。`
    loading.value = false
  }, 1500)
}

function useSamplePrompt(prompt: string) {
  inputText.value = prompt
  handleSend()
}
</script>

<template>
  <div class="deep-block rounded-xl overflow-hidden">
    <!-- Header -->
    <div class="flex items-center justify-between px-5 py-3 border-b border-white/10">
      <div class="flex items-center gap-3">
        <div
          class="w-8 h-8 rounded-lg flex items-center justify-center"
          :style="{ backgroundColor: model.typeColor + '30' }"
        >
          <UIcon :name="model.icon" class="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 class="text-white font-medium text-sm">{{ model.name }} 体验</h3>
          <p class="text-white/40 text-xs">在线体验 · 即时响应</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span class="px-2 py-0.5 rounded text-[10px] bg-white/10 text-white/60">免费体验</span>
      </div>
    </div>

    <!-- Chat area -->
    <div class="p-5 min-h-[300px] max-h-[400px] overflow-y-auto">
      <!-- Welcome message -->
      <div v-if="!outputText && !loading" class="flex flex-col items-center justify-center h-[260px]">
        <div class="w-16 h-16 rounded-2xl bg-primary-600/30 flex items-center justify-center mb-4">
          <UIcon :name="model.icon" class="w-8 h-8 text-primary-300" />
        </div>
        <p class="text-white/60 text-sm mb-6">输入问题，体验{{ model.name }}的安全分析能力</p>
        <div class="flex flex-wrap gap-2 justify-center max-w-md">
          <button
            v-for="prompt in samplePrompts"
            :key="prompt"
            class="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/50 text-xs hover:bg-white/10 hover:text-white/80 transition-all"
            @click="useSamplePrompt(prompt)"
          >
            {{ prompt }}
          </button>
        </div>
      </div>

      <!-- User message -->
      <div v-if="inputText && (outputText || loading)" class="mb-4">
        <div class="flex justify-end">
          <div class="bg-primary-600/30 rounded-xl rounded-tr-sm px-4 py-2.5 max-w-[80%]">
            <p class="text-white/90 text-sm">{{ inputText }}</p>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex items-start gap-3">
        <div class="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
          <UIcon :name="model.icon" class="w-4 h-4 text-primary-300" />
        </div>
        <div class="bg-white/5 rounded-xl rounded-tl-sm px-4 py-3">
          <div class="flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce" style="animation-delay: 0ms;" />
            <span class="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce" style="animation-delay: 150ms;" />
            <span class="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce" style="animation-delay: 300ms;" />
          </div>
        </div>
      </div>

      <!-- AI response -->
      <div v-if="outputText && !loading" class="flex items-start gap-3">
        <div class="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
          <UIcon :name="model.icon" class="w-4 h-4 text-primary-300" />
        </div>
        <div class="bg-white/5 rounded-xl rounded-tl-sm px-4 py-3 max-w-[85%]">
          <p class="text-white/80 text-sm whitespace-pre-wrap leading-relaxed">{{ outputText }}</p>
        </div>
      </div>
    </div>

    <!-- Input area -->
    <div class="px-5 py-4 border-t border-white/10">
      <div class="flex items-center gap-3">
        <input
          v-model="inputText"
          type="text"
          :placeholder="`向${model.name}提问...`"
          class="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/20 transition-all"
          @keydown.enter="handleSend"
        >
        <button
          class="w-10 h-10 rounded-lg bg-primary-600 flex items-center justify-center hover:bg-primary-500 transition-colors disabled:opacity-50"
          :disabled="loading || !inputText.trim()"
          @click="handleSend"
        >
          <UIcon name="i-lucide-send" class="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  </div>
</template>
