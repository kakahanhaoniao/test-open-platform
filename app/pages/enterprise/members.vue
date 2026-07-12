<script setup lang="ts">
import { members } from '~/data/mock'

useHead({ title: '成员管理 - 奇安信AI开放平台' })

const showInviteDialog = ref(false)
const inviteEmail = ref('')
const inviteRole = ref('developer')
const inviteLink = ref('')
const inviteLinkGenerated = ref(false)

const roleOptions = [
  { value: 'admin', label: '管理员' },
  { value: 'developer', label: '开发者' },
  { value: 'finance', label: '财务' },
  { value: 'readonly', label: '只读' }
]

const roleExplanations = [
  {
    role: '管理员',
    color: 'primary',
    bgClass: 'bg-primary-50 border-primary-100',
    iconClass: 'text-primary-600',
    permissions: ['全部权限']
  },
  {
    role: '开发者',
    color: 'blue',
    bgClass: 'bg-blue-50 border-blue-100',
    iconClass: 'text-blue-600',
    permissions: ['创建Key', '使用模型', '查看自己消耗']
  },
  {
    role: '财务',
    color: 'amber',
    bgClass: 'bg-amber-50 border-amber-100',
    iconClass: 'text-amber-600',
    permissions: ['查看账单', '购买充能包']
  },
  {
    role: '只读',
    color: 'gray',
    bgClass: 'bg-gray-50 border-gray-200',
    iconClass: 'text-gray-500',
    permissions: ['查看企业信息', '查看自己消耗']
  }
]

const memberList = ref(members.map(m => ({ ...m })))

function getInitials(name: string): string {
  return name.slice(0, 1)
}

function generateInviteLink() {
  if (!inviteEmail.value) return
  inviteLink.value = 'https://ai.qianxin.com/invite/abc123'
  inviteLinkGenerated.value = true
}

function closeInviteDialog() {
  showInviteDialog.value = false
  inviteEmail.value = ''
  inviteRole.value = 'developer'
  inviteLink.value = ''
  inviteLinkGenerated.value = false
}

function copyInviteLink() {
  if (import.meta.client && navigator.clipboard) {
    navigator.clipboard.writeText(inviteLink.value)
  }
}

function getRoleBadgeClass(role: string): string {
  switch (role) {
    case 'admin': return 'bg-primary-50 text-primary-700'
    case 'developer': return 'bg-blue-50 text-blue-700'
    case 'finance': return 'bg-amber-50 text-amber-700'
    case 'readonly': return 'bg-gray-100 text-gray-600'
    default: return 'bg-gray-100 text-gray-600'
  }
}

function getStatusBadge(status: string): { class: string; label: string; dotClass: string } {
  switch (status) {
    case 'active':
      return { class: 'bg-green-50 text-green-600', label: '已激活', dotClass: 'bg-green-500' }
    case 'pending':
      return { class: 'bg-amber-50 text-amber-600', label: '待邀请', dotClass: 'bg-amber-500' }
    case 'disabled':
      return { class: 'bg-gray-100 text-gray-500', label: '已禁用', dotClass: 'bg-gray-400' }
    default:
      return { class: 'bg-gray-100 text-gray-500', label: status, dotClass: 'bg-gray-400' }
  }
}

function toggleMemberStatus(member: typeof memberList.value[0]) {
  if (member.status === 'active') {
    member.status = 'disabled'
  } else if (member.status === 'disabled') {
    member.status = 'active'
  }
}

// Role change dropdown state
const openRoleDropdown = ref<string | null>(null)

function toggleRoleDropdown(memberId: string) {
  openRoleDropdown.value = openRoleDropdown.value === memberId ? null : memberId
}

function changeRole(member: typeof memberList.value[0], newRole: string) {
  const roleMap: Record<string, string> = {
    admin: '管理员',
    developer: '开发者',
    finance: '财务',
    readonly: '只读'
  }
  member.role = newRole as typeof member.role
  member.roleLabel = roleMap[newRole] || newRole
  openRoleDropdown.value = null
}

function onDocumentClick(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target.closest('[data-role-dropdown]')) {
    openRoleDropdown.value = null
  }
}
onMounted(() => document.addEventListener('click', onDocumentClick))
onUnmounted(() => document.removeEventListener('click', onDocumentClick))
</script>

<template>
  <div>
    <EnterpriseSidebar />
    <div class="ml-60 p-8 min-h-screen bg-[#FAFAFA]">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-xl font-bold text-gray-900">成员管理</h1>
          <p class="text-sm text-gray-400 mt-1">管理企业成员、角色权限与邀请</p>
        </div>
        <button
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white transition-colors"
          @click="showInviteDialog = true"
        >
          <UIcon name="i-lucide-user-plus" class="w-4 h-4" />
          邀请成员
        </button>
      </div>

      <!-- Invite Dialog -->
      <div
        v-if="showInviteDialog"
        class="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div class="absolute inset-0 bg-black/40" @click="closeInviteDialog" />
        <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
          <div class="flex items-center justify-between mb-5">
            <h3 class="text-lg font-bold text-gray-900">邀请新成员</h3>
            <button
              class="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              @click="closeInviteDialog"
            >
              <UIcon name="i-lucide-x" class="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div class="space-y-4">
            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">邮箱地址</label>
              <input
                v-model="inviteEmail"
                type="email"
                placeholder="请输入成员邮箱"
                class="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              />
            </div>

            <!-- Role -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">角色</label>
              <select
                v-model="inviteRole"
                class="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white"
              >
                <option
                  v-for="opt in roleOptions"
                  :key="opt.value"
                  :value="opt.value"
                >
                  {{ opt.label }}
                </option>
              </select>
            </div>

            <!-- Send Invite -->
            <button
              class="w-full py-2.5 rounded-lg text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="!inviteEmail"
              @click="generateInviteLink"
            >
              发送邀请
            </button>

            <!-- Generated Link -->
            <div
              v-if="inviteLinkGenerated"
              class="p-3 rounded-lg bg-green-50 border border-green-100"
            >
              <p class="text-xs text-green-700 font-medium mb-1.5">邀请链接已生成</p>
              <div class="flex items-center gap-2">
                <code class="flex-1 text-xs font-mono bg-white px-2.5 py-1.5 rounded border border-green-200 text-gray-700 truncate">
                  {{ inviteLink }}
                </code>
                <button
                  class="shrink-0 p-1.5 rounded-md hover:bg-green-100 transition-colors"
                  title="复制链接"
                  @click="copyInviteLink"
                >
                  <UIcon name="i-lucide-copy" class="w-4 h-4 text-green-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Role Explanation Panel -->
      <div class="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <h3 class="font-semibold text-gray-900 mb-4">角色权限说明</h3>
        <div class="grid grid-cols-4 gap-4">
          <div
            v-for="re in roleExplanations"
            :key="re.role"
            class="rounded-lg border p-4"
            :class="re.bgClass"
          >
            <div class="flex items-center gap-2 mb-3">
              <UIcon
                :name="re.role === '管理员' ? 'i-lucide-shield' : re.role === '开发者' ? 'i-lucide-code-2' : re.role === '财务' ? 'i-lucide-wallet' : 'i-lucide-eye'"
                class="w-4.5 h-4.5"
                :class="re.iconClass"
              />
              <span class="font-semibold text-sm text-gray-900">{{ re.role }}</span>
            </div>
            <div class="space-y-1.5">
              <div
                v-for="perm in re.permissions"
                :key="perm"
                class="flex items-center gap-1.5 text-xs text-gray-600"
              >
                <UIcon name="i-lucide-check" class="w-3 h-3 text-green-500 shrink-0" />
                {{ perm }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Member Table -->
      <div class="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table class="w-full">
          <thead>
            <tr class="text-xs text-gray-400 border-b border-gray-100 bg-gray-50/50">
              <th class="text-left py-3 px-5 font-medium">成员</th>
              <th class="text-left py-3 px-5 font-medium">角色</th>
              <th class="text-left py-3 px-5 font-medium">Key数</th>
              <th class="text-left py-3 px-5 font-medium">本月Token</th>
              <th class="text-left py-3 px-5 font-medium">本月消耗</th>
              <th class="text-left py-3 px-5 font-medium">状态</th>
              <th class="text-left py-3 px-5 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="member in memberList"
              :key="member.id"
              class="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
            >
              <!-- Member -->
              <td class="py-4 px-5">
                <div class="flex items-center gap-3">
                  <div
                    class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-medium"
                    :class="{
                      'bg-primary-100 text-primary-700': member.role === 'admin',
                      'bg-blue-100 text-blue-700': member.role === 'developer',
                      'bg-amber-100 text-amber-700': member.role === 'finance',
                      'bg-gray-100 text-gray-600': member.role === 'readonly'
                    }"
                  >
                    {{ getInitials(member.name) }}
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ member.name }}</p>
                    <p class="text-xs text-gray-400">{{ member.email }}</p>
                  </div>
                </div>
              </td>

              <!-- Role -->
              <td class="py-4 px-5">
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                  :class="getRoleBadgeClass(member.role)"
                >
                  {{ member.roleLabel }}
                </span>
              </td>

              <!-- Key Count -->
              <td class="py-4 px-5 text-sm text-gray-600 font-mono">{{ member.keyCount }}</td>

              <!-- Monthly Tokens -->
              <td class="py-4 px-5 text-sm text-gray-600 font-mono">{{ (member.monthlyTokens / 10000).toFixed(0) }}万</td>

              <!-- Monthly Cost -->
              <td class="py-4 px-5 text-sm text-gray-900 font-medium font-mono">&yen;{{ member.monthlyCost.toLocaleString() }}</td>

              <!-- Status -->
              <td class="py-4 px-5">
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                  :class="getStatusBadge(member.status).class"
                >
                  <span
                    class="w-1.5 h-1.5 rounded-full mr-1.5"
                    :class="getStatusBadge(member.status).dotClass"
                  />
                  {{ getStatusBadge(member.status).label }}
                </span>
              </td>

              <!-- Actions -->
              <td class="py-4 px-5">
                <div class="flex items-center gap-2">
                  <!-- Change Role Dropdown -->
                  <div class="relative" :data-role-dropdown="member.id">
                    <button
                      class="text-xs px-2.5 py-1 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
                      @click.stop="toggleRoleDropdown(member.id)"
                    >
                      修改角色
                    </button>
                    <div
                      v-if="openRoleDropdown === member.id"
                      class="absolute left-0 top-full mt-1 w-32 bg-white rounded-lg border border-gray-100 shadow-lg shadow-gray-200/50 py-1 z-10"
                    >
                      <button
                        v-for="opt in roleOptions"
                        :key="opt.value"
                        class="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                        :class="member.role === opt.value ? 'text-primary-600 font-medium' : ''"
                        @click="changeRole(member, opt.value)"
                      >
                        {{ opt.label }}
                      </button>
                    </div>
                  </div>

                  <!-- Toggle Status -->
                  <button
                    v-if="member.status !== 'pending'"
                    class="text-xs px-2.5 py-1 rounded-md transition-colors"
                    :class="member.status === 'active'
                      ? 'text-amber-600 hover:bg-amber-50'
                      : 'text-green-600 hover:bg-green-50'"
                    @click="toggleMemberStatus(member)"
                  >
                    {{ member.status === 'active' ? '禁用' : '启用' }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
