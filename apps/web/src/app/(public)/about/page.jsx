import AboutPageClient from './AboutPageClient';
import JsonLd from '../../../components/seo/JsonLd.jsx';
import { organizationSchema, breadcrumbSchema, faqSchema, webPageSchema, navigationSchema } from '../../../lib/seo.js';

export const metadata = {
  title: 'About Relief Nepal | Vision, Mission, Board & Structure',
  description:
    'Learn about Relief Nepal\'s vision for an equitable society, mission to empower marginalized communities, board members, organizational structure, and strategic priorities for 2026-2030 aligned with SDGs.',
  openGraph: {
    title: 'About Relief Nepal | Vision, Mission & Organization',
    description:
      'Non-profit organization established in 2008, working across Nepal for child protection, health, education, disaster resilience, WASH, and livelihoods.',
    type: 'website',
    images: [
      {
        url: '/images/og-about.jpg',
        width: 1200,
        height: 630,
        alt: 'Relief Nepal - About our organization',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Relief Nepal | Vision, Mission & Organization',
    description:
      'Non-profit organization established in 2008, working across Nepal for child protection, health, education, disaster resilience, WASH, and livelihoods.',
    images: ['/images/og-about.jpg'],
  },
  alternates: {
    canonical: '/about',
    languages: {
      'en-NP': 'https://reliefnepal.org.np/about',
      'ne-NP': 'https://reliefnepal.org.np/ne/about',
      'x-default': 'https://reliefnepal.org.np/about',
    },
  },
  other: {
    'theme-color': '#087943',
    'color-scheme': 'light',
  },
};

export default function AboutPage() {
  const breadcrumbData = breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'About', url: '/about' }]);
  const webPageData = webPageSchema({
    name: 'About Relief Nepal | Vision, Mission & Organization',
    description: 'Non-profit organization established in 2008, working across Nepal for child protection, health, education, disaster resilience, WASH, and livelihoods.',
    url: '/about',
    image: '/images/og-about.jpg',
    breadcrumb: [{ name: 'Home', url: '/' }, { name: 'About', url: '/about' }],
    isPartOf: true,
  });
  const navData = navigationSchema([
    { position: 1, name: 'About', url: '/about' },
    { position: 2, name: 'Projects', url: '/projects' },
    { position: 3, name: 'Impact', url: '/impact' },
    { position: 4, name: 'Stories', url: '/stories' },
    { position: 5, name: 'Gallery', url: '/gallery' },
    { position: 6, name: 'Notices', url: '/notice' },
    { position: 7, name: 'Vacancies', url: '/vacancies' },
    { position: 8, name: 'Network', url: '/network' },
    { position: 9, name: 'Contact', url: '/contact' },
    { position: 10, name: 'Get Involved', url: '/get-involved' },
  ]);

  return (
    <>
      <JsonLd key="about-breadcrumb" data={breadcrumbData} />
      <JsonLd key="about-org" data={organizationSchema} />
      <JsonLd key="about-webpage" data={webPageData} />
      <JsonLd key="about-navigation" data={navData} />
      <JsonLd
        key="about-faq"
        data={faqSchema([
          {
            question: 'When was Relief Nepal established?',
            answer: 'Relief Nepal was established in 2008 (2065 BS) and is headquartered in Sindhuli, Bagmati Province, Nepal.',
          },
          {
            question: 'What are Relief Nepal\'s main focus areas?',
            answer: 'Relief Nepal works across five core sectors: Child Protection, Education & Health, Disaster & Climate Resilience, WASH (Water, Sanitation & Hygiene), and Livelihoods.',
          },
          {
            question: 'Where does Relief Nepal operate?',
            answer: 'Relief Nepal operates across Bagmati, Madhesh, and Karnali provinces of Nepal, directly benefiting more than 15,000 people annually.',
          },
          {
            question: 'How is Relief Nepal governed?',
            answer: 'The General Assembly guides the Executive Committee, which is supported by the Advisory Committee. The Executive Director leads the Program Development and Management, Monitoring, Evaluation and Documentation, and Admin, Finance and HR divisions, with Internal Audit alongside the Executive Director.',
          },
        ])}
      />
      <AboutPageClient />
    </>
  );
}