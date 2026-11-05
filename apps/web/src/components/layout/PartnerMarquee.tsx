'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { apiRequest } from '../../lib/api/client.js';

interface Partner {
  id: string;
  name: string;
  logo_url: string | null;
  logo_public_id: string | null;
  slug: string;
  relationship_type: string;
  publication_status: string;
  display_order: number;
}

export default function PartnerMarquee() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    let active = true;
    apiRequest('/networks')
      .then((data) => {
        if (active) {
          // Filter only published partners with logos
          const partnersWithLogos = (data as Partner[])
            .filter(
              (p) =>
                p.publication_status === 'published' &&
                (p.logo_url || p.logo_public_id)
            )
            .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
          setPartners(partnersWithLogos);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  // Pause on hover
  const handleMouseEnter = () => setPaused(true);
  const handleMouseLeave = () => setPaused(false);

  // Scroll animation using CSS animation (more performant)
  useEffect(() => {
    if (loading || partners.length === 0) return;

    const track = trackRef.current;
    if (!track) return;

    // We'll use CSS animation instead of JS animation for better performance
    // The animation is defined in the style tag below
  }, [loading, partners.length]);

  if (loading || partners.length === 0) {
    return (
      <section className="py-8 bg-forest-50" aria-label="Our partners">
        <div className="rn-container">
          <p className="text-center text-sm text-slate-500" role="status">
            Loading partners…
          </p>
        </div>
      </section>
    );
  }

  // Duplicate partners for seamless infinite scroll
  const duplicatedPartners = [...partners, ...partners];

  return (
    <section
      className="py-8 bg-forest-50"
      aria-label="Our partners"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="rn-container">
        <div className="mb-6 text-center">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-forest-600">
            Our Partners & Networks
          </p>
          <h2 className="mt-2 text-3xl font-bold text-forest-900">
            Collaborating for greater impact
          </h2>
        </div>

        <div
          className="relative overflow-hidden"
          role="region"
          aria-label="Partner logos carousel"
        >
          <div
            ref={trackRef}
            className="flex items-center gap-8"
            style={{
              animation: paused ? 'none' : 'marquee 30s linear infinite',
              width: 'max-content',
            }}
            aria-live="off"
          >
            {duplicatedPartners.map((partner, index) => (
              <div
                key={`${partner.id}-${index}`}
                className="flex-shrink-0 w-40 h-20 sm:w-48 sm:h-24"
                title={partner.name}
              >
                <a
                  href={`/network/${encodeURIComponent(partner.slug)}`}
                  className="flex h-full items-center justify-center rounded-lg bg-white p-4 shadow-sm transition hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-forest-500"
                  aria-label={`View ${partner.name} profile`}
                >
                  {partner.logo_url ? (
                    <Image
                      src={partner.logo_url}
                      alt={`${partner.name} logo`}
                      width={160}
                      height={80}
                      className="max-h-full max-w-full object-contain"
                      unoptimized
                    />
                  ) : (
                    <div
                      className="flex h-full w-full items-center justify-center text-center text-xs font-medium text-forest-700"
                      aria-label={`${partner.name} - logo not available`}
                    >
                      {partner.name}
                    </div>
                  )}
                </a>
              </div>
            ))}
          </div>

          {/* Gradient overlays on sides */}
          <div
            className="absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-forest-50 to-transparent pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-forest-50 to-transparent pointer-events-none"
            aria-hidden="true"
          />
        </div>

        <p className="mt-4 text-center text-xs text-slate-500">
          Hover to pause • {partners.length} partner{partners.length !== 1 ? 's' : ''}
        </p>

        <style jsx>{`
          @keyframes marquee {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
        `}</style>
      </div>
    </section>
  );
}