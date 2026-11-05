import { apiRequest } from '@/lib/api/client';

export default async function DashboardPage() {
  const [stats, activities] = await Promise.all([
    apiRequest('/admin/dashboard/stats').catch(() => ({})),
    apiRequest('/admin/dashboard/activity?limit=10').catch(() => []),
  ]);

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.__DASHBOARD_INITIAL_DATA__ = {
              stats: ${JSON.stringify(stats)},
              activities: ${JSON.stringify(activities)},
            };
          `,
        }}
      />
    </>
  );
}