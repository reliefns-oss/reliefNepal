'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  ArrowUpRight,
  Globe2,
  Handshake,
  MapPin,
  Network,
  Search,
} from 'lucide-react';
import { apiRequest } from '../../lib/api/client.js';
import styles from './network.module.css';

const categories = [
  {
    id: 'local_district',
    label: 'Local / District Partner',
    shortLabel: 'Local and district',
    description:
      'Community organizations and local institutions working alongside people in their districts.',
    color: 'district',
  },
  {
    id: 'resource_provider',
    label: 'Resource Provider / Partner',
    shortLabel: 'Resource providers',
    description:
      'Organizations contributing expertise, resources, funding, or technical support.',
    color: 'resource',
  },
];

const hub = { x: 500, y: 300 };
const mobileHub = { x: 160, y: 140 };

function partnerPosition(index, count) {
  const angle = -Math.PI / 2 + (2 * Math.PI * index) / count;
  return {
    x: hub.x + Math.cos(angle) * 340,
    y: hub.y + Math.sin(angle) * 228,
  };
}

function mobilePartnerPosition(index) {
  const itemsPerRow = 2;
  const row = Math.floor(index / itemsPerRow);
  const col = index % itemsPerRow;
  const spacingX = 160;
  const spacingY = 140;
  const startX = mobileHub.x - spacingX / 2;
  const startY = mobileHub.y + 80;
  return {
    x: startX + col * spacingX + spacingX / 2,
    y: startY + row * spacingY,
  };
}

function useMobileLayout() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 760);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  return isMobile;
}

function categoryFor(id) {
  return categories.find((category) => category.id === id) || categories[0];
}

function PartnerMark({ partner, className = '', size = 'default' }) {
  const dimensions =
    size === 'small'
      ? { width: 42, height: 38 }
      : size === 'node'
        ? { width: 80, height: 80 }
        : { width: 54, height: 42 };
  return (
    <span
      className={`${styles.partnerMark} ${className} ${styles[`partnerMark_${size}`]}`}
      aria-hidden="true"
    >
      {partner.logo_url ? (
        <Image
          src={partner.logo_url}
          alt=""
          width={dimensions.width}
          height={dimensions.height}
          loading="lazy"
          unoptimized
          style={{ objectFit: 'contain', objectPosition: 'center' }}
        />
      ) : (
        <span className={styles.partnerFallback}>
          {partner.name?.trim().charAt(0)?.toUpperCase() || 'P'}
        </span>
      )}
    </span>
  );
}

function PartnerCard({ partner, index }) {
  const category = categoryFor(partner.relationship_type);
  return (
    <Link
      href={`/network/${encodeURIComponent(partner.slug)}`}
      className={`${styles.directoryCard} ${styles[`category_${category.color}`]}`}
      style={{ '--card-index': index }}
    >
      <PartnerMark partner={partner} size="small" />
      <div className={styles.directoryCopy}>
        <span className={styles.categoryLabel}>{category.label}</span>
        <h3>{partner.name}</h3>
        <p>
          {partner.short_description ||
            partner.description ||
            category.description}
        </p>
        {partner.location && (
          <span className={styles.location}>
            <MapPin size={14} aria-hidden="true" /> {partner.location}
          </span>
        )}
      </div>
      <ArrowUpRight className={styles.cardArrow} size={19} aria-hidden="true" />
    </Link>
  );
}

function ConnectionLine({ partner, index, isActive, color, isMobile }) {
  const point = isMobile
    ? mobilePartnerPosition(index, 8)
    : partnerPosition(index, 8);
  const center = isMobile ? mobileHub : hub;
  const lineColor = color === 'district' ? '#278553' : '#3379ad';
  const lineOpacity = isActive ? 0.9 : 0.5;

  return (
    <line
      key={partner.id}
      className={`${styles.connection} ${styles[`connection_${color}`]}`}
      data-partner-id={partner.id}
      x1={center.x}
      y1={center.y}
      x2={point.x}
      y2={point.y}
      strokeWidth={isActive ? 2.5 : 1.5}
      stroke={lineColor}
      strokeOpacity={lineOpacity}
      strokeDasharray="8 6"
      strokeLinecap="round"
      style={{
        filter: isActive
          ? 'drop-shadow(0 0 8px currentColor)'
          : 'drop-shadow(0 0 2px currentColor)',
      }}
    />
  );
}

function HubNode({ isMobile }) {
  return (
    <div
      className={styles.hub}
      style={
        isMobile
          ? {
              transform: 'none',
              width: '280px',
              height: '140px',
              borderRadius: '16px',
            }
          : {}
      }
    >
      <span className={styles.hubLogo}>
        <Image
          src="/images/logo.jpg"
          alt=""
          width={isMobile ? 63 : 100}
          height={isMobile ? 51 : 100}
          priority
        />
      </span>
    </div>
  );
}

function PartnerNode({
  partner,
  index,
  category,
  isMobile,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
}) {
  const point = isMobile
    ? mobilePartnerPosition(index, 8)
    : partnerPosition(index, 8);

  if (isMobile) {
    return (
      <a
        key={partner.id}
        href={`/network/${encodeURIComponent(partner.slug)}`}
        className={`${styles.node} ${styles[`node_${category.color}`]} ${styles.nodeMobile}`}
        style={{ '--node-index': index }}
        aria-label={`${partner.name}, ${categoryFor(category).label}. View partner profile.`}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        <PartnerMark partner={partner} size="node" />
      </a>
    );
  }

  return (
    <a
      key={partner.id}
      href={`/network/${encodeURIComponent(partner.slug)}`}
      className={`${styles.node} ${styles[`node_${category.color}`]} ${styles.nodeCircular}`}
      style={{
        left: `${(point.x / 1000) * 100}%`,
        top: `${(point.y / 600) * 100}%`,
        '--node-index': index,
        transform: 'translate(-50%, -50%)',
      }}
      aria-label={`${partner.name}, ${categoryFor(category).label}. View partner profile.`}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <div className={styles.nodeContent}>
        <PartnerMark partner={partner} size="node" />
      </div>
    </a>
  );
}

function AnimatedHeroBackground() {
  return <div className={styles.heroPattern} aria-hidden="true" />;
}

function FilterButton({ category, isActive, count, onClick }) {
  return (
    <button
      type="button"
      className={`${styles.filterButton} ${styles[`filter_${category.color}`]} ${isActive ? styles.filterActive : ''}`}
      aria-pressed={isActive}
      onClick={onClick}
    >
      {category.shortLabel} <span>{count}</span>
    </button>
  );
}

function StateCard({ icon, title, description, action }) {
  return (
    <div
      className={styles.stateCard}
      role={icon === 'alert' ? 'alert' : 'status'}
    >
      {icon !== 'loading' && icon && (
        <div className={styles.emptyIcon}>{icon}</div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  );
}

function CategoryIntro() {
  return (
    <section className={styles.categoryIntro} aria-label="Partner categories">
      {categories.map((category) => (
        <article
          key={category.id}
          className={styles[`categoryIntro_${category.color}`]}
        >
          <span>
            {category.id === 'local_district' ? (
              <MapPin size={18} />
            ) : (
              <Globe2 size={18} />
            )}
          </span>
          <div>
            <h2>{category.label}</h2>
            <p>{category.description}</p>
          </div>
        </article>
      ))}
    </section>
  );
}

export default function NetworkExplorer() {
  const [partners, setPartners] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('loading');
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const [focusedNodeId, setFocusedNodeId] = useState(null);
  const isMobile = useMobileLayout();
  const diagramRef = useRef(null);

  useEffect(() => {
    let current = true;
    apiRequest('/networks')
      .then((data) => {
        if (!current) return;
        setPartners(Array.isArray(data) ? data : []);
        setStatus('ready');
      })
      .catch(() => {
        if (current) setStatus('error');
      });
    return () => {
      current = false;
    };
  }, []);

  useEffect(() => {
    const filterFromHash = () => {
      const value = window.location.hash.slice(1);
      if (categories.some((category) => category.id === value))
        setActiveCategory(value);
    };
    filterFromHash();
    window.addEventListener('hashchange', filterFromHash);
    return () => window.removeEventListener('hashchange', filterFromHash);
  }, []);

  const counts = useMemo(
    () =>
      Object.fromEntries(
        categories.map((category) => [
          category.id,
          partners.filter(
            (partner) => partner.relationship_type === category.id,
          ).length,
        ]),
      ),
    [partners],
  );

  const visiblePartners = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    return partners.filter((partner) => {
      const matchesCategory =
        activeCategory === 'all' ||
        partner.relationship_type === activeCategory;
      const text = [
        partner.name,
        partner.short_description,
        partner.description,
        partner.location,
      ]
        .filter(Boolean)
        .join(' ')
        .toLocaleLowerCase();
      return matchesCategory && (!normalized || text.includes(normalized));
    });
  }, [partners, activeCategory, query]);

  const diagramPartners = visiblePartners.slice(0, 8);

  return (
    <main className={styles.networkPage}>
      <section className={styles.hero} aria-labelledby="network-title">
        <AnimatedHeroBackground />
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>
            <span />
            Our network
          </p>
          <h1 id="network-title">Stronger Together, Greater Impact.</h1>
          <p className={styles.heroIntro}>
            Working alongside local organizations and resource partners helps
            Relief Nepal reach more communities and build change that lasts.
          </p>
          <div className={styles.heroActions}>
            <a className={styles.primaryAction} href="#partner-network">
              Explore our partners <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a className={styles.secondaryAction} href="/contact">
              Become a partner <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </div>
          <div className={styles.heroNote}>
            <Handshake size={17} aria-hidden="true" />
            Partnership rooted in local knowledge and shared purpose
          </div>
        </div>
        <div className={styles.heroAside} aria-hidden="true">
          <Network size={24} strokeWidth={1.4} />
          <span>Connected by purpose</span>
        </div>
      </section>

      <section
        id="partner-network"
        className={styles.explorer}
        aria-labelledby="explorer-title"
      >
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrowDark}>A shared network</p>
            <h2 id="explorer-title">Connected through collaboration</h2>
            <p>
              Explore the organizations working with Relief Nepal. Select a
              partner to learn more about the relationship.
            </p>
          </div>
          <div className={styles.partnerCount}>
            <strong>{partners.length}</strong>
            <span>
              {partners.length === 1
                ? 'published partner'
                : 'published partners'}
            </span>
          </div>
        </div>

        <div className={styles.controls}>
          <div
            className={styles.filterGroup}
            role="group"
            aria-label="Filter partners by category"
          >
            <FilterButton
              category={{ id: 'all', shortLabel: 'All partners', color: 'all' }}
              isActive={activeCategory === 'all'}
              count={partners.length}
              onClick={() => setActiveCategory('all')}
            />
            {categories.map((category) => (
              <FilterButton
                key={category.id}
                category={category}
                isActive={activeCategory === category.id}
                count={counts[category.id]}
                onClick={() => setActiveCategory(category.id)}
              />
            ))}
          </div>
          <label className={styles.searchBox}>
            <Search size={18} aria-hidden="true" />
            <span className="sr-only">
              Search partner names and descriptions
            </span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search partners"
            />
          </label>
        </div>

        <div className={styles.legend} aria-label="Partner category legend">
          {categories.map((category) => (
            <span key={category.id}>
              <i className={styles[`legend_${category.color}`]} />
              {category.label}
            </span>
          ))}
        </div>

        {status === 'loading' ? (
          <StateCard
            key="loading"
            icon="loading"
            title="Loading published partners…"
            description="Please wait while we fetch the network data."
          />
        ) : status === 'error' ? (
          <StateCard
            key="error"
            icon={<Handshake size={26} aria-hidden="true" />}
            title="Partner information is temporarily unavailable"
            description="Please try again in a moment."
            action={
              <button type="button" onClick={() => window.location.reload()}>
                Try again
              </button>
            }
          />
        ) : partners.length === 0 ? (
          <StateCard
            key="empty"
            icon={<Handshake size={26} aria-hidden="true" />}
            title="Our network is growing"
            description="Published partner profiles will appear here as they are added. We believe meaningful work is built through shared purpose."
            action={<a href="/contact">Talk with our team</a>}
          />
        ) : visiblePartners.length === 0 ? (
          <StateCard
            key="no-match"
            icon={<Search size={26} aria-hidden="true" />}
            title="No partners match those filters"
            description="Try another category or search term."
            action={
              <button
                type="button"
                onClick={() => {
                  setActiveCategory('all');
                  setQuery('');
                }}
              >
                Clear filters
              </button>
            }
          />
        ) : (
          <>
            <div
              className={styles.diagram}
              role="group"
              aria-label="Network visualization connecting Relief Nepal with partner organizations"
              ref={diagramRef}
            >
              <svg
                className={styles.connections}
                viewBox="0 0 1000 600"
                preserveAspectRatio="none"
                aria-hidden="true"
                style={{ display: isMobile ? 'none' : 'block' }}
              >
                {diagramPartners.map((partner, index) => (
                  <ConnectionLine
                    key={partner.id}
                    partner={partner}
                    index={index}
                    isActive={
                      hoveredNodeId === partner.id ||
                      focusedNodeId === partner.id
                    }
                    color={categoryFor(partner.relationship_type).color}
                    isMobile={false}
                  />
                ))}
              </svg>
              {isMobile && (
                <svg
                  className={styles.connections}
                  viewBox="0 0 320 600"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  {diagramPartners.map((partner, index) => (
                    <ConnectionLine
                      key={partner.id}
                      partner={partner}
                      index={index}
                      isActive={
                        hoveredNodeId === partner.id ||
                        focusedNodeId === partner.id
                      }
                      color={categoryFor(partner.relationship_type).color}
                      isMobile={true}
                    />
                  ))}
                </svg>
              )}
              <HubNode isMobile={isMobile} />
              <div className={styles.nodes}>
                {diagramPartners.map((partner, index) => {
                  const category = categoryFor(partner.relationship_type);
                  return (
                    <PartnerNode
                      key={partner.id}
                      partner={partner}
                      index={index}
                      category={category}
                      isMobile={isMobile}
                      onPointerEnter={() => setHoveredNodeId(partner.id)}
                      onPointerLeave={() => setHoveredNodeId(null)}
                      onFocus={() => setFocusedNodeId(partner.id)}
                      onBlur={() => setFocusedNodeId(null)}
                    />
                  );
                })}
              </div>
              {visiblePartners.length > diagramPartners.length && (
                <p className={styles.diagramNote}>
                  Showing {diagramPartners.length} of {visiblePartners.length}{' '}
                  matching connections. Browse every profile below.
                </p>
              )}
            </div>

            <div className={styles.directoryHeading}>
              <div>
                <p className={styles.eyebrowDark}>Partner directory</p>
                <h2>{visiblePartners.length} organizations</h2>
              </div>
              <p>
                Choose any profile to see more about their work and connection.
              </p>
            </div>

            <div className={styles.directory}>
              {visiblePartners.map((partner, index) => (
                <PartnerCard key={partner.id} partner={partner} index={index} />
              ))}
            </div>
          </>
        )}
      </section>

      <CategoryIntro />
    </main>
  );
}
