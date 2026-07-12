# Task 8 Report: Upgrade Marketplace Listing Page

## Status: DONE

## Changes Made

### 1. Rewrote `app/pages/marketplace/index.vue`

**Search Hero Section:**
- Gradient background (primary-600 -> violet-800) with decorative blur circles
- Large centered search input with magnifying glass icon
- Hot tags row below search: 安全大模型, 威胁检测, 代码安全, 漏洞分析, 合规检查, 数据安全
- Clicking a hot tag fills the search input

**Type Tabs + Subcategory Scroll:**
- Replaced left sidebar (MarketplaceFilters) with horizontal layout
- Capsule type tabs (全部/模型/应用) with counts, sticky at top
- Horizontal scrollable subcategory tags below tabs
- Subcategories adapt based on selected type (model types, app types, or combined)
- Clicking a subcategory toggles it; clicking again deselects

**Featured Recommendations:**
- 2 large cards with gradient backgrounds (primary-violet and red-rose-amber)
- Show top 2 capabilities by rating
- Display: icon, name, rating, call count, description
- "快速接入" CTA button
- Only visible when no search/filter active and on page 1

**Sort Bar:**
- 3 sort options: 热门, 最新, 价格 (new price sort added)
- Price sort uses lowest plan price from getPlansForCapability
- Results count displayed on left

**Pagination:**
- 12 items per page
- Prev/next buttons with chevron icons
- Page number buttons with active state (primary-600 bg)
- Page resets to 1 when filters change

**Quick Preview Slideover:**
- USlideover component, right side, max-w-[420px]
- Header with "快速预览" title and close button
- Body: icon + name + rating + call count, description, tags, pricing info, features list
- Footer: 3 action buttons (在线体验/立即接入/购买套餐) matching CapabilitySidebar pattern

### 2. Upgraded `app/components/CapabilityCard.vue`

**Price Tag:**
- Shows lowest plan price from modelPlans/appPlans via getPlansForCapability
- Format: "¥999/月" for monthly, "¥9590/年" for annual
- Falls back to "按量计费" when no plans exist
- Displayed as a small badge next to the type name

**Call Count Micro-badge:**
- Shows callCount (models) or useCount (apps) with activity icon
- Moved to bottom row alongside rating

**Favorite Heart Icon:**
- Heart icon in top-right corner
- Local toggle ref (isFavorited) - will be replaced by useFavorites() composable in Task 12
- Red fill when favorited, gray outline when not
- preventDefault + stopPropagation to avoid card navigation

**Quick Preview Button:**
- Eye icon button, appears on hover (opacity-0 -> group-hover:opacity-100)
- Emits 'quickPreview' event with capability and type
- Also appears in hover action bar at bottom

**Hover Effects:**
- Card lifts: -translate-y-1 with enhanced shadow
- Action bar slides up from bottom with gradient fade
- Quick preview + action button visible on hover
- Smooth transitions (duration-200)

**Other Changes:**
- Removed old pricingText computed (replaced by priceTag)
- Removed API Docs link from bottom row
- Changed UButton color from 'accent' to 'secondary' (accent not a valid Nuxt UI color)
- Added Plan type import and getPlansForCapability import

## Build Verification

- `nuxi typecheck`: No new type errors in modified files (pre-existing errors in other files unchanged)
- `nuxi build`: Build completes successfully

## Commit

- `3fe304b` feat: upgrade marketplace with search hero, featured cards, upgraded cards, pagination

## Self-Review Notes

1. **Duplicate price tag logic**: The `getPriceTag` function exists in both marketplace/index.vue and CapabilityCard.vue (as `priceTag` computed). This is acceptable since they serve different contexts (featured cards vs grid cards), but could be extracted to a shared utility in a future refactor.

2. **Favorite is local-only**: The heart icon uses a local ref that resets on component re-render. This is intentional per the task spec ("for now just add the icon with a local toggle ref") and will be replaced by useFavorites() in Task 12.

3. **Slideover width**: Used `:ui="{ content: 'max-w-[420px]' }"` to override the default `max-w-md` (448px) to 420px. This is a valid Nuxt UI slot class override.

4. **MarketplaceFilters component**: The old sidebar filter component is no longer imported/used by the marketplace page. It still exists in the codebase and is used by the b/ variant pages. No deletion was performed.

5. **Featured cards use navigateTo**: The featured card div uses @click="navigateTo(...)" which returns a route object. This works at runtime but the UButton @click.stop handler needed `void` prefix to satisfy TypeScript.

6. **Subcategory scroll**: Uses a custom `.scrollbar-hide` CSS class for hiding the horizontal scrollbar while keeping scroll functionality.
