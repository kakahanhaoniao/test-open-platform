<script setup lang="ts">
useHead({
  title: '登录 - 奇安信AI开放平台',
  meta: [
    { name: 'description', content: '登录奇安信AI开放平台，体验AI安全能力。' }
  ]
})

const state = reactive({
  email: '',
  password: ''
})

const loading = ref(false)

const handleLogin = () => {
  loading.value = true
  // Demo: simulate login then redirect to dev console
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
        <!-- Login Card -->
        <div class="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          <!-- Header -->
          <div class="text-center mb-8">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center mx-auto mb-4">
              <UIcon name="i-lucide-shield-check" class="w-6 h-6 text-white" />
            </div>
            <h1 class="text-2xl font-bold text-gray-900 mb-2">登录奇安信AI开放平台</h1>
            <p class="text-sm text-gray-500">欢迎回来，请登录您的账号</p>
          </div>

          <!-- Form -->
          <form class="space-y-5" @submit.prevent="handleLogin">
            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">邮箱地址</label>
              <UInput
                v-model="state.email"
                type="email"
                placeholder="请输入邮箱地址"
                icon="i-lucide-mail"
                size="lg"
              />
            </div>

            <!-- Password -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="block text-sm font-medium text-gray-700">密码</label>
                <NuxtLink to="#" class="text-xs text-primary-600 hover:text-primary-700 font-medium">
                  忘记密码？
                </NuxtLink>
              </div>
              <UInput
                v-model="state.password"
                type="password"
                placeholder="请输入密码"
                icon="i-lucide-lock"
                size="lg"
              />
            </div>

            <!-- Remember me -->
            <div class="flex items-center gap-2">
              <input
                id="remember"
                type="checkbox"
                class="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label for="remember" class="text-sm text-gray-600">记住我</label>
            </div>

            <!-- Submit -->
            <UButton
              type="submit"
              label="登录"
              color="primary"
              block
              size="lg"
              :loading="loading"
            />
          </form>

          <!-- Divider -->
          <div class="relative my-8">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-100" />
            </div>
            <div class="relative flex justify-center text-xs">
              <span class="px-3 bg-white text-gray-400">或使用以下方式登录</span>
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

          <!-- Register Link -->
          <p class="text-center text-sm text-gray-500 mt-8">
            还没有账号？
            <NuxtLink to="/portal/register" class="text-primary-600 hover:text-primary-700 font-semibold">
              注册新账号
            </NuxtLink>
          </p>
        </div>

        <!-- Bottom info -->
        <p class="text-center text-xs text-gray-400 mt-6">
          登录即表示您同意我们的
          <NuxtLink to="#" class="underline">服务条款</NuxtLink>
          和
          <NuxtLink to="#" class="underline">隐私政策</NuxtLink>
        </p>
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
