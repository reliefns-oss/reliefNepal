import FeedbackForm from '../../../components/forms/FeedbackForm.jsx';
import JsonLd from '../../../components/seo/JsonLd.jsx';
import { breadcrumbSchema, organizationSchema, webPageSchema } from '../../../lib/seo.js';

export const metadata = {
  title: 'Feedback Form | Relief Nepal',
  description:
    'Share your feedback with Relief Nepal. Your experience helps us improve our community-led development work across Nepal.',
  openGraph: {
    title: 'Feedback Form | Relief Nepal',
    description: 'Share your feedback with Relief Nepal. Your experience helps us improve our work.',
    type: 'website',
    images: [
      {
        url: '/images/og-contact.jpg',
        width: 1200,
        height: 630,
        alt: 'Relief Nepal Feedback Form',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Feedback Form | Relief Nepal',
    description: 'Share your feedback with Relief Nepal. Your experience helps us improve our work.',
    images: ['/images/og-contact.jpg'],
  },
  alternates: {
    canonical: '/feedback-form',
    languages: {
      'en-NP': 'https://reliefnepal.org.np/feedback-form',
      'ne-NP': 'https://reliefnepal.org.np/ne/feedback-form',
      'x-default': 'https://reliefnepal.org.np/feedback-form',
    },
  },
  other: {
    'theme-color': '#087943',
    'color-scheme': 'light',
  },
};

export default function FeedbackFormPage() {
  const breadcrumbData = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Feedback', url: '/feedback-form' },
  ]);
  const webPageData = webPageSchema({
    name: 'Feedback Form | Relief Nepal',
    description: 'Share your feedback with Relief Nepal. Your experience helps us improve our community-led development work across Nepal.',
    url: '/feedback-form',
    image: '/images/og-contact.jpg',
    breadcrumb: [{ name: 'Home', url: '/' }, { name: 'Feedback', url: '/feedback-form' }],
    isPartOf: true,
  });

  return (
    <>
      <JsonLd key="feedback-breadcrumb" data={breadcrumbData} />
      <JsonLd key="feedback-org" data={organizationSchema} />
      <JsonLd key="feedback-webpage" data={webPageData} />
      <section className="bg-[#f7f8f5] px-5 py-16 text-[#183a2a] sm:py-24">
        <div className="mx-auto grid max-w-3xl gap-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.2em] text-forest-600">
              Feedback form
            </p>
            <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">
              We value your feedback
            </h1>
            <p className="mt-5 max-w-md leading-7 text-slate-600">
              Help us improve by sharing your experience with Relief Nepal. Your feedback
              is sent directly to our team and helps shape our community-led development work.
            </p>
          </div>
          <div className="rounded-2xl border border-forest-100 bg-white p-6 shadow-sm sm:p-9">
            <FeedbackForm />
          </div>
        </div>
      </section>
    </>
  );
}