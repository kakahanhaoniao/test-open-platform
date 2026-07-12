<script setup lang="ts">
import type { TemplateModule } from '~/data/mock'

const props = defineProps<{
  modules: TemplateModule[]
  selectedModuleId: string | null
  capability: any
  capabilityType: 'model' | 'app'
}>()

const emit = defineEmits<{
  'select-module': [id: string]
}>()

const componentMap: Record<string, string> = {
  banner: 'ModulesModuleBanner',
  hero: 'ModulesModuleHero',
  intro: 'ModulesModuleIntro',
  features: 'ModulesModuleFeatures',
  advantages: 'ModulesModuleAdvantages',
  scenarios: 'ModulesModuleScenarios',
  tabs: 'ModulesModuleTabs',
  carousel: 'ModulesModuleCarousel',
  cards: 'ModulesModuleCards',
  steps: 'ModulesModuleSteps',
  pricing: 'ModulesModulePricing',
  integration: 'ModulesModuleIntegration',
  related: 'ModulesModuleRelated'
}

const visibleModules = computed(() =>
  props.modules.filter(m => m.visible !== false).sort((a, b) => a.order - b.order)
)
</script>

<template>
  <div class="bg-white rounded-xl border border-gray-100 overflow-hidden">
    <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100">
      <h2 class="text-sm font-semibold text-gray-700">实时预览</h2>
      <span class="text-xs text-gray-400">点击模块可选中编辑</span>
    </div>
    <div class="p-4 bg-[#FAFAFA] max-h-[calc(100vh-180px)] overflow-y-auto space-y-0">
      <div
        v-for="mod in visibleModules"
        :key="mod.id"
        class="relative cursor-pointer transition-all duration-150"
        :class="[
          selectedModuleId === mod.id
            ? 'ring-2 ring-primary-500 ring-offset-2 rounded-xl'
            : 'hover:ring-1 hover:ring-gray-300 hover:rounded-xl'
        ]"
        @click="emit('select-module', mod.id)"
      >
        <!-- Selected indicator -->
        <div
          v-if="selectedModuleId === mod.id"
          class="absolute top-2 right-2 z-10 px-2 py-0.5 bg-primary-500 text-white text-xs rounded-full"
        >
          {{ mod.type }}
        </div>
        <component
          :is="componentMap[mod.type]"
          v-if="componentMap[mod.type]"
          :module="mod"
          :capability="capability"
          :capability-type="capabilityType"
        />
      </div>

      <!-- Empty state -->
      <div
        v-if="visibleModules.length === 0"
        class="text-center py-16 text-gray-400"
      >
        <UIcon name="i-lucide-layout-template" class="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p class="text-sm">暂无模块，请从左侧添加</p>
      </div>
    </div>
  </div>
</template>
