<script setup lang="ts">
useHead({
  title: '注册 - 奇安信AI开放平台',
  meta: [
    { name: 'description', content: '注册奇安信AI开放平台，免费体验AI安全能力。' }
  ]
})

const state = reactive({
  company: '',
  email: '',
  password: '',
  confirmPassword: '',
  agree: false
})

const loading = ref(false)

const handleRegister = () => {
  loading.value = true
  // Demo: simulate register then redirect to dev console
  setTimeout(() => {
    loading.value = false
    navigateTo('/dev')
  }, 1500)
}
</script>

<template>
  <div class="min-h-screen bg-[#FAFAFA] flex flex-col">
    <PortalNav />

    <div class="flex-1 flex items-center justify-center px-6 py-12">
      <div class="w-full max-w-md">
        <!-- Register Card -->
        <div class="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          <!-- Header -->
          <div class="text-center mb-8">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center mx-auto mb-4">
              <UIcon name="i-lucide-rocket" class="w-6 h-6 text-white" />
            </div>
            <h1 class="text-2xl font-bold text-gray-900 mb-2">创建账号</h1>
            <p class="text-sm text-gray-500">注册即可获得1000万Token免费体验额度</p>
          </div>

          <!-- Benefits -->
          <div class="bg-primary-50/50 rounded-xl border border-primary-100 p-4 mb-6">
            <div class="grid grid-cols-2 gap-3">
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-check-circle-2" class="w-4 h-4 text-primary-500 shrink-0" />
                <span class="text-xs text-gray-600">1000万Token免费额度</span>
              </div>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-check-circle-2" class="w-4 h-4 text-primary-500 shrink-0" />
                <span class="text-xs text-gray-600">全模型体验权限</span>
              </div>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-check-circle-2" class="w-4 h-4 text-primary-500 shrink-0" />
                <span class="text-xs text-gray-600">无需信用卡</span>
              </div>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-check-circle-2" class="w-4 h-4 text-primary-500 shrink-0" />
                <span class="text-xs text-gray-600">7天无理由退款</span>
              </div>
            </div>
          </div>

          <!-- Form -->
          <form class="space-y-5" @submit.prevent="handleRegister">
            <!-- Company Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">公司名称</label>
              <UInput
                v-model="state.company"
                placeholder="请输入公司名称"
                icon="i-lucide-building-2"
                size="lg"
              />
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">邮箱地址</label>
              <UInput
                v-model="state.email"
                type="email"
                placeholder="请输入工作邮箱"
                icon="i-lucide-mail"
                size="lg"
              />
            </div>

            <!-- Password -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">密码</label>
              <UInput
                v-model="state.password"
                type="password"
                placeholder="至少8位，含字母和数字"
                icon="i-lucide-lock"
                size="lg"
              />
            </div>

            <!-- Confirm Password -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">确认密码</label>
              <UInput
                v-model="state.confirmPassword"
                type="password"
                placeholder="请再次输入密码"
                icon="i-lucide-lock"
                size="lg"
              />
            </div>

            <!-- Agreement -->
            <div class="flex items-start gap-2">
              <input
                id="agree"
                v-model="state.agree"
                type="checkbox"
                class="w-4 h-4 mt-0.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label for="agree" class="text-sm text-gray-500">
                我已阅读并同意
                <NuxtLink to="#" class="text-primary-600 hover:text-primary-700 font-medium">服务条款</NuxtLink>
                和
                <NuxtLink to="#" class="text-primary-600 hover:text-primary-700 font-medium">隐私政策</NuxtLink>
              </label>
            </div>

            <!-- Submit -->
            <UButton
              type="submit"
              label="创建账号"
              color="primary"
              block
              size="lg"
              :loading="loading"
              :disabled="!state.agree"
            />
          </form>

          <!-- Divider -->
          <div class="relative my-8">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-100" />
            </div>
            <div class="relative flex justify-center text-xs">
              <span class="px-3 bg-white text-gray-400">或使用以下方式注册</span>
            </div>
          </div>

          <!-- Social Login -->
          <div class="grid grid-cols-2 gap-3">
            <UButton
              label="企业微信"
              icon="i-lucide-message-square"
              variant="outline"
              color="neutral"
              block
              size="lg"
              @click="navigateTo('/dev')"
            />
            <UButton
              label="钉钉"
              icon="i-lucide-smartphone"
              variant="outline"
              color="neutral"
              block
              size="lg"
              @click="navigateTo('/dev')"
            />
          </div>

          <!-- Login Link -->
          <p class="text-center text-sm text-gray-500 mt-8">
            已有账号？
            <NuxtLink to="/portal/login" class="text-primary-600 hover:text-primary-700 font-semibold">
              立即登录
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-100 py-6">
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex items-center justify-center gap-6 text-xs text-gray-400">
          <span>&copy; 2026 奇安信科技集团</span>
          <span>隐私政策</span>
          <span>服务条款</span>
          <span>帮助中心</span>
        </div>
      </div>
    </footer>
  </div>
</template>
