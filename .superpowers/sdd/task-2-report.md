# Task 2 Report: Add Plan interface + mock data for three-tier plan system

## Status: DONE

## Changes Made

**File modified:** `app/data/mock.ts`

### 1. Added Plan interface (after ChargingPack interface)
- New `Plan` interface with `type: 'pack' | 'model-plan' | 'app-plan'` discriminated union field
- Includes `targetId`, `billingCycle`, `price` (number), `includedTokens`, `includedCalls`, `icon`, `gradient`, `badge` fields

### 2. Added `type: 'pack'` to ChargingPack interface and data
- Added `type: 'pack'` field to the `ChargingPack` interface definition
- Added `type: 'pack' as const` to all 4 charging pack entries (pack-starter, pack-pro, pack-enterprise, pack-unlimited)

### 3. Added modelPlans array (4 entries)
- `mp-security-pro` -> targetId: `qax-security-llm` (monthly, 999)
- `mp-security-annual` -> targetId: `qax-security-llm` (annual, 9590)
- `mp-threat-pro` -> targetId: `threat-detect-v3` (monthly, 599)
- `mp-code-pro` -> targetId: `code-security-scan` (monthly, 399)

### 4. Added appPlans array (3 entries)
- `ap-threat-assistant` -> targetId: `app-threat-assistant` (monthly, 299)
- `ap-code-scan` -> targetId: `app-code-scan` (monthly, 199)
- `ap-compliance` -> targetId: `app-compliance` (monthly, 249)

### 5. Added getPlansForCapability helper function
- Returns `{ packs: ChargingPack[]; modelPlans: Plan[]; appPlans: Plan[] }`
- Filters modelPlans and appPlans by `targetId === capabilityId`

## Deviations from Task Brief

1. **ChargingPack interface updated**: Added `type: 'pack'` to the ChargingPack interface itself (not just the data). The brief only mentioned adding `type: 'pack' as const` to the data entries, but without the interface field, TypeScript reports `TS2353: Object literal may only specify known properties`.

2. **getPlansForCapability return type**: Changed `packs: Plan[]` to `packs: ChargingPack[]`. The brief's version used `chargingPacks.map(p => ({ ...p, type: 'pack' as const }))` and claimed the result was `Plan[]`, but ChargingPack has `price: string` and `tokens: string` while Plan has `price: number` and no `tokens` field -- they are fundamentally different shapes. Using `ChargingPack[]` is type-safe and avoids a cast.

## Type Safety Verification

- `npx nuxi typecheck` shows zero errors in `app/data/mock.ts`
- All pre-existing errors in other files are unrelated to this change
- No consuming components (ChargingPackCard, CapabilityDetail, models/[id]) broke from the added `type` field on ChargingPack

## Commit

- `f0b7693` feat: add Plan interface + model/app plan mock data for three-tier plan system
