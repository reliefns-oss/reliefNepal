import VacancyList from '../../../components/vacancies/VacancyList.jsx';
import JsonLd from '../../../components/seo/JsonLd.jsx';
import { breadcrumbSchema, organizationSchema, faqSchema, webPageSchema, navigationSchema } from '../../../lib/seo.js';

export const metadata = {
  title: 'Vacancies & Career Opportunities | Relief Nepal',
  description:
    'Explore current career opportunities and job openings at Relief Nepal. Find role details, requirements, and application instructions for positions across our programs.',
  openGraph: {
    title: 'Vacancies & Career Opportunities | Relief Nepal',
    description:
      'Find current openings, role details, requirements, and application instructions for positions across our programs.',
    type: 'website',
    images: [
      {
        url: '/images/og-vacancies.jpg',
        width: 1200,
        height: 630,
        alt: 'Relief Nepal - Career opportunities and vacancies',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vacancies & Career Opportunities | Relief Nepal',
    description:
      'Find current openings, role details, requirements, and application instructions.',
    images: ['/images/og-vacancies.jpg'],
  },
  alternates: {
    canonical: '/vacancies',
    languages: {
      'en-NP': 'https://reliefnepal.org.np/vacancies',
      'ne-NP': 'https://reliefnepal.org.np/ne/vacancies',
      'x-default': 'https://reliefnepal.org.np/vacancies',
    },
  },
  other: {
    'theme-color': '#087943',
    'color-scheme': 'light',
  },
};

export default function VacanciesPage() {
  const breadcrumbData = breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Vacancies', url: '/vacancies' }]);
  const webPageData = webPageSchema({
    name: 'Vacancies & Career Opportunities | Relief Nepal',
    description: 'Find current openings, role details, requirements, and application instructions for positions across our programs.',
    url: '/vacancies',
    image: '/images/og-vacancies.jpg',
    breadcrumb: [{ name: 'Home', url: '/' }, { name: 'Vacancies', url: '/vacancies' }],
    isPartOf: true,
  });
  const navData = navigationSchema([
    { position: 1, name: 'All Vacancies', url: '/vacancies' },
    { position: 2, name: 'Current Openings', url: '/vacancies' },
  ]);

  return (
    <>
      <JsonLd key="vacancies-breadcrumb" data={breadcrumbData} />
      <JsonLd key="vacancies-org" data={organizationSchema} />
      <JsonLd key="vacancies-webpage" data={webPageData} />
      <JsonLd key="vacancies-navigation" data={navData} />
      <JsonLd
        key="vacancies-faq"
        data={faqSchema([
          {
            question: 'How do I apply for a vacancy at Relief Nepal?',
            answer: 'Click on a vacancy listing to view full details and application instructions. Applications are typically submitted via email or through the application link provided in the job posting.',
          },
          {
            question: 'Does Relief Nepal offer internships or volunteer positions?',
            answer: 'Occasionally, Relief Nepal offers internship and volunteer opportunities. Check the vacancies page regularly for the latest openings.',
          },
          {
            question: 'Where are Relief Nepal\'s job locations?',
            answer: 'Relief Nepal operates primarily in Bagmati, Madhesh, and Karnali provinces. Job locations are specified in each vacancy listing.',
          },
        ])}
      />
      <header className="bg-forest-900 px-5 py-14 text-white sm:py-20">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-white/70">
            Careers at Relief Nepal
          </p>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">Vacancies</h1>
          <p className="mt-4 max-w-2xl leading-7 text-white/80">
            Find current openings, role details, requirements, and application
            instructions.
          </p>
        </div>
      </header>
      <main className="min-h-[35vh] bg-[#f7f8f5] text-[#183a2a]">
        <VacancyList />
      </main>
    </>
  );
}