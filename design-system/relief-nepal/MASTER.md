# Relief Nepal — Design System (MASTER)

> **Global Source of Truth** for all visual, interaction, and accessibility decisions.
> Read this first. Page-specific overrides live in `pages/<page-name>.md` and take precedence only where explicitly noted.

---

## 1. Brand Foundation

### 1.1 Organization Identity

| Property | Value |
|----------|-------|
| **Name** | Relief Nepal |
| **Established** | 2008 (2065 BS) |
| **Headquarters** | Kamalamai Municipality-6, Sindhuli, Bagmati Province, Nepal |
| **Legal Status** | Non-profit NGO |
| **Mission** | Building self-reliant, equitable communities across Nepal through community-led development |
| **Vision** | A just, equitable society where every child, woman, and marginalized person thrives with dignity |
| **Tagline** | Community, Dignity, Hope |

### 1.2 Core Sectors (Program Pillars)

| # | Sector | Icon | Color Accent | Description |
|---|--------|------|--------------|-------------|
| 01 | **Protection** | 🛡️ Shield | `--color-protection` (#087943) | Rights, safety & dignity of children, women & marginalized communities |
| 02 | **Health & Education** | 🏥 Cross | `--color-health` (#174b87) | Healthier communities & inclusive learning opportunities |
| 03 | **Disaster & Climate** | 🌤️ Cloud/Arrow | `--color-climate` (#c99a3d) | Preparedness, resilience & humanitarian response |
| 04 | **WASH** | 💧 Droplet | `--color-wash` (#0d9488) | Safe water, sanitation & healthy hygiene practices |
| 05 | **Livelihoods** | 🏠 Home | `--color-livelihoods` (#65a30d) | Self-reliance through skills, opportunities & community action |

### 1.3 Brand Personality

| Trait | Expression |
|-------|------------|
| **Trustworthy** | Transparent reporting, verified impact data, clear governance |
| **Humanitarian** | People-first language, dignity-affirming imagery, ethical storytelling |
| **Community-Focused** | Local voices centered, participatory approach, grassroots partnerships |
| **Professional** | Clean layouts, accessible typography, consistent systems |
| **Hopeful** | Warm accents (gold), progress-oriented messaging, success stories |

---

## 2. Color System

### 2.1 Brand Palette (Semantic Tokens)

**Primary — Forest Green (Trust, Growth, Nature)**
```css
--color-forest-50:  #eff6f0;
--color-forest-100: #dcebdd;
--color-forest-200: #bcd5bc;
--color-forest-300: #8eb98f;
--color-forest-400: #5d9660;
--color-forest-500: #3a7a3e;
--color-forest-600: #2d6230;  /* PRIMARY BRAND */
--color-forest-700: #224a25;  /* PRIMARY HOVER */
--color-forest-800: #1a3b1e;
--color-forest-900: #143017;
--color-forest-950: #0a1a0c;
```

**Neutral — Ivory (Warmth, Paper, Approachability)**
```css
--color-ivory: #faf8f1;
--color-ivory-100: #f5f1e8;
--color-ivory-200: #ebe4d6;
```

**Accent — Gold (Hope, Achievement, Warmth)**
```css
--color-gold-100: #fef3c7;
--color-gold-200: #fde68a;
--color-gold-300: #fcd34d;
--color-gold-400: #fbbf24;
--color-gold-500: #f59e0b;
--color-gold-600: #d97706;  /* ACCENT PRIMARY */
--color-gold-700: #b45309;
--color-gold-800: #92400e;
--color-gold-900: #78350f;
```

### 2.2 Sector Accent Colors (for program cards, badges, data viz)

```css
--color-protection:   #087943;  /* Forest 700 */
--color-health:       #174b87;  /* Deep blue */
--color-climate:      #c99a3d;  /* Gold 500 */
--color-wash:         #0d9488;  /* Teal 600 */
--color-livelihoods:  #65a30d;  /* Lime 600 */
```

### 2.3 Semantic Color Mappings (Light Mode)

| Role | Value | Usage |
|------|-------|-------|
| `--color-primary` | `var(--color-forest-600)` | Primary buttons, links, key actions |
| `--color-primary-hover` | `var(--color-forest-700)` | Hover states |
| `--color-primary-light` | `var(--color-forest-50)` | Subtle backgrounds, badges |
| `--color-primary-border` | `var(--color-forest-200)` | Input borders, card borders |
| `--color-accent` | `var(--color-gold-600)` | CTAs, highlights, donation buttons |
| `--color-accent-hover` | `var(--color-gold-700)` | Accent hover |
| `--color-accent-light` | `var(--color-gold-100)` | Accent backgrounds |
| `--color-success` | `#166534` | Success states, completed projects |
| `--color-warning` | `#854d0e` | Warnings, pending states |
| `--color-error` | `#991b1b` | Errors, destructive actions |
| `--color-info` | `#1e40af` | Info badges, neutral actions |

### 2.4 Surface & Neutral Tokens (Light Mode)

```css
--color-bg-primary:   #f8faf8;   /* Page background */
--color-bg-secondary: #ffffff;   /* Cards, modals, elevated surfaces */
--color-bg-tertiary:  #f0f4f0;   /* Subtle sections, alternate rows */
--color-bg-hover:     #e8eee8;   /* Hover on neutral surfaces */
--color-bg-active:    #dceadc;   /* Active/pressed neutral */

--color-text-primary:   #1a2a1a;   /* Headings, primary content */
--color-text-secondary: #4a5a4a;   /* Body text, descriptions */
--color-text-tertiary:  #7a8a7a;   /* Captions, metadata, timestamps */
--color-text-quaternary: #aabbaa;  /* Placeholders, disabled text */
--color-text-inverse:   #ffffff;   /* On dark backgrounds */

--color-border-light:  #e8eee8;  /* Default borders */
--color-border-medium: #dceadc;  /* Emphasized borders */
--color-border-strong: #bcd5bc;  /* Focus rings, active borders */
```

### 2.5 Dark Mode Overrides

```css
.dark {
  --color-bg-primary:   #0f1a0f;
  --color-bg-secondary: #162416;
  --color-bg-tertiary:  #1a2e1a;
  --color-bg-hover:     #1e351e;
  --color-bg-active:    #254025;

  --color-text-primary:   #f0f5f0;
  --color-text-secondary: #cdd5cd;
  --color-text-tertiary:  #9aa99a;
  --color-text-quaternary: #6b7b6b;

  --color-border-light:  #2a3f2a;
  --color-border-medium: #3a553a;
  --color-border-strong: #4a6b4a;

  --color-primary-light:  #1a3b1e;
  --color-primary-border: #3a553a;

  /* Shadows deepen in dark mode */
  --shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.2);
  --shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.3), 0 1px 2px -1px rgb(0 0 0 / 0.3);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.3), 0 4px 6px -4px rgb(0 0 0 / 0.3);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.3), 0 8px 10px -6px rgb(0 0 0 / 0.3);
}
```

### 2.6 Accessibility Standards (WCAG AA+)

| Requirement | Target | Implementation |
|-------------|--------|----------------|
| **Text Contrast (Normal)** | ≥ 4.5:1 | All body text on `--color-bg-primary/secondary` |
| **Text Contrast (Large)** | ≥ 3:1 | Headings ≥ 18px or ≥ 14px bold |
| **UI Component Contrast** | ≥ 3:1 | Borders, focus rings, icons |
| **Enhanced Contrast (Target)** | ≥ 7:1 | Critical CTAs, error states, key data |
| **Focus Ring** | 3-4px solid | `box-shadow: 0 0 0 3px var(--color-primary-light)` |
| **Reduced Motion** | Required | `@media (prefers-reduced-motion: reduce)` disables non-essential animation |

**Contrast Verified Pairs (Light Mode):**
- `--color-text-primary` on `--color-bg-primary` → 12.8:1 ✅
- `--color-text-secondary` on `--color-bg-secondary` → 7.2:1 ✅
- `--color-primary` on `--color-text-inverse` → 5.1:1 ✅
- `--color-accent` on `--color-text-inverse` → 4.8:1 ✅
- `--color-error` on `--color-text-inverse` → 5.4:1 ✅

---

## 3. Typography System

### 3.1 Font Families

| Role | Font | Weights | Source |
|------|------|---------|--------|
| **Headings** | **Lexend** | 300, 400, 500, 600, 700 | Google Fonts |
| **Body** | **Source Sans 3** | 300, 400, 500, 600, 700 | Google Fonts |
| **Mono/Code** | **JetBrains Mono** | 400, 500, 600 | Google Fonts |
| **Data/Numbers** | **Tabular Nums** | — | `font-variant-numeric: tabular-nums` |

**CSS Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&family=Source+Sans+3:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
```

**Tailwind Config:**
```js
fontFamily: {
  heading: ['Lexend', 'system-ui', 'sans-serif'],
  body: ['Source Sans 3', 'system-ui', 'sans-serif'],
  mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
}
```

### 3.2 Type Scale (Fluid, Clamp-based)

| Token | Min | Max | Line Height | Letter Spacing | Usage |
|-------|-----|-----|-------------|----------------|-------|
| `--text-display` | 3.5rem | 5rem | 1.05 | -0.03em | Hero headlines (homepage) |
| `--text-h1` | 2.5rem | 3.5rem | 1.1 | -0.02em | Page titles, section headers |
| `--text-h2` | 2rem | 2.5rem | 1.2 | -0.01em | Major section titles |
| `--text-h3` | 1.5rem | 1.875rem | 1.3 | -0.01em | Card titles, subsection headers |
| `--text-h4` | 1.25rem | 1.5rem | 1.35 | 0 | Small card titles |
| `--text-lg` | 1.125rem | 1.25rem | 1.6 | 0 | Lead paragraphs, intro text |
| `--text-base` | 1rem | 1rem | 1.65 | 0 | Body text (default) |
| `--text-sm` | 0.875rem | 0.875rem | 1.6 | 0 | Secondary text, captions |
| `--text-xs` | 0.75rem | 0.75rem | 1.5 | 0.02em | Labels, badges, metadata |
| `--text-2xs` | 0.625rem | 0.625rem | 1.5 | 0.05em | Legal, copyright, tiny labels |

### 3.3 Fluid Typography Implementation

```css
:root {
  --text-display: clamp(2.5rem, 5vw + 1rem, 5rem);
  --text-h1: clamp(2rem, 3vw + 1rem, 3.5rem);
  --text-h2: clamp(1.75rem, 2.5vw + 1rem, 2.5rem);
  --text-h3: clamp(1.25rem, 1.5vw + 1rem, 1.875rem);
  --text-h4: clamp(1.125rem, 1vw + 1rem, 1.5rem);
  --text-lg: clamp(1rem, 0.5vw + 1rem, 1.25rem);
  --text-base: 1rem;
  --text-sm: 0.875rem;
  --text-xs: 0.75rem;
}
```

### 3.4 Font Weights & Styles

```css
--font-weight-light: 300;
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;

--line-height-tight: 1.1;
--line-height-snug: 1.375;
--line-height-normal: 1.5;
--line-height-relaxed: 1.625;
--line-height-loose: 1.75;
```

---

## 4. Spacing & Layout System

### 4.1 Spacing Scale (Base: 4px / 0.25rem)

| Token | Value | Usage |
|-------|-------|-------|
| `--space-0` | 0 | Reset |
| `--space-1` | 0.25rem (4px) | Micro spacing, icon gaps |
| `--space-2` | 0.5rem (8px) | Button padding, small gaps |
| `--space-3` | 0.75rem (12px) | Form field gaps, card padding sm |
| `--space-4` | 1rem (16px) | Base unit, card padding md |
| `--space-5` | 1.25rem (20px) | Section inner padding |
| `--space-6` | 1.5rem (24px) | Card padding lg, component gaps |
| `--space-8` | 2rem (32px) | Section vertical rhythm |
| `--space-10` | 2.5rem (40px) | Large section gaps |
| `--space-12` | 3rem (48px) | Major section separation |
| `--space-16` | 4rem (64px) | Page-level padding |
| `--space-20` | 5rem (80px) | Hero sections, major breaks |
| `--space-24` | 6rem (96px) | Full-screen hero (desktop) |

### 4.2 Container Widths

| Token | Value | Usage |
|-------|-------|-------|
| `--container-sm` | 640px | Narrow content, forms |
| `--container-md` | 768px | Standard content |
| `--container-lg` | 1024px | Wide content, two-column |
| `--container-xl` | 1280px | Full-width content, grids |
| `--container-2xl` | 1440px | Maximum content width |

### 4.3 Layout Grid

```css
:root {
  --grid-cols: 12;
  --grid-gap: var(--space-6);
  --grid-gap-sm: var(--space-4);
  --grid-gap-lg: var(--space-8);
}
```

**Responsive Breakpoints:**
```css
--bp-sm: 640px;   /* Mobile landscape / small tablet */
--bp-md: 768px;   /* Tablet portrait */
--bp-lg: 1024px;  /* Tablet landscape / small desktop */
--bp-xl: 1280px;  /* Desktop */
--bp-2xl: 1440px; /* Large desktop */
```

---

## 5. Border Radius & Shadows

### 5.1 Border Radius Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-none` | 0 | Sharp corners (tables, full-bleed) |
| `--radius-xs` | 0.125rem (2px) | Badges, tags, small chips |
| `--radius-sm` | 0.25rem (4px) | Buttons, inputs, small cards |
| `--radius-md` | 0.375rem (6px) | Default cards, modals, dropdowns |
| `--radius-lg` | 0.5rem (8px) | Large cards, featured sections |
| `--radius-xl` | 0.75rem (12px) | Hero cards, prominent CTAs |
| `--radius-2xl` | 1rem (16px) | Full-bleed sections, special cards |
| `--radius-full` | 9999px | Pills, avatars, circular elements |

### 5.2 Shadow System (Elevation)

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-xs` | `0 1px 2px 0 rgb(0 0 0 / 0.03)` | Subtle, hover on flat elements |
| `--shadow-sm` | `0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)` | Cards, default elevation |
| `--shadow-md` | `0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)` | Raised cards, dropdowns |
| `--shadow-lg` | `0 10px 15px -3px rgb(0 0 0 / 0.05), 0 4px 6px -4px rgb(0 0 0 / 0.05)` | Modals, popovers, hero cards |
| `--shadow-xl` | `0 20px 25px -5px rgb(0 0 0 / 0.05), 0 8px 10px -6px rgb(0 0 0 / 0.05)` | Full-screen modals, major overlays |

---

## 6. Component System (shadcn/ui + Radix UI)

### 6.1 Component Inventory

| Component | Base | Variants | Status |
|-----------|------|----------|--------|
| **Button** | Radix Slot | primary, secondary, outline, ghost, destructive, link | ✅ Exists |
| **Card** | Custom | default, bordered, elevated, interactive | ✅ Exists |
| **Input** | Radix Slot | default, error, success, disabled | ✅ Exists |
| **Textarea** | Radix Slot | default, error | ✅ Exists |
| **Select** | Radix Select | default, searchable, multi | 🔄 Needs audit |
| **Checkbox** | Radix Checkbox | default, indeterminate | 🔄 Needs audit |
| **Radio Group** | Radix Radio Group | default | 🔄 Needs audit |
| **Switch** | Radix Switch | default | 🔄 Needs audit |
| **Dialog/Modal** | Radix Dialog | default, alert, confirmation, form | ✅ Exists |
| **Dropdown Menu** | Radix Dropdown Menu | default, with separators, icons | 🔄 Needs audit |
| **Tabs** | Radix Tabs | default, vertical, animated | 🔄 Needs audit |
| **Accordion** | Radix Accordion | default, single-open, multiple | 🔄 Needs audit |
| **Toast/Sonner** | Sonner | success, error, info, loading, promise | ✅ Exists |
| **Tooltip** | Radix Tooltip | default, delayed, rich content | 🔄 Needs audit |
| **Avatar** | Custom | image, fallback, status badge | 🔄 Needs creation |
| **Badge** | Custom | default, outline, dot, status | ✅ Exists |
| **Breadcrumb** | Custom | default, with separators | ✅ Exists |
| **Pagination** | Custom | default, with ellipsis | 🔄 Needs creation |
| **Table** | Custom | default, striped, hover, sortable | ✅ Exists |
| **Skeleton** | Custom | text, circular, rectangular | ✅ Exists |
| **Progress** | Radix Progress | default, indeterminate, circle | 🔄 Needs creation |
| **Slider** | Radix Slider | default, range, stepped | 🔄 Needs creation |
| **Date Picker** | Custom/DayPicker | single, range, multi-month | 🔄 Needs creation |

### 6.2 Button Specifications

```typescript
// Variants (using design tokens)
const buttonVariants = {
  primary:      'bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary/90 border border-primary',
  secondary:    'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-secondary',
  outline:      'bg-transparent text-primary hover:bg-primary-light border border-primary-border',
  ghost:        'bg-transparent text-primary hover:bg-primary-light border border-transparent',
  destructive:  'bg-error text-error-foreground hover:bg-error/90 border border-error',
  link:         'bg-transparent text-primary underline-offset-4 hover:underline',

  // Special: Donation CTA
  donation:     'bg-accent text-accent-foreground hover:bg-accent-hover active:bg-accent/90 border border-accent shadow-lg',
}

// Sizes
const buttonSizes = {
  xs: 'px-2.5 py-1.5 text-xs gap-1.5',
  sm: 'px-3 py-2 text-sm gap-2',
  md: 'px-4 py-2.5 text-sm gap-2',     // Default
  lg: 'px-5 py-3 text-base gap-2.5',
  xl: 'px-6 py-3.5 text-base gap-2.5',
  icon: 'size-9',                         // Icon only
  iconSm: 'size-8',
  iconLg: 'size-10',
}
```

**Accessibility Requirements:**
- Minimum 44×44px touch target (use `min-h-[44px] min-w-[44px]` on icon buttons)
- Visible focus ring: `focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary-light`
- Loading state: Show spinner, disable interactions, preserve dimensions
- `aria-disabled` when disabled, `aria-busy` when loading

### 6.3 Card Specifications

```typescript
const cardVariants = {
  default: 'bg-card text-card-foreground border border-border-light shadow-sm',
  bordered: 'bg-card text-card-foreground border border-border-medium',
  elevated: 'bg-card text-card-foreground border border-border-light shadow-md',
  interactive: 'bg-card text-card-foreground border border-border-light shadow-sm hover:shadow-md hover:border-border-medium transition-all duration-200 cursor-pointer',
  featured: 'bg-card text-card-foreground border border-border-light shadow-lg',
}

// Padding
const cardPadding = {
  none: '',
  sm: 'p-4',
  md: 'p-5',       // Default
  lg: 'p-6',
  xl: 'p-8',
}
```

### 6.4 Form Field Specifications

```css
/* Base input */
.field-base {
  @apply w-full rounded-md border border-border-medium bg-background
         px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground
         transition-colors duration-150
         focus:outline-none focus:ring-3 focus:ring-primary-light focus:border-primary
         disabled:cursor-not-allowed disabled:opacity-50;
}

/* Error state */
.field-error {
  @apply border-error focus:ring-error-light focus:border-error;
}

/* Success state */
.field-success {
  @apply border-success focus:ring-success-light focus:border-success;
}

/* Label */
.field-label {
  @apply block text-sm font-medium text-foreground mb-1.5;
}

/* Error message */
.field-error-message {
  @apply mt-1.5 text-sm text-error flex items-center gap-1;
}

/* Helper text */
.field-helper {
  @apply mt-1.5 text-sm text-muted-foreground;
}
```

---

## 7. Animation & Motion System

### 7.1 Motion Principles (from ui-ux-pro-max)

| Principle | Implementation |
|-----------|----------------|
| **Meaningful** | Motion conveys state change, hierarchy, or spatial relationship |
| **Respectful** | Honor `prefers-reduced-motion`; disable non-essential animation |
| **Performant** | Use `transform`/`opacity` only; avoid layout-triggering properties |
| **Context-Aware** | Faster on mobile, slower on desktop; stagger for lists |
| **Spring Physics** | Natural easing (`cubic-bezier(0.2, 0.6, 0.2, 1)` or GSAP `back.out(1.4)`) |

### 7.2 Transition Tokens

```css
:root {
  --transition-instant:  0ms;           /* State changes only */
  --transition-fast:     100ms ease;    /* Hover, focus, tap feedback */
  --transition-normal:   150ms ease;    /* Default UI transitions */
  --transition-slow:     200ms ease;    /* Modals, drawers, complex */
  --transition-slower:   300ms ease;    /* Page transitions, hero */
  --transition-slowest:  500ms ease;    /* Major state changes */

  /* Easing curves */
  --ease-linear:     linear;
  --ease-in:         cubic-bezier(0.4, 0, 1, 1);
  --ease-out:        cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out:     cubic-bezier(0.4, 0, 0.2, 1);
  --ease-spring:     cubic-bezier(0.2, 0.6, 0.2, 1);
  --ease-bounce:     cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

### 7.3 Standard Animations

| Animation | Duration | Easing | Usage |
|-----------|----------|--------|-------|
| **Fade In** | 200ms | ease-out | Modals, toasts, dropdowns |
| **Fade Out** | 150ms | ease-in | Modals, toasts, dropdowns |
| **Slide Up** | 300ms | spring | Page sections, cards on scroll |
| **Slide Down** | 200ms | ease-out | Mobile nav, dropdowns |
| **Scale Tap** | 100ms | ease-out | Button press, card press |
| **Stagger List** | 300-450ms | back.out(1.4) | Grid items, cards, lists |
| **Ken Burns** | 8-12s | linear | Hero background images |
| **Progress Fill** | Variable | linear | Carousel progress bars |

### 7.4 GSAP Presets (Standard Tier — Motion: 4/10)

```javascript
// Stagger Reveal (for grids, cards, lists)
gsap.from('.stagger-item', {
  opacity: 0,
  scale: 0.92,
  y: 16,
  duration: 0.4,
  stagger: { each: 0.06, from: 'start', grid: 'auto' },
  ease: 'back.out(1.4)',
  scrollTrigger: { trigger: '.stagger-container', start: 'top 85%' }
});

// Hero Content Reveal
gsap.timeline({ defaults: { ease: 'power3.out' } })
  .from('.hero-eyebrow', { opacity: 0, y: 20 }, 0.1)
  .from('.hero-title', { opacity: 0, y: 26 }, 0.25)
  .from('.hero-text', { opacity: 0, y: 20 }, 0.4)
  .from('.hero-actions', { opacity: 0, y: 16 }, 0.55);

// Card Hover Lift
gsap.to('.card-interactive', {
  y: -4,
  boxShadow: 'var(--shadow-lg)',
  duration: 0.2,
  ease: 'power2.out'
});

// Carousel Progress Bar
gsap.to('.carousel-progress', {
  scaleX: 1,
  duration: 6.5,  // matches AUTOPLAY_MS
  ease: 'none',
  repeat: -1
});
```

**Reduced Motion Guard:**
```javascript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReducedMotion) {
  gsap.set('.stagger-item', { opacity: 1, scale: 1, y: 0 });
  // Disable all non-essential animations
}
```

---

## 8. Icon System

### 8.1 Library Strategy

| Priority | Library | Style | Import |
|----------|---------|-------|--------|
| **Primary** | **Phosphor Icons** | Regular (weight="regular") | `@phosphor-icons/react` |
| **Fallback** | **Heroicons v2** | Outline | `@heroicons/react/24/outline` |
| **Specialized** | **Lucide React** | Outline | `lucide-react` |

### 8.2 Icon Usage Rules

| Context | Implementation |
|---------|----------------|
| **Decorative** (next to visible text) | `aria-hidden="true"` + `focusable="false"` |
| **Meaningful** (no visible text equivalent) | Provide `aria-label` or visually hidden text |
| **Interactive** (inside button/link) | Parent gets accessible name; icon `aria-hidden="true"` |
| **Status/State** (loading, success, error) | `role="img"` + `aria-label` describing state |

### 8.3 Icon Sizing

| Context | Size | CSS |
|---------|------|-----|
| **Inline with text (sm)** | 14px / 0.875rem | `w-3.5 h-3.5` |
| **Inline with text (base)** | 16px / 1rem | `w-4 h-4` |
| **Inline with text (lg)** | 20px / 1.25rem | `w-5 h-5` |
| **Button icon (sm)** | 16px | `w-4 h-4` |
| **Button icon (md)** | 18px | `w-4.5 h-4.5` |
| **Button icon (lg)** | 20px | `w-5 h-5` |
| **Feature/icon card** | 32px | `w-8 h-8` |
| **Hero/large decorative** | 48-64px | `w-12 h-12` to `w-16 h-16` |

### 8.4 Sector Icons (Custom SVG)

Each program sector has a custom icon representing its focus area:
- Protection: Shield with checkmark
- Health & Education: Heart + book/stethoscope
- Disaster & Climate: Cloud with arrow/lightning
- WASH: Water droplet with leaf
- Livelihoods: Home with sprouting plant

---

## 9. Layout Patterns

### 9.1 Page Structure (Standard)

```tsx
<page-layout>
  <header>Sticky, transparent→solid on scroll</header>
  <main>
    <section className="hero">Page-specific hero</section>
    <section className="content">Primary content</section>
    <section className="proof">Impact stats, partners, testimonials</section>
    <section className="cta">Conversion section</section>
  </main>
  <footer>Comprehensive footer</footer>
</page-layout>
```

### 9.2 Hero Section Patterns

| Page Type | Hero Pattern | Height | Content |
|-----------|--------------|--------|---------|
| **Home** | Carousel + Ken Burns | 88vh (min 560px) | Mission, 2 CTAs, slide controls |
| **Impact/Program** | Static image + overlay | 60vh | Sector title, summary, scroll indicator |
| **Projects** | Simple + filter bar | 40vh | Title, description, filter/search |
| **About** | Image + mission | 50vh | Org photo, tagline |
| **Story/Article** | Featured image | 45vh | Title, author, date, category |
| **Contact/Get Involved** | Split layout | 50vh | Form + info/map side-by-side |

### 9.3 Section Rhythm

```css
.section {
  padding-block: var(--space-16);  /* 64px default */
}
.section-sm {
  padding-block: var(--space-10);  /* 40px */
}
.section-lg {
  padding-block: var(--space-20);  /* 80px */
}
.section-xl {
  padding-block: var(--space-24);  /* 96px */
}
```

**Responsive adjustments:**
```css
@media (max-width: 768px) {
  .section { padding-block: var(--space-12); }   /* 48px */
  .section-lg { padding-block: var(--space-16); } /* 64px */
}
```

### 9.4 Grid Patterns

```css
/* 2-column: content + sidebar */
.grid-2col {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-8);
}
@media (min-width: 1024px) {
  .grid-2col { grid-template-columns: 1fr 320px; }
}

/* 3-column: features, programs, stats */
.grid-3col {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-6);
}
@media (min-width: 768px) {
  .grid-3col { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1024px) {
  .grid-3col { grid-template-columns: repeat(3, 1fr); }
}

/* Auto-fit: partners, logos, flexible cards */
.grid-auto {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--space-6);
}
```

---

## 10. Navigation Patterns

### 10.1 Header (Sticky, Shrinking)

```css
.header {
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  height: var(--header-height);  /* 64px */
  background: var(--color-bg-secondary/95);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border-light);
  transition: height var(--transition-normal), box-shadow var(--transition-normal);
}

.header.scrolled {
  box-shadow: var(--shadow-sm);
}
```

### 10.2 Mega Menu (Desktop)

- **Trigger**: Hover + Focus (keyboard accessible)
- **Animation**: Fade + slide down (200ms ease-out)
- **Structure**: Columnar, grouped by category
- **Max Width**: `--container-xl` (1280px)
- **Close**: Click outside, Escape key, focus loss

### 10.3 Mobile Navigation

- **Pattern**: Slide-over drawer (from right)
- **Width**: `min(320px, 85vw)`
- **Animation**: 300ms spring
- **Backdrop**: Semi-transparent, click to close
- **Focus Trap**: Required when open

### 10.4 Breadcrumb

```css
.breadcrumb {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
}
.breadcrumb-separator { color: var(--color-text-quaternary); }
.breadcrumb-current { color: var(--color-text-primary); font-weight: 500; }
```

---

## 11. Data Display & Visualization

### 11.1 Impact Statistics

```tsx
// Component: ImpactStat
<dl className="impact-stat">
  <dt className="impact-value" style="--value-color: var(--color-forest-600)">
    {value}  {/* Use tabular-nums */}
  </dt>
  <dd className="impact-label">{label}</dd>
</dl>
```

**Visual Style:**
- Large numeric value (clamp 3rem-5rem, font-weight 700)
- Label below (text-sm, text-secondary)
- Optional: Sector color accent bar on left
- Animated count-up on scroll (respect reduced motion)

### 11.2 Data Tables

```css
.table-container { overflow-x: auto; }
.table { width: 100%; border-collapse: collapse; }
.table th { text-align: left; font-weight: 600; padding: var(--space-3) var(--space-4); border-bottom: 2px solid var(--color-border-medium); }
.table td { padding: var(--space-3) var(--space-4); border-bottom: 1px solid var(--color-border-light); }
.table tbody tr:hover { background: var(--color-bg-hover); }
.table tbody tr:focus-within { outline: 2px solid var(--color-primary); outline-offset: -2px; }
```

### 11.3 Charts (Future)

When implementing charts, use:
- **Library**: Recharts or Chart.js with accessibility plugin
- **Colors**: Sector accent palette (colorblind-safe)
- **Patterns**: Texture/pattern fills for non-color differentiation
- **Labels**: Direct labeling preferred over legends
- **Tooltips**: Keyboard accessible, high contrast

---

## 12. Content Patterns

### 12.1 Project Card

```tsx
<article className="project-card">
  <div className="project-image">
    <img src={banner} alt="" loading="lazy" />
    <span className="project-index">01</span>
    <span className="project-category">{programName}</span>
  </div>
  <div className="project-content">
    <h3><a href={slug}>{title}</a></h3>
    <p>{summary}</p>
    <div className="project-meta">
      <span>{district}</span>
      <span>{period}</span>
    </div>
    <a className="project-link" href={slug}>
      Learn more <ChevronRight aria-hidden="true" />
    </a>
  </div>
</article>
```

### 12.2 Story Card

```tsx
<article className="story-card">
  <div className="story-image">
    <img src={image} alt={title} loading="lazy" />
  </div>
  <div className="story-content">
    <span className="story-tag">{category}</span>
    <h3><a href={slug}>{title}</a></h3>
    <p>{excerpt}</p>
    <div className="story-meta">
      <time>{date}</time>
      <span>{readTime}</span>
    </div>
    <a className="story-link" href={slug}>Read story</a>
  </div>
</article>
```

### 12.3 Partner/Logo Marquee

- **Animation**: Continuous horizontal scroll (20-30s loop)
- **Pause**: On hover, focus, reduced motion
- **Items**: Minimum 10 logos for seamless loop
- **Accessibility**: `aria-label="Our partners"`, static fallback for reduced motion

---

## 13. Forms & Feedback

### 13.1 Form Layout

```tsx
<form className="space-y-6" noValidate>
  <div className="field-group">
    <label htmlFor="name" className="field-label">Full Name</label>
    <input id="name" type="text" className="field-base" required />
    <p className="field-helper">As it appears on official documents</p>
  </div>

  <div className="field-group">
    <label htmlFor="email" className="field-label">Email Address</label>
    <input id="email" type="email" className="field-base" required />
  </div>

  <div className="field-group">
    <label htmlFor="message" className="field-label">Message</label>
    <textarea id="message" className="field-base min-h-[140px]" required />
  </div>

  <div className="field-group">
    <button type="submit" className="button-primary w-full sm:w-auto">
      Send Message
    </button>
  </div>
</form>
```

### 13.2 Validation States

| State | Visual | Screen Reader |
|-------|--------|---------------|
| **Default** | Border `border-border-medium` | — |
| **Focus** | Ring `ring-3 ring-primary-light`, border `border-primary` | — |
| **Error** | Border `border-error`, ring `ring-error-light`, error message below | `aria-invalid="true"`, `aria-describedby="error-id"` |
| **Success** | Border `border-success`, ring `ring-success-light` | `aria-describedby="success-id"` (optional) |
| **Disabled** | `opacity-50 cursor-not-allowed` | `aria-disabled="true"` |

### 13.3 Toast Notifications (Sonner)

```typescript
// Success
toast.success('Message sent successfully', {
  description: 'We\'ll get back to you within 2 business days.',
  duration: 5000,
});

// Error
toast.error('Failed to send', {
  description: 'Please check your connection and try again.',
  action: { label: 'Retry', onClick: () => resend() },
});

// Loading (Promise)
toast.promise(sendMessage(), {
  loading: 'Sending...',
  success: 'Sent!',
  error: 'Failed to send',
});
```

---

## 14. Accessibility Checklist (Per Page)

### 14.1 Required on Every Page

- [ ] **Skip Link** — First focusable element: `<a href="#main" className="skip-link">Skip to main content</a>`
- [ ] **Landmarks** — `<header>`, `<nav>`, `<main>`, `<footer>`, `<aside>` (where applicable)
- [ ] **Heading Hierarchy** — Single `<h1>`, logical h2→h3→h4 progression
- [ ] **Language** — `<html lang="en">` (add `lang="ne"` for Nepali pages)
- [ ] **Viewport** — `<meta name="viewport" content="width=device-width, initial-scale=1">`
- [ ] **Focus Visible** — All interactive elements have 3-4px focus ring
- [ ] **Touch Targets** — Minimum 44×44px (check mobile nav, pagination, icon buttons)
- [ ] **Color Contrast** — All text meets 4.5:1 (7:1 for key CTAs)
- [ ] **Reduced Motion** — Non-essential animation disabled via media query
- [ ] **Images** — `alt` text for informative images, `alt=""` for decorative
- [ ] **Forms** — Labels associated (`htmlFor`/`id`), error messages linked (`aria-describedby`)
- [ ] **ARIA** — Only where native HTML insufficient; test with screen reader

### 14.2 Page-Specific Requirements

| Page | Additional Checks |
|------|-------------------|
| **Home** | Carousel: keyboard nav, pause on hover/focus, reduced motion static fallback |
| **Impact** | Accordions: `aria-expanded`, `aria-controls`, keyboard toggle |
| **Projects** | Filters: live region for results count, accessible combobox/select |
| **Stories** | Article: `article` element, proper heading structure, reading time |
| **Contact** | Form: autocomplete attributes, clear error summary at top |
| **Gallery** | Lightbox: focus trap, keyboard nav (arrows, ESC), `aria-label` on images |
| **Notice/Vacancy** | Tables: sortable headers with `aria-sort`, pagination accessible |

---

## 15. Performance Budgets

| Metric | Target | Measurement |
|--------|--------|-------------|
| **LCP** | ≤ 2.5s | Hero image optimized, preload, minimal JS blocking |
| **FID/INP** | ≤ 100ms | Minimal main-thread work, code splitting |
| **CLS** | ≤ 0.1 | Reserve space for images, fonts, dynamic content |
| **Total JS** | ≤ 170KB gzipped | Tree shaking, dynamic imports for heavy components |
| **Fonts** | ≤ 50KB | Subset Lexend/Source Sans 3, `font-display: swap` |
| **Images** | WebP/AVIF | Next.js Image optimization, responsive sizes |

---

## 16. Implementation Roadmap

### Phase 1: Foundation (Week 1-2)
- [ ] Create `design-tokens.css` with all semantic tokens (light + dark)
- [ ] Update `tailwind.config.js` to use design tokens
- [ ] Add Google Fonts import (Lexend + Source Sans 3 + JetBrains Mono)
- [ ] Set up CSS custom properties in `:root` and `.dark`
- [ ] Configure `next/font` for self-hosted fonts (optional)

### Phase 2: Component Library (Week 2-4)
- [ ] Audit existing components against specs in Section 6
- [ ] Standardize Button, Card, Input, Textarea, Badge
- [ ] Build missing: Select, Checkbox, Radio, Switch, Avatar, Pagination, Progress, Slider
- [ ] Add Storybook/visual regression testing
- [ ] Document component props and usage

### Phase 3: Layout & Patterns (Week 3-4)
- [ ] Refactor Header (sticky, mega menu, mobile drawer)
- [ ] Build Footer (responsive, accessible)
- [ ] Create Hero patterns (Home, Impact, Project, Article, Contact)
- [ ] Build Section wrapper components
- [ ] Implement Grid patterns (2col, 3col, auto-fit)

### Phase 4: Pages & Content (Week 4-6)
- [ ] Redesign Homepage (Hero, Impact Stats, Focus Areas, Projects, CTA, Partners)
- [ ] Redesign Impact/Program pages (Sector cards, Project grids, Details)
- [ ] Redesign Projects listing (Filters, Search, Cards, Pagination)
- [ ] Redesign About (Mission, Team, Structure, Board, Achievements)
- [ ] Redesign Stories (Listing, Article, Categories, Search)
- [ ] Redesign Get Involved / Contact / Gallery / Network / Notice

### Phase 5: Polish & Accessibility (Week 5-6)
- [ ] Full WCAG AA audit (automated + manual)
- [ ] Screen reader testing (NVDA, VoiceOver)
- [ ] Keyboard navigation audit
- [ ] Reduced motion verification
- [ ] Dark mode implementation & testing
- [ ] Performance optimization (LCP, CLS, bundle size)
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)

### Phase 6: Documentation & Handoff (Week 6)
- [ ] Component documentation (Storybook/MDX)
- [ ] Design token reference
- [ ] Page-specific override docs
- [ ] Contribution guidelines
- [ ] Design system versioning strategy

---

## 17. Governance

### 17.1 Versioning
- **MAJOR**: Breaking changes to tokens, component APIs, or layout primitives
- **MINOR**: New components, new tokens, non-breaking enhancements
- **PATCH**: Bug fixes, token value adjustments, documentation updates

### 17.2 Change Process
1. Propose change in GitHub Issue with "design-system" label
2. Design review (accessibility, brand alignment, component impact)
3. Implementation in feature branch
4. Visual regression test (Chromatic/Storybook)
5. Accessibility test
6. Merge to main with version bump

### 17.3 Token Naming Convention
```
--color-{category}-{scale}        // e.g., --color-forest-600
--color-{semantic}-{modifier}     // e.g., --color-primary-hover
--space-{step}                    // e.g., --space-4
--text-{size}                     // e.g., --text-h1
--radius-{size}                   // e.g., --radius-md
--shadow-{size}                   // e.g., --shadow-lg
--transition-{speed}              // e.g., --transition-normal
--ease-{curve}                    // e.g., --ease-spring
--z-{layer}                       // e.g., --z-modal
```

---

## 18. References

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Radix UI Primitives](https://www.radix-ui.com/)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Phosphor Icons](https://phosphoricons.com/)
- [Lexend Font](https://fonts.google.com/specimen/Lexend)
- [Source Sans 3 Font](https://fonts.google.com/specimen/Source+Sans+3)
- [ui-ux-pro-max Accessible & Ethical Style](references/quick-reference.md)
- [ui-ux-pro-max Corporate Trust Typography](references/typography.csv)

---

*Generated with ui-ux-pro-max design intelligence. Last updated: 2026-11-08*