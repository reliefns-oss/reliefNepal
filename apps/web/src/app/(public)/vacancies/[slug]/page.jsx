import Link from 'next/link';
import { notFound } from 'next/navigation';
import JsonLd from '../../../../components/seo/JsonLd.jsx';
import { breadcrumbSchema, organizationSchema, articleSchema, webPageSchema } from '../../../../lib/seo.js';

const apiBase = (
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'
).replace(/\/$/, '');

async function getVacancy(slug) {
  const response = await fetch(
    `${apiBase}/vacancies/${encodeURIComponent(slug)}`,
    { cache: 'no-store' },
  );
  if (response.status === 404) return null;
  if (!response.ok) throw new Error('Vacancy information could not be loaded.');
  const payload = await response.json();
  return payload.data;
}

function dateLabel(value) {
  if (!value) return null;
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Kathmandu',
  }).format(new Date(`${value}T00:00:00+05:45`));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const vacancy = await getVacancy(slug);
  if (!vacancy) {
    return { title: 'Vacancy not found | Relief Nepal' };
  }
  const url = `/vacancies/${slug}`;
  return {
    title: `${vacancy.title} | Relief Nepal`,
    description: vacancy.description?.slice(0, 160) || `Career opportunity: ${vacancy.title}`,
    openGraph: {
      title: vacancy.title,
      description: vacancy.description?.slice(0, 160) || `Career opportunity: ${vacancy.title}`,
      type: 'article',
      publishedTime: vacancy.created_at,
      modifiedTime: vacancy.updated_at || vacancy.created_at,
      authors: ['Relief Nepal'],
      section: 'Careers',
      tags: ['vacancy', 'job', 'career', 'relief nepal'],
      images: vacancy.image_url ? [{ url: vacancy.image_url, width: 1200, height: 630, alt: vacancy.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: vacancy.title,
      description: vacancy.description?.slice(0, 160) || `Career opportunity: ${vacancy.title}`,
      images: vacancy.image_url ? [vacancy.image_url] : [],
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

export default async function VacancyDetailPage({ params }) {
  const { slug } = await params;
  const vacancy = await getVacancy(slug);
  if (!vacancy) notFound();
  const applyHref =
    vacancy.application_url ||
    (vacancy.application_email
      ? `mailto:${vacancy.application_email}?subject=${encodeURIComponent(`Application for ${vacancy.title}`)}`
      : null);

  const breadcrumbData = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Vacancies', url: '/vacancies' },
    { name: vacancy.title, url: `/vacancies/${slug}` }
  ]);
  const organizationData = organizationSchema;
  const articleData = articleSchema({
    headline: vacancy.title,
    description: vacancy.description?.slice(0, 160) || `Career opportunity: ${vacancy.title}`,
    url: `/vacancies/${slug}`,
    image: vacancy.image_url,
    datePublished: vacancy.created_at,
    dateModified: vacancy.updated_at || vacancy.created_at,
    authorName: 'Relief Nepal',
    publisherName: 'Relief Nepal',
    publisherLogo: '/images/logo.jpg',
    mainEntityOfPage: `/vacancies/${slug}`,
    speakableSections: ['.whitespace-pre-line', 'main article', '[role="main"]', 'dl', 'section'],
  });
  const webPageData = webPageSchema({
    name: vacancy.title,
    description: vacancy.description?.slice(0, 160) || `Career opportunity: ${vacancy.title}`,
    url: `/vacancies/${slug}`,
    image: vacancy.image_url,
    datePublished: vacancy.created_at,
    dateModified: vacancy.updated_at || vacancy.created_at,
    breadcrumb: [
      { name: 'Home', url: '/' },
      { name: 'Vacancies', url: '/vacancies' },
      { name: vacancy.title, url: `/vacancies/${slug}` }
    ],
    isPartOf: true,
  });

  return (
    <>
      <JsonLd key="vacancy-breadcrumb" data={breadcrumbData} />
      <JsonLd key="vacancy-org" data={organizationData} />
      <JsonLd key="vacancy-article" data={articleData} />
      <JsonLd key="vacancy-webpage" data={webPageData} />
      <main className="min-h-[65vh] bg-[#f7f8f5] px-5 py-14 text-[#183a2a] sm:py-20">
        <article className="mx-auto max-w-4xl">
          <Link
            href="/vacancies"
            className="text-sm font-semibold text-forest-700 underline"
          >
            ← All vacancies
          </Link>
          <header className="mt-8 border-b border-forest-100 pb-7">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-forest-600">
              {vacancy.job_type?.replaceAll('-', ' ')} · {vacancy.job_level} level
            </p>
            <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-5xl">
              {vacancy.title}
            </h1>
            <p className="mt-4 text-slate-600">
              {vacancy.location}
              {vacancy.duration ? ` · ${vacancy.duration}` : ''}
            </p>
          </header>

          <dl className="mt-7 grid gap-4 rounded-2xl border border-forest-100 bg-white p-6 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Positions
              </dt>
              <dd className="mt-1 font-semibold">
                {vacancy.number_of_vacancies}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Salary
              </dt>
              <dd className="mt-1 font-semibold">Negotiable</dd>
            </div>
            {vacancy.work_schedule && (
              <div>
                <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Schedule
                </dt>
                <dd className="mt-1 font-semibold">
                  {vacancy.work_schedule}
                  {vacancy.hours_per_week
                    ? ` · ${vacancy.hours_per_week} hours/week`
                    : ''}
                </dd>
              </div>
            )}
            {vacancy.application_deadline && (
              <div>
                <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Application deadline
                </dt>
                <dd className="mt-1 font-semibold">
                  {dateLabel(vacancy.application_deadline)}
                </dd>
              </div>
            )}
          </dl>

          <div className="mt-9 grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <div className="space-y-8">
              <section>
                <h2 className="text-xl font-bold">Job description</h2>
                <p className="mt-3 whitespace-pre-line leading-7 text-slate-700">
                  {vacancy.description}
                </p>
              </section>
              {vacancy.responsibilities && (
                <section>
                  <h2 className="text-xl font-bold">Responsibilities</h2>
                  <p className="mt-3 whitespace-pre-line leading-7 text-slate-700">
                    {vacancy.responsibilities}
                  </p>
                </section>
              )}
              <section>
                <h2 className="text-xl font-bold">
                  Qualifications and requirements
                </h2>
                <p className="mt-3 whitespace-pre-line leading-7 text-slate-700">
                  {vacancy.qualifications}
                </p>
              </section>
              {vacancy.benefits && (
                <section>
                  <h2 className="text-xl font-bold">Benefits</h2>
                  <p className="mt-3 whitespace-pre-line leading-7 text-slate-700">
                    {vacancy.benefits}
                  </p>
                </section>
              )}
              {vacancy.application_instructions && (
                <section>
                  <h2 className="text-xl font-bold">How to apply</h2>
                  <p className="mt-3 whitespace-pre-line leading-7 text-slate-700">
                    {vacancy.application_instructions}
                  </p>
                </section>
              )}
            </div>
            <aside className="h-fit rounded-2xl border border-forest-100 bg-white p-5">
              <h2 className="font-bold">Ready to apply?</h2>
              {applyHref ? (
                <a
                  href={applyHref}
                  target={vacancy.application_url ? '_blank' : undefined}
                  rel={vacancy.application_url ? 'noreferrer' : undefined}
                  className="mt-4 inline-flex w-full justify-center rounded-lg bg-forest-800 px-4 py-3 text-sm font-semibold text-white hover:bg-forest-900"
                >
                  Apply for this position
                </a>
              ) : (
                <p className="mt-3 text-sm text-slate-600">
                  Follow the application instructions above.
                </p>
              )}
            </aside>
          </div>
        </article>
      </main>
    </>
  );
}