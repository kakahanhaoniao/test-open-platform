<script setup lang="ts">
const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const searchQuery = ref('')

const categories = [
  {
    name: '安全',
    icons: ['shield-check', 'shield-alert', 'shield', 'lock', 'scan-eye', 'eye', 'scan', 'siren']
  },
  {
    name: '通用',
    icons: ['brain', 'cpu', 'zap', 'globe', 'sparkles', 'lightbulb', 'rocket', 'target']
  },
  {
    name: '操作',
    icons: ['key', 'plus', 'arrow-right', 'copy', 'download', 'upload', 'settings', 'refresh-cw']
  },
  {
    name: '数据',
    icons: ['bar-chart-3', 'activity', 'trending-up', 'gauge', 'pie-chart', 'database', 'server', 'hard-drive']
  },
  {
    name: '通信',
    icons: ['message-square', 'mail', 'bell', 'phone', 'send', 'megaphone', 'radio', 'wifi']
  },
  {
    name: '文件',
    icons: ['file-text', 'file-code', 'file-check', 'clipboard', 'folder', 'archive', 'file', 'files']
  }
]

const filteredCategories = computed(() => {
  if (!searchQuery.value) return categories
  const q = searchQuery.value.toLowerCase()
  return categories
    .map(cat => ({
      ...cat,
      icons: cat.icons.filter(icon => icon.includes(q))
    }))
    .filter(cat => cat.icons.length > 0)
})

function iconFullName(name: string): string {
  return `i-lucide-${name}`
}

function selectIcon(name: string) {
  emit('update:modelValue', iconFullName(name))
}

function isSelected(name: string): boolean {
  return props.modelValue === iconFullName(name)
}
</script>

<template>
  <div class="space-y-3">
    <!-- Search -->
    <UInput
      v-model="searchQuery"
      icon="i-lucide-search"
      placeholder="搜索图标..."
      size="sm"
    />

    <!-- Icon grid by category -->
    <div class="max-h-80 overflow-y-auto space-y-4">
      <div
        v-for="category in filteredCategories"
        :key="category.name"
      >
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
          {{ category.name }}
        </p>
        <div class="grid grid-cols-8 gap-1">
          <button
            v-for="icon in category.icons"
            :key="icon"
            type="button"
            class="flex flex-col items-center justify-center p-1.5 rounded-md transition-all duration-150 hover:bg-gray-100 dark:hover:bg-gray-800"
            :class="[
              isSelected(icon)
                ? 'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : ''
            ]"
            :title="icon"
            @click="selectIcon(icon)"
          >
            <UIcon
              :name="iconFullName(icon)"
              class="w-5 h-5"
              :class="isSelected(icon) ? 'text-primary-500' : 'text-gray-600 dark:text-gray-300'"
            />
            <span
              class="text-[9px] mt-0.5 truncate w-full text-center leading-tight"
              :class="isSelected(icon) ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500'"
            >
              {{ icon }}
            </span>
          </button>
        </div>
      </div>

      <!-- Empty state -->
      <div
        v-if="filteredCategories.length === 0"
        class="text-center py-6 text-sm text-gray-400"
      >
        未找到匹配的图标
      </div>
    </div>
  </div>
</template>
