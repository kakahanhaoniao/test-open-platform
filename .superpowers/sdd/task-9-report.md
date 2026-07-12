# Task 9 Report: Upgrade Portal Homepage

## Status: COMPLETE

## Commit
`c9c1b1d` - feat: upgrade Portal homepage with animation, carousel, matrix, pricing tabs, quick start

## File Modified
- `app/pages/index.vue` (592 insertions, 132 deletions)

## 6 Upgrades Implemented

### 1. Hero Canvas Animation
- Added `<canvas ref="heroCanvas">` behind the hero section
- Animated security nodes (dots) connecting with lines using `requestAnimationFrame`
- Purple color (#7C3AED) with subtle opacity (0.15 for lines, 0.35 for dots)
- Performance: node count capped at 60, connection distance 150px
- Lifecycle: `onMounted` initializes, `onUnmounted` cleans up animation frame + resize listener
- Handles window resize with DPR-aware canvas scaling

### 2. Capability Carousel
- Replaced the 2x2 grid of CapabilityCard components with a horizontal auto-rotating carousel
- Shows 3-4 hot capabilities (models + apps) with icon, name, core params (parameters, rating, call count), tags, and "快速体验" button
- Auto-rotates every 4 seconds, pauses on hover (`@mouseenter`/`@mouseleave`)
- Dot indicators below with click-to-navigate
- Smooth CSS transition (`translateX` with 500ms ease-in-out)

### 3. Security Capability Matrix (安全能力矩阵)
- 2x3 grid (responsive: 1 col mobile, 2 col sm, 3 col lg)
- 6 domains: 网络安全, 威胁检测, 漏洞分析, 合规审计, 代码安全, 应急响应
- Each card shows: icon, domain name, capability count, representative model name
- Click navigates to `/marketplace?type={type}` with category filter
- Hover effect: lift + purple shadow + "查看能力" arrow indicator

### 4. Enterprise Section Redesign
- Replaced dark bg (`bg-gray-900`) with white cards on white bg
- Purple gradient border effect using absolute-positioned gradient div behind each card
- 4 feature cards with: icon, big number (5000+, 50万+, 1亿+, 30%), title, description
- Trust indicator badge updated to light theme (primary-50 bg)
- CTA: "了解企业方案" links to /enterprise

### 5. Pricing Tabs
- Tab switcher with 3 tabs: 充能包 | 模型套餐 | 应用套餐
- Imports `chargingPacks`, `modelPlans`, `appPlans` from `~/data/mock`
- Pack tab: shows 3 featured charging packs (体验包, 专业包, 企业包)
- Model tab: shows 2 featured model plans
- App tab: shows 2 featured app plans
- Active tab styled with `bg-primary-600 text-white`, inactive with `bg-gray-100`
- Each plan card shows icon, name, description, price, features, and CTA button

### 6. Quick Start Section (快速接入)
- 3-step flow: 注册 → 获取Key → 调用API
- Each step in a white card with numbered gradient circle, icon, title, description
- Code snippet preview in a dark terminal-style box with macOS-style dots
- Shows curl command for API call example
- CTA: "立即开始" links to `/console/keys/create`

## Preserved Sections
- Stats bar (unchanged)
- Testimonials section (unchanged)
- CTA section (unchanged)
- Footer (unchanged)

## Build Verification
- `npx nuxi build` completed successfully with no errors
- Total output: 14.5 MB (4.39 MB gzip)

## Concerns
- The canvas animation uses `requestAnimationFrame` directly; for very low-end devices the animation could be throttled further, but the node cap of 60 should be sufficient
- The enterprise section gradient border uses a `-z-10` trick with absolute positioning; this works but could be simplified with a CSS `border-image` approach in a future refactor
- The carousel uses CSS `translateX` for transitions which is performant but does not support touch/swipe gestures natively -- could be enhanced with a touch library if needed
