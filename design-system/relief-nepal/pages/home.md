# Homepage Design Override — Relief Nepal

> Extends `MASTER.md`. Only deviations and page-specific specs are documented here.

---

## 1. Page Structure

```tsx
<main className="rn-site">
  <HeroCarousel />                    // Full-viewport, Ken Burns
  <ImpactStatsBar />                  // 4-5 key metrics, sticky on scroll
  <FocusAreas />                      // 5 sector cards, grid
  <ProjectsPreview />                 // 3 featured projects + "View All"
  <StoriesPreview />                  // 3 latest stories (optional)
  <CTASection />                      // Get Involved + Contact
  <PartnerMarquee />                  // Animated logo strip
</main>
```

---

## 2. Hero Carousel (`HeroCarousel`)

### 2.1 Specifications (Enhanced from current `RnHero`)

| Property | Value |
|----------|-------|
| **Height** | `clamp(560px, 88vh, 820px)` |
| **Slides** | 8-12 images with captions |
| **Transition** | Ken Burns (scale 1.18→1, 9s cubic-bezier) + Crossfade (1.4s) |
| **Overlay** | Gradient: `rgba(7,20,36,0.88) → rgba(7,20,36,0.15)` (90deg) + vertical fade |
| **Glow Accents** | Two blurred orbs (forest-600, gold-500), slow drift animation |
| **Content Max-Width** | 1180px (container) |
| **Content Padding** | `clamp(1.25rem, 5vw, 3rem)` inline |

### 2.2 Content Hierarchy

```tsx
<div className="hero-content">
  <p className="hero-eyebrow">
    <span className="hero-pulse" aria-hidden="true" />
    Relief Nepal · Community-led development
  </p>
  <h1 className="hero-title">
    Building self-reliant, equitable communities across Nepal
  </h1>
  <p className="hero-text">
    We partner with children, youth, women and marginalized groups
    to strengthen rights, opportunity and resilience.
  </p>
  <div className="hero-actions">
    <Link className="btn btn-primary btn-lg" href="/projects">
      Explore Our Work
      <ChevronRight aria-hidden="true" />
    </Link>
    <Link className="btn btn-outline btn-lg" href="/get-involved">
      Get Involved
      <ChevronRight aria-hidden="true" />
    </Link>
  </div>
</div>
```

### 2.3 Typography (Page-Specific)

| Element | Size | Weight | Line Height | Color |
|---------|------|--------|-------------|-------|
| `.hero-eyebrow` | `clamp(0.85rem, 1vw, 1rem)` | 600 | 1 | White (with backdrop) |
| `.hero-title` | `clamp(2.5rem, 5.5vw, 4.5rem)` | 700 | 1.05 | White |
| `.hero-text` | `clamp(1rem, 1.5vw, 1.25rem)` | 400 | 1.65 | `rgba(255,255,255,0.86)` |
| `.btn` | `1rem` | 700 | 1 | Per variant |

### 2.4 Controls Bar (Bottom)

```tsx
<div className="hero-controls">
  <div className="hero-caption">
    <span className="hero-count">
      {currentSlide}/{totalSlides}  // tabular-nums, 1.6rem/700
    </span>
    <span className="hero-caption-text">{caption}</span>
  </div>

  <div className="hero-progress" role="group" aria-label="Choose slide">
    {slides.map((_, i) => (
      <button
        className={`hero-progress-bar ${i === current ? 'active' : ''} ${i < current ? 'done' : ''}`}
        aria-pressed={i === current}
        aria-label={`Go to slide ${i + 1}`}
        key={i}
      >
        <b />  // Animated fill via CSS
      </button>
    ))}
  </div>

  <div className="hero-arrows">
    <button aria-label="Previous slide" onClick={prev}><ChevronLeft /></button>
    <button aria-label="Next slide" onClick={next}><ChevronRight /></button>
  </div>
</div>
```

### 2.5 Accessibility Requirements

- [ ] `aria-roledescription="carousel"` on section
- [ ] `aria-label="Relief Nepal highlights"` on section
- [ ] `tabIndex={0}` when >1 slide (keyboard navigation)
- [ ] Arrow keys: ← previous, → next
- [ ] Swipe gestures on touch (50px threshold)
- [ ] Pause on hover, focus, touch
- [ ] **Reduced Motion**: Static first slide, no Ken Burns, no progress animation, instant transitions
- [ ] Focus trap NOT needed (controls are part of page tab order)
- [ ] Progress bars: `aria-live="off"`, `role="group"`

### 2.6 CSS Custom Properties (Hero-Specific)

```css
.rn-home-hero {
  --hero-autoplay: 6500ms;
  --hero-ink: #ffffff;
  --hero-overlay-start: rgba(7, 20, 36, 0.88);
  --hero-overlay-mid: rgba(7, 20, 36, 0.55);
  --hero-overlay-end: rgba(7, 20, 36, 0.15);
  --hero-glow-a: var(--color-forest-600);
  --hero-glow-b: var(--color-gold-500);
}
```

---

## 3. Impact Stats Bar (`ImpactStatsBar`)

### 3.1 Layout

```tsx
<section className="impact-stats" aria-labelledby="impact-stats-title">
  <h2 id="impact-stats-title" className="sr-only">Our Impact in Numbers</h2>
  <div className="stats-grid">
    {stats.map((stat) => (
      <ImpactStat key={stat.label} {...stat} />
    ))}
  </div>
</section>
```

### 3.2 Data (Verified, Updated Annually)

| Label | Value | Sector Color | Source |
|-------|-------|--------------|--------|
| **People Reached Annually** | 15,000+ | Forest | Annual Report 2024 |
| **Districts Covered** | 12 | Protection | Program Data |
| **Projects Completed** | 47+ | Health | Project Database |
| **Communities Empowered** | 200+ | Livelihoods | M&E Reports |
| **Years of Service** | 16+ | Gold | Est. 2008 |

### 3.3 Component Spec (`ImpactStat`)

```tsx
<dl className="impact-stat">
  <dt className="impact-value" style={{ '--stat-color': sectorColor }}>
    {value}
  </dt>
  <dd className="impact-label">{label}</dd>
</dl>
```

**Visual:**
- Value: `clamp(2.5rem, 4vw, 3.5rem)`, weight 700, `font-variant-numeric: tabular-nums`
- Color: `var(--stat-color)` (sector accent)
- Label: `var(--text-sm)`, `var(--color-text-secondary)`, uppercase, tracking-wide
- Container: `bg-card`, `border border-border-light`, `rounded-xl`, `p-6 md:p-8`
- Hover: `shadow-md`, `border-border-medium`, `translate-y-[-2px]`

### 3.4 Responsive

| Breakpoint | Columns | Gap |
|------------|---------|-----|
| `< 640px` | 2 | 16px |
| `640-1024px` | 3 | 24px |
| `> 1024px` | 5 | 24px |

### 3.5 Animation

- Stagger reveal on scroll (IntersectionObserver)
- Count-up animation for values (respects `prefers-reduced-motion`)
- `gsap.from('.impact-stat', { opacity: 0, y: 20, duration: 0.5, stagger: 0.1, ease: 'power3.out' })`

---

## 4. Focus Areas (`FocusAreas`)

### 4.1 Section Spec

```tsx
<section className="focus-areas" aria-labelledby="focus-areas-title">
  <div className="section-header">
    <h2 id="focus-areas-title">Creating change where it matters</h2>
    <p>Explore our five core program areas and the communities we serve</p>
  </div>
  <div className="focus-grid">
    {sectors.map((sector) => (
      <FocusAreaCard key={sector.id} {...sector} />
    ))}
  </div>
</section>
```

### 4.2 Sector Data

```javascript
const sectors = [
  {
    id: 'protection',
    number: '01',
    title: 'Protection',
    summary: 'Promoting the rights, safety and dignity of children, women and marginalized communities.',
    icon: ShieldCheck,  // Phosphor
    color: 'var(--color-protection)',
    image: '/images/sector-protection.jpg',
    projectCount: 12,
    href: '/impact#protection',
  },
  {
    id: 'health-education',
    number: '02',
    title: 'Health & Education',
    summary: 'Supporting healthier communities and more inclusive opportunities to learn.',
    icon: HeartPulse,  // Phosphor
    color: 'var(--color-health)',
    image: '/images/sector-health.jpg',
    projectCount: 14,
    href: '/impact#health-education',
  },
  // ... disaster-climate, wash, livelihoods
];
```

### 4.3 Card Design (`FocusAreaCard`)

```tsx
<article className="focus-card">
  <Link href={href} className="focus-card-link" aria-label={`${title} program`}>
    <div className="focus-card-media">
      <img src={image} alt="" loading="lazy" />
      <span className="focus-card-number">{number}</span>
    </div>
    <div className="focus-card-content">
      <div className="focus-card-icon" style={{ background: `${color}15`, color }}>
        <Icon />
      </div>
      <h3>{title}</h3>
      <p>{summary}</p>
      <div className="focus-card-meta">
        <span>{projectCount} projects</span>
        <ChevronRight aria-hidden="true" />
      </div>
    </div>
  </Link>
</article>
```

**Visual States:**
- Default: `bg-card`, `border border-border-light`, `rounded-xl`, `overflow-hidden`
- Hover: `shadow-lg`, `border-transparent`, image `scale(1.03)`
- Focus-visible: `outline-none`, `ring-3 ring-primary-light`

### 4.4 Grid Layout

| Breakpoint | Columns |
|------------|---------|
| `< 768px` | 1 |
| `768-1024px` | 2 |
| `> 1024px` | 3 (or 5 with horizontal scroll) |

**Option B (Desktop): Single row, 5 cards, horizontal scroll with scroll-snap**

---

## 5. Projects Preview (`ProjectsPreview`)

### 5.1 Section Spec

```tsx
<section className="projects-preview" aria-labelledby="projects-title">
  <div className="section-header projects-header">
    <div>
      <h2 id="projects-title">Projects that make a difference</h2>
      <p>Explore our latest verified projects across all program areas</p>
    </div>
    <Link href="/projects" className="btn btn-outline">
      View All Projects
      <ChevronRight aria-hidden="true" />
    </Link>
  </div>
  <div className="projects-grid">
    {featuredProjects.map((project, i) => (
      <ProjectCard key={project.id} project={project} index={i + 1} />
    ))}
  </div>
</section>
```

### 5.2 Project Card (`ProjectCard`)

```tsx
<article className="project-card">
  <Link href={`/projects/${project.slug}`} className="project-card-image" aria-label={`${project.title} - ${project.program?.name || project.status}`}>
    <img src={project.banner_url} alt="" loading="lazy" />
    <span className="project-index">0{index}</span>
    <span className="project-category">{project.program?.name || project.status}</span>
  </Link>
  <div className="project-content">
    <h3>
      <a href={`/projects/${project.slug}`}>{project.title}</a>
    </h3>
    <p>{project.summary || 'Project details will be published after verification.'}</p>
    <a href={`/projects/${project.slug}`} className="project-link">
      Discover project <ChevronRight aria-hidden="true" />
    </a>
  </div>
</article>
```

### 5.3 States

| State | Display |
|-------|---------|
| **Loading** | 3 skeleton cards (shimmer) |
| **Error** | Empty state: "Projects temporarily unavailable" + retry button |
| **Empty** | Empty state: "Projects will appear as verified content becomes available" |
| **Data** | Up to 3 cards |

---

## 6. CTA Section (`CTASection`)

### 6.1 Design

```tsx
<section className="cta-section" aria-labelledby="cta-title">
  <div className="cta-inner">
    <div className="cta-content">
      <h2 id="cta-title">Be part of positive change</h2>
      <p>Your support helps us reach more communities, protect more children, and build more resilient futures.</p>
    </div>
    <div className="cta-actions">
      <Link href="/get-involved" className="btn btn-donation btn-lg">
        Support Our Work
        <Heart aria-hidden="true" />
      </Link>
      <Link href="/contact" className="btn btn-outline btn-lg">
        Talk to Our Team
        <MessageSquare aria-hidden="true" />
      </Link>
    </div>
  </div>
</section>
```

### 6.2 Visual

- Background: `var(--color-forest-50)` with subtle pattern
- Border top: `border-border-medium`
- Padding: `var(--space-20)` vertical
- Donation button uses `--color-accent` (gold) variant

---

## 7. Partner Marquee (`PartnerMarquee`)

### 7.1 Specifications

```tsx
<section className="partner-marquee" aria-labelledby="partners-title">
  <h2 id="partners-title" className="sr-only">Our Partners</h2>
  <div className="marquee-track" aria-live="off">
    {partners.map((partner, i) => (
      <img
        key={`${partner.name}-${i}`}
        src={partner.logo}
        alt=""  // Decorative, names in aria-label on track
        loading="lazy"
        width={120}
        height={60}
      />
    ))}
    {/* Duplicated for seamless loop */}
    {partners.map((partner, i) => (
      <img key={`${partner.name}-${i}-dup`} ... />
    ))}
  </div>
</section>
```

### 7.2 Animation

- Continuous horizontal scroll: 20-30s linear loop
- Pause on hover, focus, `prefers-reduced-motion`
- Minimum 10 unique logos (duplicated = 20+ for seamless loop)
- Logos: SVG preferred, monochrome (filter: grayscale(1) opacity(0.6))
- Hover: `filter: grayscale(0) opacity(1)`

### 7.3 Accessibility

- `aria-label="Our partners and supporters"`
- `prefers-reduced-motion`: Static grid layout instead of marquee

---

## 8. Responsive Breakpoints Summary

| Section | Mobile (<640) | Tablet (640-1024) | Desktop (>1024) |
|---------|---------------|-------------------|-----------------|
| Hero | Full height, stacked CTAs | Full height, side-by-side CTAs | Full height, side-by-side CTAs |
| Impact Stats | 2 cols | 3 cols | 5 cols |
| Focus Areas | 1 col, stacked | 2 cols | 3 cols (or 5 with scroll) |
| Projects | 1 col | 2 cols | 3 cols |
| CTA | Stacked buttons | Side-by-side | Side-by-side |
| Marquee | Slower scroll | Normal | Normal |

---

## 9. SEO & Structured Data

```json
{
  "@context": "https://schema.org",
  "@type": "NonprofitOrganization",
  "name": "Relief Nepal",
  "url": "https://reliefnepal.org.np",
  "logo": "https://reliefnepal.org.np/images/logo.jpg",
  "description": "Building self-reliant, equitable communities across Nepal through community-led development in protection, health, education, disaster resilience, WASH, and livelihoods.",
  "foundingDate": "2008",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Kamalamai Municipality-6",
    "addressLocality": "Sindhuli",
    "addressRegion": "Bagmati Province",
    "postalCode": "",
    "addressCountry": "NP"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+977-047-520915",
    "contactType": "customer service",
    "email": "info@reliefnepal.org.np"
  },
  "sameAs": [
    "https://facebook.com/reliefnepal",
    "https://twitter.com/reliefnepal",
    "https://linkedin.com/company/relief-nepal",
    "https://youtube.com/@reliefnepal"
  ]
}
```

---

## 10. Performance Targets (Homepage)

| Metric | Target |
|--------|--------|
| **LCP** | ≤ 2.0s (hero image preloaded, WebP/AVIF) |
| **CLS** | ≤ 0.05 (reserved space for hero, stats, grid) |
| **INP** | ≤ 100ms (minimal JS on load, defer non-critical) |
| **Hero Image** | Priority load, `fetchpriority="high"`, preload hint |
| **Stat Images** | Lazy load, WebP, responsive sizes |
| **Partner Logos** | SVG sprites or optimized WebP, lazy |

---

*Override created: 2026-11-08 | Based on MASTER.md v1.0*