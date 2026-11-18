'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import './rn-hero.css';

const AUTOPLAY_MS = 6500;

/**
 * images: array of strings, or objects { src, caption }
 * Example: <RnHero images={["/images/a.jpg", { src: "/images/b.jpg", caption: "Clean water, Dhading" }]} />
 */
export default function RnHero({
  images = ['/images/Picture7.png'],
  eyebrow,
  title,
  text,
}) {
  const configuredImages =
    Array.isArray(images) && images.length ? images : ['/images/Picture7.png'];
  const slides = configuredImages
    .map((image) => (typeof image === 'string' ? { src: image } : image))
    .filter((slide) => typeof slide?.src === 'string' && slide.src.length > 0);
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const heroRef = useRef(null);
  const touchX = useRef(null);
  const total = slides.length;
  const paused = hovered || focused;

  const go = useCallback(
    (index) => {
      if (!total) return;
      setActive((index + total) % total);
    },
    [total],
  );

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        go(active + 1);
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        go(active - 1);
      }
    };
    const handleTouchStart = (event) => {
      touchX.current = event.touches[0]?.clientX ?? null;
    };
    const handleTouchEnd = (event) => {
      if (touchX.current == null) return;
      const endX = event.changedTouches[0]?.clientX;
      if (endX != null && Math.abs(endX - touchX.current) > 50)
        go(active + (endX < touchX.current ? 1 : -1));
      touchX.current = null;
    };
    const handleFocusOut = (event) => {
      if (!hero.contains(event.relatedTarget)) setFocused(false);
    };
    const handleMouseEnter = () => setHovered(true);
    const handleMouseLeave = () => setHovered(false);
    const handleFocusIn = () => setFocused(true);
    const handleTouchCancel = () => {
      touchX.current = null;
    };

    hero.addEventListener('keydown', handleKeyDown);
    hero.addEventListener('mouseenter', handleMouseEnter);
    hero.addEventListener('mouseleave', handleMouseLeave);
    hero.addEventListener('focusin', handleFocusIn);
    hero.addEventListener('focusout', handleFocusOut);
    hero.addEventListener('touchstart', handleTouchStart, { passive: true });
    hero.addEventListener('touchend', handleTouchEnd, { passive: true });
    hero.addEventListener('touchcancel', handleTouchCancel, { passive: true });

    return () => {
      hero.removeEventListener('keydown', handleKeyDown);
      hero.removeEventListener('mouseenter', handleMouseEnter);
      hero.removeEventListener('mouseleave', handleMouseLeave);
      hero.removeEventListener('focusin', handleFocusIn);
      hero.removeEventListener('focusout', handleFocusOut);
      hero.removeEventListener('touchstart', handleTouchStart);
      hero.removeEventListener('touchend', handleTouchEnd);
      hero.removeEventListener('touchcancel', handleTouchCancel);
    };
  }, [active, go]);

  // autoplay (restarts whenever the slide changes, so the progress bar stays in sync)
  useEffect(() => {
    if (paused || reduced || total < 2) return;
    const t = setTimeout(() => go(active + 1), AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [active, paused, reduced, total, go]);

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <section
      ref={heroRef}
      className="rn-home-hero"
      style={{ '--rn-autoplay': `${AUTOPLAY_MS}ms` }}
      aria-roledescription="carousel"
      aria-label="Relief Nepal highlights"
      tabIndex={total > 1 ? 0 : undefined}
    >
      {/* Slides */}
      <div className="rn-home-hero-slides" aria-live="off">
        {slides.map((s, i) => (
          <div
            key={`${s.src}-${i}`}
            className={`rn-home-hero-slide ${i === active ? 'active' : ''}`}
            style={{ backgroundImage: `url(${JSON.stringify(s.src)})` }}
            role="group"
            aria-roledescription="slide"
            aria-label={`Slide ${i + 1} of ${total}`}
            aria-hidden={i !== active}
          />
        ))}
      </div>

      {/* Bottom fade overlay for control bar visibility */}
      <div className="rn-home-hero-bottom-fade" aria-hidden="true" />

      {/* Content - no text, no buttons */}
      <div className="rn-container rn-home-hero-content" />

      {/* Bottom control bar */}
      {total > 1 && (
        <div className="rn-home-hero-controls rn-container">
          <div className="rn-home-hero-caption" key={active}>
            <span className="rn-home-hero-count">
              {pad(active + 1)}
              <i>/ {pad(total)}</i>
            </span>
            {slides[active].caption && <span>{slides[active].caption}</span>}
          </div>

          <div
            className="rn-home-hero-bars"
            role="group"
            aria-label="Choose slide"
          >
            {slides.map((s, i) => (
              <button
                key={`${s.src}-${i}`}
                type="button"
                aria-pressed={i === active}
                aria-label={`Go to slide ${i + 1}`}
                className={`rn-home-hero-bar ${i === active ? 'active' : ''} ${i < active ? 'done' : ''} ${
                  paused ? 'paused' : ''
                }`}
                onClick={() => go(i)}
              >
                <b />
              </button>
            ))}
          </div>

          <div className="rn-home-hero-arrows">
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => go(active - 1)}
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                aria-hidden="true"
              >
                <path
                  d="M15 6l-6 6 6 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => go(active + 1)}
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                aria-hidden="true"
              >
                <path
                  d="M9 6l6 6-6 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}