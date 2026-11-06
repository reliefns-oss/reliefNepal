'use client';

import { useState, useEffect } from 'react';
import { apiRequest } from '../../lib/api/client.js';
import { ChevronRight } from 'lucide-react';

const focusAreas = [
  {
    number: '01',
    icon: '♡',
    title: 'Protection',
    description:
      'Promoting the rights, safety and dignity of children, women and marginalized communities.',
  },
  {
    number: '02',
    icon: '✚',
    title: 'Health & Education',
    description:
      'Supporting healthier communities and more inclusive opportunities to learn.',
  },
  {
    number: '03',
    icon: '↗',
    title: 'Disaster & Climate',
    description:
      'Strengthening preparedness, community resilience and humanitarian response.',
  },
  {
    number: '04',
    icon: '♧',
    title: 'WASH',
    description:
      'Promoting access to safe water, sanitation and healthy hygiene practices.',
  },
  {
    number: '05',
    icon: '⌂',
    title: 'Livelihoods',
    description:
      'Helping people build self-reliance through skills, opportunities and community action.',
  },
];


export default function HomePageClient() {
  const [projects, setProjects] = useState([]);
  const [projectState, setProjectState] = useState('loading');

  useEffect(() => {
    let active = true;
    apiRequest('/projects')
      .then((data) => {
        if (!active) return;
        setProjects(Array.isArray(data) ? data : []);
        setProjectState('ready');
      })
      .catch(() => {
        if (active) setProjectState('error');
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      {/* Welcome section */}
      <section className="rn-welcome rn-section" aria-labelledby="welcome-heading">
        <div className="rn-container rn-welcome-grid">
          <div className="rn-welcome-copy">
            <h2 id="welcome-heading">
              Together, we can build a more <span>equitable Nepal.</span>
            </h2>

            <p>
              Relief Nepal, established in 2008 and headquartered in Sindhuli,
              is a non-profit organization dedicated to improving the well-being
              of underserved children, families, and communities. Operating
              across the Bagmati, Madhesh, and Koshi provinces, the organization
              successfully implemented diverse humanitarian and development
              projects between 2021 and 2025, directly benefiting more than
              15,000 people annually.
            </p>

            <p>
              Moving forward, the organizational strategic plan for 2026–2030
              centers on five core sectors: Child Protection, Education,
              Employment and Income, Health and Nutrition, and Resilient
              Humanitarian Actions and Disaster Preparedness. To ensure
              long-term sustainability, Relief Nepal integrates three
              cross-cutting areas into these sectors, aligning its future
              programs with local, provincial, and federal government priorities
              to actively contribute to Nepal&apos;s SDG targets.
            </p>
          </div>
        </div>
      </section>

      {/* Focus areas */}
      <section className="rn-focus rn-section" aria-labelledby="focus-heading">
        <div className="rn-container">
          <div className="rn-section-heading">
            <div>
              <h2 id="focus-heading">Creating change where it matters.</h2>
            </div>
          </div>

          <div className="rn-focus-grid">
            {focusAreas.map((area) => (
              <article className="rn-focus-card" key={area.number}>
                <div className="rn-focus-card-top">
                  <span className="rn-focus-icon" aria-hidden="true">
                    {area.icon}
                  </span>
                  <span className="rn-focus-number">{area.number}</span>
                </div>

                <h3>{area.title}</h3>
                <p>{area.description}</p>

                <a href="/projects" aria-label={`Explore ${area.title}`} className="rn-focus-link">
                  <ChevronRight className="rn-focus-arrow" aria-hidden="true" />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="rn-projects rn-section" aria-labelledby="projects-heading">
        <div className="rn-container">
          <div className="rn-section-heading rn-projects-heading">
            <div>
              <h2 id="projects-heading">Projects that make a difference.</h2>
            </div>

            <a className="rn-text-link" href="/projects">
              View all projects <ChevronRight className="rn-text-link-arrow" aria-hidden="true" />
            </a>
          </div>

          <div className="rn-project-grid">
            {projects.slice(0, 3).map((project, index) => (
              <article
                className="rn-project-card"
                key={project.id || project.slug}
              >
                {project.banner_url && (
                  <a
                    className="rn-project-image"
                    href={`/projects/${project.slug}`}
                  >
                    <img src={project.banner_url} alt="" loading="lazy" />
                    <span className="rn-project-index">0{index + 1}</span>
                  </a>
                )}

                <div className="rn-project-content">
                  <span className="rn-project-category">
                    {project.program?.name || project.status}
                  </span>

                  <h3>
                    <a href={`/projects/${project.slug}`}>{project.title}</a>
                  </h3>

                  <p>
                    {project.summary ||
                      'Project information will be added as verified details are published.'}
                  </p>

                  <a
                    className="rn-text-link"
                    href={`/projects/${project.slug}`}
                  >
                    Discover project <ChevronRight className="rn-text-link-arrow" aria-hidden="true" />
                  </a>
                </div>
              </article>
            ))}
            {projectState === 'loading' && (
              <p className="rn-project-empty" role="status">
                Loading published projects…
              </p>
            )}
            {projectState === 'error' && (
              <p className="rn-project-empty" role="status">
                Published project information is temporarily unavailable. Please
                check back soon.
              </p>
            )}
            {projectState === 'ready' && projects.length === 0 && (
              <p className="rn-project-empty">
                Published projects will appear here as verified content becomes
                available.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="rn-cta" aria-labelledby="cta-heading">
        <div className="rn-container rn-cta-inner">
          <div className="rn-cta-copy">
            <h2 id="cta-heading">Be part of positive change.</h2>
          </div>

          <div className="rn-cta-actions">
            <a className="rn-button rn-button-primary" href="/get-involved">
              Get Involved <ChevronRight className="rn-button-arrow" aria-hidden="true" />
            </a>

            <a className="rn-cta-contact" href="/contact">
              Talk to our team <ChevronRight className="rn-button-arrow" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}