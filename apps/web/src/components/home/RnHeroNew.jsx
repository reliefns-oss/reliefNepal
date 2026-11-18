'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import NepaliDate from 'nepali-date-converter';
import ForexSection from './ForexSection.jsx';
import { NEPALI_HOLIDAYS } from './nepali-holidays.js';
import './rn-hero-new.css';

const AUTOPLAY_MS = 6500;

const NEPALI_MONTHS = [
  'बैशाख', 'जेठ', 'असार', 'साउन', 'भदौ', 'असोज',
  'कार्तिक', 'मंसिर', 'पुष', 'माघ', 'फागुन', 'चैत',
];

const NEPALI_DAYS = ['आइत', 'सोम', 'मङ्गल', 'बुध', 'बिही', 'शुक्र', 'शनि'];
const NEPALI_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
const toNepaliDigits = (value) =>
  String(value).replace(/\d/g, (digit) => NEPALI_DIGITS[Number(digit)]);

function getNepalToday() {
  const dateParts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kathmandu',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .formatToParts(new Date())
    .reduce((parts, part) => ({ ...parts, [part.type]: part.value }), {});
  const localDate = new Date(
    Number(dateParts.year),
    Number(dateParts.month) - 1,
    Number(dateParts.day),
    12,
  );
  return new NepaliDate(localDate);
}

export default function RnHeroNew({
  images = ['/images/Picture7.png'],
  initialCalendarDate,
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

  // autoplay
  useEffect(() => {
    if (paused || reduced || total < 2) return;
    const t = setTimeout(() => go(active + 1), AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [active, paused, reduced, total, go]);

  // Calendar state
  const [calendarDate, setCalendarDate] = useState(() => {
    if (!initialCalendarDate) return getNepalToday();
    const [year, month, day] = initialCalendarDate.split('-').map(Number);
    return new NepaliDate(new Date(year, month - 1, day, 12));
  });
  const [today, setToday] = useState(calendarDate);
  const [selectedHoliday, setSelectedHoliday] = useState(null);

  useEffect(() => {
    const currentDate = getNepalToday();
    setCalendarDate(currentDate);
    setToday(currentDate);
  }, []);

  const currentMonth = calendarDate.getMonth();
  const currentYear = calendarDate.getYear();
  const firstDay = new NepaliDate(currentYear, currentMonth, 1).getDay();
  const monthEnd = new NepaliDate(currentYear, currentMonth, 1);
  monthEnd.setMonth(currentMonth + 1);
  monthEnd.setDate(0);
  const daysInMonth = monthEnd.getDate();
  const isCurrentMonth =
    today.getYear() === currentYear && today.getMonth() === currentMonth;

  const pad = (n) => String(n).padStart(2, '0');
  const changeCalendarMonth = (offset) => {
    const nextMonth = new NepaliDate(currentYear, currentMonth, 1);
    nextMonth.setMonth(currentMonth + offset);
    setCalendarDate(nextMonth);
    setSelectedHoliday(null);
  };
  const holidaysByDate = new Map(
    NEPALI_HOLIDAYS
      .filter((holiday) => holiday.year === currentYear && holiday.month === currentMonth + 1)
      .map((holiday) => [holiday.day, holiday]),
  );

  return (
    <section
      ref={heroRef}
      className="rn-home-hero-new"
      style={{ '--rn-autoplay': `${AUTOPLAY_MS}ms` }}
      aria-roledescription="carousel"
      aria-label="Relief Nepal highlights"
      tabIndex={total > 1 ? 0 : undefined}
    >
      {/* Slides - 80% width */}
      <div className="rn-home-hero-new-slides" aria-live="off">
        {slides.map((s, i) => (
          <div
            key={`${s.src}-${i}`}
            className={`rn-home-hero-new-slide ${i === active ? 'active' : ''}`}
            style={{ backgroundImage: `url(${JSON.stringify(s.src)})` }}
            role="group"
            aria-roledescription="slide"
            aria-label={`Slide ${i + 1} of ${total}`}
            aria-hidden={i !== active}
          />
        ))}
      </div>

      {/* Bottom fade overlay */}
      <div className="rn-home-hero-new-bottom-fade" aria-hidden="true" />

      {/* Right sidebar - Calendar & Forex (20%) */}
      <aside className="rn-home-hero-new-sidebar" aria-label="नेपाली पात्रो र विनिमय दर">
        {/* Calendar */}
        <div className="rn-hero-calendar">
          <div className="rn-hero-calendar-header">
            <button
              className="rn-hero-calendar-nav"
              onClick={() => changeCalendarMonth(-1)}
              aria-label="अघिल्लो महिना"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="rn-hero-calendar-title">
              <span className="rn-hero-calendar-month-nepali">{NEPALI_MONTHS[currentMonth]}</span>
              <span className="rn-hero-calendar-year">{toNepaliDigits(currentYear)}</span>
            </div>
            <button
              className="rn-hero-calendar-nav"
              onClick={() => changeCalendarMonth(1)}
              aria-label="अर्को महिना"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="rn-hero-calendar-weekdays">
            {NEPALI_DAYS.map((day, i) => (
              <span key={day} className={i === 0 || i === 6 ? 'weekend' : ''} title={`${day}बार`}>
                {day}
              </span>
            ))}
          </div>

          <div className="rn-hero-calendar-days">
            {Array.from({ length: firstDay }).map((_, i) => (
              <span key={`empty-${i}`} className="rn-hero-calendar-day empty" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const isToday = isCurrentMonth && dayNum === today.getDate();
              const isWeekend = [0, 6].includes((firstDay + i) % 7);
              const holiday = holidaysByDate.get(dayNum);
              const holidayLabel = [
                holiday?.name,
                isWeekend ? 'साप्ताहिक बिदा' : null,
              ].filter(Boolean).join(', ');
              return (
                <button
                  type="button"
                  key={dayNum}
                  className={`rn-hero-calendar-day ${isToday ? 'today' : ''} ${isWeekend ? 'weekend' : ''} ${holiday ? 'holiday' : ''} ${selectedHoliday?.day === dayNum ? 'selected-holiday' : ''}`}
                  aria-label={`${NEPALI_MONTHS[currentMonth]} ${toNepaliDigits(dayNum)}${holidayLabel ? `, ${holidayLabel}` : ''}`}
                  aria-pressed={selectedHoliday?.day === dayNum}
                  title={holidayLabel || undefined}
                  onClick={() => setSelectedHoliday(
                    holiday || isWeekend
                      ? { day: dayNum, festival: holiday, isWeekend }
                      : null,
                  )}
                >
                  {toNepaliDigits(dayNum)}
                  {(holiday || isWeekend) && <span className="rn-hero-calendar-holiday-dot" aria-hidden="true" />}
                </button>
              );
            })}
          </div>
          {selectedHoliday && (
            <div className="rn-hero-calendar-holiday-detail" aria-live="polite">
              <strong>{selectedHoliday.festival?.name || 'साप्ताहिक बिदा'}</strong>
              <span>
                {[
                  selectedHoliday.festival?.scope,
                  selectedHoliday.isWeekend ? 'शनिबार / आइतबार' : null,
                ].filter(Boolean).join(' · ')}
              </span>
            </div>
          )}
        </div>

        {/* Forex Section */}
        <ForexSection
          compact
          currencies={['USD', 'CAD', 'SGD', 'INR', 'EUR']}
        />
      </aside>

      {/* Bottom control bar */}
      {total > 1 && (
        <div className="rn-home-hero-new-controls">
          <div className="rn-home-hero-new-caption" key={active}>
            <span className="rn-home-hero-new-count">
              {pad(active + 1)}
              <i>/ {pad(total)}</i>
            </span>
            {slides[active].caption && <span>{slides[active].caption}</span>}
          </div>

          <div className="rn-home-hero-new-bars" role="group" aria-label="Choose slide">
            {slides.map((s, i) => (
              <button
                key={`${s.src}-${i}`}
                type="button"
                aria-pressed={i === active}
                aria-label={`Go to slide ${i + 1}`}
                className={`rn-home-hero-new-bar ${i === active ? 'active' : ''} ${i < active ? 'done' : ''} ${paused ? 'paused' : ''}`}
                onClick={() => go(i)}
              >
                <b />
              </button>
            ))}
          </div>

          <div className="rn-home-hero-new-arrows">
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => go(active - 1)}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => go(active + 1)}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}