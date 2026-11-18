import { notFound } from 'next/navigation';
import JsonLd from '../../../../components/seo/JsonLd.jsx';
import { breadcrumbSchema, organizationSchema, projectSchema, webPageSchema } from '../../../../lib/seo.js';

const apiBase = (
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'
).replace(/\/$/, '');

async function getProject(slug) {
  const response = await fetch(
    `${apiBase}/projects/${encodeURIComponent(slug)}`,
    { cache: 'no-store' },
  );
  if (response.status === 404) return null;
  if (!response.ok) throw new Error('Project information could not be loaded');
  const payload = await response.json();
  return payload.data;
}

function formatImpactNumbers(metrics) {
  if (!Array.isArray(metrics) || metrics.length === 0) return null;
  const verifiedMetrics = metrics
    .filter(
      (item) => item.label && item.value !== null && item.value !== undefined,
    )
    .map((item) => ({
      ...item,
      value: `${item.value}${item.unit ? (item.unit === '%' ? '' : ' ') + item.unit : ''}`,
    }))
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
  return verifiedMetrics.length ? verifiedMetrics : null;
}

function formatImpactDetails(details) {
  if (!details || !Array.isArray(details) || details.length === 0) return null;
  return details
    .map((item) => ({
      ...item,
      title: item.title || item.name || '',
      description: item.description || item.detail || '',
    }))
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) {
    return { title: 'Project not found | Relief Nepal' };
  }
  const url = `/projects/${slug}`;
  return {
    title: `${project.title} | Relief Nepal`,
    description: project.summary || `Learn about ${project.title} and Relief Nepal's work.`,
    openGraph: {
      title: project.title,
      description: project.summary || `Learn about ${project.title} and Relief Nepal's work.`,
      type: 'article',
      images: project.banner_url ? [{ url: project.banner_url, width: 1200, height: 630, alt: project.title }] : [],
      publishedTime: project.created_at,
      modifiedTime: project.updated_at,
      authors: ['Relief Nepal'],
      section: 'Projects',
      tags: ['project', 'program', 'relief nepal', project.program?.name].filter(Boolean),
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.summary || `Learn about ${project.title} and Relief Nepal's work.`,
      images: project.banner_url ? [project.banner_url] : [],
    },
    alternates: {
      canonical: url,
      languages: {
        'en-NP': `https://reliefnepal.org.np${url}`,
        'ne-NP': `https://reliefnepal.org.np/ne${url}`,
        'x-default': `https://reliefnepal.org.np${url}`,
      },
    },
    other: {
      'theme-color': '#087943',
      'color-scheme': 'light',
    },
  };
}

export default async function ProjectDetailPage({ params }) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const impactNumbers = formatImpactNumbers(project.impact_metrics);
  const impactDetails = formatImpactDetails(project.impact_details);

  const breadcrumbData = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Projects', url: '/projects' },
    { name: project.title, url: `/projects/${slug}` }
  ]);
  const organizationData = organizationSchema;
  const projectData = projectSchema({
    name: project.title,
    description: project.summary || `Learn about ${project.title} and Relief Nepal's work.`,
    url: `/projects/${slug}`,
    image: project.banner_url,
    dateCreated: project.created_at,
    dateModified: project.updated_at,
    projectStatus: project.status,
    location: project.location,
    funder: project.donor ? { name: project.donor } : undefined,
  });
  const webPageData = webPageSchema({
    name: project.title,
    description: project.summary || `Learn about ${project.title} and Relief Nepal's work.`,
    url: `/projects/${slug}`,
    image: project.banner_url,
    datePublished: project.created_at,
    dateModified: project.updated_at,
    breadcrumb: [
      { name: 'Home', url: '/' },
      { name: 'Projects', url: '/projects' },
      { name: project.title, url: `/projects/${slug}` }
    ],
    isPartOf: true,
  });

  return (
    <>
      <JsonLd key="project-breadcrumb" data={breadcrumbData} />
      <JsonLd key="project-org" data={organizationData} />
      <JsonLd key="project-schema" data={projectData} />
      <JsonLd key="project-webpage" data={webPageData} />
      <article className="min-h-[65vh] bg-[#f7f8f5] px-5 py-16 text-[#183a2a] sm:py-24">
        <div className="mx-auto max-w-4xl">
          <a
            href="/projects"
            className="text-sm font-semibold text-forest-700 hover:text-forest-900 transition"
          >
            ← All projects
          </a>
          <p className="mt-10 text-xs font-bold uppercase tracking-[.18em] text-forest-600">
            {project.status}
          </p>
          <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">
            {project.title}
          </h1>
          {project.banner_url && (
            <img
              src={project.banner_url}
              alt={`${project.title} project banner`}
              className="mt-8 max-h-[520px] w-full rounded-2xl object-cover"
            />
          )}
          {project.program?.name && (
            <p className="mt-3 text-sm font-semibold text-forest-700">
              {project.program.name} Program
            </p>
          )}
          {project.summary && (
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
              {project.summary}
            </p>
          )}

          {/* Project Meta Information */}
          <dl className="mt-10 grid gap-5 rounded-2xl border border-forest-100 bg-white p-6 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Status
              </dt>
              <dd className="mt-1 font-semibold capitalize">{project.status}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Project Period
              </dt>
              <dd className="mt-1 font-semibold">
                {project.period || project.starts_on || 'Not specified'}{' '}
                {project.ends_on && `– ${project.ends_on}`}
              </dd>
            </div>
            {project.location && (
              <div>
                <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Location
                </dt>
                <dd className="mt-1 font-semibold">{project.location}</dd>
              </div>
            )}
            {project.donor && (
              <div>
                <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Donor
                </dt>
                <dd className="mt-1 font-semibold">{project.donor}</dd>
              </div>
            )}
            {project.total_budget && (
              <div>
                <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Total Budget
                </dt>
                <dd className="mt-1 font-semibold">{project.total_budget}</dd>
              </div>
            )}
            {project.theme && (
              <div>
                <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Theme
                </dt>
                <dd className="mt-1 font-semibold">{project.theme}</dd>
              </div>
            )}
          </dl>

          {/* Background */}
          {project.background && (
            <section className="mt-12 max-w-3xl">
              <h2 className="text-2xl font-bold text-[#183a2a]">Background</h2>
              <div className="mt-4 prose prose-slate max-w-none">
                <p className="leading-8 text-slate-600 whitespace-pre-wrap">
                  {project.background}
                </p>
              </div>
            </section>
          )}

          {/* Impact Numbers */}
          {impactNumbers && impactNumbers.length > 0 && (
            <section className="mt-12 max-w-3xl">
              <h2 className="text-2xl font-bold text-[#183a2a]">
                Impact (Numbers)
              </h2>
              <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {impactNumbers.map((item, index) => (
                  <div
                    key={item.id || `${item.label}-${index}`}
                    className="rounded-xl border border-forest-100 bg-white p-5"
                  >
                    <dt className="text-sm font-semibold text-forest-800">
                      {item.label}
                    </dt>
                    <dd className="mt-1 text-3xl font-bold text-[#183a2a]">
                      {item.value}
                    </dd>
                    {(item.reporting_period || item.measured_on) && (
                      <dd className="mt-2 text-xs text-slate-500">
                        {item.reporting_period || item.measured_on}
                      </dd>
                    )}
                    {item.source && (
                      <dd className="mt-1 text-xs text-slate-500">
                        Source: {item.source}
                      </dd>
                    )}
                  </div>
                ))}
              </dl>
            </section>
          )}

          {/* Impact Details */}
          {impactDetails && impactDetails.length > 0 && (
            <section className="mt-12 max-w-3xl">
              <h2 className="text-2xl font-bold text-[#183a2a]">
                Impact Details
              </h2>
              <div className="mt-6 space-y-6">
                {impactDetails.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-forest-100 bg-white p-6"
                  >
                    <h3 className="text-lg font-bold text-[#183a2a]">
                      {item.title}
                    </h3>
                    <p className="mt-2 leading-7 text-slate-600 whitespace-pre-wrap">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {Array.isArray(project.gallery) &&
            project.gallery.some((item) => item.media_type === 'photo') && (
              <section className="mt-14 border-t border-slate-200 pt-10">
                <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[.16em] text-blue-800">
                      In the community
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-[#000048] sm:text-3xl">
                      Project gallery
                    </h2>
                  </div>
                  <a
                    href={`/gallery/${encodeURIComponent(project.slug)}`}
                    className="text-sm font-semibold text-blue-800 underline-offset-4 hover:underline"
                  >
                    View project gallery
                  </a>
                </div>
                <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
                  {project.gallery
                    .filter(
                      (item) => item.media_type === 'photo' && item.media_url,
                    )
                    .map((item) => (
                      <figure
                        key={item.id}
                        className="mb-4 break-inside-avoid overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                      >
                        <img
                          src={item.media_url}
                          alt={item.alt_text || item.title}
                          loading="lazy"
                          className="block h-auto w-full"
                        />
                        <figcaption className="px-4 py-3">
                          <p className="font-semibold text-[#000048]">
                            {item.title}
                          </p>
                          {item.caption && (
                            <p className="mt-1 text-sm leading-6 text-slate-600">
                              {item.caption}
                            </p>
                          )}
                        </figcaption>
                      </figure>
                    ))}
                </div>
              </section>
            )}
        </div>
      </article>
    </>
  );
}