'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FolderOpen,
  Users,
  Building2,
  Newspaper,
  Mail,
  TrendingUp,
  TrendingDown,
  Target,
  Activity,
  Plus,
  ExternalLink,
  Edit,
} from 'lucide-react';
import { Card, CardHeader, CardContent, Badge, Button, Skeleton, EmptyState } from '@/components/ui';
import { AdminLayout, PageHeader } from '@/components/admin';
import { apiRequest } from '@/lib/api/client';
import { getAdminErrorMessage } from '@/lib/admin-feedback';
import { useToast } from '@/components/ui/Toast';
import '@/components/ui/design-tokens.css';

const STAT_CARDS = [
  { key: 'projects', label: 'Total Projects', icon: FolderOpen, color: 'brand', trend: null },
  { key: 'programs', label: 'Active Programs', icon: Target, color: 'brand', trend: null },
  { key: 'partners', label: 'Network Partners', icon: Building2, color: 'success', trend: null },
  { key: 'stories', label: 'Published Stories', icon: Newspaper, color: 'info', trend: null },
  { key: 'messages', label: 'Pending Messages', icon: Mail, color: 'warning', trend: null },
  { key: 'beneficiaries', label: 'Total Beneficiaries', icon: Users, color: 'brand', trend: null },
];

const RECENT_ACTIVITY_TYPES = {
  project_created: { icon: Plus, color: 'brand', label: 'Project created' },
  project_updated: { icon: Edit, color: 'info', label: 'Project updated' },
  story_published: { icon: Newspaper, color: 'success', label: 'Story published' },
  partner_added: { icon: Building2, color: 'brand', label: 'Partner added' },
  message_received: { icon: Mail, color: 'warning', label: 'Message received' },
  user_login: { icon: Activity, color: 'info', label: 'Admin login' },
};

function StatCard({ title, value, trend, icon: Icon, color = 'brand', loading = false }) {
  const colors = {
    brand: { bg: 'bg-brand-50', text: 'text-brand-600', iconBg: 'bg-brand-100', trend: 'text-brand-600' },
    success: { bg: 'bg-green-50', text: 'text-green-600', iconBg: 'bg-green-100', trend: 'text-green-600' },
    warning: { bg: 'bg-amber-50', text: 'text-amber-600', iconBg: 'bg-amber-100', trend: 'text-amber-600' },
    error: { bg: 'bg-red-50', text: 'text-red-600', iconBg: 'bg-red-100', trend: 'text-red-600' },
    info: { bg: 'bg-blue-50', text: 'text-blue-600', iconBg: 'bg-blue-100', trend: 'text-blue-600' },
  };

  const c = colors[color] || colors.brand;

  if (loading) {
    return (
      <Card className={c.bg} padding="md">
        <Skeleton variant="text" lines={3} className="h-20" />
      </Card>
    );
  }

  return (
    <Card className={`${c.bg} hover:shadow-md transition-shadow`} padding="md">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-secondary">{title}</p>
          <motion.div
            className="mt-2 text-3xl font-bold text-text-primary"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {value}
          </motion.div>
          {trend !== null && trend !== undefined && (
            <motion.div
              className={`mt-2 flex items-center gap-1 text-sm ${trend >= 0 ? c.trend : 'text-red-600'}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {trend >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span className="font-medium">{Math.abs(trend)}%</span>
              <span className="text-text-tertiary">vs last month</span>
            </motion.div>
          )}
        </div>
        <div className={`${c.iconBg} p-3 rounded-xl flex-shrink-0`}>
          <Icon className={`w-6 h-6 ${c.text}`} aria-hidden="true" />
        </div>
      </div>
    </Card>
  );
}

function ActivityItem({ activity }) {
  const typeConfig = RECENT_ACTIVITY_TYPES[activity.type] || { icon: Activity, color: 'brand', label: 'Activity' };
  const Icon = typeConfig.icon;
  const colors = {
    brand: 'text-brand-600 bg-brand-100',
    success: 'text-green-600 bg-green-100',
    warning: 'text-amber-600 bg-amber-100',
    error: 'text-red-600 bg-red-100',
    info: 'text-blue-600 bg-blue-100',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-start gap-3 p-3 hover:bg-bg-primary rounded-lg transition-colors"
    >
      <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${colors[typeConfig.color] || colors.brand}`}>
        <Icon className="w-5 h-5" aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary">{activity.description}</p>
        <p className="text-xs text-text-tertiary">{new Date(activity.created_at).toLocaleString()}</p>
      </div>
      <Badge variant="default" size="xs">{typeConfig.label}</Badge>
    </motion.div>
  );
}

function QuickActionButton({ label, href, icon: Icon, variant = 'secondary' }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => window.location.href = href}
      className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-all duration-200 ${
        variant === 'primary'
          ? 'bg-brand-600 text-white hover:bg-brand-700 border-brand-600'
          : 'bg-white text-text-secondary hover:bg-bg-primary hover:text-text-primary border-border-light'
      }`}
    >
      <Icon className="w-5 h-5" aria-hidden="true" />
      <span className="font-medium">{label}</span>
    </motion.button>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState({});
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState('');
  const { toast } = useToast();

  // Read initial data from server component
  useEffect(() => {
    if (typeof window !== 'undefined' && window.__DASHBOARD_INITIAL_DATA__) {
      setStats(window.__DASHBOARD_INITIAL_DATA__.stats || {});
      setActivities(window.__DASHBOARD_INITIAL_DATA__.activities || []);
      setLoading(false);
    }
  }, []);

  // Fallback fetch if no initial data
  useEffect(() => {
    if (loading && Object.keys(stats).length === 0) {
      const fetchData = async () => {
        try {
          const [statsRes, activitiesRes] = await Promise.all([
            apiRequest('/admin/dashboard/stats'),
            apiRequest('/admin/dashboard/activity?limit=10'),
          ]);
          setStats(statsRes);
          setActivities(activitiesRes);
        } catch (err) {
          setError(getAdminErrorMessage(err));
          toast({ title: 'Error', description: getAdminErrorMessage(err), type: 'error' });
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [loading, stats, toast]);

  const statValues = {
    projects: stats.total_projects ?? 0,
    programs: stats.active_programs ?? 0,
    partners: stats.network_partners ?? 0,
    stories: stats.published_stories ?? 0,
    messages: stats.pending_messages ?? 0,
    beneficiaries: stats.total_beneficiaries ?? 0,
  };

  return (
    <AdminLayout user={null} onSignOut={() => {}}>
      <PageHeader
        title="Dashboard"
        description="Here's what's happening across Relief Nepal today."
        breadcrumbs={[{ label: 'Dashboard', isActive: true }]}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-6">
        {STAT_CARDS.map((stat, index) => (
          <motion.div key={stat.key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
            <StatCard
              title={stat.label}
              value={statValues[stat.key]?.toLocaleString() || '—'}
              trend={stat.trend}
              icon={stat.icon}
              color={stat.color}
              loading={loading}
            />
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader title="Recent Activity" description="Latest actions across the platform" action={
              <Button variant="ghost" size="sm">View all</Button>
            } />
            <CardContent>
              {loading ? (
                <div className="space-y-3" role="status" aria-label="Loading activity">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton variant="list-item" key={i} />
                  ))}
                </div>
              ) : activities.length === 0 ? (
                <EmptyState illustration="activity" title="No recent activity" description="Activity will appear here as you manage content." size="sm" />
              ) : (
                <div className="space-y-1">
                  {activities.map((activity, index) => (
                    <ActivityItem key={activity.id || index} activity={activity} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <Card>
            <CardHeader title="Quick Actions" description="Common administrative tasks" />
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                <QuickActionButton label="Create Project" href="/admin/projects/new" icon={Plus} variant="primary" />
                <QuickActionButton label="Publish Story" href="/admin/stories/new" icon={Newspaper} />
                <QuickActionButton label="Add Partner" href="/admin/networks/new" icon={Building2} />
                <QuickActionButton label="Upload Report" href="/admin/reports/new" icon={ExternalLink} />
                <QuickActionButton label="View Messages" href="/admin/messages" icon={Mail} />
                <QuickActionButton label="Manage Team" href="/admin/team/new" icon={Users} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="System Status" description="Platform health overview" />
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-bg-primary">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-sm font-medium text-text-primary">API Server</span>
                  </div>
                  <Badge variant="success" size="sm">Operational</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-bg-primary">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-sm font-medium text-text-primary">Database</span>
                  </div>
                  <Badge variant="success" size="sm">Connected</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-bg-primary">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-sm font-medium text-text-primary">Storage</span>
                  </div>
                  <Badge variant="success" size="sm">{stats.storage_usage ? `${stats.storage_usage}% used` : 'Normal'}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-bg-primary">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="text-sm font-medium text-text-primary">Pending Reviews</span>
                  </div>
                  <Badge variant="warning" size="sm">{stats.pending_reviews ?? 0}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AdminLayout>
  );
}