import RnHero from '../../components/home/RnHero.jsx';
import DistrictMapSection from '../../components/geography/DistrictMapSection.jsx';
import HomePageClient from './HomePageClient';
import PartnerMarquee from '../../components/layout/PartnerMarquee.tsx';
import ForexSection from '../../components/home/ForexSection.jsx';
import JsonLd from '../../components/seo/JsonLd.jsx';
import {
  organizationSchema,
  breadcrumbSchema,
  webPageSchema,
  navigationSchema,
} from '../../lib/seo.js';

const homeHeroSlides = [
  { src: '/images/Picture7.png', caption: 'Community-led development' },
  { src: '/images/plant.png', caption: 'Environmental conservation' },
  { src: '/images/Trackshoot-support.jpg', caption: 'Community support' },
  { src: '/images/girls.group.png', caption: "Girls' group activities" },
  { src: '/images/handwashing.jpg', caption: 'Safe hygiene practices' },
  { src: '/images/heath.youth.jpg', caption: 'Youth health awareness' },
  { src: '/images/dhara.jpg', caption: 'Access to clean water' },
  { src: '/images/grp.holding.png', caption: 'Community participation' },
  { src: '/images/protection.child.jpg', caption: 'Child protection' },
];

export const metadata = {
  title: 'Building self-reliant, equitable communities across Nepal',
  description:
    'Relief Nepal is a non-profit organization established in 2008, dedicated to improving the well-being of underserved children, families, and communities across Nepal through community-led development in protection, health, education, disaster resilience, WASH, and livelihoods.',
  openGraph: {
    title: 'Relief Nepal | Community, dignity, hope',
    description:
      'Building self-reliant, equitable communities across Nepal through community-led development.',
    type: 'website',
    images: [
      {
        url: '/images/og-home.jpg',
        width: 1200,
        height: 630,
        alt: 'Relief Nepal - Community-led development across Nepal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Relief Nepal | Community, dignity, hope',
    description:
      'Building self-reliant, equitable communities across Nepal through community-led development.',
    images: ['/images/og-home.jpg'],
  },
  alternates: {
    canonical: '/',
    languages: {
      'en-NP': 'https://reliefnepal.org.np',
      'ne-NP': 'https://reliefnepal.org.np/ne',
      'x-default': 'https://reliefnepal.org.np',
    },
  },
  other: {
    'theme-color': '#087943',
    'color-scheme': 'light',
  },
};

export default function HomePage() {
  const breadcrumbData = breadcrumbSchema([{ name: 'Home', url: '/' }]);
  const webPageData = webPageSchema({
    name: 'Relief Nepal | Community, dignity, hope',
    description: 'Building self-reliant, equitable communities across Nepal through community-led development.',
    url: 'https://reliefnepal.org.np/',
    image: '/images/og-home.jpg',
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
      <JsonLd key="home-breadcrumb" data={breadcrumbData} />
      <JsonLd key="home-webpage" data={webPageData} />
      <JsonLd key="home-navigation" data={navData} />
      <JsonLd key="home-org" data={organizationSchema} />
      <main className="rn-site">
        <RnHero images={homeHeroSlides} />

        <DistrictMapSection />

        <ForexSection />

        <HomePageClient />

        <PartnerMarquee />
      </main>
    </>
  );
}