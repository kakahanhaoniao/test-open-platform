<script setup lang="ts">
import type { TemplateModule } from '~/data/mock'

const props = defineProps<{
  module: TemplateModule
  capability: any
  capabilityType: 'model' | 'app'
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

const componentName = computed(() => componentMap[props.module.type] || '')
</script>

<template>
  <component
    :is="componentName"
    v-if="componentName && module.visible !== false"
    :module="module"
    :capability="capability"
    :capability-type="capabilityType"
  />
</template>
