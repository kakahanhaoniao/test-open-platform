<script setup lang="ts">
import { organization, members } from '~/data/mock'

useHead({ title: '企业空间 - 奇安信AI开放平台' })

const previewMembers = members.slice(0, 5)

function getInitials(name: string): string {
  return name.slice(0, 1)
}
</script>

<template>
  <div>
    <ConsoleSidebar />
    <div class="ml-60 p-8 min-h-screen bg-[#FAFAFA]">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-xl font-bold text-gray-900">企业空间</h1>
        <p class="text-sm text-gray-400 mt-1">管理企业信息、成员与资源</p>
      </div>

      <!-- Enterprise Info Card -->
      <div class="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <div class="flex items-start justify-between">
          <div>
            <div class="flex items-center gap-3 mb-3">
              <h2 class="text-2xl font-bold text-gray-900">{{ organization.name }}</h2>
              <span
                v-if="organization.verified"
                class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-600"
              >
                <UIcon name="i-lucide-check-circle" class="w-3.5 h-3.5" />
                已认证
              </span>
            </div>
            <div class="flex items-center gap-3 text-sm">
              <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700">
                {{ organization.industry }}
              </span>
              <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                {{ organization.scale }}
              </span>
              <span class="text-gray-400 text-xs">
                创建于 {{ organization.createdAt }}
              </span>
            </div>
          </div>
          <div class="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
            <UIcon name="i-lucide-building-2" class="w-6 h-6 text-primary-600" />
          </div>
        </div>
      </div>

      <!-- 4 Stat Cards -->
      <div class="grid grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-xl border border-gray-100 p-5">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center">
              <UIcon name="i-lucide-users" class="w-4.5 h-4.5 text-primary-600" />
            </div>
            <span class="text-sm text-gray-500">成员数</span>
          </div>
          <div class="flex items-baseline gap-1">
            <span class="text-2xl font-bold text-gray-900">{{ organization.memberCount }}</span>
            <span class="text-sm text-gray-400">人</span>
          </div>
        </div>

        <div class="bg-white rounded-xl border border-gray-100 p-5">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
              <UIcon name="i-lucide-key" class="w-4.5 h-4.5 text-blue-600" />
            </div>
            <span class="text-sm text-gray-500">活跃Key数</span>
          </div>
          <div class="flex items-baseline gap-1">
            <span class="text-2xl font-bold text-gray-900">{{ organization.activeKeyCount }}</span>
            <span class="text-sm text-gray-400">个</span>
          </div>
        </div>

        <div class="bg-white rounded-xl border border-gray-100 p-5">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
              <UIcon name="i-lucide-receipt" class="w-4.5 h-4.5 text-amber-600" />
            </div>
            <span class="text-sm text-gray-500">本月消耗</span>
          </div>
          <div class="flex items-baseline gap-1">
            <span class="text-2xl font-bold text-gray-900">&yen;{{ organization.monthlyCost.toLocaleString() }}</span>
          </div>
        </div>

        <div class="bg-white rounded-xl border border-gray-100 p-5">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
              <UIcon name="i-lucide-coins" class="w-4.5 h-4.5 text-green-600" />
            </div>
            <span class="text-sm text-gray-500">充能包余额</span>
          </div>
          <div class="flex items-baseline gap-1">
            <span class="text-2xl font-bold text-gray-900">{{ (organization.packBalance / 10000).toFixed(0) }}</span>
            <span class="text-sm text-gray-400">万 Token</span>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <h3 class="font-semibold text-gray-900 mb-4">快捷操作</h3>
        <div class="flex items-center gap-3">
          <NuxtLink
            to="/console/workspace/members"
            class="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white transition-colors"
          >
            <UIcon name="i-lucide-user-plus" class="w-4 h-4" />
            邀请成员
          </NuxtLink>
          <NuxtLink
            to="/console/workspace/packs"
            class="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors"
          >
            <UIcon name="i-lucide-coins" class="w-4 h-4" />
            购买充能包
          </NuxtLink>
          <NuxtLink
            to="/console/workspace/members"
            class="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors"
          >
            <UIcon name="i-lucide-users" class="w-4 h-4" />
            管理成员
          </NuxtLink>
        </div>
      </div>

      <!-- Member Preview -->
      <div class="bg-white rounded-xl border border-gray-100 p-6">
        <div class="flex items-center justify-between mb-5">
          <h3 class="font-semibold text-gray-900">成员预览</h3>
          <NuxtLink
            to="/console/workspace/members"
            class="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            查看全部成员
            <UIcon name="i-lucide-arrow-right" class="w-4 h-4" />
          </NuxtLink>
        </div>
        <div class="space-y-3">
          <div
            v-for="member in previewMembers"
            :key="member.id"
            class="flex items-center gap-3 py-2"
          >
            <div
              class="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-medium"
              :class="{
                'bg-primary-100 text-primary-700': member.role === 'admin',
                'bg-blue-100 text-blue-700': member.role === 'developer',
                'bg-amber-100 text-amber-700': member.role === 'finance',
                'bg-gray-100 text-gray-600': member.role === 'readonly'
              }"
            >
              {{ getInitials(member.name) }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <span class="text-sm font-medium text-gray-900">{{ member.name }}</span>
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium"
                  :class="{
                    'bg-primary-50 text-primary-700': member.role === 'admin',
                    'bg-blue-50 text-blue-700': member.role === 'developer',
                    'bg-amber-50 text-amber-700': member.role === 'finance',
                    'bg-gray-100 text-gray-600': member.role === 'readonly'
                  }"
                >
                  {{ member.roleLabel }}
                </span>
              </div>
              <p class="text-xs text-gray-400 mt-0.5 truncate">{{ member.email }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
