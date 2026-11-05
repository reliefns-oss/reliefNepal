import ProcurementDetail from '../../../../components/procurement/ProcurementDetail';
import JsonLd from '../../../../components/seo/JsonLd.jsx';
import { breadcrumbSchema, organizationSchema } from '../../../../lib/seo.js';

interface Props {
  params: Promise<{ slug: string }>;
}

async function getProcurementForMetadata(slug: string) {
  const apiBase = (
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'
  ).replace(/\/$/, '');

  const response = await fetch(`${apiBase}/procurement/${slug}`, { cache: 'no-store' });
  if (!response.ok) return null;
  const data = await response.json();
  if (!data || !data.data) return null;

  // Find matching procurement item
  const item = data.data;
  return item || null;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const item = await getProcurementForMetadata(slug);

  if (!item) {
    return { title: 'Procurement not found | Relief Nepal' };
  }

  const title = `${item.title} | Procurement`;
  const description =
    item.description ||
    `Procurement opportunity: ${item.title}. Reference: ${item.reference_number}`;

  return {
    title: `${title} | Relief Nepal`,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: item.attachment_url
        ? [{ url: item.attachment_url, width: 1200, height: 630, alt: item.title }]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: item.attachment_url ? [item.attachment_url] : [],
    },
    alternates: {
      canonical: `/procurement/${slug}`,
    },
  };
}

export default async function ProcurementDetailPage({ params }: Props) {
  const { slug } = await params;

  return (
    <>
      <JsonLd
        key="procurement-breadcrumb"
        data={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Get Involved', url: '/get-involved' },
          { name: 'Procurement', url: '/procurement' },
          { name: slug, url: `/procurement/${slug}` },
        ])}
      />
      <JsonLd key="procurement-org" data={organizationSchema} />
      <ProcurementDetail slug={decodeURIComponent(slug)} />
    </>
  );
}