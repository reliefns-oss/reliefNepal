'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { apiRequest } from '../../../lib/api/client.js';
import styles from './about.module.css';

// Import OrgStructure dynamically to avoid SSR issues with IntersectionObserver/ResizeObserver
const OrgStructure = dynamic(() => import('./OrgStructure'), {
  ssr: false,
  loading: () => (
    <div className={styles.orgChartSkeleton} aria-hidden="true">
      <div className={styles.skeletonRow} />
      <div className={styles.skeletonRow} />
      <div className={styles.skeletonRow} />
      <div className={styles.skeletonRow} />
      <div className={styles.skeletonRow} />
    </div>
  ),
});

// Import BoardMembers dynamically
const BoardMembers = dynamic(() => import('./BoardMembers'), {
  ssr: false,
  loading: () => (
    <section id="board" className={styles.boardSection} aria-labelledby="board-title">
      <div className={styles.container}>
        <div className={styles.sectionHeading}>
          <h2 id="board-title">Currently Involved Board Members</h2>
        </div>
        <div className={styles.tableWrapper}>
          <div className={styles.boardTableSkeleton} aria-hidden="true">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={styles.skeletonRow} />
            ))}
          </div>
        </div>
      </div>
    </section>
  ),
});

const heroSlides = [
  '/images/handwashing.jpg',
  '/images/Picture7.png',
  '/images/dhara.jpg',
  '/images/Picture2.jpg',
  '/images/Trackshoot-support.jpg',
  '/images/computer-learning.jpg',
];

const principles = [
  {
    title: 'Our Vision',
    text: 'Developed Society based on social, economic, political and gender equity.',
  },
  {
    title: 'Our Mission',
    text: 'To enhance the livelihoods of children, youth, women and marginalized sections of society by empowering them to become self-reliant, participate meaningfully in decision-making, and enjoy their rights.',
  },
  {
    title: 'Our Goal',
    text: 'Vulnerable and marginalized people, especially children, youth and people living in marginalized conditions, are empowered to participate in decision-making about issues affecting their livelihoods.',
  },
  {
    title: 'Our Objectives',
    text: 'Relief Nepal works to empower marginalized communities and improve their quality of life through the following objectives.',
    objectives: [
      {
        number: '01',
        text: 'To empower women and marginalized groups, ensure human rights, increase school enrolment among school-age children, reduce domestic violence, the dowry system and human slavery, and promote animal welfare through social mobilization and institutional building.',
      },
      {
        number: '02',
        text: 'To improve safe drinking water supply, sanitation and hygiene behavior among target groups and reduce communicable and waterborne diseases.',
      },
      {
        number: '03',
        text: 'To increase access to basic health services and nutritional education for deprived and marginalized communities, women and children under five, and reduce the incidence of STDs and HIV/AIDS in the community.',
      },
      {
        number: '04',
        text: 'To improve livelihoods through integrated management of agriculture, biodiversity, ecosystem services and renewable energy.',
      },
      {
        number: '05',
        text: 'To promote the livelihoods of marginalized people by promoting local products and strengthening their links with potential market systems.',
      },
      {
        number: '06',
        text: 'To facilitate child rights protection and promotion programs as a resource organization at the local level.',
      },
      {
        number: '07',
        text: 'To conduct non-formal education and literacy programs in partnership with government organizations (GOs) and international non-governmental organizations (INGOs), targeting illiterate children, youth and women from Dalit and disadvantaged groups, and linking these programs with income-generating activities and savings and credit programs.',
      },
      {
        number: '08',
        text: 'To work against social abuses such as the dowry system, child marriage, child labor and human trafficking, especially trafficking of girls and women, to ensure their rights.',
      },
      {
        number: '09',
        text: 'To support and promote small-scale modern farming, animal husbandry and income-generating activities for marginalized, low-income groups in association with relevant agriculture development offices and financial institutions.',
      },
      {
        number: '10',
        text: 'To provide relief and support to disaster-affected populations, including those affected by climate change hazards, in association with humanitarian support organizations.',
      },
    ],
  },
];

const organization = [
  {
    title: 'Program Development and Management',
    items: [
      'Child Protection',
      'Education & Health',
      'WASH',
      'Income Generation and Livelihood',
      'DRR and CCA',
    ],
  },
  {
    title: 'Administrative Department',
    items: [
      'Office Management',
      'Staff Management',
      'Document Management',
      'Public Service Management',
      'Infrastructure Management',
      'Meeting Management',
      'Other activities management',
    ],
  },
  {
    title: 'Monitoring, Evaluation and Knowledge Management Department',
    items: [
      'Monitoring & Evaluation Unit',
      'Policy and Advocacy Unit',
      'Publication and Communication Unit',
      'Research Unit',
    ],
  },
  {
    title: 'Finance and Human Resource Management Department',
    items: [
      'Admin & Procurement Unit',
      'Finance Unit',
      'HR Unit',
      'Office Management',
    ],
  },
];

export default function AboutPageClient() {
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [activeSection, setActiveSection] = useState('about-overview');
  const [visibleSections, setVisibleSections] = useState(() => new Set());
  const [boardMembers, setBoardMembers] = useState([]);
  const [boardMembersLoading, setBoardMembersLoading] = useState(true);
  const [boardMembersError, setBoardMembersError] = useState(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveHeroSlide((current) => (current + 1) % heroSlides.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, []);
  // console.log(process.env.NEXT_PUBLIC_API_URL);

  useEffect(() => {
    const sections = document.querySelectorAll('[data-about-section]');
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          setActiveSection(id);
          setVisibleSections((current) => {
            if (current.has(id)) return current;
            const next = new Set(current);
            next.add(id);
            return next;
          });
        });
      },
      { rootMargin: '-18% 0px -64% 0px', threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // Fetch board members from API
  useEffect(() => {
    let active = true;
    async function fetchBoardMembers() {
      try {
        setBoardMembersLoading(true);
        setBoardMembersError(null);
        console.log(process.env.NEXT_PUBLIC_API_URL);

        const data = await apiRequest('/board-members');
        if (active) {
          setBoardMembers(data || []);
        }
      } catch (error) {
        if (active) {
          setBoardMembersError(error.message);
          // Fallback to empty array on error
          setBoardMembers([]);
        }
      } finally {
        if (active) {
          setBoardMembersLoading(false);
        }
      }
    }
    fetchBoardMembers();
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className={styles.page}>
      <div className={styles.documentLayout}>
        <article className={styles.documentContent}>
          <header
            id="about-overview"
            data-about-section
            className={`${styles.documentIntro} ${visibleSections.has('about-overview') ? styles.sectionVisible : ''}`}
          >
            <p className={styles.eyebrow}>About Relief Nepal</p>
            <h1>Working alongside communities for lasting change.</h1>
            <p className={styles.introCopy}>
              Relief Nepal is a non-governmental organization working with
              children, women, and marginalized communities to strengthen
              rights, wellbeing, and self-reliance.
            </p>
            <div
              className={styles.hero}
              aria-label="Relief Nepal community work"
            >
              <div className={styles.heroSlides} aria-hidden="true">
                {heroSlides.map((image, index) => (
                  <Image
                    key={image}
                    fill
                    sizes="(max-width: 640px) 100vw, 70vw"
                    className={`${styles.heroSlide} ${index === activeHeroSlide ? styles.heroSlideActive : ''}`}
                    src={image}
                    alt=""
                  />
                ))}
              </div>
            </div>
          </header>

          {/* VISION, MISSION, GOAL AND OBJECTIVES */}
          <section
            id="principles"
            data-about-section
            className={`${styles.principles} ${visibleSections.has('principles') ? styles.sectionVisible : ''}`}
            aria-labelledby="principles-title"
          >
            <div className={styles.container}>
              <div className={styles.sectionHeading}>
                <p className={styles.eyebrow}>What guides us</p>
                <h2 id="principles-title">
                  Vision, Mission, Goal & Objectives
                </h2>
              </div>

              <div className={styles.principleGrid}>
                {principles.map((item, index) => (
                  <article
                    className={`${styles.principleCard} ${
                      item.objectives ? styles.objectivesCard : ''
                    }`}
                    key={item.title}
                  >
                    <span className={styles.number}>
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <h3>{item.title}</h3>
                    <p>{item.text}</p>

                    {item.objectives && (
                      <ol className={styles.objectiveList}>
                        {item.objectives.map((objective) => (
                          <li key={objective.number}>
                            <span className={styles.objectiveNumber}>
                              {objective.number}
                            </span>
                            <p>{objective.text}</p>
                          </li>
                        ))}
                      </ol>
                    )}
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* BOARD MEMBERS */}
          <BoardMembers
            members={boardMembers}
            loading={boardMembersLoading}
            error={boardMembersError}
            visible={visibleSections.has('board')}
          />

          {/* ORGANIZATIONAL STRUCTURE - Interactive */}
          <section
            id="organization"
            data-about-section
            className={`${styles.orgSection} ${visibleSections.has('organization') ? styles.sectionVisible : ''}`}
            aria-labelledby="org-title"
          >
            <div className={styles.container}>
              <div className={styles.sectionHeading}>
                <p className={styles.eyebrow}>How we work</p>
                <h2 id="org-title">Organizational Structure</h2>
                <p>
                  Our organizational structure supports effective governance,
                  coordination, transparent management, and program delivery.
                  Scroll through each stage to see how the layers work together.
                </p>
              </div>

              <OrgStructure organization={organization} />
            </div>
          </section>

          {/* FUTURE DIRECTION */}
          <section
            id="future"
            data-about-section
            className={`${styles.direction} ${visibleSections.has('future') ? styles.sectionVisible : ''}`}
          >
            <div className={styles.container}>
              <div className={styles.sectionHeading}>
                <p className={styles.eyebrow}>
                  Our priorities for 2026&ndash;2030
                </p>
                <h2>The Future We Are Working Toward</h2>
                <p>
                  Our plans are guided by the Sustainable Development Goals and
                  shaped around the needs of children, families, communities,
                  and the country.
                </p>
              </div>

              <figure className={styles.sdgFeature}>
                <figcaption>
                  <span className={styles.featureLabel}>
                    Our priority framework
                  </span>
                  <h3>Sustainable Development Goals</h3>
                  <p>
                    These goals guide our shared commitment to a fairer,
                    healthier, and more resilient future.
                  </p>
                </figcaption>

                <Image
                  src="/images/about-sdg-priorities.png"
                  alt="Sustainable Development Goals prioritized by Relief Nepal."
                  width={1321}
                  height={133}
                  sizes="(max-width: 768px) 100vw, 70vw"
                />
              </figure>

              <figure className={styles.programFeature}>
                <figcaption>
                  <span className={styles.featureLabel}>
                    Thematic program areas
                  </span>
                  <h3>Our Plan for 2026&ndash;2030</h3>
                </figcaption>

                <Image
                  src="/images/about-program-areas-2026-2030.png"
                  alt="Relief Nepal's thematic program areas for 2026&ndash;2030."
                  width={1221}
                  height={957}
                  sizes="(max-width: 768px) 100vw, 70vw"
                />
              </figure>
            </div>
          </section>

          {/* OUR JOURNEY */}
          <section
            id="journey"
            data-about-section
            className={`${styles.journey} ${visibleSections.has('journey') ? styles.sectionVisible : ''}`}
          >
            <div className={styles.container}>
              <div className={styles.sectionHeading}>
                <p className={styles.eyebrow}>Our story so far</p>
                <h2>A Journey Built With Communities</h2>
                <p>
                  From our registration to the work we do today, every step has
                  been made possible through community partnership.
                </p>
              </div>

              <figure className={styles.journeyImage}>
                <Image
                  src="/images/about-journey.png"
                  alt="Timeline of Relief Nepal's journey from registration in 2065 to the present."
                  width={1918}
                  height={1078}
                  sizes="(max-width: 768px) 100vw, 70vw"
                />
              </figure>
            </div>
          </section>
        </article>

        <aside
          className={styles.contentsPanel}
          aria-label="About page contents"
        >
          <p className={styles.contentsTitle}>On this page</p>
          <nav aria-label="About page sections">
            <a
              href="#about-overview"
              aria-current={
                activeSection === 'about-overview' ? 'location' : undefined
              }
            >
              Overview
            </a>
            <a
              href="#principles"
              aria-current={
                activeSection === 'principles' ? 'location' : undefined
              }
            >
              Vision, mission & objectives
            </a>
            <a
              href="#board"
              aria-current={activeSection === 'board' ? 'location' : undefined}
            >
              Board members
            </a>
            <a
              href="#organization"
              aria-current={
                activeSection === 'organization' ? 'location' : undefined
              }
            >
              Organization structure
            </a>
            <a
              href="#future"
              aria-current={activeSection === 'future' ? 'location' : undefined}
            >
              Strategic priorities
            </a>
            <a
              href="#journey"
              aria-current={
                activeSection === 'journey' ? 'location' : undefined
              }
            >
              Our journey
            </a>
          </nav>
        </aside>
      </div>
    </main>
  );
}
