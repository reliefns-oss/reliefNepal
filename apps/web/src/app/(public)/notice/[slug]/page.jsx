import Link from 'next/link';
import { notFound } from 'next/navigation';
import SeoComponents from '../../../../components/seo/SeoComponents.jsx';
import { breadcrumbSchema, organizationSchema, articleSchema, webPageSchema } from '../../../../lib/seo.js';

const apiBase = (
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'
).replace(/\/$/, '');

async function getNotice(slug) {
  const response = await fetch(
    `${apiBase}/notices/${encodeURIComponent(slug)}`,
    { cache: 'no-store' },
  );
  if (response.status === 404) return null;
  if (!response.ok) throw new Error('Notice could not be loaded.');
  const payload = await response.json();
  return payload.data;
}

function noticeDate(value) {
  if (!value) return null;
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Kathmandu',
  }).format(new Date(value));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const notice = await getNotice(slug);
  if (!notice) {
    return { title: 'Notice not found | Relief Nepal' };
  }
  const url = `/notice/${slug}`;
  return {
    title: `${notice.title} | Relief Nepal`,
    description: notice.body?.slice(0, 160) || `Official notice: ${notice.title}`,
    openGraph: {
      title: notice.title,
      description: notice.body?.slice(0, 160) || `Official notice: ${notice.title}`,
      type: 'article',
      publishedTime: notice.published_at,
      modifiedTime: notice.updated_at || notice.published_at,
      authors: ['Relief Nepal'],
      section: 'Notices',
      tags: ['notice', 'announcement', 'relief nepal'],
      images: notice.image_url ? [{ url: notice.image_url, width: 1200, height: 630, alt: notice.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: notice.title,
      description: notice.body?.slice(0, 160) || `Official notice: ${notice.title}`,
      images: notice.image_url ? [notice.image_url] : [],
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

export default async function NoticeDetailPage({ params }) {
  const { slug } = await params;
  const notice = await getNotice(slug);
  if (!notice) notFound();

  const breadcrumbData = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Notices', url: '/notice' },
    { name: notice.title, url: `/notice/${slug}` }
  ]);
  const organizationData = organizationSchema;
  const articleData = articleSchema({
    headline: notice.title,
    description: notice.body?.slice(0, 160) || `Official notice: ${notice.title}`,
    url: `/notice/${slug}`,
    image: notice.image_url,
    datePublished: notice.published_at,
    dateModified: notice.updated_at || notice.published_at,
    authorName: 'Relief Nepal',
    publisherName: 'Relief Nepal',
    publisherLogo: '/images/logo.jpg',
    mainEntityOfPage: `/notice/${slug}`,
    speakableSections: ['.whitespace-pre-line', 'main article', '[role="main"]'],
  });
  const webPageData = webPageSchema({
    name: notice.title,
    description: notice.body?.slice(0, 160) || `Official notice: ${notice.title}`,
    url: `/notice/${slug}`,
    image: notice.image_url,
    datePublished: notice.published_at,
    dateModified: notice.updated_at || notice.published_at,
    breadcrumb: [
      { name: 'Home', url: '/' },
      { name: 'Notices', url: '/notice' },
      { name: notice.title, url: `/notice/${slug}` }
    ],
    isPartOf: true,
  });

  return (
    <>
      <SeoComponents
        breadcrumb={breadcrumbData}
        organization={organizationData}
        article={articleData}
        webPage={webPageData}
      />
      <main className="min-h-[65vh] bg-[#f7f8f5] px-5 py-14 text-[#183a2a] sm:py-20">
        <article className="mx-auto max-w-3xl">
          <Link
            href="/notice"
            className="text-sm font-semibold text-forest-700 underline"
          >
            Back to notices
          </Link>
          <header className="mt-8 border-b border-forest-100 pb-6">
            <p className="text-xs font-bold uppercase tracking-[.2em] text-forest-600">
              Official notice
            </p>
            <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-5xl">
              {notice.title}
            </h1>
            {notice.published_at && (
              <time
                dateTime={notice.published_at}
                className="mt-4 block text-sm text-slate-600"
              >
                Published {noticeDate(notice.published_at)}
              </time>
            )}
          </header>

          {notice.image_url && (
            <img
              src={notice.image_url}
              alt={notice.title}
              className="mt-7 max-h-[34rem] w-full rounded-2xl object-cover"
            />
          )}

          {notice.body && (
            <div className="mt-8 whitespace-pre-line text-base leading-8 text-slate-700">
              {notice.body}
            </div>
          )}

          {notice.attachment_url && (
            <a
              href={notice.attachment_url}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex rounded-lg bg-forest-800 px-5 py-3 text-sm font-semibold text-white hover:bg-forest-900"
            >
              Open notice attachment
            </a>
          )}
        </article>
      </main>
    </>
  );
}