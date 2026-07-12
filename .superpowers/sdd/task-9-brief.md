### Task 9: Upgrade Portal homepage

**Files:**
- Modify: `app/pages/index.vue` (Hero canvas animation + capability carousel + security matrix + enterprise section redesign + pricing tabs + quick start section)

**Interfaces:**
- Consumes: `models`, `apps`, `chargingPacks`, `modelPlans`, `appPlans` for pricing tabs
- Produces: Redesigned homepage with 6 upgraded/new sections

- [ ] **Step 1: Add Canvas particle/node animation to Hero** — lightweight Canvas animation showing security nodes connecting, rendered behind the hero text

- [ ] **Step 2: Replace capability preview with horizontal carousel** — auto-rotating cards showing 3-4 hot capabilities with core params + "快速体验" button

- [ ] **Step 3: Add "安全能力矩阵" section** — 2x3 grid of security domains (网络安全/威胁检测/漏洞分析/合规审计/代码安全/应急响应), each with icon + capability count + representative model name, linking to marketplace with category filter

- [ ] **Step 4: Redesign enterprise section** — white cards with purple gradient border instead of dark bg, feature cards with icon + number + description

- [ ] **Step 5: Upgrade pricing section** — Tab switcher (充能包/模型套餐/应用套餐), each tab shows 2-3 featured plans

- [ ] **Step 6: Add "快速接入" section** — 3-step flow (注册→获取Key→调用API) with code snippet preview

- [ ] **Step 7: Verify and commit**

```bash
git add app/pages/index.vue
git commit -m "feat: upgrade Portal homepage with animation, carousel, matrix, pricing tabs, quick start"
```
