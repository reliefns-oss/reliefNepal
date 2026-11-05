import RnHero from '../../components/home/RnHero.jsx';
import DistrictMapSection from '../../components/geography/DistrictMapSection.jsx';
import HomePageClient from './HomePageClient';
import PartnerMarquee from '../../components/layout/PartnerMarquee.tsx';
import JsonLd from '../../components/seo/JsonLd.jsx';
import { organizationSchema, breadcrumbSchema } from '../../lib/seo.js';

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
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLd key="home-breadcrumb" data={breadcrumbSchema([{ name: 'Home', url: '/' }])} />
      <JsonLd key="home-org" data={organizationSchema} />
      <main className="rn-site">
        <RnHero
          images={homeHeroSlides}
          eyebrow="Relief Nepal · Community-led development"
          title="Building self-reliant, equitable communities across Nepal"
          text="We partner with children, youth, women and marginalized groups to strengthen rights, opportunity and resilience."
        />

        <DistrictMapSection />

        <HomePageClient />

        <PartnerMarquee />
      </main>
    </>
  );
}