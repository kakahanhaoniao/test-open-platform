### Task 2: Add Plan interface + mock data for three-tier plan system

**Files:**
- Modify: `app/data/mock.ts` (add Plan interface, modelPlans, appPlans exports)

**Interfaces:**
- Consumes: existing `models` and `apps` arrays for targetId references
- Produces: `Plan` interface, `modelPlans: Plan[]`, `appPlans: Plan[]`, updated `chargingPacks` to include `type: 'pack'`

- [ ] **Step 1: Add Plan interface after ChargingPack interface (around line 70)**

```ts
export interface Plan {
  id: string
  type: 'pack' | 'model-plan' | 'app-plan'
  targetId?: string
  name: string
  description: string
  billingCycle: 'one-time' | 'monthly' | 'annual'
  price: number
  originalPrice?: number
  includedTokens?: number
  includedCalls?: number
  features: string[]
  popular: boolean
  icon: string
  gradient?: string
  badge?: string
}
```

- [ ] **Step 2: Add `type: 'pack'` field to existing ChargingPack data (4 entries)**

Add `type: 'pack' as const` to each charging pack object.

- [ ] **Step 3: Add modelPlans and appPlans data after chargingPacks**

```ts
export const modelPlans: Plan[] = [
  { id: 'mp-security-pro', type: 'model-plan', targetId: 'qax-security-llm', name: '安全大模型专业版', description: '包含200万Token/月，优先响应速度', billingCycle: 'monthly', price: 999, includedTokens: 2000000, features: ['200万Token/月', '优先响应速度', '1对1技术支持'], popular: true, icon: 'i-lucide-brain', gradient: 'from-primary-600 to-primary-400' },
  { id: 'mp-security-annual', type: 'model-plan', targetId: 'qax-security-llm', name: '安全大模型年度版', description: '年付享8折优惠', billingCycle: 'annual', price: 9590, originalPrice: 11988, includedTokens: 24000000, features: ['200万Token/月', '优先响应速度', '1对1技术支持', '专属模型实例'], popular: false, icon: 'i-lucide-brain' },
  { id: 'mp-threat-pro', type: 'model-plan', targetId: 'threat-detect-v3', name: '威胁检测专业版', description: '100万Token/月+实时威胁推送', billingCycle: 'monthly', price: 599, includedTokens: 1000000, features: ['100万Token/月', '实时威胁推送', '优先响应'], popular: false, icon: 'i-lucide-shield-alert' },
  { id: 'mp-code-pro', type: 'model-plan', targetId: 'code-security-scan', name: '代码安全扫描专业版', description: '150万Token/月+CI/CD集成', billingCycle: 'monthly', price: 399, includedTokens: 1500000, features: ['150万Token/月', 'CI/CD集成', '漏洞报告导出'], popular: false, icon: 'i-lucide-code-2' }
]

export const appPlans: Plan[] = [
  { id: 'ap-threat-assistant', type: 'app-plan', targetId: 'app-threat-assistant', name: '威胁检测助手专业版', description: '5000次调用/月+7天数据留存', billingCycle: 'monthly', price: 299, includedCalls: 5000, features: ['5000次调用/月', '7天数据留存', '实时告警'], popular: true, icon: 'i-lucide-radar', gradient: 'from-red-500 to-amber-500' },
  { id: 'ap-code-scan', type: 'app-plan', targetId: 'app-code-scan', name: '代码安全扫描专业版', description: '3000次扫描/月+CI/CD集成', billingCycle: 'monthly', price: 199, includedCalls: 3000, features: ['3000次扫描/月', 'CI/CD集成', '漏洞报告导出'], popular: false, icon: 'i-lucide-code-2' },
  { id: 'ap-compliance', type: 'app-plan', targetId: 'app-compliance', name: '合规审计助手专业版', description: '2000次审计/月+合规报告', billingCycle: 'monthly', price: 249, includedCalls: 2000, features: ['2000次审计/月', '合规报告生成', '多标准支持'], popular: false, icon: 'i-lucide-scale' }
]
```

- [ ] **Step 4: Create helper function to get plans for a capability**

```ts
export function getPlansForCapability(capabilityId: string): { packs: Plan[]; modelPlans: Plan[]; appPlans: Plan[] } {
  return {
    packs: chargingPacks.map(p => ({ ...p, type: 'pack' as const })),
    modelPlans: modelPlans.filter(p => p.targetId === capabilityId),
    appPlans: appPlans.filter(p => p.targetId === capabilityId)
  }
}
```

- [ ] **Step 5: Verify build and commit**

```bash
npx nuxi build 2>&1 | tail -5
git add app/data/mock.ts
git commit -m "feat: add Plan interface + model/app plan mock data for three-tier plan system"
```
