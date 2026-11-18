import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import SeoComponents from '../../../../components/seo/SeoComponents.jsx';
import {
  articleSchema,
  breadcrumbSchema,
  organizationSchema,
  webPageSchema,
} from '../../../../lib/seo.js';

const apiBase = (
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'
).replace(/\/$/, '');

async function getAction(slug) {
  const response = await fetch(
    `${apiBase}/government-actions/${encodeURIComponent(slug)}`,
    { cache: 'no-store' },
  );
  if (response.status === 404) return null;
  if (!response.ok) throw new Error('Initiative could not be loaded.');
  const payload = await response.json();
  return payload.data;
}

function formatActionDate(value) {
  if (!value) return null;
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value.slice(0, 10)}T00:00:00.000Z`));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const action = await getAction(slug);
  if (!action) return { title: 'Initiative not found | Relief Nepal' };

  const description = action.summary || action.body.slice(0, 160);
  const url = `/government-actions/${slug}`;
  return {
    title: `${action.title} | Joint Action with Government | Relief Nepal`,
    description,
    openGraph: {
      title: action.title,
      description,
      type: 'article',
      publishedTime: action.published_at,
      images: action.image_url
        ? [{ url: action.image_url, width: 1200, height: 630, alt: action.title }]
        : [],
    },
    alternates: { canonical: url },
  };
}

export default async function GovernmentActionPage({ params }) {
  const { slug } = await params;
  const action = await getAction(slug);
  if (!action) notFound();

  const url = `/government-actions/${slug}`;
  const description = action.summary || action.body.slice(0, 160);
  const date = formatActionDate(action.action_date);
  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Joint Action with Government', url: '/#government-partnerships' },
    { name: action.title, url },
  ]);
  const article = articleSchema({
    headline: action.title,
    description,
    url,
    image: action.image_url,
    datePublished: action.published_at,
    dateModified: action.updated_at || action.published_at,
    authorName: 'Relief Nepal',
    publisherName: 'Relief Nepal',
    publisherLogo: '/images/logo.jpg',
    mainEntityOfPage: url,
  });
  const webPage = webPageSchema({
    name: action.title,
    description,
    url,
    image: action.image_url,
    datePublished: action.published_at,
    dateModified: action.updated_at || action.published_at,
    breadcrumb: [
      { name: 'Home', url: '/' },
      { name: 'Joint Action with Government', url: '/#government-partnerships' },
      { name: action.title, url },
    ],
    isPartOf: true,
  });

  return (
    <>
      <SeoComponents
        breadcrumb={breadcrumb}
        organization={organizationSchema}
        article={article}
        webPage={webPage}
      />
      <main className="min-h-[65vh] bg-[#f7f8f5] px-5 py-14 text-[#183a2a] sm:py-20">
        <article className="mx-auto max-w-3xl">
          <Link
            href="/#government-partnerships"
            className="text-sm font-semibold text-forest-700 underline"
          >
            Back to government partnerships
          </Link>
          <header className="mt-8 border-b border-forest-100 pb-6">
            <p className="text-xs font-bold uppercase tracking-[.2em] text-forest-600">
              Joint Action with Government
            </p>
            <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-5xl">
              {action.title}
            </h1>
            <p className="mt-4 text-base font-semibold text-forest-800">
              {action.government_partner}
            </p>
            {date && (
              <time
                dateTime={action.action_date}
                className="mt-2 block text-sm text-slate-600"
              >
                {date}
              </time>
            )}
          </header>

          {action.image_url && (
            <div className="relative mt-7 aspect-[16/9] max-h-[34rem] w-full overflow-hidden rounded-2xl">
              <Image
                src={action.image_url}
                alt={action.title}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                unoptimized
                className="object-cover"
              />
            </div>
          )}

          <p className="mt-8 text-lg font-medium leading-8 text-slate-800">
            {action.summary}
          </p>
          <div className="mt-5 whitespace-pre-line text-base leading-8 text-slate-700">
            {action.body}
          </div>
        </article>
      </main>
    </>
  );
}
