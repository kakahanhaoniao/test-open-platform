### Task 8: Upgrade marketplace listing page

**Files:**
- Modify: `app/pages/marketplace/index.vue` (search hero + capsule tabs + featured cards + upgraded cards + horizontal filters + pagination)
- Modify: `app/components/CapabilityCard.vue` (add price tag, call count badge, favorite icon, quick preview button, hover actions)

**Interfaces:**
- Consumes: `models`, `apps`, `chargingPacks`, `modelPlans`, `appPlans` for price tags
- Produces: Redesigned marketplace with search hero, featured section, upgraded cards, pagination

- [ ] **Step 1: Rewrite marketplace/index.vue** with: search hero section (large search + hot tags), capsule type tabs + subcategory scroll, 2 featured recommendation cards, horizontal filter bar (replacing left sidebar), upgraded CapabilityCard grid, pagination (12 per page)

- [ ] **Step 2: Upgrade CapabilityCard.vue** with: price tag (from pricing or plans), call count micro-badge, favorite heart icon, quick preview button (eye icon), hover: card lifts + show action bar

- [ ] **Step 3: Add quick preview USlideover** — clicking quick preview opens a side panel showing capability summary + 3 action buttons

- [ ] **Step 4: Verify and commit**

```bash
git add app/pages/marketplace/ app/components/CapabilityCard.vue
git commit -m "feat: upgrade marketplace with search hero, featured cards, upgraded cards, pagination"
```
