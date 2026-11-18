import ProjectsListClient from './ProjectsListClient';
import JsonLd from '../../../components/seo/JsonLd.jsx';
import { organizationSchema, breadcrumbSchema, webPageSchema, navigationSchema } from '../../../lib/seo.js';

export const metadata = {
  title: 'Projects & Programs | Relief Nepal',
  description:
    'Explore Relief Nepal\'s current and past projects across child protection, health, education, disaster resilience, WASH, and livelihoods. Filter by program and search projects.',
  openGraph: {
    title: 'Projects & Programs | Relief Nepal',
    description:
      'Explore Relief Nepal\'s published work by program. Project details are shared here after review and approval.',
    type: 'website',
    images: [
      {
        url: '/images/og-projects.jpg',
        width: 1200,
        height: 630,
        alt: 'Relief Nepal - Projects and programs',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projects & Programs | Relief Nepal',
    description:
      'Explore Relief Nepal\'s published work by program. Project details are shared here after review and approval.',
    images: ['/images/og-projects.jpg'],
  },
  alternates: {
    canonical: '/projects',
    languages: {
      'en-NP': 'https://reliefnepal.org.np/projects',
      'ne-NP': 'https://reliefnepal.org.np/ne/projects',
      'x-default': 'https://reliefnepal.org.np/projects',
    },
  },
  other: {
    'theme-color': '#087943',
    'color-scheme': 'light',
  },
};

export default function ProjectsPage() {
  const breadcrumbData = breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Projects', url: '/projects' }]);
  const webPageData = webPageSchema({
    name: 'Projects & Programs | Relief Nepal',
    description: 'Explore Relief Nepal\'s published work by program. Project details are shared here after review and approval.',
    url: '/projects',
    image: '/images/og-projects.jpg',
    breadcrumb: [{ name: 'Home', url: '/' }, { name: 'Projects', url: '/projects' }],
    isPartOf: true,
  });
  const navData = navigationSchema([
    { position: 1, name: 'All Projects', url: '/projects' },
    { position: 2, name: 'Child Protection', url: '/projects?program=child-protection' },
    { position: 3, name: 'Health & Education', url: '/projects?program=health-education' },
    { position: 4, name: 'Disaster Resilience', url: '/projects?program=disaster-resilience' },
    { position: 5, name: 'WASH', url: '/projects?program=wash' },
    { position: 6, name: 'Livelihoods', url: '/projects?program=livelihoods' },
  ]);

  return (
    <>
      <JsonLd key="projects-breadcrumb" data={breadcrumbData} />
      <JsonLd key="projects-org" data={organizationSchema} />
      <JsonLd key="projects-webpage" data={webPageData} />
      <JsonLd key="projects-navigation" data={navData} />
      <ProjectsListClient />
    </>
  );
}