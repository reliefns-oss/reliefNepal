import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import JsonLd from '../../../../components/seo/JsonLd.jsx';
import { breadcrumbSchema, organizationSchema, faqSchema, webPageSchema } from '../../../../lib/seo.js';

export const metadata = {
  title: 'Membership | Relief Nepal',
  description:
    'Learn about Relief Nepal membership types, eligibility criteria, fees, and how to become a member. Join a network of individuals and organizations working together for lasting change.',
  openGraph: {
    title: 'Membership | Relief Nepal',
    description:
      'Learn about membership types, eligibility, fees, and how to join Relief Nepal. Open to all Nepalese citizens aged 16 and above.',
    type: 'website',
    images: [
      {
        url: '/images/og-membership.jpg',
        width: 1200,
        height: 630,
        alt: 'Relief Nepal Membership - Join our community',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Membership | Relief Nepal',
    description:
      'Learn about membership types, eligibility, fees, and how to join Relief Nepal.',
    images: ['/images/og-membership.jpg'],
  },
  alternates: {
    canonical: '/get-involved/membership',
    languages: {
      'en-NP': 'https://reliefnepal.org.np/get-involved/membership',
      'ne-NP': 'https://reliefnepal.org.np/ne/get-involved/membership',
      'x-default': 'https://reliefnepal.org.np/get-involved/membership',
    },
  },
  other: {
    'theme-color': '#087943',
    'color-scheme': 'light',
  },
};

export default function MembershipPage() {
  const breadcrumbData = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Get Involved', url: '/get-involved' },
    { name: 'Membership', url: '/get-involved/membership' },
  ]);
  const webPageData = webPageSchema({
    name: 'Membership | Relief Nepal',
    description: 'Learn about Relief Nepal membership types, eligibility criteria, fees, and how to become a member.',
    url: '/get-involved/membership',
    image: '/images/og-membership.jpg',
    breadcrumb: [
      { name: 'Home', url: '/' },
      { name: 'Get Involved', url: '/get-involved' },
      { name: 'Membership', url: '/get-involved/membership' },
    ],
    isPartOf: true,
  });

  return (
    <>
      <JsonLd key="membership-breadcrumb" data={breadcrumbData} />
      <JsonLd key="membership-org" data={organizationSchema} />
      <JsonLd key="membership-webpage" data={webPageData} />
      <JsonLd
        key="membership-faq"
        data={faqSchema([
          {
            question: 'Who can become a member of Relief Nepal?',
            answer: 'Any Nepalese citizen who has completed the age of 16 may obtain membership by paying the specified membership fees and fulfilling the required procedures.',
          },
          {
            question: 'What are the types of membership?',
            answer: 'The members of Relief Nepal shall be of the following types: Ordinary member, Life-long member, and Consumer member.',
          },
          {
            question: 'What are the membership fees?',
            answer: 'Ordinary member: Admission fee Rs. 200/-, Annual fee Rs. 50/-. Life-long member: Lump sum payment Rs. 1,000/-. Only ordinary and life-long members may take part in the election.',
          },
          {
            question: 'What disqualifies someone from membership?',
            answer: 'One shall be disqualified for membership if they are not a Nepalese citizen, do not observe the Statute of Relief Nepal, consume narcotic drugs, are a member of any destructive organization, or carry narcotics such as cannabis, hashish, or drugs.',
          },
        ])}
      />
      <main className="bg-[#f7f8f5] px-5 py-16 text-[#183a2a] sm:py-24">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/get-involved"
            className="inline-flex items-center gap-1 text-sm font-semibold text-forest-700 underline hover:text-forest-900 mb-8 block max-w-fit"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to Get involved
          </Link>

          <header className="mb-12">
            <p className="text-xs font-bold uppercase tracking-[.2em] text-forest-600">
              Get involved
            </p>
            <h1 className="mt-3 text-4xl font-bold sm:text-5xl leading-tight">
              Become a member of Relief Nepal
            </h1>
            <p className="mt-5 leading-7 text-slate-600">
              Membership is open to all Nepalese citizens aged 16 and above who
              share our vision of community-led development. Join a network of
              individuals and organizations working together for lasting change.
            </p>
          </header>

          <section className="space-y-8" aria-labelledby="eligibility-heading">
            <h2 id="eligibility-heading" className="text-2xl font-bold text-[#183a2a]">
              Eligibility
            </h2>
            <div className="prose prose-forest max-w-none text-slate-700">
              <p className="leading-7">
                Any Nepalese citizen who has completed the age of 16 may obtain
                membership by paying the specified membership fees and fulfilling
                the required procedures.
              </p>
            </div>
          </section>

          <section className="space-y-8" aria-labelledby="types-heading">
            <h2 id="types-heading" className="text-2xl font-bold text-[#183a2a]">
              Types of members
            </h2>
            <p className="leading-7 text-slate-700">
              The members of Relief Nepal shall be of the following types:
            </p>
            <ul className="list-disc list-inside space-y-3 text-slate-700 leading-7">
              <li><strong>Ordinary member</strong></li>
              <li><strong>Life-long member</strong></li>
              <li><strong>Consumer member</strong></li>
            </ul>
          </section>

          <section className="space-y-8" aria-labelledby="fees-heading">
            <h2 id="fees-heading" className="text-2xl font-bold text-[#183a2a]">
              Membership fee
            </h2>
            <div className="space-y-6">
              <div className="rounded-xl border border-forest-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold text-[#183a2a]">Ordinary member</h3>
                <dl className="mt-3 space-y-2 text-slate-700 leading-7">
                  <dt className="font-semibold">Admission fee</dt>
                  <dd className="ml-4">Rs. 200/-</dd>
                  <dt className="font-semibold">Annual fee</dt>
                  <dd className="ml-4">Rs. 50/-</dd>
                </dl>
              </div>
              <div className="rounded-xl border border-forest-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold text-[#183a2a]">Life-long member</h3>
                <dl className="mt-3 space-y-2 text-slate-700 leading-7">
                  <dt className="font-semibold">Lump sum payment</dt>
                  <dd className="ml-4">Rs. 1,000/-</dd>
                </dl>
              </div>
              <p className="text-sm text-slate-600">
                <strong>Note:</strong> Only ordinary and life-long members may take
                part in the election.
              </p>
            </div>
          </section>

          <section className="space-y-8" aria-labelledby="disqualification-heading">
            <h2 id="disqualification-heading" className="text-2xl font-bold text-[#183a2a]">
              Disqualification for membership
            </h2>
            <p className="leading-7 text-slate-700">
              One shall be disqualified for membership in the following
              circumstances:
            </p>
            <ol className="list-decimal list-inside space-y-4 text-slate-700 leading-7">
              <li>One who is not a Nepalese citizen</li>
              <li>
                One who does not observe the Statute of Relief Nepal and acts
                contrary to the same
              </li>
              <li>One who consumes narcotic drugs</li>
              <li>
                One who consumes and carries narcotics such as cannabis, hashish,
                drugs
              </li>
              <li>One who is a member of any destructive organization</li>
            </ol>
          </section>

          <section className="mt-12 rounded-xl border border-forest-300 bg-forest-50 p-6 sm:p-8">
            <h3 className="text-lg font-bold text-forest-900">Ready to join?</h3>
            <p className="mt-2 text-slate-700 leading-7">
              Contact our team to learn more about the membership process and
              submit your application.
            </p>
            <Link
              href="/contact"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-forest-700 px-5 py-3 text-sm font-semibold text-white hover:bg-forest-800 transition-colors"
            >
              Contact us about membership
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </section>
        </div>
      </main>
    </>
  );
}