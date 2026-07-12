diff --git a/app/data/mock.ts b/app/data/mock.ts
index a582438..e05812b 100644
--- a/app/data/mock.ts
+++ b/app/data/mock.ts
@@ -1032,17 +1032,49 @@ export function getCallLogs(): CallLog[] {
 }
 
 export function getMonitorMetrics(): MonitorMetrics {
   return monitorMetrics
 }
 
 export function getAdminEnterprises(): AdminEnterprise[] {
   return adminEnterprises
 }
 
-export function getPlansForCapability(capabilityId: string): { packs: ChargingPack[]; modelPlans: Plan[]; appPlans: Plan[] } {
+function parsePrice(priceStr: string): number {
+  // Remove ¥, commas, and trailing /月 or similar suffixes
+  const cleaned = priceStr.replace(/[¥,]/g, '').replace(/\/月$/, '')
+  const num = Number(cleaned)
+  return isNaN(num) ? 0 : num
+}
+
+function parseTokens(tokensStr: string): number {
+  if (tokensStr.includes('无限')) return -1
+  // Handle 亿 (100 million)
+  const yiMatch = tokensStr.match(/([\d.]+)亿/)
+  if (yiMatch) return Math.round(Number(yiMatch[1]) * 100000000)
+  // Handle 万 (10 thousand)
+  const wanMatch = tokensStr.match(/([\d.]+)万/)
+  if (wanMatch) return Math.round(Number(wanMatch[1]) * 10000)
+  return 0
+}
+
+export function getPlansForCapability(capabilityId: string): { packs: Plan[]; modelPlans: Plan[]; appPlans: Plan[] } {
+  const packs: Plan[] = chargingPacks.map(pack => ({
+    id: pack.id,
+    type: 'pack' as const,
+    name: pack.name,
+    description: pack.tokens,
+    billingCycle: 'one-time' as const,
+    price: parsePrice(pack.price),
+    originalPrice: pack.originalPrice ? parsePrice(pack.originalPrice) : undefined,
+    includedTokens: parseTokens(pack.tokens),
+    features: pack.features,
+    popular: pack.popular,
+    icon: 'i-lucide-coins',
+    badge: pack.originalPrice || undefined
+  }))
   return {
-    packs: chargingPacks,
+    packs,
     modelPlans: modelPlans.filter(p => p.targetId === capabilityId),
     appPlans: appPlans.filter(p => p.targetId === capabilityId)
   }
 }
