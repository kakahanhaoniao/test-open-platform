# Task 7 Report: Upgrade packs pages with three-tab plan system

## Status: DONE

## Changes Made

### New Components
1. **`app/components/PlanCard.vue`** - Reusable plan card component
   - Renders any `Plan` type (pack, model-plan, app-plan) with unified layout
   - Shows icon, name, badge (popular/badge), included tokens/calls, price with billing cycle, original price strikethrough, features list, buy button
   - Supports gradient backgrounds via `plan.gradient`
   - Adaptive styling: gradient cards get white text, normal cards get dark text
   - Formats tokens (wan/yi) and calls appropriately

2. **`app/components/PostPurchaseDialog.vue`** - Post-purchase guidance dialog
   - **Model-plan**: Shows 3-step integration guide (Create API Key, SDK code sample, API endpoint)
   - **App-plan**: Shows 3-step integration guide (Configure Webhook, SDK integration, iFrame embed)
   - **Pack**: Shows balance confirmation + recommended next steps (API Key, docs, Playground)
   - Uses UModal with close/CTA buttons

### Modified Pages
3. **`app/pages/console/packs/index.vue`** - Console packs page with three tabs
   - UTabs with 3 tabs: 充能包 | 模型套餐 | 应用套餐
   - Packs tab: converts `ChargingPack[]` to `Plan[]` for unified PlanCard rendering
   - Model Plans tab: renders `modelPlans` from mock data
   - App Plans tab: renders `appPlans` from mock data
   - Empty state with icon when no plans available
   - Balance card, usage trend chart, purchase history table retained
   - Post-purchase dialog on buy click

4. **`app/pages/enterprise/packs.vue`** - Enterprise packs page with three tabs
   - Same three-tab layout as console
   - Enterprise-specific features: balance card with usage ratio, batch purchase button, member usage breakdown table
   - 4-column grid layout (wider enterprise layout)
   - Post-purchase dialog on buy click

5. **`app/components/CapabilitySidebar.vue`** - Updated purchase modal
   - "购买充能包" button changed to "购买套餐" with subtitle showing all plan types
   - Opens UModal with capability-specific plans via `getPlansForCapability()`
   - Dynamic tabs: shows model-plans/app-plans tabs only when plans exist for this capability, always shows packs tab
   - Default tab auto-selects to first available
   - Each plan rendered with PlanCard, buy triggers PostPurchaseDialog
   - Removed `buyPack` emit (replaced by in-modal buy)

## Technical Details
- Uses `UTabs` from `@nuxt/ui` v4 with `variant="pill"`, `color="primary"`, `:content="false"` for manual tab content rendering
- ChargingPack-to-Plan conversion uses same parsing logic as `getPlansForCapability()` in mock.ts
- PlanCard handles all three plan types with conditional rendering based on `plan.type`
- PostPurchaseDialog uses `<pre>` tags with Vue interpolation for dynamic code samples

## Build Verification
- `nuxi typecheck`: No errors in modified files (pre-existing errors in other files are unrelated)
- `nuxi build`: Successful

## Commit
- `41e2308` feat: three-tab plan system on packs pages + updated purchase modal

## Self-Review Notes
- The `ChargingPack` to `Plan` conversion in console/packs and enterprise/packs duplicates the logic from `getPlansForCapability()`. This is intentional because packs pages show ALL packs (not filtered by capability), while the sidebar shows capability-specific plans.
- Empty states shown when modelPlans/appPlans arrays are empty (which they currently are in the global view since these are capability-specific plans)
- The purchase modal in CapabilitySidebar correctly filters plans by capability ID
