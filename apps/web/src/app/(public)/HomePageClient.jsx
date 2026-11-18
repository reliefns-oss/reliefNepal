'use client';

import { useState, useEffect } from 'react';
import { apiRequest } from '../../lib/api/client.js';
import GovernmentActionSection from '../../components/home/GovernmentActionSection.jsx';
import {
  BookOpen,
  Briefcase,
  CloudSun,
  HeartHandshake,
  HeartPulse,
  LifeBuoy,
  Megaphone,
  ShieldCheck,
  UsersRound,
  ChevronRight,
} from 'lucide-react';

const planSectors = [
  { title: 'Child Protection', icon: ShieldCheck, href: '/programs' },
  { title: 'Education', icon: BookOpen, href: '/programs' },
  { title: 'Employment and Income', icon: Briefcase, href: '/programs' },
  { title: 'Health and Nutrition', icon: HeartPulse, href: '/programs' },
  {
    title: 'Humanitarian Actions and Disaster Preparedness',
    icon: LifeBuoy,
    href: '/projects',
  },
];

const crossCuttingTopics = [
  { title: 'CCA', icon: CloudSun },
  { title: 'Advocacy', icon: Megaphone },
  { title: 'GEDSI', icon: UsersRound },
];

export default function HomePageClient() {
  const [stories, setStories] = useState([]);
  const [storiesState, setStoriesState] = useState('loading');

  useEffect(() => {
    let active = true;
    apiRequest('/notices')
      .then((data) => {
        if (!active) return;
        setStories(
          Array.isArray(data)
            ? data.filter((story) => story?.title && story?.slug)
            : [],
        );
        setStoriesState('ready');
      })
      .catch(() => {
        if (active) setStoriesState('error');
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      {/* Welcome section */}
      <section
        className="rn-welcome rn-section"
        aria-labelledby="welcome-heading"
      >
        <div className="rn-container rn-welcome-grid">
          <div className="rn-welcome-copy">
            <h2 id="welcome-heading">
              Together, we can build a more <span>equitable Nepal.</span>
            </h2>

            <p>
              Relief Nepal, established in 2008 and headquartered in Sindhuli,
              is a non-profit organization dedicated to improving the well-being
              of underserved children, families, and communities. Operating
              across the Bagmati, Madhesh, and Karnali provinces, the
              organization successfully implemented diverse humanitarian and
              development projects between 2021 and 2025, directly benefiting
              more than 15,000 people annually.
            </p>

            <p>
              Moving forward, the organizational strategic plan for 2026–2030
              focuses on five sectors: Child Protection, Education, Employment
              and Income, Health and Nutrition, and Humanitarian Actions and
              Disaster Preparedness. CCA, Advocacy, and GEDSI are integrated
              across these sectors, aligning future programs with local,
              provincial, and federal priorities and Nepal&apos;s SDG targets.
            </p>
          </div>
        </div>
      </section>

      {/* Strategic plan */}
      <section className="rn-focus rn-section" aria-labelledby="plan-heading">
        <div className="rn-container">
          <div className="rn-section-heading">
            <div>
              <h2 id="plan-heading">Our Plan for 2026–2030</h2>
            </div>
          </div>

          <div className="rn-plan-grid">
            {planSectors.map(({ title, icon: Icon, href }, index) => (
              <a href={href} className="rn-plan-card" key={title}>
                <div className="rn-plan-card-top">
                  <span className="rn-plan-icon">
                    <Icon size={27} strokeWidth={1.8} aria-hidden="true" />
                  </span>
                  <span className="rn-plan-number">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3>{title}</h3>
              </a>
            ))}
          </div>

          <div className="rn-crosscutting">
            <h3>Cross-cutting</h3>
            <ul>
              {crossCuttingTopics.map(({ title, icon: Icon }) => (
                <li key={title}>
                  <Icon
                    className="rn-crosscutting-icon"
                    size={18}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  {title}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Impact stories */}
      <section
        className="rn-projects rn-section"
        aria-labelledby="stories-heading"
      >
        <div className="rn-container">
          <div className="rn-section-heading rn-projects-heading">
            <div>
              <h2 id="stories-heading">Impact Stories</h2>
            </div>

            <a className="rn-text-link" href="/stories">
              View all stories{' '}
              <ChevronRight className="rn-text-link-arrow" aria-hidden="true" />
            </a>
          </div>

          <div className="rn-project-grid">
            {stories.slice(0, 3).map((story, index) => (
              <article
                className="rn-project-card"
                key={story.id || story.slug}
              >
                {story.image_url && (
                  <a
                    className="rn-project-image"
                    href={`/notice/${encodeURIComponent(story.slug)}`}
                  >
                    <img src={story.image_url} alt="" loading="lazy" />
                    <span className="rn-project-index">0{index + 1}</span>
                  </a>
                )}

                <div className="rn-project-content">
                  <span className="rn-project-category">Community story</span>

                  <h3>
                    <a href={`/notice/${encodeURIComponent(story.slug)}`}>
                      {story.title}
                    </a>
                  </h3>

                  <p>
                    {story.summary ||
                      'Read how community-led work is supporting positive change.'}
                  </p>

                  <a
                    className="rn-text-link"
                    href={`/notice/${encodeURIComponent(story.slug)}`}
                  >
                    Read story{' '}
                    <ChevronRight
                      className="rn-text-link-arrow"
                      aria-hidden="true"
                    />
                  </a>
                </div>
              </article>
            ))}
            {storiesState === 'loading' && (
              <p className="rn-project-empty" role="status">
                Loading published stories…
              </p>
            )}
            {storiesState === 'error' && (
              <p className="rn-project-empty" role="status">
                Published stories are temporarily unavailable. Please
                check back soon.
              </p>
            )}
            {storiesState === 'ready' && stories.length === 0 && (
              <p className="rn-project-empty">
                Published stories will appear here as verified content becomes
                available.
              </p>
            )}
          </div>
        </div>
      </section>

      <GovernmentActionSection />

      {/* Call to action */}
      <section className="rn-cta" aria-labelledby="cta-heading">
        <div className="rn-container rn-cta-inner">
          <div className="rn-cta-copy">
            <h2 id="cta-heading">Be part of positive change.</h2>
          </div>

          <div className="rn-cta-actions">
            <a className="rn-button rn-button-primary" href="/get-involved">
              Get Involved{' '}
              <ChevronRight className="rn-button-arrow" aria-hidden="true" />
            </a>

            <a className="rn-cta-contact" href="/contact">
              Talk to our team{' '}
              <ChevronRight className="rn-button-arrow" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
