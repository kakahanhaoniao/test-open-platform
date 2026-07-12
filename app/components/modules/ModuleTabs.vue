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

const title = computed(() => props.module.props?.title || '')
const tabs = computed(() => {
  if (props.module.props?.tabs?.length) {
    return props.module.props.tabs
  }
  return props.module.children || []
})

const activeTab = ref(0)

const activeModules = computed(() => {
  const currentTab = tabs.value[activeTab.value]
  return currentTab?.children || []
})
</script>

<template>
  <div :class="[spacingTop, spacingBottom, bgClass]">
    <h2 v-if="title" class="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
      {{ title }}
    </h2>

    <!-- Tab headers -->
    <div class="flex gap-1 border-b border-gray-200 mb-6">
      <button
        v-for="(tab, i) in tabs"
        :key="i"
        class="px-4 py-2.5 text-sm font-medium transition-colors relative -mb-px border-b-2"
        :class="activeTab === i
          ? 'border-primary-600 text-primary-600'
          : 'border-transparent text-gray-500 hover:text-gray-700'"
        @click="activeTab = i"
      >
        {{ tab.name }}
      </button>
    </div>

    <!-- Tab content: render child modules recursively -->
    <div class="space-y-0">
      <template v-for="(child, i) in activeModules" :key="child.id || i">
        <ModulesModuleRenderer
          :module="child"
          :capability="capability"
          :capability-type="capabilityType"
        />
      </template>
    </div>
  </div>
</template>
