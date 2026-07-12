### Task 3: Add PageTemplate + TemplateModule interfaces and default template data

**Files:**
- Modify: `app/data/mock.ts` (add PageTemplate, TemplateModule interfaces, defaultTemplates, getDefaultTemplate helper)

**Interfaces:**
- Consumes: `models` and `apps` arrays for targetId
- Produces: `PageTemplate`, `TemplateModule`, `ModuleType` types; `defaultTemplates` array; `getDefaultTemplate(targetType, targetId)` function

- [ ] **Step 1: Add template interfaces after Plan interface**

```ts
export type ModuleType = 'banner' | 'hero' | 'intro' | 'features' | 'advantages' |
  'scenarios' | 'tabs' | 'carousel' | 'cards' | 'steps' |
  'pricing' | 'integration' | 'related'

export interface TemplateModule {
  id: string
  type: ModuleType
  title?: string
  props: Record<string, any>
  visible: boolean
  order: number
  spacing: { top: 'xs' | 'sm' | 'md' | 'lg'; bottom: 'xs' | 'sm' | 'md' | 'lg' }
  background: 'white' | 'gray' | 'primary-light'
  children?: TemplateModule[]
}

export interface PageTemplate {
  id: string
  targetType: 'model' | 'app'
  targetId: string
  theme: { primaryColor?: string; bgStyle?: 'light' | 'dark' | 'gradient' }
  modules: TemplateModule[]
}
```

- [ ] **Step 2: Add default template generator function**

```ts
export function getDefaultTemplate(targetType: 'model' | 'app', targetId: string, appType?: string): PageTemplate {
  const base: PageTemplate = {
    id: `tpl-${targetId}`,
    targetType,
    targetId,
    theme: { bgStyle: 'light' },
    modules: []
  }

  const mkModule = (type: ModuleType, order: number, props: Record<string, any> = {}): TemplateModule => ({
    id: `mod-${type}-${order}`,
    type,
    visible: true,
    order,
    props,
    spacing: { top: 'md', bottom: 'md' },
    background: 'white'
  })

  if (targetType === 'model') {
    base.modules = [
      mkModule('banner', 1, { gradient: 'from-primary-600 to-primary-400' }),
      mkModule('intro', 2),
      mkModule('features', 3, { layout: 'grid' }),
      mkModule('scenarios', 4, { layout: 'cards' }),
      mkModule('pricing', 5, { useDefault: true }),
      mkModule('integration', 6, { useDefault: true }),
      mkModule('related', 7, { maxCount: 4 })
    ]
  } else {
    switch (appType) {
      case 'chat':
        base.modules = [
          mkModule('banner', 1),
          mkModule('intro', 2),
          mkModule('features', 3, { layout: 'grid' }),
          mkModule('integration', 4, { useDefault: true }),
          mkModule('pricing', 5, { useDefault: true })
        ]
        break
      case 'tool':
        base.modules = [
          mkModule('banner', 1),
          mkModule('intro', 2),
          mkModule('steps', 3, { direction: 'vertical' }),
          mkModule('pricing', 4, { useDefault: true }),
          mkModule('integration', 5, { useDefault: true })
        ]
        break
      case 'showcase':
        base.modules = [
          mkModule('banner', 1),
          mkModule('carousel', 2, { autoplay: true }),
          mkModule('advantages', 3),
          mkModule('cards', 4, { columns: 3 }),
          mkModule('integration', 5, { useDefault: true })
        ]
        break
      default: // external-link
        base.modules = [
          mkModule('banner', 1),
          mkModule('intro', 2),
          mkModule('cards', 3, { columns: 3 }),
        ]
    }
  }
  return base
}
```

- [ ] **Step 3: Add defaultTemplates array for the first 3 models and 2 apps**

Generate default templates using the function and export as `defaultTemplates`.

- [ ] **Step 4: Verify build and commit**

```bash
npx nuxi build 2>&1 | tail -5
git add app/data/mock.ts
git commit -m "feat: add PageTemplate/TemplateModule interfaces + default template generator"
```
