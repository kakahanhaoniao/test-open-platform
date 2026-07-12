### Task 5: Refactor marketplace detail page to use template rendering

**Files:**
- Modify: `app/pages/marketplace/[id].vue` (replace CapabilityDetail with template-based rendering)
- Modify: `app/components/CapabilityDetail.vue` (extract right sidebar into separate component)

**Interfaces:**
- Consumes: `getDefaultTemplate()` from mock.ts, all 13 Module* components
- Produces: Template-based detail page with sticky right sidebar

- [ ] **Step 1: Create `app/components/CapabilitySidebar.vue`** — extract the sticky right info panel from CapabilityDetail (name, icon, rating, 3 action buttons, pricing summary, tags, enterprise batch purchase)

- [ ] **Step 2: Rewrite `app/pages/marketplace/[id].vue`** to:
  1. Look up capability and template (`getDefaultTemplate`)
  2. Render breadcrumb
  3. Two-column layout: left = module renderer loop, right = CapabilitySidebar (sticky)
  4. Module renderer iterates `template.modules.filter(m => m.visible)` sorted by `order`, renders `<component :is="moduleComponentMap[module.type]" :module="module" :capability="capability" :capability-type="capabilityType" />`
  5. Bottom: related capabilities section

- [ ] **Step 3: Verify detail page renders correctly for a model and an app**

- [ ] **Step 4: Commit**

```bash
git add app/pages/marketplace/ app/components/CapabilitySidebar.vue
git commit -m "feat: refactor detail page to template-based module rendering"
```
