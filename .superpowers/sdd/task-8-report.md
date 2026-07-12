# Task 8 Report: Marketplace Detail Page Direct Purchase Refactor

## Summary

Refactored the marketplace detail page right sidebar to support direct purchase with 3 action buttons, replacing the previous navigation-based flow that required users to jump to the console. Added 3 modal dialogs for charging pack selection, integration guide, and enterprise batch purchase.

## Files Modified

- `/Users/xiaoshao/Downloads/ai-platform/app/components/CapabilityDetail.vue` — Complete refactor of the right sidebar and addition of 3 modals

## Changes Made

### 8.1 Current Structure Analysis

The original `CapabilityDetail.vue` had:
- A header with icon, name, badges, and action buttons (体验模型/开始对话 etc.) that navigated to `/dev/playground` or other console pages
- A tab-based content area (overview, playground, pricing, chat, demo, integration, docs)
- The overview tab's right sidebar contained a "Model Info Card" with pricing rows and two small buttons ("获取API Key" linking to `/dev/keys`, "立即体验" linking to `/dev/playground"), plus a "快速入口" card with links to console pages
- The pricing tab had a "购买充能包" button linking to `/dev/packs`

### 8.2 Right Sidebar Refactor

**Removed from header**: The top-right action buttons (体验模型, 开始对话, etc.) and the heart/favorite button were removed to consolidate all CTAs into the sidebar.

**Replaced sidebar content** with a single unified card containing:

1. **Model name + rating + call count** — displayed at the top of the sidebar card
2. **3 stacked action buttons** (prominent, full-width):
   - **在线体验** — green button (`bg-green-500`), switches `activeTab` to 'playground' for models, 'chat' for chat apps, 'demo' for showcase apps
   - **立即接入** — primary purple button (`bg-primary-600`), opens the integration guide modal
   - **购买充能包** — outline-style button with purple border (`border-primary-200 bg-primary-50/50`), subtitle "体验包 ¥99 起", opens the charging pack selection modal
3. **Pricing info** — directly visible (no tab needed), shows input/output prices for models
4. **Enterprise-only section** (`v-if="currentUser.isEnterprise"`):
   - **企业批量采购** button — purple outline, subtitle "专属折扣+统一结算", opens enterprise batch purchase modal
5. **Tags and related info** — kept at the bottom of the sidebar card

### 8.3 Charging Pack Selection Modal

- Title: "选择充能包"
- 4 pack cards from `chargingPacks` mock data, each showing:
  - Pack name, token amount, price (with original price strikethrough if applicable)
  - Unit price
  - Feature tags with check icons
  - "最受欢迎" badge on the popular pack
  - [购买] button (primary for popular, outline for others)
- Close button (X icon)
- On purchase click: shows success alert "购买成功！充能包已到账", auto-closes after 2 seconds

### 8.4 Integration Guide Modal

- Title: "接入引导"
- Step 1: "创建API Key" — with a [前往创建] link button to `/console/keys/create`
- Step 2: "安装SDK" — dark code block with `pip install qax-ai-sdk`, copy button
- Step 3: "调用API" — dark code block with Python example using the current model's ID, copy button
- Copy buttons show a check icon for 2 seconds after copying
- Close button

### 8.5 Enterprise Batch Purchase Modal

- Title: "企业批量采购"
- Form fields: 预估月调用量 (UInput), 联系方式 (UInput)
- [提交咨询] button — shows success alert "提交成功！我们将在1个工作日内联系您", auto-closes after 2 seconds
- Info note: "企业客户享受专属折扣，我们将在1个工作日内联系您" (amber background)
- Close button

### Additional Changes

- **Pricing tab buttons** updated: "购买充能包" now calls `handleBuyPack()` instead of navigating to `/dev/packs`; "获取API Key" now calls `handleIntegration()` instead of navigating to `/dev/keys`
- All modals use `Teleport to="body"` with backdrop overlay (`bg-black/50`)
- Modals use `v-if` toggles for show/hide
- Design patterns consistent: white cards, `rounded-xl`/`rounded-2xl`, `border-gray-100`

## Data Dependencies

- `chargingPacks` — imported from `~/data/mock` (4 packs: 体验包, 专业包, 企业包, 无限包)
- `currentUser` — imported from `~/data/mock` (has `isEnterprise: true` for testing)

## Preserved Behavior

- All tab-based content areas remain unchanged (overview, playground, pricing, chat, demo, integration, docs)
- The overview tab's left column (description, features, tags) is unchanged
- Related promotions banner is unchanged
- Breadcrumb navigation in the parent page is unchanged
