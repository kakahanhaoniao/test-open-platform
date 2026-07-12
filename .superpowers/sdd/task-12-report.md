# Task 12 Report: Global QuickCreateKey FAB + Favorites System

## Summary

Implemented a global QuickCreateKey floating action button and a localStorage-based favorites system that persists across sessions.

## Changes Made

### 1. Created `app/composables/useFavorites.ts`
- Shared reactive `favorites` ref (module-level singleton) so all components share the same state
- `onMounted` initialization: loads from `localStorage` key `ai-platform-favorites` on client
- `toggleFavorite(id)`: adds or removes a capability ID from favorites, then persists
- `isFavorite(id)`: checks if a capability ID is in the favorites array
- `save()`: writes current favorites array to localStorage as JSON

### 2. Created `app/components/QuickCreateKey.vue`
- Fixed-position FAB (bottom-right, purple `bg-primary-600`, key icon)
- On click: opens a centered dialog with:
  - Key name text input
  - Permission level selector (3 buttons: Read, Read/Write, Full)
  - Warning about one-time key visibility
  - Create button with loading state
- On create: simulates API call (800ms), generates mock key (`qax_` + 32 random chars)
- Generated key display with monospace code block, select-all, and copy button
- Copy uses `navigator.clipboard.writeText` with fallback to `document.execCommand('copy')`
- Copied state feedback (check icon, green highlight, auto-resets after 2s)
- Uses `<ClientOnly>` + `<Teleport to="body">` for proper mounting outside the layout tree

### 3. Modified `app/app.vue`
- Added `showQuickCreateKey` computed: true when route starts with `/console` or `/enterprise`
- Added `<QuickCreateKey v-if="showQuickCreateKey" />` inside `<UApp>`, before layout templates

### 4. Modified `app/pages/console/index.vue`
- Imported `apps` from mock data and `useFavorites` composable
- Added `favoritedCapabilities` computed: filters all models + apps by `isFavorite(id)`
- Added "我的收藏" section between Welcome Bar and Stat Cards:
  - Heart icon + title + count badge
  - "浏览更多" link to /marketplace
  - 4-column grid of small capability cards with icon, name, and type label
  - Each card links to `/marketplace/{id}`
  - Section only renders when `favoritedCapabilities.length > 0`

### 5. Modified `app/components/CapabilityCard.vue`
- Replaced local `isFavorited` ref with `useFavorites()` composable
- Renamed composable's `toggleFavorite` to `toggleFav` (destructured) to avoid naming conflict
- `onToggleFavorite(e)`: calls `toggleFav(props.capability.id)` instead of toggling local ref
- Template updated: `isFavorited` references replaced with `isFavorite(capability.id)`

## Build Verification

Build completed successfully with `useFavorites` chunk visible in output:
```
├─ .output/server/chunks/build/useFavorites-BIrMYP3u.mjs (456 B) (251 B gzip)
```

## Files Changed

| File | Action |
|------|--------|
| `app/composables/useFavorites.ts` | Created |
| `app/components/QuickCreateKey.vue` | Created |
| `app/app.vue` | Modified (added QuickCreateKey mounting) |
| `app/pages/console/index.vue` | Modified (added favorites section) |
| `app/components/CapabilityCard.vue` | Modified (wired favorites composable) |
