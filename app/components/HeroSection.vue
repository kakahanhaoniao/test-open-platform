<script setup lang="ts">
interface Props {
  title?: string
  subtitle?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '奇安信AI开放平台',
  subtitle: '以AI之力，守护数字世界安全'
})
</script>

<template>
  <section class="deep-block relative overflow-hidden rounded-2xl">
    <!-- Animated background dots -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="hero-dot" style="top: 15%; left: 10%; animation-delay: 0s;" />
      <div class="hero-dot" style="top: 25%; left: 30%; animation-delay: 0.5s;" />
      <div class="hero-dot" style="top: 60%; left: 20%; animation-delay: 1s;" />
      <div class="hero-dot" style="top: 40%; left: 70%; animation-delay: 1.5s;" />
      <div class="hero-dot" style="top: 70%; left: 80%; animation-delay: 2s;" />
      <div class="hero-dot" style="top: 20%; left: 60%; animation-delay: 0.3s;" />
      <div class="hero-dot" style="top: 80%; left: 45%; animation-delay: 0.8s;" />
      <div class="hero-dot" style="top: 50%; left: 90%; animation-delay: 1.2s;" />
      <!-- Grid lines -->
      <div class="absolute inset-0 opacity-[0.03]" style="background-image: linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px); background-size: 60px 60px;" />
    </div>

    <!-- Gradient overlay -->
    <div class="absolute inset-0 bg-gradient-to-r from-primary-900/80 via-primary-800/40 to-transparent" />

    <div class="relative z-10 px-8 py-16 md:px-12 md:py-20">
      <slot name="badge">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-6">
          <span class="w-2 h-2 rounded-full bg-accent-400 badge-pulse" />
          <span class="text-white/80 text-xs font-medium">AI安全能力开放平台</span>
        </div>
      </slot>

      <h1 class="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
        <slot name="title">
          {{ title }}
        </slot>
      </h1>

      <p class="text-white/60 text-lg md:text-xl max-w-2xl mb-8">
        <slot name="subtitle">
          {{ subtitle }}
        </slot>
      </p>

      <slot name="actions">
        <div class="flex flex-wrap gap-4">
          <UButton
            size="xl"
            class="bg-white text-primary-700 hover:bg-white/90 font-semibold"
            trailing-icon="i-lucide-arrow-right"
          >
            开始使用
          </UButton>
          <UButton
            size="xl"
            variant="outline"
            class="border-white/20 text-white hover:bg-white/10"
            icon="i-lucide-play-circle"
          >
            观看演示
          </UButton>
        </div>
      </slot>

      <!-- Stats -->
      <slot name="stats">
        <div class="flex flex-wrap gap-8 mt-12 pt-8 border-t border-white/10">
          <div>
            <p class="text-2xl md:text-3xl font-bold text-white">10+</p>
            <p class="text-white/40 text-sm mt-1">AI安全模型</p>
          </div>
          <div>
            <p class="text-2xl md:text-3xl font-bold text-white">8+</p>
            <p class="text-white/40 text-sm mt-1">安全应用</p>
          </div>
          <div>
            <p class="text-2xl md:text-3xl font-bold text-white">5000万+</p>
            <p class="text-white/40 text-sm mt-1">累计调用次数</p>
          </div>
          <div>
            <p class="text-2xl md:text-3xl font-bold text-white">99.9%</p>
            <p class="text-white/40 text-sm mt-1">服务可用性</p>
          </div>
        </div>
      </slot>
    </div>
  </section>
</template>

<style scoped>
@keyframes hero-dot-float {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.5);
  }
}

.hero-dot {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--color-primary-400);
  animation: hero-dot-float 4s ease-in-out infinite;
}
</style>
