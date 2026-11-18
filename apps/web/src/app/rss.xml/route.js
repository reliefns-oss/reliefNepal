import { siteConfig } from '../../lib/seo.js';

const apiBase = (
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'
).replace(/\/$/, '');

async function fetchNotices() {
  try {
    const response = await fetch(`${apiBase}/notices`, { cache: 'no-store' });
    if (!response.ok) return [];
    const payload = await response.json();
    return Array.isArray(payload?.data) ? payload.data : [];
  } catch {
    return [];
  }
}

async function fetchVacancies() {
  try {
    const response = await fetch(`${apiBase}/vacancies`, { cache: 'no-store' });
    if (!response.ok) return [];
    const payload = await response.json();
    return Array.isArray(payload?.data) ? payload.data : [];
  } catch {
    return [];
  }
}

async function fetchProjects() {
  try {
    const response = await fetch(`${apiBase}/projects`, { cache: 'no-store' });
    if (!response.ok) return [];
    const payload = await response.json();
    return Array.isArray(payload?.data) ? payload.data : [];
  } catch {
    return [];
  }
}

function formatRfc822Date(dateString) {
  if (!dateString) return new Date().toUTCString();
  const date = new Date(dateString);
  return date.toUTCString();
}

function escapeXml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const baseUrl = siteConfig.url;
  const [notices, vacancies, projects] = await Promise.all([
    fetchNotices(),
    fetchVacancies(),
    fetchProjects(),
  ]);

  // Combine all content items
  const items = [
    ...notices.map((notice) => ({
      title: notice.title,
      link: `${baseUrl}/notice/${encodeURIComponent(notice.slug)}`,
      description: notice.body?.slice(0, 500) || `Official notice: ${notice.title}`,
      pubDate: formatRfc822Date(notice.published_at),
      guid: `${baseUrl}/notice/${encodeURIComponent(notice.slug)}`,
      category: 'Notices',
    })),
    ...vacancies.map((vacancy) => ({
      title: vacancy.title,
      link: `${baseUrl}/vacancies/${encodeURIComponent(vacancy.slug)}`,
      description: vacancy.description?.slice(0, 500) || `Career opportunity: ${vacancy.title}`,
      pubDate: formatRfc822Date(vacancy.created_at),
      guid: `${baseUrl}/vacancies/${encodeURIComponent(vacancy.slug)}`,
      category: 'Vacancies',
    })),
    ...projects.map((project) => ({
      title: project.title,
      link: `${baseUrl}/projects/${encodeURIComponent(project.slug)}`,
      description: project.summary?.slice(0, 500) || `Learn about ${project.title} and Relief Nepal's work.`,
      pubDate: formatRfc822Date(project.created_at),
      guid: `${baseUrl}/projects/${encodeURIComponent(project.slug)}`,
      category: 'Projects',
    })),
  ]
    .filter((item) => item.pubDate)
    .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
    .slice(0, 50);

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(siteConfig.name)} - Latest Updates</title>
    <link>${baseUrl}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>en-NP</language>
    <copyright>Copyright ${new Date().getFullYear()} ${escapeXml(siteConfig.name)}</copyright>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${baseUrl}/images/logo.jpg</url>
      <title>${escapeXml(siteConfig.name)}</title>
      <link>${baseUrl}</link>
      <width>144</width>
      <height>144</height>
    </image>
    ${items.map((item) => `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <guid isPermaLink="true">${escapeXml(item.guid)}</guid>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${item.pubDate}</pubDate>
      <category>${escapeXml(item.category)}</category>
      <dc:creator>${escapeXml(siteConfig.name)}</dc:creator>
    </item>
    `).join('')}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
    },
  });
}