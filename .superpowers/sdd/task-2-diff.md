diff --git a/app/data/mock.ts b/app/data/mock.ts
index 61091ad..a582438 100644
--- a/app/data/mock.ts
+++ b/app/data/mock.ts
@@ -53,29 +53,48 @@ export interface Activity {
   hot: boolean
   new: boolean
   ctaText: string
   rules: string[]
   benefits: string[]
   icon: string
 }
 
 export interface ChargingPack {
   id: string
+  type: 'pack'
   name: string
   tokens: string
   price: string
   unitPrice: string
   originalPrice?: string
   popular: boolean
   features: string[]
 }
 
+export interface Plan {
+  id: string
+  type: 'pack' | 'model-plan' | 'app-plan'
+  targetId?: string
+  name: string
+  description: string
+  billingCycle: 'one-time' | 'monthly' | 'annual'
+  price: number
+  originalPrice?: number
+  includedTokens?: number
+  includedCalls?: number
+  features: string[]
+  popular: boolean
+  icon: string
+  gradient?: string
+  badge?: string
+}
+
 export const models: Model[] = [
   {
     id: 'qax-security-llm',
     name: '奇安信安全大模型',
     provider: '奇安信',
     type: 'security',
     typeName: '安全大模型',
     typeColor: '#7C3AED',
     parameters: '100B',
     description: '基于千亿参数的安全领域大语言模型，深度融合奇安信20年安全知识库，支持威胁分析、安全问答、报告生成等多种安全场景',
@@ -494,58 +513,75 @@ export const activities: Activity[] = [
     ctaText: '报名参赛',
     rules: ['报名截止：2026年8月15日', '作品提交截止：2026年9月30日', '评审期：2026年10月1日-15日', '需使用奇安信AI开放平台至少1个API'],
     benefits: ['一等奖5万元', '二等奖3万元', '三等奖2万元', '优秀作品平台推荐', '商业化支持', '技术导师指导'],
     icon: 'i-lucide-trophy'
   }
 ]
 
 export const chargingPacks: ChargingPack[] = [
   {
     id: 'pack-starter',
+    type: 'pack' as const,
     name: '体验包',
     tokens: '100万Token',
     price: '¥99',
     unitPrice: '¥0.099/千Token',
     popular: false,
     features: ['基础模型调用', '标准响应速度', '社区技术支持']
   },
   {
     id: 'pack-pro',
+    type: 'pack' as const,
     name: '专业包',
     tokens: '500万Token',
     price: '¥399',
     unitPrice: '¥0.080/千Token',
     originalPrice: '¥495',
     popular: true,
     features: ['全模型调用', '优先响应速度', '工单技术支持', 'API调用统计']
   },
   {
     id: 'pack-enterprise',
+    type: 'pack' as const,
     name: '企业包',
     tokens: '2000万Token',
     price: '¥1,499',
     unitPrice: '¥0.075/千Token',
     originalPrice: '¥1,980',
     popular: false,
     features: ['全模型调用', '最高响应速度', '1对1技术支持', 'API调用统计', '专属模型实例', 'SLA保障']
   },
   {
     id: 'pack-unlimited',
+    type: 'pack' as const,
     name: '无限包',
     tokens: '无限Token',
     price: '¥4,999/月',
     unitPrice: '不限',
     popular: false,
     features: ['全模型无限调用', '最高响应速度', '专属技术团队', '高级API统计', '专属模型实例', '99.9% SLA', '私有化部署选项']
   }
 ]
 
+export const modelPlans: Plan[] = [
+  { id: 'mp-security-pro', type: 'model-plan', targetId: 'qax-security-llm', name: '安全大模型专业版', description: '包含200万Token/月，优先响应速度', billingCycle: 'monthly', price: 999, includedTokens: 2000000, features: ['200万Token/月', '优先响应速度', '1对1技术支持'], popular: true, icon: 'i-lucide-brain', gradient: 'from-primary-600 to-primary-400' },
+  { id: 'mp-security-annual', type: 'model-plan', targetId: 'qax-security-llm', name: '安全大模型年度版', description: '年付享8折优惠', billingCycle: 'annual', price: 9590, originalPrice: 11988, includedTokens: 24000000, features: ['200万Token/月', '优先响应速度', '1对1技术支持', '专属模型实例'], popular: false, icon: 'i-lucide-brain' },
+  { id: 'mp-threat-pro', type: 'model-plan', targetId: 'threat-detect-v3', name: '威胁检测专业版', description: '100万Token/月+实时威胁推送', billingCycle: 'monthly', price: 599, includedTokens: 1000000, features: ['100万Token/月', '实时威胁推送', '优先响应'], popular: false, icon: 'i-lucide-shield-alert' },
+  { id: 'mp-code-pro', type: 'model-plan', targetId: 'code-security-scan', name: '代码安全扫描专业版', description: '150万Token/月+CI/CD集成', billingCycle: 'monthly', price: 399, includedTokens: 1500000, features: ['150万Token/月', 'CI/CD集成', '漏洞报告导出'], popular: false, icon: 'i-lucide-code-2' }
+]
+
+export const appPlans: Plan[] = [
+  { id: 'ap-threat-assistant', type: 'app-plan', targetId: 'app-threat-assistant', name: '威胁检测助手专业版', description: '5000次调用/月+7天数据留存', billingCycle: 'monthly', price: 299, includedCalls: 5000, features: ['5000次调用/月', '7天数据留存', '实时告警'], popular: true, icon: 'i-lucide-radar', gradient: 'from-red-500 to-amber-500' },
+  { id: 'ap-code-scan', type: 'app-plan', targetId: 'app-code-scan', name: '代码安全扫描专业版', description: '3000次扫描/月+CI/CD集成', billingCycle: 'monthly', price: 199, includedCalls: 3000, features: ['3000次扫描/月', 'CI/CD集成', '漏洞报告导出'], popular: false, icon: 'i-lucide-code-2' },
+  { id: 'ap-compliance', type: 'app-plan', targetId: 'app-compliance', name: '合规审计助手专业版', description: '2000次审计/月+合规报告', billingCycle: 'monthly', price: 249, includedCalls: 2000, features: ['2000次审计/月', '合规报告生成', '多标准支持'], popular: false, icon: 'i-lucide-scale' }
+]
+
 export const modelTypes = [
   { value: 'all', label: '全部模型' },
   { value: 'security', label: '安全大模型' },
   { value: 'threat', label: '威胁检测' },
   { value: 'vulnerability', label: '漏洞分析' },
   { value: 'compliance', label: '合规检查' },
   { value: 'code', label: '代码安全' },
   { value: 'data', label: '数据安全' },
   { value: 'malware', label: '恶意软件' },
   { value: 'incident', label: '应急响应' },
@@ -995,10 +1031,18 @@ export function getCallLogs(): CallLog[] {
   return callLogs
 }
 
 export function getMonitorMetrics(): MonitorMetrics {
   return monitorMetrics
 }
 
 export function getAdminEnterprises(): AdminEnterprise[] {
   return adminEnterprises
 }
+
+export function getPlansForCapability(capabilityId: string): { packs: ChargingPack[]; modelPlans: Plan[]; appPlans: Plan[] } {
+  return {
+    packs: chargingPacks,
+    modelPlans: modelPlans.filter(p => p.targetId === capabilityId),
+    appPlans: appPlans.filter(p => p.targetId === capabilityId)
+  }
+}
