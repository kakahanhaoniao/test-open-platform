<script setup lang="ts">
import { getAppById } from '~/data/mock'

const route = useRoute()
const app = computed(() => getAppById(route.params.id as string))

// Chat demo state
const chatMessages = ref<{ role: string; content: string }[]>([])
const chatInput = ref('')
const chatLoading = ref(false)

// Tool demo state
const toolForm = ref({ target: '', scanType: 'web' })

function sendChatMessage() {
  if (!chatInput.value.trim()) return
  chatMessages.value.push({ role: 'user', content: chatInput.value })
  chatLoading.value = true
  const msg = chatInput.value
  chatInput.value = ''
  setTimeout(() => {
    chatMessages.value.push({
      role: 'assistant',
      content: `基于${app.value?.name || 'AI助手'}的分析：\n\n针对"${msg}"，我已完成安全分析。根据当前威胁情报与安全知识库的关联分析，该目标存在以下安全风险：\n\n1. 发现2个高危漏洞\n2. 关联到1个已知APT组织\n3. 建议立即进行安全加固\n\n详细分析报告已生成，是否需要进一步了解？`
    })
    chatLoading.value = false
  }, 1500)
}

function runToolScan() {
  chatLoading.value = true
  setTimeout(() => {
    chatMessages.value.push({
      role: 'assistant',
      content: `扫描任务已启动！\n\n目标：${toolForm.value.target}\n扫描类型：${toolForm.value.scanType === 'web' ? 'Web应用' : '主机安全'}\n\n扫描进度：100%\n\n发现结果：\n- 高危漏洞：2个\n- 中危漏洞：5个\n- 低危漏洞：8个\n- 配置基线偏差：3项\n\n详细报告已生成，可下载查看。`
    })
    chatLoading.value = false
  }, 2000)
}

useHead({
  title: computed(() => app.value ? `${app.value.name} - 奇安信AI开放平台` : '应用详情 - 奇安信AI开放平台')
})
</script>

<template>
  <div v-if="app" class="p-6 md:p-8">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-gray-400 mb-6">
      <NuxtLink to="/apps" class="hover:text-primary-600 transition-colors">应用中心</NuxtLink>
      <UIcon name="i-lucide-chevron-right" class="w-3 h-3" />
      <span class="text-gray-700">{{ app.name }}</span>
    </div>

    <!-- App header -->
    <div class="bg-white rounded-xl border border-gray-100 p-6 mb-6">
      <div class="flex flex-col md:flex-row md:items-start gap-6">
        <div
          class="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
          :style="{ backgroundColor: app.typeColor + '12' }"
        >
          <UIcon :name="app.icon" class="w-8 h-8" :style="{ color: app.typeColor }" />
        </div>

        <div class="flex-1">
          <div class="flex items-center gap-3 mb-2">
            <h1 class="text-2xl font-bold text-gray-900">{{ app.name }}</h1>
            <span
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium"
              :style="{ backgroundColor: app.typeColor + '10', color: app.typeColor }"
            >
              <UIcon :name="app.typeIcon" class="w-3 h-3" />
              {{ app.typeName }}
            </span>
            <span
              v-if="app.hot"
              class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-600"
            >
              <UIcon name="i-lucide-flame" class="w-3 h-3 mr-1" />
              热门
            </span>
            <span
              v-if="app.new"
              class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-50 text-primary-600"
            >
              NEW
            </span>
          </div>

          <p class="text-gray-500 mb-4">{{ app.description }}</p>

          <div class="flex flex-wrap items-center gap-3">
            <div class="flex items-center gap-1">
              <UIcon name="i-lucide-star" class="w-4 h-4 text-amber-400 fill-amber-400" />
              <span class="text-sm font-medium text-gray-700">{{ app.rating }}</span>
            </div>
            <span class="text-sm text-gray-400">{{ app.useCount }}人使用</span>
          </div>
        </div>

        <div class="flex flex-col gap-2 shrink-0">
          <!-- Different CTA based on app type -->
          <UButton
            v-if="app.type === 'external-link'"
            size="lg"
            color="primary"
            icon="i-lucide-external-link"
          >
            访问应用
          </UButton>
          <UButton
            v-else-if="app.type === 'chat'"
            size="lg"
            color="primary"
            icon="i-lucide-message-square"
          >
            开始对话
          </UButton>
          <UButton
            v-else-if="app.type === 'tool'"
            size="lg"
            color="primary"
            icon="i-lucide-wrench"
          >
            使用工具
          </UButton>
          <UButton
            v-else
            size="lg"
            color="primary"
            icon="i-lucide-eye"
          >
            查看展示
          </UButton>
        </div>
      </div>
    </div>

    <!-- Dynamic content based on app type -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left: Main content area -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Chat type: Chat interface -->
        <div v-if="app.type === 'chat'" class="deep-block rounded-xl overflow-hidden">
          <div class="flex items-center justify-between px-5 py-3 border-b border-white/10">
            <div class="flex items-center gap-3">
              <UIcon :name="app.icon" class="w-5 h-5 text-primary-300" />
              <span class="text-white font-medium text-sm">{{ app.name }}</span>
            </div>
            <span class="text-white/40 text-xs">在线</span>
          </div>

          <div class="p-5 min-h-[350px] max-h-[450px] overflow-y-auto">
            <!-- Welcome -->
            <div v-if="chatMessages.length === 0 && !chatLoading" class="flex flex-col items-center justify-center h-[300px]">
              <div class="w-16 h-16 rounded-2xl bg-primary-600/30 flex items-center justify-center mb-4">
                <UIcon :name="app.icon" class="w-8 h-8 text-primary-300" />
              </div>
              <p class="text-white/60 text-sm mb-2">{{ app.name }}</p>
              <p class="text-white/40 text-xs">输入问题开始对话</p>
            </div>

            <!-- Messages -->
            <div v-for="(msg, i) in chatMessages" :key="i" class="mb-4">
              <div v-if="msg.role === 'user'" class="flex justify-end">
                <div class="bg-primary-600/30 rounded-xl rounded-tr-sm px-4 py-2.5 max-w-[80%]">
                  <p class="text-white/90 text-sm">{{ msg.content }}</p>
                </div>
              </div>
              <div v-else class="flex items-start gap-3">
                <div class="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <UIcon :name="app.icon" class="w-4 h-4 text-primary-300" />
                </div>
                <div class="bg-white/5 rounded-xl rounded-tl-sm px-4 py-3 max-w-[85%]">
                  <p class="text-white/80 text-sm whitespace-pre-wrap leading-relaxed">{{ msg.content }}</p>
                </div>
              </div>
            </div>

            <!-- Loading -->
            <div v-if="chatLoading" class="flex items-start gap-3">
              <div class="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                <UIcon :name="app.icon" class="w-4 h-4 text-primary-300" />
              </div>
              <div class="bg-white/5 rounded-xl rounded-tl-sm px-4 py-3">
                <div class="flex items-center gap-1.5">
                  <span class="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce" style="animation-delay: 0ms;" />
                  <span class="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce" style="animation-delay: 150ms;" />
                  <span class="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce" style="animation-delay: 300ms;" />
                </div>
              </div>
            </div>
          </div>

          <div class="px-5 py-4 border-t border-white/10">
            <div class="flex items-center gap-3">
              <input
                v-model="chatInput"
                type="text"
                placeholder="输入消息..."
                class="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-primary-500/50 transition-all"
                @keydown.enter="sendChatMessage"
              >
              <button
                class="w-10 h-10 rounded-lg bg-primary-600 flex items-center justify-center hover:bg-primary-500 transition-colors disabled:opacity-50"
                :disabled="chatLoading || !chatInput.trim()"
                @click="sendChatMessage"
              >
                <UIcon name="i-lucide-send" class="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>

        <!-- Tool type: Form interface -->
        <div v-else-if="app.type === 'tool'" class="bg-white rounded-xl border border-gray-100 p-6">
          <h2 class="text-lg font-bold text-gray-900 mb-4">工具配置</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">扫描目标</label>
              <input
                v-model="toolForm.target"
                type="text"
                placeholder="输入IP地址、域名或URL..."
                class="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">扫描类型</label>
              <div class="flex gap-3">
                <button
                  class="px-4 py-2 rounded-lg text-sm transition-all"
                  :class="toolForm.scanType === 'web'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'"
                  @click="toolForm.scanType = 'web'"
                >
                  Web应用
                </button>
                <button
                  class="px-4 py-2 rounded-lg text-sm transition-all"
                  :class="toolForm.scanType === 'host'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'"
                  @click="toolForm.scanType = 'host'"
                >
                  主机安全
                </button>
              </div>
            </div>
            <UButton
              color="primary"
              size="lg"
              icon="i-lucide-play"
              :loading="chatLoading"
              @click="runToolScan"
            >
              开始扫描
            </UButton>
          </div>

          <!-- Results area -->
          <div v-if="chatMessages.length > 0" class="mt-6 p-4 rounded-lg bg-gray-50">
            <h3 class="text-sm font-medium text-gray-700 mb-2">扫描结果</h3>
            <div v-for="(msg, i) in chatMessages.filter(m => m.role === 'assistant')" :key="i">
              <p class="text-sm text-gray-600 whitespace-pre-wrap">{{ msg.content }}</p>
            </div>
          </div>
        </div>

        <!-- Showcase type: Visual display -->
        <div v-else-if="app.type === 'showcase'" class="deep-block rounded-xl overflow-hidden">
          <div class="p-8">
            <div class="flex items-center gap-3 mb-6">
              <UIcon :name="app.icon" class="w-6 h-6 text-primary-300" />
              <h2 class="text-lg font-bold text-white">{{ app.name }}</h2>
            </div>
            <!-- Simulated dashboard -->
            <div class="grid grid-cols-3 gap-4 mb-6">
              <div class="bg-white/5 rounded-lg p-4 border border-white/10">
                <p class="text-white/40 text-xs mb-1">实时告警</p>
                <p class="text-2xl font-bold text-white">1,247</p>
                <p class="text-red-400 text-xs mt-1">+12% 较昨日</p>
              </div>
              <div class="bg-white/5 rounded-lg p-4 border border-white/10">
                <p class="text-white/40 text-xs mb-1">威胁事件</p>
                <p class="text-2xl font-bold text-white">89</p>
                <p class="text-amber-400 text-xs mt-1">+5% 较昨日</p>
              </div>
              <div class="bg-white/5 rounded-lg p-4 border border-white/10">
                <p class="text-white/40 text-xs mb-1">已处置</p>
                <p class="text-2xl font-bold text-accent-400">94.2%</p>
                <p class="text-accent-300 text-xs mt-1">处置率</p>
              </div>
            </div>
            <!-- Simulated chart area -->
            <div class="bg-white/5 rounded-lg p-4 border border-white/10 h-40 flex items-center justify-center">
              <div class="text-center">
                <UIcon name="i-lucide-activity" class="w-8 h-8 text-primary-400 mb-2" />
                <p class="text-white/40 text-sm">安全态势实时监控大屏</p>
                <p class="text-white/20 text-xs mt-1">可视化展示区域</p>
              </div>
            </div>
          </div>
        </div>

        <!-- External link type: Info + link -->
        <div v-else-if="app.type === 'external-link'" class="bg-white rounded-xl border border-gray-100 p-6">
          <h2 class="text-lg font-bold text-gray-900 mb-4">应用详情</h2>
          <p class="text-gray-600 leading-relaxed mb-6">{{ app.detail }}</p>
          <div class="p-4 rounded-lg bg-primary-50 border border-primary-100">
            <div class="flex items-center gap-3">
              <UIcon name="i-lucide-external-link" class="w-5 h-5 text-primary-600" />
              <div>
                <p class="text-sm font-medium text-primary-700">访问外部应用</p>
                <p class="text-xs text-primary-500">{{ app.link || '点击上方按钮访问应用' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- App detail text -->
        <div class="bg-white rounded-xl border border-gray-100 p-6">
          <h2 class="text-lg font-bold text-gray-900 mb-4">详细介绍</h2>
          <p class="text-gray-600 leading-relaxed">{{ app.detail }}</p>
        </div>
      </div>

      <!-- Right: Sidebar info -->
      <div class="space-y-6">
        <!-- Features -->
        <div class="bg-white rounded-xl border border-gray-100 p-6">
          <h2 class="text-lg font-bold text-gray-900 mb-4">核心功能</h2>
          <ul class="space-y-3">
            <li
              v-for="feature in app.features"
              :key="feature"
              class="flex items-center gap-2 text-sm text-gray-600"
            >
              <UIcon name="i-lucide-check-circle" class="w-4 h-4 text-primary-500 shrink-0" />
              {{ feature }}
            </li>
          </ul>
        </div>

        <!-- Tags -->
        <div class="bg-white rounded-xl border border-gray-100 p-6">
          <h2 class="text-lg font-bold text-gray-900 mb-4">标签</h2>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in app.tags"
              :key="tag"
              class="px-3 py-1.5 rounded-lg text-sm bg-gray-50 text-gray-600"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <!-- Info card -->
        <div class="bg-white rounded-xl border border-gray-100 p-6">
          <h2 class="text-lg font-bold text-gray-900 mb-4">应用信息</h2>
          <div class="space-y-3">
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-400">应用类型</span>
              <span class="text-gray-700 font-medium">{{ app.typeName }}</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-400">用户评分</span>
              <div class="flex items-center gap-1">
                <UIcon name="i-lucide-star" class="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span class="text-gray-700 font-medium">{{ app.rating }}</span>
              </div>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-400">使用人数</span>
              <span class="text-gray-700 font-medium">{{ app.useCount }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 404 state -->
  <div v-else class="flex flex-col items-center justify-center py-20">
    <UIcon name="i-lucide-search-x" class="w-16 h-16 text-gray-300 mb-4" />
    <p class="text-gray-400 text-lg mb-2">应用未找到</p>
    <NuxtLink to="/apps">
      <UButton variant="soft" color="primary">返回应用中心</UButton>
    </NuxtLink>
  </div>
</template>
