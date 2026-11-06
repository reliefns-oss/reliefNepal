'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { User, Mail, Phone, Award, Briefcase } from 'lucide-react';
import styles from './BoardMembers.module.css';

interface BoardMember {
  id: string;
  sn: number;
  name: string;
  qualification: string;
  expertise: string;
  designation: string;
  contact: string;
  email: string;
  experience: number;
  photo_url: string | null;
  photo_public_id: string | null;
  display_order: number;
  is_active: boolean;
}

interface BoardMembersProps {
  members: BoardMember[];
  loading?: boolean;
  error?: string | null;
  visible?: boolean;
}

export default function BoardMembers({ members = [], loading = false, error = null, visible = true }: BoardMembersProps) {
  const [visibleIndices, setVisibleIndices] = useState<Set<number>>(new Set());
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);

  const setCardRef = useCallback((index: number) => (el: HTMLDivElement | null) => {
    if (el) cardRefs.current[index] = el;
  }, []);

  // Staggered entrance animation
  useEffect(() => {
    if (!visible) return;

    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    if (reducedMotion) {
      setVisibleIndices(new Set(members.map((_, i) => i)));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            const index = Number(target.dataset.index);
            setVisibleIndices((prev) => {
              const next = new Set(prev);
              next.add(index);
              return next;
            });
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    cardRefs.current.forEach((card, index) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, [members.length, reducedMotion, visible]);

  // Active card hover state
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (loading) {
    return (
      <section id="board" className={styles.section} aria-labelledby="board-title">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 id="board-title" className={styles.sectionTitle}>
              Currently Involved Board Members
            </h2>
            <p className={styles.sectionDescription}>
              Our board members bring diverse experience and expertise,
              guiding Relief Nepal&rsquo;s vision and ensuring effective
              governance and accountability.
            </p>
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
    );
  }

  if (error) {
    return (
      <section id="board" className={styles.section} aria-labelledby="board-title">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 id="board-title" className={styles.sectionTitle}>
              Currently Involved Board Members
            </h2>
            <p className={styles.sectionDescription}>
              Our board members bring diverse experience and expertise,
              guiding Relief Nepal&rsquo;s vision and ensuring effective
              governance and accountability.
            </p>
          </div>
          <div className={styles.errorMessage}>
            <p>Unable to load board members. Please try again later.</p>
            <button
              onClick={() => window.location.reload()}
              className={styles.retryButton}
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (members.length === 0) {
    return (
      <section id="board" className={styles.section} aria-labelledby="board-title">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 id="board-title" className={styles.sectionTitle}>
              Currently Involved Board Members
            </h2>
            <p className={styles.sectionDescription}>
              Our board members bring diverse experience and expertise,
              guiding Relief Nepal&rsquo;s vision and ensuring effective
              governance and accountability.
            </p>
          </div>
          <p className={styles.emptyMessage}>No board members available at this time.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="board" className={styles.section} aria-labelledby="board-title">
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 id="board-title" className={styles.sectionTitle}>
            Currently Involved Board Members
          </h2>
          <p className={styles.sectionDescription}>
            Our board members bring diverse experience and expertise,
            guiding Relief Nepal&rsquo;s vision and ensuring effective
            governance and accountability.
          </p>
        </div>

        <div
          className={`${styles.grid} ${visibleIndices.size === members.length ? styles.gridComplete : ''}`}
          role="list"
          aria-label="Board members"
        >
          {members.map((member, index) => {
            const isVisible = visibleIndices.has(index);
            const isHovered = hoveredIndex === index;

            return (
              <article
                key={member.id}
                ref={setCardRef(index)}
                data-index={index}
                className={`${styles.card} ${
                  isVisible ? styles.cardVisible : ''
                } ${isHovered ? styles.cardHovered : ''}`}
                style={{
                  '--stagger': index * 0.12,
                  '--card-index': index,
                } as React.CSSProperties}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                role="listitem"
              >
                <div className={styles.cardInner}>
                  {/* Photo / Avatar */}
                  <div className={styles.photoWrapper}>
                    {member.photo_url ? (
                      <Image
                        src={member.photo_url}
                        alt={`${member.name} photo`}
                        fill
                        className={styles.photo}
                        sizes="(max-width: 640px) 100px, (max-width: 1024px) 120px, 140px"
                      />
                    ) : (
                      <div className={styles.avatar} aria-hidden="true">
                        <User size={48} />
                      </div>
                    )}

                    {/* Designation badge */}
                    <span className={styles.designationBadge}>
                      {member.designation}
                    </span>
                  </div>

                  {/* Content */}
                  <div className={styles.content}>
                    {/* Name and SN */}
                    <div className={styles.header}>
                      <span className={styles.serialNumber}>#{member.sn}</span>
                      <h3 className={styles.name}>{member.name}</h3>
                    </div>

                    {/* Qualification */}
                    <div className={styles.detail}>
                      <Award className={styles.icon} aria-hidden="true" />
                      <span>{member.qualification}</span>
                    </div>

                    {/* Expertise */}
                    <div className={styles.detail}>
                      <Briefcase className={styles.icon} aria-hidden="true" />
                      <span>{member.expertise}</span>
                    </div>

                    {/* Experience */}
                    <div className={styles.detail}>
                      <Award className={styles.icon} aria-hidden="true" />
                      <span>{member.experience} years experience</span>
                    </div>

                    {/* Contact Info */}
                    <div className={styles.contactGrid}>
                      <a
                        href={`tel:${member.contact}`}
                        className={styles.contactItem}
                        aria-label={`Call ${member.name}`}
                      >
                        <Phone className={styles.icon} aria-hidden="true" />
                        <span>{member.contact}</span>
                      </a>
                      <a
                        href={`mailto:${member.email}`}
                        className={styles.contactItem}
                        aria-label={`Email ${member.name}`}
                      >
                        <Mail className={styles.icon} aria-hidden="true" />
                        <span>{member.email}</span>
                      </a>
                    </div>
                  </div>

                  {/* Subtle decorative element */}
                  <div className={styles.glow} aria-hidden="true" />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}