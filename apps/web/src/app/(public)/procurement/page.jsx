import ProcurementList from '../../../components/procurement/ProcurementList.tsx';
import JsonLd from '../../../components/seo/JsonLd.jsx';
import { breadcrumbSchema, organizationSchema, faqSchema } from '../../../lib/seo.js';

export const metadata = {
  title: 'Procurement Opportunities | Relief Nepal',
  description:
    'View current procurement opportunities, tenders, and calls for proposals at Relief Nepal. Find tender details, requirements, and submission instructions.',
  openGraph: {
    title: 'Procurement Opportunities | Relief Nepal',
    description:
      'Find current tenders, procurement notices, and calls for proposals with details and submission instructions.',
    type: 'website',
    images: [
      {
        url: '/images/og-procurement.jpg',
        width: 1200,
        height: 630,
        alt: 'Relief Nepal - Procurement opportunities and tenders',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Procurement Opportunities | Relief Nepal',
    description:
      'Find current tenders, procurement notices, and calls for proposals.',
    images: ['/images/og-procurement.jpg'],
  },
  alternates: {
    canonical: '/procurement',
  },
};

export default function ProcurementPage() {
  return (
    <>
      <JsonLd
        key="procurement-breadcrumb"
        data={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Get Involved', url: '/get-involved' },
          { name: 'Procurement', url: '/procurement' },
        ])}
      />
      <JsonLd key="procurement-org" data={organizationSchema} />
      <JsonLd
        key="procurement-faq"
        data={faqSchema([
          {
            question: 'How do I submit a bid for a procurement opportunity?',
            answer:
              'Click on a procurement listing to view full details and submission instructions. Bids are typically submitted via email or through the submission portal specified in the tender document.',
          },
          {
            question: 'What types of procurement opportunities does Relief Nepal publish?',
            answer:
              'Relief Nepal publishes tenders for goods, services, and works related to our programs. This includes construction, consulting services, vehicle procurement, medical supplies, and more.',
          },
          {
            question: 'Where can I find procurement documents and terms of reference?',
            answer:
              'Procurement documents, terms of reference, and bid forms are available for download on each procurement listing page. Some documents may require registration to access.',
          },
          {
            question: 'Does Relief Nepal follow a specific procurement policy?',
            answer:
              'Yes, Relief Nepal follows a transparent procurement policy aligned with international best practices and donor requirements. The policy ensures fair competition, value for money, and accountability.',
          },
        ])}
      />
      <header className="bg-forest-900 px-5 py-14 text-white sm:py-20">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-white/70">
            Procurement at Relief Nepal
          </p>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
            Procurement Opportunities
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-white/80">
            View current tenders, calls for proposals, and procurement notices.
            Find tender details, requirements, and submission instructions.
          </p>
        </div>
      </header>
      <main className="min-h-[35vh] bg-[#f7f8f5] text-[#183a2a]">
        <ProcurementList />
      </main>
    </>
  );
}