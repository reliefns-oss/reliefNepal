'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Briefcase,
  Users,
  Image,
  Newspaper,
  Building2,
  UserCheck,
  FileStack,
  Banknote,
  Shield,
  Settings,
  Activity,
  BarChart3,
  ChevronRight,
  Menu,
  LogOut,
  MapPin,
  Mail,
} from 'lucide-react';
import { Button, Tooltip, Badge } from '@/components/ui';
import '@/components/ui/design-tokens.css';

const navigation = [
  {
    group: 'OVERVIEW',
    items: [
      { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    ],
  },
  {
    group: 'CONTENT MANAGEMENT',
    items: [
      { href: '/admin/pages', label: 'Pages', icon: FileText, badge: null },
      { href: '/admin/about', label: 'About Us', icon: Users, badge: null },
      { href: '/admin/work', label: 'Our Work', icon: Briefcase, badge: null },
      { href: '/admin/projects', label: 'Projects & Programs', icon: FolderOpen, badge: null },
      { href: '/admin/stories', label: 'Stories & News', icon: Newspaper, badge: null },
      { href: '/admin/networks', label: 'Partners & Networks', icon: Building2, badge: null },
      { href: '/admin/impact', label: 'Impact & Statistics', icon: BarChart3, badge: null },
      { href: '/admin/gallery', label: 'Gallery / Media', icon: Image, badge: null },
    ],
  },
  {
    group: 'ORGANIZATION',
    items: [
      { href: '/admin/team', label: 'Team Members', icon: UserCheck, badge: null },
      { href: '/admin/offices', label: 'Office Locations', icon: MapPin, badge: null },
      { href: '/admin/messages', label: 'Contact Messages', icon: Mail, badge: null },
    ],
  },
  {
    group: 'TRANSPARENCY',
    items: [
      { href: '/admin/reports/annual', label: 'Annual Reports', icon: FileStack, badge: null },
      { href: '/admin/reports/financial', label: 'Financial Reports', icon: Banknote, badge: null },
      { href: '/admin/policies', label: 'Policies & Documents', icon: Shield, badge: null },
    ],
  },
  {
    group: 'SYSTEM',
    items: [
      { href: '/admin/users', label: 'Users & Roles', icon: Users, badge: null },
      { href: '/admin/activity', label: 'Activity Logs', icon: Activity, badge: null },
      { href: '/admin/settings', label: 'Settings', icon: Settings, badge: null },
    ],
  },
];

export function Sidebar({ collapsed = false, _onToggle, className = '' }) {
  const pathname = usePathname();

  const isActive = (href) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <motion.aside
      className={`fixed left-0 top-0 z-[300] h-full bg-white border-r border-border-light transition-all duration-300 ease-in-out ${collapsed ? 'w-[72px]' : 'w-[280px]'} ${className}`}
      style={{ height: 'calc(100vh - 64px)', top: '64px' }}
      initial={false}
      animate={{ width: collapsed ? 72 : 280 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    >
      <div className="flex flex-col h-full overflow-y-auto scrollbar-thin">
        {!collapsed && (
          <div className="p-4 border-b border-border-light">
            <Link href="/admin" className="flex items-center gap-3" aria-label="Relief Nepal Admin">
              <div className="w-10 h-10 rounded-lg bg-brand-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-text-primary truncate">Relief Nepal</p>
                <p className="text-xs text-text-tertiary truncate">Admin Dashboard</p>
              </div>
            </Link>
          </div>
        )}

        <nav className="flex-1 p-3" aria-label="Main navigation">
          {navigation.map((section, sectionIndex) => (
            <motion.div
              key={section.group}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.05 }}
              className="mb-6"
            >
              {!collapsed && (
                <div
                  className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-text-quaternary"
                >
                  {section.group}
                </div>
              )}
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <li key={item.href}>
                      <Tooltip content={collapsed ? item.label : ''} position="right" delay={200}>
                        <Link
                          href={item.href}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                            active
                              ? 'bg-brand-50 text-brand-700'
                              : 'text-text-secondary hover:bg-bg-primary hover:text-text-primary'
                          } ${collapsed ? 'justify-center' : ''}`}
                          aria-current={active ? 'page' : undefined}
                          title={collapsed ? item.label : undefined}
                        >
                          <span className="w-5 h-5 flex-shrink-0" aria-hidden="true">
                            <item.icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
                          </span>
                          {!collapsed && (
                            <>
                              <span className="font-medium truncate">{item.label}</span>
                              {item.badge && (
                                <Badge variant="primary" size="xs" className="ml-auto">
                                  {item.badge}
                                </Badge>
                              )}
                            </>
                          )}
                        </Link>
                      </Tooltip>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          ))}
        </nav>

        <div className="p-3 border-t border-border-light">
          <Tooltip content={collapsed ? 'Sign out' : ''} position="right" delay={200}>
            <button
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-all duration-200 text-text-secondary hover:bg-red-50 hover:text-red-600 ${collapsed ? 'justify-center' : ''}`}
              onClick={() => { /* sign out logic */ }}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
              {!collapsed && <span className="font-medium">Sign out</span>}
            </button>
          </Tooltip>
        </div>
      </div>
    </motion.aside>
  );
}

export function SidebarTrigger({ collapsed, onToggle }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onToggle}
      aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      aria-expanded={!collapsed}
      className="lg:hidden"
    >
      {collapsed ? <ChevronRight className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
    </Button>
  );
}

export function MobileSidebar({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[299] bg-black/40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.aside
            className="fixed left-0 top-0 z-[300] h-full w-[280px] bg-white border-r border-border-light lg:hidden"
            style={{ height: 'calc(100vh - 64px)', top: '64px' }}
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            <Sidebar collapsed={false} onToggle={onClose} />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}