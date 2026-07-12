### Task 7: Upgrade packs pages with three-tab plan system

**Files:**
- Modify: `app/pages/console/packs/index.vue` (add model-plan + app-plan tabs)
- Modify: `app/pages/enterprise/packs.vue` (add model-plan + app-plan tabs)
- Modify: `app/components/CapabilitySidebar.vue` (update purchase modal to show all plan types)

**Interfaces:**
- Consumes: `Plan` interface, `chargingPacks`, `modelPlans`, `appPlans`, `getPlansForCapability()` from mock.ts
- Produces: Three-tab packs pages, updated purchase modal with plan type selection

- [ ] **Step 1: Rewrite console/packs with three tabs** — Tab bar: 充能包 | 模型套餐 | 应用套餐. Each tab renders plan cards with appropriate fields (tokens vs calls, billing cycle badge, features list, buy button).

- [ ] **Step 2: Rewrite enterprise/packs with three tabs** — Same structure plus enterprise-specific features (member allocation, batch purchase).

- [ ] **Step 3: Update purchase modal in CapabilitySidebar** — When clicking "购买套餐", show all available plans for this capability: model-plans first, then app-plans, then charging packs. Each with buy button.

- [ ] **Step 4: Add post-purchase guidance** — After buying a model-plan, show integration guide modal. After buying an app-plan, show webhook/SDK steps. After buying a pack, show balance + next steps.

- [ ] **Step 5: Verify and commit**

```bash
git add app/pages/console/packs/ app/pages/enterprise/packs.vue app/components/CapabilitySidebar.vue
git commit -m "feat: three-tab plan system on packs pages + updated purchase modal"
```
