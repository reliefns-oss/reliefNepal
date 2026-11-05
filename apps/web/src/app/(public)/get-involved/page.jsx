import Link from 'next/link';
import JsonLd from '../../../components/seo/JsonLd.jsx';
import { breadcrumbSchema, organizationSchema, faqSchema } from '../../../lib/seo.js';

export const metadata = {
  title: 'Get Involved | Support, Volunteer, Join Relief Nepal',
  description:
    'Discover ways to get involved with Relief Nepal: support our work, explore procurement opportunities, or become a member. Join us in building self-reliant, equitable communities across Nepal.',
  openGraph: {
    title: 'Get Involved | Relief Nepal',
    description:
      'Support our work, explore procurement opportunities, or become a member. Join us in building equitable communities.',
    type: 'website',
    images: [
      {
        url: '/images/og-get-involved.jpg',
        width: 1200,
        height: 630,
        alt: 'Get involved with Relief Nepal - Support, procurement, become a member',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Get Involved | Relief Nepal',
    description:
      'Support our work, explore procurement opportunities, or become a member. Join us in building equitable communities.',
    images: ['/images/og-get-involved.jpg'],
  },
  alternates: {
    canonical: '/get-involved',
  },
};

const opportunities = [
  [
    'support',
    'Support our work',
    'Talk with our team about supporting community-led programs. Verified giving options will be shared directly.',
    '/contact',
    'Contact Relief Nepal',
  ],
  [
    'procurement',
    'Procurement opportunities',
    'Current tenders, calls for proposals, and procurement notices for goods, services, and works.',
    '/procurement',
    'View procurement',
  ],
  [
    'membership',
    'Membership',
    'Learn about membership types, eligibility, fees, and how to join Relief Nepal.',
    '/get-involved/membership',
    'Read about membership',
  ],
];

export default function GetInvolvedPage() {
  return (
    <>
      <JsonLd key="getinvolved-breadcrumb" data={breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Get Involved', url: '/get-involved' }])} />
      <JsonLd key="getinvolved-org" data={organizationSchema} />
      <JsonLd
        key="getinvolved-faq"
        data={faqSchema([
          {
            question: 'How can I support Relief Nepal\'s work?',
            answer: 'You can support Relief Nepal by contacting our team through the contact page to discuss giving options, volunteering, or partnership opportunities.',
          },
          {
            question: 'Are there procurement opportunities at Relief Nepal?',
            answer: 'Current tenders, calls for proposals, and procurement notices are posted on the procurement page. Check regularly for the latest opportunities for goods, services, and works.',
          },
          {
            question: 'How do I become a member of Relief Nepal?',
            answer: 'Any Nepalese citizen aged 16 or above can become a member by paying the admission fee and annual fee. Visit the Membership page for detailed eligibility, fees, and application process.',
          },
        ])}
      />
      <main className="bg-[#f7f8f5] px-5 py-16 text-[#183a2a] sm:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[.2em] text-forest-600">
              Get involved
            </p>
            <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
              Build a partnership with purpose.
            </h1>
            <p className="mt-5 leading-7 text-slate-600">
              We welcome conversations with people and organizations interested
              in supporting community-led work. Choose a topic below to start a
              conversation.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {opportunities.map(([id, title, description, href, label]) => (
              <section
                id={id}
                key={id}
                className="scroll-mt-28 rounded-2xl border border-forest-100 bg-white p-6 shadow-sm"
              >
                <h2 className="text-xl font-bold">{title}</h2>
                <p className="mt-3 min-h-20 text-sm leading-6 text-slate-600">
                  {description}
                </p>
                <Link
                  className="mt-5 inline-flex text-sm font-semibold text-forest-700 underline"
                  href={href}
                >
                  {label}
                </Link>
              </section>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}