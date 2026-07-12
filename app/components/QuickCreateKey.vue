<script setup lang="ts">
const showDialog = ref(false)
const keyName = ref('')
const keyPermission = ref('read')
const generatedKey = ref('')
const isCreating = ref(false)
const copied = ref(false)

const permissionOptions = [
  { label: '只读 (Read)', value: 'read' },
  { label: '读写 (Read/Write)', value: 'read-write' },
  { label: '完全控制 (Full)', value: 'full' }
]

function openDialog() {
  keyName.value = ''
  keyPermission.value = 'read'
  generatedKey.value = ''
  copied.value = false
  showDialog.value = true
}

function generateMockKey() {
  const prefix = 'qax'
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let key = prefix + '_'
  for (let i = 0; i < 32; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return key
}

async function createKey() {
  if (!keyName.value.trim()) return
  isCreating.value = true
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800))
  generatedKey.value = generateMockKey()
  isCreating.value = false
}

async function copyKey() {
  if (!generatedKey.value) return
  try {
    await navigator.clipboard.writeText(generatedKey.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    // Fallback
    const textarea = document.createElement('textarea')
    textarea.value = generatedKey.value
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  }
}

function closeDialog() {
  showDialog.value = false
}
</script>

<template>
  <ClientOnly>
    <Teleport to="body">
      <!-- FAB Button -->
      <button
        class="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
        title="快速创建 API Key"
        @click="openDialog"
      >
        <UIcon name="i-lucide-key" class="w-6 h-6 group-hover:rotate-12 transition-transform duration-200" />
      </button>

      <!-- Dialog Overlay -->
      <div
        v-if="showDialog"
        class="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center"
        @click.self="closeDialog"
      >
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center">
                <UIcon name="i-lucide-key" class="w-5 h-5 text-primary-600" />
              </div>
              <h3 class="text-base font-bold text-gray-900">快速创建 API Key</h3>
            </div>
            <button
              class="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
              @click="closeDialog"
            >
              <UIcon name="i-lucide-x" class="w-5 h-5" />
            </button>
          </div>

          <!-- Body -->
          <div class="px-6 py-5 space-y-4">
            <!-- Generated Key Display -->
            <div v-if="generatedKey" class="space-y-3">
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-check-circle" class="w-5 h-5 text-green-500" />
                <span class="text-sm font-semibold text-green-700">Key 创建成功</span>
              </div>
              <div class="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p class="text-xs text-gray-500 mb-2">请妥善保存此密钥，关闭后将无法再次查看</p>
                <div class="flex items-center gap-2">
                  <code class="flex-1 text-xs font-mono text-gray-800 bg-white rounded-lg px-3 py-2 border border-gray-200 break-all select-all">
                    {{ generatedKey }}
                  </code>
                  <button
                    class="shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
                    :class="copied ? 'bg-green-100 text-green-700' : 'bg-primary-50 text-primary-600 hover:bg-primary-100'"
                    @click="copyKey"
                  >
                    <UIcon v-if="copied" name="i-lucide-check" class="w-4 h-4" />
                    <UIcon v-else name="i-lucide-copy" class="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div class="flex items-center gap-2 text-xs text-gray-400">
                <UIcon name="i-lucide-info" class="w-3.5 h-3.5" />
                <span>名称: {{ keyName }} | 权限: {{ keyPermission }}</span>
              </div>
            </div>

            <!-- Create Form -->
            <template v-else>
              <!-- Key Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Key 名称</label>
                <input
                  v-model="keyName"
                  type="text"
                  placeholder="例如: 生产环境密钥"
                  class="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  @keydown.enter="createKey"
                />
              </div>

              <!-- Permission Select -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">权限级别</label>
                <div class="grid grid-cols-3 gap-2">
                  <button
                    v-for="opt in permissionOptions"
                    :key="opt.value"
                    class="px-3 py-2 rounded-lg text-xs font-medium border transition-all"
                    :class="keyPermission === opt.value
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50'"
                    @click="keyPermission = opt.value"
                  >
                    {{ opt.label.split(' ')[0] }}
                  </button>
                </div>
              </div>

              <!-- Info -->
              <div class="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-100">
                <UIcon name="i-lucide-alert-triangle" class="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p class="text-xs text-amber-700">创建后请立即复制并妥善保存，密钥仅显示一次。</p>
              </div>
            </template>
          </div>

          <!-- Footer -->
          <div class="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              class="px-4 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
              @click="closeDialog"
            >
              {{ generatedKey ? '关闭' : '取消' }}
            </button>
            <button
              v-if="!generatedKey"
              class="px-4 py-2 rounded-lg text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="!keyName.trim() || isCreating"
              @click="createKey"
            >
              <span v-if="isCreating" class="flex items-center gap-2">
                <UIcon name="i-lucide-loader-2" class="w-4 h-4 animate-spin" />
                创建中...
              </span>
              <span v-else>创建 Key</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </ClientOnly>
</template>
