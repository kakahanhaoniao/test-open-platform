# Task 3 Report: Add PageTemplate + TemplateModule interfaces and default template data

## Status: DONE

## Changes Made

**File modified:** `app/data/mock.ts`

### 1. Added ModuleType type alias (after Plan interface)
- Union of 13 module type literals: 'banner', 'hero', 'intro', 'features', 'advantages', 'scenarios', 'tabs', 'carousel', 'cards', 'steps', 'pricing', 'integration', 'related'

### 2. Added TemplateModule interface
- Fields: id, type (ModuleType), title (optional), props (Record<string, any>), visible, order, spacing (top/bottom with xs/sm/md/lg), background ('white'|'gray'|'primary-light'), children (optional recursive)

### 3. Added PageTemplate interface
- Fields: id, targetType ('model'|'app'), targetId, theme (primaryColor optional, bgStyle optional), modules (TemplateModule[])

### 4. Added getDefaultTemplate function
- Generates default module configurations based on targetType and appType
- Model templates: 7 modules (banner, intro, features, scenarios, pricing, integration, related)
- App chat: 5 modules (banner, intro, features, integration, pricing)
- App tool: 5 modules (banner, intro, steps, pricing, integration)
- App showcase: 5 modules (banner, carousel, advantages, cards, integration)
- App external-link (default): 3 modules (banner, intro, cards)

### 5. Added defaultTemplates array
- 3 model templates: qax-security-llm, threat-detect-v3, vuln-analyzer-pro
- 2 app templates: smart-soc (chat), threat-intel-assistant (chat)

## Build Verification
- `npx nuxi build` completed successfully with no errors

## Commit
- `30d82af` feat: add PageTemplate/TemplateModule interfaces + default template generator

## Self-Review Notes
- All interfaces and the function match the task brief exactly
- The defaultTemplates array uses actual IDs from the existing models and apps arrays (not the placeholder IDs mentioned in the task context, which were inaccurate)
- Both app templates use 'chat' type because the first 2 apps in the data (smart-soc, threat-intel-assistant) are both chat-type apps
- The task brief mentioned "first 3 models and 2 apps" which is satisfied
- No concerns with the implementation
