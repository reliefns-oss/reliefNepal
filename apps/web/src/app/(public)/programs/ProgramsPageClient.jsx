'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { apiRequest } from '@/lib/api/client';
import styles from './programs.module.css';

const programOrder = [
  'protection',
  'health-education',
  'disaster-climate',
  'wash',
  'livelihoods',
];

function getSectionId(program) {
  return program.slug || `program-${program.id}`;
}

function formatStatus(value) {
  if (!value) return 'Published';
  return value
    .replaceAll('-', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getProjectPeriod(project) {
  if (project.period) return project.period;
  return (
    [project.starts_on, project.ends_on].filter(Boolean).join(' – ') || null
  );
}

export default function ProgramsPageClient() {
  const [programs, setPrograms] = useState([]);
  const [projects, setProjects] = useState([]);
  const [state, setState] = useState('loading');
  const [retryCount, setRetryCount] = useState(0);
  const [activeSection, setActiveSection] = useState('overview');
  const [copyFeedback, setCopyFeedback] = useState('Copy page');

  useEffect(() => {
    let active = true;

    async function fetchData() {
      setState('loading');
      try {
        const [programsData, projectsData] = await Promise.all([
          apiRequest('/programs'),
          apiRequest('/projects'),
        ]);
        if (!active) return;
        setPrograms(Array.isArray(programsData) ? programsData : []);
        setProjects(Array.isArray(projectsData) ? projectsData : []);
        setState('ready');
      } catch {
        if (active) setState('error');
      }
    }

    fetchData();
    return () => {
      active = false;
    };
  }, [retryCount]);

  const sortedPrograms = useMemo(
    () =>
      [...programs].sort((a, b) => {
        const indexA = programOrder.indexOf(a.slug);
        const indexB = programOrder.indexOf(b.slug);
        return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
      }),
    [programs],
  );

  const programSections = useMemo(
    () =>
      sortedPrograms.map((program, index) => ({
        program,
        id: getSectionId(program),
        number: String(index + 1).padStart(2, '0'),
        projects: projects.filter(
          (project) =>
            (project.program_id && project.program_id === program.id) ||
            (project.program?.slug && project.program?.slug === program.slug),
        ),
      })),
    [projects, sortedPrograms],
  );

  useEffect(() => {
    if (!programSections.length) {
      setActiveSection('overview');
      return undefined;
    }

    let frame;
    const updateActiveSection = () => {
      const marker = window.scrollY + 170;
      let current = 'overview';

      for (const section of programSections) {
        const element = document.getElementById(section.id);
        if (
          element &&
          element.getBoundingClientRect().top + window.scrollY <= marker
        ) {
          current = section.id;
        }
      }
      setActiveSection(current);
    };

    const handleScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = undefined;
        updateActiveSection();
      });
    };

    updateActiveSection();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [programSections]);

  async function copyPage() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopyFeedback('Copied');
      window.setTimeout(() => setCopyFeedback('Copy page'), 1800);
    } catch {
      setCopyFeedback('Copy unavailable');
      window.setTimeout(() => setCopyFeedback('Copy page'), 1800);
    }
  }

  if (state === 'loading') {
    return (
      <main className={styles.page}>
        <div className={styles.loading} role="status">
          <div className={styles.loadingSpinner} aria-hidden="true" />
          <p>Loading program areas…</p>
        </div>
      </main>
    );
  }

  if (state === 'error') {
    return (
      <main className={styles.page}>
        <div className={styles.messagePanel} role="alert">
          <p className={styles.eyebrow}>Programs</p>
          <h1>Program information is unavailable</h1>
          <p>
            We could not load the published program areas right now. Please try
            again in a moment.
          </p>
          <button
            type="button"
            onClick={() => setRetryCount((count) => count + 1)}
            className={styles.retryButton}
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.docsHeader}>
          <div>
            <p className={styles.eyebrow}>Relief Nepal · Programs</p>
            <h1>Programs shaped with communities</h1>
            <p className={styles.headerLead}>
              Our program areas bring together the partnerships, knowledge, and
              projects that support community-led change across Nepal.
            </p>
          </div>
          <button
            type="button"
            onClick={copyPage}
            className={styles.copyButton}
            aria-live="polite"
          >
            <span aria-hidden="true">↗</span>
            {copyFeedback}
          </button>
        </header>

        <div className={styles.docsLayout}>
          <article className={styles.docsContent}>
            <section
              id="overview"
              className={styles.introSection}
              aria-labelledby="overview-title"
            >
              <p className={styles.sectionKicker}>Overview</p>
              <h2 id="overview-title">Our program areas</h2>
              <p className={styles.introLead}>
                Relief Nepal works alongside communities to strengthen safety,
                health, learning, resilience, and livelihoods. The program areas
                below organize our work while leaving space for local priorities
                and partnerships to shape each project.
              </p>
              <p>
                Explore a category to learn what it covers and to find the
                published projects connected to it. Project pages contain the
                detailed locations, partners, budgets, background, and impact
                information available for each intervention.
              </p>
              {programSections.length > 0 && (
                <div className={styles.overviewList}>
                  {programSections.map((section) => (
                    <a href={`#${section.id}`} key={section.id}>
                      <span>{section.number}</span>
                      {section.program.name}
                      <span aria-hidden="true">→</span>
                    </a>
                  ))}
                </div>
              )}
            </section>

            {programSections.map((section) => {
              const { program } = section;
              return (
                <section
                  id={section.id}
                  key={section.id}
                  className={styles.programSection}
                  aria-labelledby={`${section.id}-title`}
                >
                  <div className={styles.sectionHeadingRow}>
                    <span className={styles.sectionNumber}>
                      {section.number}
                    </span>
                    <div>
                      <p className={styles.sectionKicker}>Program area</p>
                      <h2 id={`${section.id}-title`}>{program.name}</h2>
                    </div>
                  </div>
                  <p className={styles.programDescription}>
                    {program.description ||
                      "This program area brings Relief Nepal's community partnerships and projects together around shared priorities."}
                  </p>

                  <div className={styles.sectionDivider} />
                  <div className={styles.projectsHeading}>
                    <div>
                      <p className={styles.sectionKicker}>Published work</p>
                      <h3>Projects in this program</h3>
                    </div>
                    <span>
                      {section.projects.length}{' '}
                      {section.projects.length === 1 ? 'project' : 'projects'}
                    </span>
                  </div>

                  {section.projects.length > 0 ? (
                    <div className={styles.projectList}>
                      {section.projects.map((project, projectIndex) => {
                        const facts = [
                          ['Location', project.location],
                          ['Period', getProjectPeriod(project)],
                          ['Donor', project.donor],
                        ].filter(([, value]) => value);

                        return (
                          <article
                            key={project.id || project.slug}
                            className={styles.projectEntry}
                          >
                            <div className={styles.projectVisual}>
                              {project.banner_url ? (
                                <img
                                  src={project.banner_url}
                                  alt={`${project.title} project banner`}
                                  loading="lazy"
                                />
                              ) : (
                                <span aria-hidden="true">RN</span>
                              )}
                              <span className={styles.projectIndex}>
                                {String(projectIndex + 1).padStart(2, '0')}
                              </span>
                            </div>
                            <div className={styles.projectContent}>
                              <p className={styles.projectMeta}>
                                {formatStatus(project.status)}
                              </p>
                              <h4>
                                <Link href={`/projects/${project.slug}`}>
                                  {project.title}
                                </Link>
                              </h4>
                              <p className={styles.projectSummary}>
                                {project.summary ||
                                  'Project details will be added as verified information becomes available.'}
                              </p>
                              {facts.length > 0 && (
                                <dl className={styles.projectFacts}>
                                  {facts.map(([label, value]) => (
                                    <div key={label}>
                                      <dt>{label}</dt>
                                      <dd>{value}</dd>
                                    </div>
                                  ))}
                                </dl>
                              )}
                              <Link
                                href={`/projects/${project.slug}`}
                                className={styles.projectLink}
                              >
                                Read project details{' '}
                                <span aria-hidden="true">→</span>
                              </Link>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  ) : (
                    <div className={styles.emptyState}>
                      <p>No published projects in this program yet.</p>
                      <span>
                        New work will appear here after it has been reviewed and
                        published.
                      </span>
                    </div>
                  )}
                </section>
              );
            })}

            {programSections.length === 0 && (
              <section className={styles.emptyState} aria-live="polite">
                <p>No published program areas are available yet.</p>
                <span>
                  Please check back soon as Relief Nepal&apos;s program
                  information is updated.
                </span>
              </section>
            )}

            <div className={styles.contentFooter}>
              <p>Looking for one project rather than a program area?</p>
              <Link href="/projects" className={styles.projectArchiveLink}>
                Browse all projects <span aria-hidden="true">→</span>
              </Link>
            </div>
          </article>

          <aside className={styles.docsAside}>
            <nav className={styles.toc} aria-label="On this page">
              <p className={styles.tocTitle}>On this page</p>
              <div className={styles.tocList}>
                <a
                  href="#overview"
                  className={
                    activeSection === 'overview'
                      ? styles.tocItemActive
                      : styles.tocItem
                  }
                  aria-current={
                    activeSection === 'overview' ? 'location' : undefined
                  }
                >
                  Overview
                </a>
                {programSections.map((section) => (
                  <a
                    href={`#${section.id}`}
                    key={section.id}
                    className={
                      activeSection === section.id
                        ? styles.tocItemActive
                        : styles.tocItem
                    }
                    aria-current={
                      activeSection === section.id ? 'location' : undefined
                    }
                  >
                    {section.program.name}
                  </a>
                ))}
              </div>
            </nav>
            <div className={styles.asideActions}>
              <p>Have a question about our work?</p>
              <Link href="/contact">
                Contact Relief Nepal <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
