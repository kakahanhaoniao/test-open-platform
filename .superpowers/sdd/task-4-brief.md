### Task 4: Create 13 module rendering components

**Files:**
- Create: `app/components/modules/ModuleBanner.vue`
- Create: `app/components/modules/ModuleHero.vue`
- Create: `app/components/modules/ModuleIntro.vue`
- Create: `app/components/modules/ModuleFeatures.vue`
- Create: `app/components/modules/ModuleAdvantages.vue`
- Create: `app/components/modules/ModuleScenarios.vue`
- Create: `app/components/modules/ModuleTabs.vue`
- Create: `app/components/modules/ModuleCarousel.vue`
- Create: `app/components/modules/ModuleCards.vue`
- Create: `app/components/modules/ModuleSteps.vue`
- Create: `app/components/modules/ModulePricing.vue`
- Create: `app/components/modules/ModuleIntegration.vue`
- Create: `app/components/modules/ModuleRelated.vue`

**Interfaces:**
- Consumes: `TemplateModule` type from mock.ts, `models`/`apps`/`chargingPacks`/`modelPlans`/`appPlans` for pricing/integration/related
- Produces: 13 module components each accepting `props: { module: TemplateModule; capability: Model | App; capabilityType: 'model' | 'app' }`

Each component renders its module type based on `module.props`. Key details:

- **ModuleBanner**: Gradient or image background, title, subtitle, badge, CTA button. Uses `module.props.gradient` for background.
- **ModuleHero**: Centered title + MD description + button group. Uses `markdown-it` for description rendering.
- **ModuleIntro**: Title + MD body + optional image. Layout from `module.props.layout` (left-right/center).
- **ModuleFeatures**: Feature list with icons. Layout from `module.props.layout` (grid/list).
- **ModuleAdvantages**: Comparison items (our advantage vs traditional).
- **ModuleScenarios**: Scenario cards. Layout from `module.props.layout` (cards/carousel).
- **ModuleTabs**: Tab headers + recursive module rendering for each tab's children.
- **ModuleCarousel**: Image carousel with auto-play. Use CSS scroll-snap for lightweight implementation.
- **ModuleCards**: Card grid with configurable columns (2/3/4).
- **ModuleSteps**: Step list with direction (horizontal/vertical).
- **ModulePricing**: If `module.props.useDefault` is true, render pricing from capability data. Otherwise render custom plans from `module.props.plans`.
- **ModuleIntegration**: If `module.props.useDefault` is true, render 3-step integration guide from capability data. Otherwise render custom steps.
- **ModuleRelated**: Auto-match by tags or use `module.props.ids`. Max count from `module.props.maxCount`.

Each component applies `module.spacing` and `module.background` as wrapper classes.

- [ ] **Step 1: Create all 13 module components** (implement each with full template+script)

- [ ] **Step 2: Verify build**

```bash
npx nuxi build 2>&1 | tail -5
```

- [ ] **Step 3: Commit**

```bash
git add app/components/modules/
git commit -m "feat: add 13 module rendering components for template system"
```
