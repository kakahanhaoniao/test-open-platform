# Task 10: Upgrade Promotions Page + Add Activity Detail Page

## Status: COMPLETE

## Commit
`1e4f581` feat: upgrade promotions page + add activity detail page with related capabilities

## Changes Summary

### 1. Updated Activity Interface (`app/data/mock.ts`)
- Added `category` field: `'限时折扣' | '免费体验' | '新客专享' | '企业优惠'`
- Added `detailMd?: string` for markdown activity descriptions
- Added `faq?: { question: string; answer: string }[]` for FAQ data
- Added `relatedCapabilityIds?: string[]` to link activities to models/apps
- Added `discountPlans?: { planId: string; discountPrice: number }[]` for discounted pricing

### 2. Updated Existing Activity Data
All 4 existing activities updated with:
- `category` assigned (限时折扣, 企业优惠, 免费体验, 新客专享)
- `detailMd` populated with rich markdown content (headings, lists, tables)
- `faq` populated with 2-3 Q&A pairs each
- `relatedCapabilityIds` linked to relevant models/apps
- `discountPlans` linked to existing modelPlans/appPlans with discount prices

### 3. Added 2 New Activities
- **新客专享礼包** (`newcomer-welcome-pack`) - category: 新客专享
- **代码安全限时特惠** (`code-security-flash-sale`) - category: 限时折扣

### 4. Upgraded Promotions Index Page (`app/pages/promotions/index.vue`)
- **Countdown banner**: Live countdown timer for the hottest activity (updates every second)
- **Category filter**: 5-button filter (全部/限时折扣/免费体验/新客专享/企业优惠)
- **Related capability tags**: Shows linked capability names + icons on hot cards and list cards
- **Updated CTAs**: "领取优惠" for free/newcomer categories, "购买套餐" for paid categories
- **NuxtLink navigation**: All cards link to `/promotions/[id]` detail page
- **Empty state**: Shows when no activities match selected category

### 5. Created Activity Detail Page (`app/pages/promotions/[id].vue`)
- **Top banner**: Full-width gradient banner with activity icon, title, subtitle, discount badge, date range, description, and CTA buttons
- **Markdown description**: Renders `detailMd` using markdown-it with styled prose
- **Related capabilities section**: 2-column grid of capability cards linking to marketplace detail pages, with type badges and pricing
- **Discount plans section**: Shows plans with original price, discounted price, and savings amount
- **Sidebar with**: Activity info, rules list, collapsible FAQ, gradient CTA card
- **CTA buttons**: "立即领取" / "购买优惠套餐" based on activity category
- **404 handling**: Throws 404 if activity ID not found

## Build Verification
- `npx nuxi build` passed successfully
- Fixed Tailwind v4 scoped style issue: replaced `@apply` directives with plain CSS properties in the detail page's `<style scoped>` block

## Files Modified
- `app/data/mock.ts` - Activity interface + data (6 activities)
- `app/pages/promotions/index.vue` - Upgraded listing page
- `app/pages/promotions/[id].vue` - New detail page

## Concerns
- None. Build passes, all features implemented per spec.
