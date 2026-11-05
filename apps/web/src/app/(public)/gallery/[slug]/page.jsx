import { ProjectGallery } from '../gallery-browser.jsx';
import JsonLd from '../../../../components/seo/JsonLd.jsx';
import { breadcrumbSchema, organizationSchema } from '../../../../lib/seo.js';

const apiBase = (
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'
).replace(/\/$/, '');

async function getProjectForGallery(slug) {
  const response = await fetch(
    `${apiBase}/gallery`,
    { cache: 'no-store' },
  );
  if (!response.ok) return null;
  const payload = await response.json();
  const items = payload?.data;
  if (!Array.isArray(items)) return null;
  const projectItems = items.filter(
    (item) => item.project?.slug?.toLowerCase() === slug.toLowerCase(),
  );
  return projectItems[0]?.project || null;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = await getProjectForGallery(slug);

  if (!project) {
    return { title: 'Gallery not found | Relief Nepal' };
  }

  const title = `${project.title} Gallery`;
  const description = project.summary || `Photos, videos and field stories from ${project.title}.`;

  return {
    title: `${title} | Relief Nepal`,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: project.banner_url ? [{ url: project.banner_url, width: 1200, height: 630, alt: project.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: project.banner_url ? [project.banner_url] : [],
    },
    alternates: {
      canonical: `/gallery/${slug}`,
    },
  };
}

export default async function ProjectGalleryPage({ params }) {
  const { slug } = await params;
  const project = await getProjectForGallery(slug);

  if (!project) {
    return (
      <>
        <JsonLd key="gallery-breadcrumb" data={breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Gallery', url: '/gallery' }])} />
        <JsonLd key="gallery-org" data={organizationSchema} />
      </>
    );
  }

  return (
    <>
      <JsonLd key="gallery-breadcrumb" data={breadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Gallery', url: '/gallery' },
        { name: project.title, url: `/gallery/${slug}` }
      ])} />
      <JsonLd key="gallery-org" data={organizationSchema} />
      <ProjectGallery slug={decodeURIComponent(slug)} />
    </>
  );
}