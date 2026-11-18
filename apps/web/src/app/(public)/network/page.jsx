import NetworkExplorer from '../../../components/networks/NetworkExplorer.jsx';
import JsonLd from '../../../components/seo/JsonLd.jsx';
import {
  breadcrumbSchema,
  organizationSchema,
  webPageSchema,
  navigationSchema,
} from '../../../lib/seo.js';

export const metadata = {
  title: 'Our Network & Partners | Relief Nepal',
  description:
    'Meet the local organizations and resource partners working alongside Relief Nepal. Explore our network of district partners and Funding Partners across Nepal.',
  openGraph: {
    title: 'Our Network & Partners | Relief Nepal',
    description:
      "Explore Relief Nepal's network of local district partners and Funding Partners working together for community-led development.",
    type: 'website',
    images: [
      {
        url: '/images/og-network.jpg',
        width: 1200,
        height: 630,
        alt: 'Relief Nepal - Our network of partners',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Network & Partners | Relief Nepal',
    description:
      "Explore Relief Nepal's network of local district partners and Funding Partners.",
    images: ['/images/og-network.jpg'],
  },
  alternates: {
    canonical: '/network',
    languages: {
      'en-NP': 'https://reliefnepal.org.np/network',
      'ne-NP': 'https://reliefnepal.org.np/ne/network',
      'x-default': 'https://reliefnepal.org.np/network',
    },
  },
  other: {
    'theme-color': '#087943',
    'color-scheme': 'light',
  },
};

export default function NetworkPage() {
  const breadcrumbData = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Our Network', url: '/network' },
  ]);
  const webPageData = webPageSchema({
    name: 'Our Network & Partners | Relief Nepal',
    description:
      "Explore Relief Nepal's network of local district partners and Funding Partners working together for community-led development.",
    url: '/network',
    image: '/images/og-network.jpg',
    breadcrumb: [
      { name: 'Home', url: '/' },
      { name: 'Our Network', url: '/network' },
    ],
    isPartOf: true,
  });
  const navData = navigationSchema([
    { position: 1, name: 'All Partners', url: '/network' },
    {
      position: 2,
      name: 'Local Partners',
      url: '/network?type=local_district',
    },
    {
      position: 3,
      name: 'Funding Partners',
      url: '/network?type=resource_provider',
    },
  ]);

  return (
    <>
      <JsonLd key="network-breadcrumb" data={breadcrumbData} />
      <JsonLd key="network-org" data={organizationSchema} />
      <JsonLd key="network-webpage" data={webPageData} />
      <JsonLd key="network-navigation" data={navData} />
      <NetworkExplorer />
    </>
  );
}
