diff --git a/app/data/mock.ts b/app/data/mock.ts
index e05812b..7d1413f 100644
--- a/app/data/mock.ts
+++ b/app/data/mock.ts
@@ -81,20 +81,44 @@ export interface Plan {
   originalPrice?: number
   includedTokens?: number
   includedCalls?: number
   features: string[]
   popular: boolean
   icon: string
   gradient?: string
   badge?: string
 }
 
+export type ModuleType = 'banner' | 'hero' | 'intro' | 'features' | 'advantages' |
+  'scenarios' | 'tabs' | 'carousel' | 'cards' | 'steps' |
+  'pricing' | 'integration' | 'related'
+
+export interface TemplateModule {
+  id: string
+  type: ModuleType
+  title?: string
+  props: Record<string, any>
+  visible: boolean
+  order: number
+  spacing: { top: 'xs' | 'sm' | 'md' | 'lg'; bottom: 'xs' | 'sm' | 'md' | 'lg' }
+  background: 'white' | 'gray' | 'primary-light'
+  children?: TemplateModule[]
+}
+
+export interface PageTemplate {
+  id: string
+  targetType: 'model' | 'app'
+  targetId: string
+  theme: { primaryColor?: string; bgStyle?: 'light' | 'dark' | 'gradient' }
+  modules: TemplateModule[]
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
@@ -1071,10 +1095,87 @@ export function getPlansForCapability(capabilityId: string): { packs: Plan[]; mo
     popular: pack.popular,
     icon: 'i-lucide-coins',
     badge: pack.originalPrice || undefined
   }))
   return {
     packs,
     modelPlans: modelPlans.filter(p => p.targetId === capabilityId),
     appPlans: appPlans.filter(p => p.targetId === capabilityId)
   }
 }
+
+export function getDefaultTemplate(targetType: 'model' | 'app', targetId: string, appType?: string): PageTemplate {
+  const base: PageTemplate = {
+    id: `tpl-${targetId}`,
+    targetType,
+    targetId,
+    theme: { bgStyle: 'light' },
+    modules: []
+  }
+
+  const mkModule = (type: ModuleType, order: number, props: Record<string, any> = {}): TemplateModule => ({
+    id: `mod-${type}-${order}`,
+    type,
+    visible: true,
+    order,
+    props,
+    spacing: { top: 'md', bottom: 'md' },
+    background: 'white'
+  })
+
+  if (targetType === 'model') {
+    base.modules = [
+      mkModule('banner', 1, { gradient: 'from-primary-600 to-primary-400' }),
+      mkModule('intro', 2),
+      mkModule('features', 3, { layout: 'grid' }),
+      mkModule('scenarios', 4, { layout: 'cards' }),
+      mkModule('pricing', 5, { useDefault: true }),
+      mkModule('integration', 6, { useDefault: true }),
+      mkModule('related', 7, { maxCount: 4 })
+    ]
+  } else {
+    switch (appType) {
+      case 'chat':
+        base.modules = [
+          mkModule('banner', 1),
+          mkModule('intro', 2),
+          mkModule('features', 3, { layout: 'grid' }),
+          mkModule('integration', 4, { useDefault: true }),
+          mkModule('pricing', 5, { useDefault: true })
+        ]
+        break
+      case 'tool':
+        base.modules = [
+          mkModule('banner', 1),
+          mkModule('intro', 2),
+          mkModule('steps', 3, { direction: 'vertical' }),
+          mkModule('pricing', 4, { useDefault: true }),
+          mkModule('integration', 5, { useDefault: true })
+        ]
+        break
+      case 'showcase':
+        base.modules = [
+          mkModule('banner', 1),
+          mkModule('carousel', 2, { autoplay: true }),
+          mkModule('advantages', 3),
+          mkModule('cards', 4, { columns: 3 }),
+          mkModule('integration', 5, { useDefault: true })
+        ]
+        break
+      default: // external-link
+        base.modules = [
+          mkModule('banner', 1),
+          mkModule('intro', 2),
+          mkModule('cards', 3, { columns: 3 }),
+        ]
+    }
+  }
+  return base
+}
+
+export const defaultTemplates: PageTemplate[] = [
+  getDefaultTemplate('model', 'qax-security-llm'),
+  getDefaultTemplate('model', 'threat-detect-v3'),
+  getDefaultTemplate('model', 'vuln-analyzer-pro'),
+  getDefaultTemplate('app', 'smart-soc', 'chat'),
+  getDefaultTemplate('app', 'threat-intel-assistant', 'chat')
+]
