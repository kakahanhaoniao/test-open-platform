<script setup lang="ts">
import type { TemplateModule } from '~/data/mock'
import ModuleBanner from './ModuleBanner.vue'
import ModuleHero from './ModuleHero.vue'
import ModuleIntro from './ModuleIntro.vue'
import ModuleFeatures from './ModuleFeatures.vue'
import ModuleAdvantages from './ModuleAdvantages.vue'
import ModuleScenarios from './ModuleScenarios.vue'
import ModuleTabs from './ModuleTabs.vue'
import ModuleCarousel from './ModuleCarousel.vue'
import ModuleCards from './ModuleCards.vue'
import ModuleSteps from './ModuleSteps.vue'
import ModulePricing from './ModulePricing.vue'
import ModuleIntegration from './ModuleIntegration.vue'
import ModuleRelated from './ModuleRelated.vue'

const props = defineProps<{
  module: TemplateModule
  capability: any
  capabilityType: 'model' | 'app'
}>()

const componentMap: Record<string, any> = {
  banner: ModuleBanner,
  hero: ModuleHero,
  intro: ModuleIntro,
  features: ModuleFeatures,
  advantages: ModuleAdvantages,
  scenarios: ModuleScenarios,
  tabs: ModuleTabs,
  carousel: ModuleCarousel,
  cards: ModuleCards,
  steps: ModuleSteps,
  pricing: ModulePricing,
  integration: ModuleIntegration,
  related: ModuleRelated
}

const resolvedComponent = computed(() => componentMap[props.module.type])
</script>

<template>
  <component
    :is="resolvedComponent"
    v-if="resolvedComponent && module.visible !== false"
    :module="module"
    :capability="capability"
    :capability-type="capabilityType"
  />
</template>
