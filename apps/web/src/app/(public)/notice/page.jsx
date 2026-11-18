import Link from 'next/link';
import NoticeList from '../../../components/notices/NoticeList.jsx';
import JsonLd from '../../../components/seo/JsonLd.jsx';
import { breadcrumbSchema, organizationSchema, webPageSchema, navigationSchema } from '../../../lib/seo.js';

export const metadata = {
  title: 'Notices & Announcements | Relief Nepal',
  description:
    'Latest notices, announcements, and updates from Relief Nepal. Stay informed about organizational updates, calls for applications, and community announcements.',
  openGraph: {
    title: 'Notices & Announcements | Relief Nepal',
    description:
      'Latest notices, announcements, and updates from Relief Nepal. Stay informed about organizational updates and community announcements.',
    type: 'website',
    images: [
      {
        url: '/images/og-notice.jpg',
        width: 1200,
        height: 630,
        alt: 'Relief Nepal - Notices and announcements',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Notices & Announcements | Relief Nepal',
    description:
      'Latest notices, announcements, and updates from Relief Nepal.',
    images: ['/images/og-notice.jpg'],
  },
  alternates: {
    canonical: '/notice',
    languages: {
      'en-NP': 'https://reliefnepal.org.np/notice',
      'ne-NP': 'https://reliefnepal.org.np/ne/notice',
      'x-default': 'https://reliefnepal.org.np/notice',
    },
  },
  other: {
    'theme-color': '#087943',
    'color-scheme': 'light',
  },
};

export default function NoticePage() {
  const breadcrumbData = breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Notices', url: '/notice' }]);
  const webPageData = webPageSchema({
    name: 'Notices & Announcements | Relief Nepal',
    description: 'Latest notices, announcements, and updates from Relief Nepal. Stay informed about organizational updates and community announcements.',
    url: '/notice',
    image: '/images/og-notice.jpg',
    breadcrumb: [{ name: 'Home', url: '/' }, { name: 'Notices', url: '/notice' }],
    isPartOf: true,
  });
  const navData = navigationSchema([
    { position: 1, name: 'All Notices', url: '/notice' },
    { position: 2, name: 'Latest', url: '/notice' },
  ]);

  return (
    <>
      <JsonLd key="notice-breadcrumb" data={breadcrumbData} />
      <JsonLd key="notice-org" data={organizationSchema} />
      <JsonLd key="notice-webpage" data={webPageData} />
      <JsonLd key="notice-navigation" data={navData} />
      <main className="min-h-[65vh] bg-[#f7f8f5] px-5 py-16 text-[#183a2a] sm:py-24">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-forest-600">
            Updates
          </p>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
            Notices and announcements
          </h1>
          <NoticeList />
          <Link
            href="/get-involved#vacancies"
            className="mt-6 inline-flex text-sm font-semibold text-forest-700 underline"
          >
            View opportunities
          </Link>
        </div>
      </main>
    </>
  );
}