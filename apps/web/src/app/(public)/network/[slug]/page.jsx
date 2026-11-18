import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import JsonLd from '../../../../components/seo/JsonLd.jsx';
import {
  ArrowLeft,
  ArrowUpRight,
  Globe2,
  Handshake,
  Mail,
  MapPin,
} from 'lucide-react';
import { apiRequest } from '../../../../lib/api/client.js';
import {
  breadcrumbSchema,
  organizationSchema,
  webPageSchema,
} from '../../../../lib/seo.js';
import styles from '../../../../components/networks/network.module.css';

export const dynamic = 'force-dynamic';

const apiBase = (
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'
).replace(/\/$/, '');

async function getPartner(slug) {
  const response = await fetch(
    `${apiBase}/networks/${encodeURIComponent(slug)}`,
    { cache: 'no-store' },
  );
  if (response.status === 404) return null;
  if (!response.ok) throw new Error('Partner information could not be loaded.');
  const payload = await response.json();
  return payload.data;
}

function categoryLabel(type) {
  return type === 'local_district'
    ? 'Local / District Partner'
    : 'Fund Provider / Partner';
}

function safeExternalUrl(value) {
  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const partner = await getPartner(slug);
  if (!partner) return { title: 'Partner not found | Relief Nepal' };
  const description =
    partner.short_description ||
    partner.description ||
    `Learn about ${partner.name} and its connection with Relief Nepal.`;
  const url = `/network/${encodeURIComponent(partner.slug)}`;
  return {
    title: `${partner.name} | Relief Nepal Network`,
    description,
    alternates: {
      canonical: url,
      languages: {
        'en-NP': `https://reliefnepal.org.np${url}`,
        'ne-NP': `https://reliefnepal.org.np/ne${url}`,
        'x-default': `https://reliefnepal.org.np${url}`,
      },
    },
    openGraph: {
      type: 'profile',
      title: `${partner.name} | Relief Nepal Network`,
      description,
      url,
      ...(partner.logo_url ? { images: [{ url: partner.logo_url }] } : {}),
    },
    twitter: {
      card: 'summary',
      title: `${partner.name} | Relief Nepal Network`,
      description,
      images: partner.logo_url ? [partner.logo_url] : [],
    },
    other: {
      'theme-color': '#087943',
      'color-scheme': 'light',
    },
  };
}

export default async function PartnerProfilePage({ params }) {
  const { slug } = await params;
  const partner = await getPartner(slug);
  if (!partner) notFound();

  let related = [];
  try {
    related = (await apiRequest('/networks'))
      .filter((item) => item.id !== partner.id)
      .slice(0, 3);
  } catch {
    // The profile remains useful if the optional related-partner list is offline.
  }

  const website = safeExternalUrl(partner.website_url);
  const areas = (partner.collaboration_areas || '')
    .split(/\n|,/)
    .map((area) => area.trim())
    .filter(Boolean);

  const breadcrumbData = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Network', url: '/network' },
    { name: partner.name, url: `/network/${slug}` },
  ]);
  const organizationData = organizationSchema;
  const webPageData = webPageSchema({
    name: partner.name,
    description:
      partner.short_description ||
      partner.description ||
      `Learn about ${partner.name} and its connection with Relief Nepal.`,
    url: `/network/${slug}`,
    image: partner.logo_url,
    datePublished: partner.created_at,
    dateModified: partner.updated_at,
    breadcrumb: [
      { name: 'Home', url: '/' },
      { name: 'Network', url: '/network' },
      { name: partner.name, url: `/network/${slug}` },
    ],
    isPartOf: true,
  });

  return (
    <>
      <JsonLd key="partner-breadcrumb" data={breadcrumbData} />
      <JsonLd key="partner-org" data={organizationData} />
      <JsonLd key="partner-webpage" data={webPageData} />
      <main
        className={`${styles.networkPage} ${styles.profilePage}`}
        id="partner-profile"
      >
        <div className={styles.profileWrap}>
          <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/network">Network</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{partner.name}</span>
          </nav>

          <article>
            <header className={styles.profileHeader}>
              <div className={styles.profileIdentity}>
                <div className={styles.profileLogo}>
                  {partner.logo_url ? (
                    <Image
                      src={partner.logo_url}
                      alt={`${partner.name} logo`}
                      width={145}
                      height={130}
                      unoptimized
                    />
                  ) : (
                    <span aria-hidden="true">
                      {partner.name.trim().charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className={styles.profileTitle}>
                  <p className={styles.eyebrowDark}>Relief Nepal partner</p>
                  <span className={styles.profileCategory}>
                    {categoryLabel(partner.relationship_type)}
                  </span>
                  <h1>{partner.name}</h1>
                  {partner.short_description && (
                    <p>{partner.short_description}</p>
                  )}
                </div>
              </div>
              <div className={styles.profileActions}>
                {website && (
                  <a href={website} target="_blank" rel="noopener noreferrer">
                    Visit website <ArrowUpRight size={17} aria-hidden="true" />
                  </a>
                )}
                <Link href="/network">
                  <ArrowLeft size={16} aria-hidden="true" /> Back to network
                </Link>
              </div>
            </header>

            <div className={styles.connectionBanner}>
              <div className={styles.connectionOrganization}>
                <span className={styles.connectionHubMark}>
                  <Image src="/images/logo.jpg" alt="" width={38} height={34} />
                </span>
                <strong>Relief Nepal</strong>
              </div>
              <span className={styles.connectionLine} aria-hidden="true" />
              <span className={styles.connectionBadge}>
                <Handshake size={18} aria-hidden="true" /> Working together
              </span>
              <span className={styles.connectionLine} aria-hidden="true" />
              <div className={styles.connectionOrganization}>
                <span className={styles.connectionInitial} aria-hidden="true">
                  {partner.name.trim().charAt(0).toUpperCase()}
                </span>
                <strong>{partner.name}</strong>
              </div>
            </div>

            <div className={styles.profileGrid}>
              <div className={styles.profileMain}>
                <section className={styles.profileSection}>
                  <p className={styles.eyebrowDark}>About the partner</p>
                  <h2>Working for community-led change</h2>
                  {partner.description ? (
                    <p className={styles.profileBody}>{partner.description}</p>
                  ) : (
                    <p className={styles.profileBody}>
                      More information about this partner is being prepared.
                    </p>
                  )}
                </section>

                {partner.collaboration_context && (
                  <section className={styles.profileSection}>
                    <p className={styles.eyebrowDark}>Our collaboration</p>
                    <h2>How we work together</h2>
                    <p className={styles.profileBody}>
                      {partner.collaboration_context}
                    </p>
                  </section>
                )}

                {areas.length > 0 && (
                  <section className={styles.profileSection}>
                    <p className={styles.eyebrowDark}>Shared focus</p>
                    <h2>Collaboration areas</h2>
                    <ul className={styles.areaList}>
                      {areas.map((area) => (
                        <li key={area}>{area}</li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>

              <aside
                className={styles.profileAside}
                aria-label="Partner details"
              >
                <h2>Partner details</h2>
                <dl>
                  <div>
                    <dt>Category</dt>
                    <dd>{categoryLabel(partner.relationship_type)}</dd>
                  </div>
                  {partner.location && (
                    <div>
                      <dt>Location</dt>
                      <dd>
                        <MapPin size={15} aria-hidden="true" />
                        {partner.location}
                      </dd>
                    </div>
                  )}
                  {website && (
                    <div>
                      <dt>Website</dt>
                      <dd>
                        <a
                          href={website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Globe2 size={15} aria-hidden="true" /> Official
                          website
                        </a>
                      </dd>
                    </div>
                  )}
                  {partner.public_contact_email && (
                    <div>
                      <dt>Public contact</dt>
                      <dd>
                        <a href={`mailto:${partner.public_contact_email}`}>
                          <Mail size={15} aria-hidden="true" />
                          {partner.public_contact_email}
                        </a>
                      </dd>
                    </div>
                  )}
                </dl>
              </aside>
            </div>
          </article>

          <section
            className={styles.relatedSection}
            aria-labelledby="related-title"
          >
            <div className={styles.relatedHeading}>
              <div>
                <p className={styles.eyebrowDark}>Our network</p>
                <h2 id="related-title">Meet other partners</h2>
              </div>
              <Link href="/network">
                Explore the full network{' '}
                <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </div>
            {related.length > 0 ? (
              <div className={styles.relatedGrid}>
                {related.map((item) => (
                  <Link
                    key={item.id}
                    href={`/network/${encodeURIComponent(item.slug)}`}
                    className={styles.relatedCard}
                  >
                    <span>
                      {item.logo_url ? (
                        <Image
                          src={item.logo_url}
                          alt=""
                          width={42}
                          height={38}
                          unoptimized
                        />
                      ) : (
                        item.name.trim().charAt(0).toUpperCase()
                      )}
                    </span>
                    <div>
                      <small>{categoryLabel(item.relationship_type)}</small>
                      <strong>{item.name}</strong>
                    </div>
                    <ArrowUpRight size={17} aria-hidden="true" />
                  </Link>
                ))}
              </div>
            ) : (
              <p className={styles.relatedEmpty}>
                Visit the network page to explore published partner profiles.
              </p>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
