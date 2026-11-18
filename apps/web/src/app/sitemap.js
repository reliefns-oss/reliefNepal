export const dynamic = 'force-dynamic';

export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://reliefnepal.org.np';
  const now = new Date();

  const staticEntries = [
    { path: '', changefreq: 'weekly', priority: 1.0 },
    { path: '/about', changefreq: 'monthly', priority: 0.8 },
    { path: '/projects', changefreq: 'weekly', priority: 0.9 },
    { path: '/impact', changefreq: 'monthly', priority: 0.8 },
    { path: '/gallery', changefreq: 'weekly', priority: 0.7 },
    { path: '/stories', changefreq: 'weekly', priority: 0.7 },
    { path: '/notice', changefreq: 'daily', priority: 0.8 },
    { path: '/vacancies', changefreq: 'daily', priority: 0.8 },
    { path: '/contact', changefreq: 'monthly', priority: 0.6 },
    { path: '/transparency', changefreq: 'monthly', priority: 0.5 },
    { path: '/get-involved', changefreq: 'monthly', priority: 0.7 },
    { path: '/get-involved/membership', changefreq: 'monthly', priority: 0.6 },
    { path: '/programs', changefreq: 'monthly', priority: 0.7 },
    { path: '/network', changefreq: 'monthly', priority: 0.7 },
    { path: '/government-actions', changefreq: 'monthly', priority: 0.7 },
  ].map(({ path, changefreq, priority }) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: changefreq,
    priority,
  }));

  let partners = [];
  const apiBase = (
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'
  ).replace(/\/$/, '');
  try {
    const response = await fetch(`${apiBase}/networks`, { cache: 'no-store' });
    if (response.ok) {
      const payload = await response.json();
      partners = Array.isArray(payload?.data) ? payload.data : [];
    }
  } catch {
    // Keep the static sitemap available if the content API is temporarily offline.
  }

  const partnerEntries = partners
    .filter((partner) => partner.slug)
    .map((partner) => ({
      url: `${base}/network/${encodeURIComponent(partner.slug)}`,
      lastModified: partner.updated_at || partner.created_at || now,
      changeFrequency: 'monthly',
      priority: 0.5,
    }));

  // Add dynamic project routes
  let projects = [];
  try {
    const response = await fetch(`${apiBase}/projects`, { cache: 'no-store' });
    if (response.ok) {
      const payload = await response.json();
      projects = Array.isArray(payload?.data) ? payload.data : [];
    }
  } catch {
    // Keep the static sitemap available if the content API is temporarily offline.
  }

  const projectEntries = projects
    .filter((project) => project.slug)
    .map((project) => ({
      url: `${base}/projects/${encodeURIComponent(project.slug)}`,
      lastModified: project.updated_at || project.created_at || now,
      changeFrequency: 'monthly',
      priority: 0.6,
    }));

  // Add dynamic gallery routes
  let galleryProjects = [];
  try {
    const response = await fetch(`${apiBase}/gallery`, { cache: 'no-store' });
    if (response.ok) {
      const payload = await response.json();
      const items = Array.isArray(payload?.data) ? payload.data : [];
      const projectMap = new Map();
      items.forEach((item) => {
        if (item.project?.slug && !projectMap.has(item.project.slug)) {
          projectMap.set(item.project.slug, {
            slug: item.project.slug,
            updated_at: item.updated_at || item.project.updated_at,
          });
        }
      });
      galleryProjects = [...projectMap.values()];
    }
  } catch {
    // Keep the static sitemap available if the content API is temporarily offline.
  }

  const galleryEntries = galleryProjects
    .filter((project) => project.slug)
    .map((project) => ({
      url: `${base}/gallery/${encodeURIComponent(project.slug)}`,
      lastModified: project.updated_at || now,
      changeFrequency: 'monthly',
      priority: 0.5,
    }));

  // Add dynamic notice routes
  let notices = [];
  try {
    const response = await fetch(`${apiBase}/notices`, { cache: 'no-store' });
    if (response.ok) {
      const payload = await response.json();
      notices = Array.isArray(payload?.data) ? payload.data : [];
    }
  } catch {
    // Keep the static sitemap available if the content API is temporarily offline.
  }

  const noticeEntries = notices
    .filter((notice) => notice.slug)
    .map((notice) => ({
      url: `${base}/notice/${encodeURIComponent(notice.slug)}`,
      lastModified: notice.updated_at || notice.published_at || notice.created_at || now,
      changeFrequency: 'yearly',
      priority: 0.4,
    }));

  // Add dynamic vacancy routes
  let vacancies = [];
  try {
    const response = await fetch(`${apiBase}/vacancies`, { cache: 'no-store' });
    if (response.ok) {
      const payload = await response.json();
      vacancies = Array.isArray(payload?.data) ? payload.data : [];
    }
  } catch {
    // Keep the static sitemap available if the content API is temporarily offline.
  }

  const vacancyEntries = vacancies
    .filter((vacancy) => vacancy.slug)
    .map((vacancy) => ({
      url: `${base}/vacancies/${encodeURIComponent(vacancy.slug)}`,
      lastModified: vacancy.updated_at || vacancy.created_at || now,
      changeFrequency: 'yearly',
      priority: 0.4,
    }));

  let governmentActions = [];
  try {
    const response = await fetch(`${apiBase}/government-actions`, { cache: 'no-store' });
    if (response.ok) {
      const payload = await response.json();
      governmentActions = Array.isArray(payload?.data) ? payload.data : [];
    }
  } catch {
    // Keep the static sitemap available if the content API is temporarily offline.
  }

  const governmentActionEntries = governmentActions
    .filter((action) => action.slug)
    .map((action) => ({
      url: `${base}/government-actions/${encodeURIComponent(action.slug)}`,
      lastModified: action.updated_at || action.published_at || action.created_at || now,
      changeFrequency: 'yearly',
      priority: 0.5,
    }));

  return [
    ...staticEntries,
    ...partnerEntries,
    ...projectEntries,
    ...galleryEntries,
    ...noticeEntries,
    ...vacancyEntries,
    ...governmentActionEntries,
  ];
}