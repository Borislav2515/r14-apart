---
name: R14-APART
description: Premium boutique apartment rental — calm, editorial hospitality in Vladikavkaz
colors:
  charcoal: "#1A1916"
  charcoal-mid: "#2E2C28"
  charcoal-light: "#3D3A35"
  footer-deep: "#111009"
  cream: "#F5F0E8"
  cream-dark: "#EDE6D6"
  white: "#FDFAF5"
  sand: "#C9B99A"
  sand-light: "#DDD0BC"
  gold: "#B8965A"
  gold-light: "#D4AF7A"
  text-muted: "#A69C90"
typography:
  display:
    fontFamily: "'Fraunces', Georgia, serif"
    fontSize: "clamp(40px, 6vw, 80px)"
    fontWeight: 300
    lineHeight: 1.05
    letterSpacing: "normal"
  hero-display:
    fontFamily: "'Fraunces', Georgia, serif"
    fontSize: "clamp(54px, 8.8vw, 112px)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "normal"
  body:
    fontFamily: "'Manrope', system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  label:
    fontFamily: "'Manrope', system-ui, sans-serif"
    fontSize: "10px"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "5px"
rounded:
  sharp: "1px"
  image: "2px"
  card: "8px"
  pill: "999px"
spacing:
  nav-h: "72px"
  section-y: "120px"
  section-y-lg: "160px"
  gutter: "48px"
  gutter-mobile: "24px"
components:
  button-primary:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.charcoal}"
    rounded: "{rounded.sharp}"
    padding: "16px 40px"
  button-primary-hover:
    backgroundColor: "{colors.gold-light}"
    textColor: "{colors.charcoal}"
    rounded: "{rounded.sharp}"
    padding: "16px 40px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.cream}"
    rounded: "{rounded.sharp}"
    padding: "16px 40px"
  button-ghost:
    backgroundColor: "rgba(17,16,14,0.24)"
    textColor: "{colors.cream}"
    rounded: "{rounded.pill}"
    padding: "0 18px"
  chip-fact:
    backgroundColor: "rgba(17,16,14,0.34)"
    textColor: "rgba(245,240,232,0.82)"
    rounded: "{rounded.pill}"
    padding: "8px 12px"
---

# Design System: R14-APART

## 1. Overview

**Creative North Star: "The Boutique Arrival"**

R14-APART reads like stepping into a carefully kept apartment in historic Vladikavkaz — not a hotel lobby, not a listing aggregator. The interface is dark, photographic, and editorial: charcoal grounds the page, cream carries prose, gold marks moments of action. Whitespace is generous; UI chrome stays thin so authentic photography and the HomeReserve booking widget remain the focal points.

The system rejects OTA clutter, generic hotel templates, AI landing-page grammar, and budget-rental noise. Motion is calm and purposeful — parallax depth, scroll reveals, hover lift — never bounce-heavy choreography that competes with trust.

**Key Characteristics:**

- Dark charcoal body with cream typography — boutique evening mood, not warm cream paper
- Serif display (Fraunces) + humanist sans (Manrope) — editorial headline, effortless UI copy
- Gold accent used sparingly for CTAs, labels, and focus — rarity signals premium
- Photography-forward sections with subtle grain overlays and gradient scrims
- Sharp 1px button corners and 2px image radii — restrained, not rounded SaaS
- Booking widget as primary conversion surface; contact pills as secondary

## 2. Colors

A muted warm-dark palette anchored in charcoal and cream, with antique gold as the sole saturated accent.

### Primary

- **Historic Charcoal** (#1A1916): Body background, hero scrims, primary surface. The default "room at dusk" tone.
- **Antique Gold** (#B8965A): Primary CTA fills, section labels, logo accent dot, focus-adjacent highlights. Used on ≤10% of any screen.
- **Warm Cream** (#F5F0E8): Primary text on dark surfaces, navigation default, body copy.

### Secondary

- **Pale Sand** (#C9B99A / #DDD0BC): Italic emphasis in display headings (`em`), secondary typographic warmth without competing with gold.
- **Mid Charcoal** (#2E2C28): Elevated bands (stats bar), subtle surface shift from body.

### Neutral

- **Off-White** (#FDFAF5): Hero headlines, high-contrast titles on photography.
- **Muted Stone** (#A69C90): Footer prose, header descriptions, de-emphasized supporting text. Lightened from an earlier #6B6760 to clear WCAG AA (4.5:1) on charcoal surfaces.
- **Footer Deep** (#111009): Footer background — one step darker than body for closure.

### Named Rules

**The Gold Sparingly Rule.** Gold appears on CTAs, one label per section maximum, logo accent, and interactive focus — never as decorative fill across large surfaces.

**The Dark Body Rule.** The page body is charcoal, not cream or sand. Warmth lives in typography, photography, and accent — not a near-white tinted background.

## 3. Typography

**Display Font:** Fraunces (Georgia fallback)
**Body Font:** Manrope (system-ui fallback)

**Character:** Fraunces brings editorial warmth and italic flourish for boutique hospitality; Manrope keeps UI labels, facts, and widget-adjacent copy clean and readable in Cyrillic.

### Hierarchy

- **Hero Display** (400, clamp(54px–112px), line-height 0.98): Full-viewport hero only. `text-wrap: balance`. Max effective size ~96px.
- **Display** (300, clamp(40px–80px), line-height 0.95–1.05): Section titles (About, CTA, FAQ). Italic `em` in sand-light.
- **SEO Line** (600, clamp(17px–24px), line-height 1.35): Hero sub-headline beneath brand name.
- **Body** (400, 14–16px, line-height 1.55–1.85): Descriptions, FAQ answers, footer. Cap line length ~65–75ch in prose blocks.
- **Label** (500, 10px, letter-spacing 5px, uppercase): Section kickers — one per section, gold. Not stacked on every block.

### Named Rules

**The Cyrillic Headline Rule.** Test display sizes at 520px and 768px widths; long Russian words must not overflow. Reduce clamp max before shrinking copy.

**The Pairing Rule.** Fraunces for display and questions; Manrope for everything functional. Never introduce a third sans family.

## 4. Elevation

Depth is conveyed through tonal layering, photography, gradient scrims, and selective shadow — not floating card stacks.

Flat charcoal body → mid-charcoal band (stats bar) → hero/CTA photography with dark scrim → near-black overlay panels for modals. Shadows appear on hover states (gold CTA glow: `0 12px 32px rgba(184,150,90,0.35)`) and elevated overlays (cookie consent, booking modal).

### Shadow Vocabulary

- **CTA hover glow** (`0 12px 32px rgba(184,150,90,0.35)`): Gold solid buttons on hover only.
- **Overlay panel** (`0 18px–24px 48px–64px rgba(0,0,0,0.28–0.4)`): Cookie consent, booking modal.

### Named Rules

**The Scrim-Not-Glass Rule.** Hero and CTA use gradient scrims and light grain — not decorative glassmorphism. Backdrop blur is limited to nav scroll state and fact pills where readability demands it.

## 5. Components

### Buttons

- **Shape:** Nearly square — 1px radius on primary/outline (`border-radius: 1px`); pill (999px) for ghost contact actions in hero.
- **Primary:** Gold fill, charcoal text, uppercase 11px / letter-spacing 3px, padding 16px 40px. Hover: gold-light + 2px lift + CTA glow shadow.
- **Outline:** Transparent, cream text, gold-tinted border. Hover: faint gold wash background.
- **Ghost (hero):** Pill shape, translucent dark fill, cream text, uppercase 11px / letter-spacing 2px. Min-height 44px touch target.

### Chips / Facts

- **Style:** Pill (999px), `rgba(17,16,14,0.34)` background, subtle cream border, 12px Manrope, optional backdrop blur.
- **Use:** Hero amenity facts only — not repeated icon-card grids.

### Cards / Containers

- **Images:** 2px radius on editorial photography — sharp, gallery-like.
- **Badges on photos:** 1px radius, gold border, translucent charcoal backdrop.

### Inputs / Fields

- **HomeReserve widget:** Third-party embed, portaled between the hero and the booking modal so only one live instance ever exists — do not restyle aggressively; wrap with min-height 112px (78px mobile hero, 112px modal).
- **Focus (site-native):** 2px gold-light outline, 3px offset on links, buttons, inputs.

### Booking Modal

- **Overlay:** Fixed, full-viewport, `rgba(17,16,13,0.78)` scrim + 6px backdrop blur. Fades in; no slide.
- **Panel:** Near-black `#171611` (not charcoal — one step darker, for separation from the page behind it), 1px gold-tinted border (`rgba(184,150,90,0.28)`), no radius. Enters with a translateY(16px) + scale(0.98) → settle, `ease-out-expo`. Bottom sheet on mobile (`align-items: flex-end`, full-width).
- **Close:** 44px circular button, top-right, rotates 90° on hover.
- **Trigger:** Opened from any "Забронировать" action site-wide (About, Cta) via shared context — never a dead link that only scrolls.

### Navigation

- **Fixed bar:** 72px height, transparent → blurred charcoal on scroll with gold-tinted bottom border.
- **Logo:** Fraunces 300, 26px, letter-spacing 6px uppercase; gold dot accent.
- **Links:** Manrope 11px uppercase, letter-spacing 2px, muted cream → full cream on hover with gold underline grow.
- **Mobile:** Full-screen overlay menu with large Fraunces links; burger pill with gold aura on open.

### FAQ Accordion

- **Questions:** Fraunces 300, clamp(18px–24px), cream → gold-light on hover.
- **Icon:** 28px circle, gold border, rotates 45° when open.
- **Dividers:** `1px solid rgba(184,150,90,0.12)` — hairline gold, not side stripes.

### Section Label (kicker)

- **Style:** 10px uppercase, letter-spacing 5px, gold, one per section header.
- **Constraint:** Deliberate brand voice — never auto-generated eyebrows on every subsection.

## 6. Do's and Don'ts

### Do:

- **Do** lead with full-bleed authentic apartment photography and generous vertical section padding (120–160px).
- **Do** keep the HomeReserve widget visually central in the hero — booking is the primary conversion path.
- **Do** use gold for CTAs, focus rings, and at most one label per section.
- **Do** honor `prefers-reduced-motion` with instant or crossfade alternatives for all animations.
- **Do** maintain 44px minimum touch targets on mobile nav and actions.

### Don't:

- **Don't** adopt OTA clutter — dense listing layouts, badge spam, price comparison grids, or Avito-style density.
- **Don't** use generic hotel templates — stock photography aesthetics, corporate blues, interchangeable luxury tropes.
- **Don't** fall into AI landing page grammar — warm cream body backgrounds, gradient text, identical icon-card grids, eyebrow kickers on every section, or numbered 01/02/03 scaffolding.
- **Don't** use budget rental visual language — loud colors, cramped layouts, low-trust patterns.
- **Don't** add colored side-stripe borders on cards or alerts.
- **Don't** animate layout properties (width, height, padding) when transform and opacity suffice.
- **Don't** let visual clutter compete with photography or the booking widget.
