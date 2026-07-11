<script setup lang="ts">
import type { Activity } from '~/data/mock'

defineProps<{
  promotions: Activity[]
}>()
</script>

<template>
  <div class="w-full overflow-hidden">
    <div class="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
      <NuxtLink
        v-for="promo in promotions"
        :key="promo.id"
        to="/promotions"
        class="snap-start shrink-0 min-w-[320px] md:min-w-[400px] group"
      >
        <div
          class="relative rounded-2xl p-5 overflow-hidden h-[120px] flex items-center"
          :class="`bg-gradient-to-r ${promo.gradient}`"
        >
          <!-- Decorative circles -->
          <div class="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10" />
          <div class="absolute -right-2 -bottom-8 w-20 h-20 rounded-full bg-white/5" />

          <div class="relative z-10 flex items-center gap-4 w-full">
            <div class="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
              <UIcon :name="promo.icon" class="w-6 h-6 text-white" />
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-white font-bold text-sm">{{ promo.title }}</span>
                <span class="px-2 py-0.5 rounded-full bg-white/20 text-white text-xs font-bold px-2">
                  {{ promo.discountText }}
                </span>
              </div>
              <p class="text-white/80 text-xs leading-relaxed line-clamp-2">
                {{ promo.description }}
              </p>
            </div>
            <UIcon name="i-lucide-chevron-right" class="w-5 h-5 text-white/60 group-hover:text-white/90 group-hover:translate-x-0.5 transition-all shrink-0" />
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
