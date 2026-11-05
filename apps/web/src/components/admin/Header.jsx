'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronDown,
  Bell,
  Search,
  User,
  LogOut,
  Settings,
  HelpCircle,
  LayoutDashboard,
  Plus,
} from 'lucide-react';
import { Button, Avatar, Badge, Input } from '@/components/ui';
import '@/components/ui/design-tokens.css';

const userMenuItems = [
  { label: 'Profile', href: '/admin/profile', icon: User },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
  { type: 'divider' },
  { label: 'Help & Support', href: '/admin/help', icon: HelpCircle },
  { type: 'divider' },
  { label: 'Sign out', icon: LogOut, variant: 'danger', action: 'signout' },
];

const notificationItems = [
  { label: 'New project created', time: '2 min ago', unread: true, href: '/admin/projects/1' },
  { label: 'Story published successfully', time: '15 min ago', unread: true, href: '/admin/stories/5' },
  { label: 'New contact message received', time: '1 hour ago', unread: false, href: '/admin/messages' },
  { label: 'Monthly report generated', time: '3 hours ago', unread: false, href: '/admin/reports' },
];

export function Header({ sidebarCollapsed, onToggleSidebar, user, onSignOut, className = '' }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const notificationsRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const breadcrumbs = pathname.split('/').filter(Boolean);
  const breadcrumbItems = breadcrumbs.map((segment, index) => {
    const href = '/' + breadcrumbs.slice(0, index + 1).join('/');
    const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
    return { href, label, isActive: index === breadcrumbs.length - 1 };
  });

  return (
    <header className={`fixed top-0 left-0 right-0 z-[200] h-16 bg-white/95 backdrop-blur-sm border-b border-border-light transition-all duration-300 ${className}`} style={{ left: sidebarCollapsed ? '72px' : '280px' }}>
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="lg:hidden"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>

          <nav className="hidden sm:flex items-center gap-1" aria-label="Breadcrumb">
            <Link href="/admin" className="flex items-center gap-1 px-2 py-1.5 text-sm text-text-tertiary hover:text-text-primary rounded-lg transition-colors" aria-label="Dashboard">
              <LayoutDashboard className="w-4 h-4" />
            </Link>
            {breadcrumbItems.map((item, _index) => (
              <span key={item.href} className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-text-quaternary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                {item.isActive ? (
                  <span className="px-2 py-1.5 text-sm font-medium text-text-primary truncate max-w-[150px]">{item.label}</span>
                ) : (
                  <Link href={item.href} className="px-2 py-1.5 text-sm text-text-secondary hover:text-text-primary rounded-lg transition-colors truncate max-w-[150px]">{item.label}</Link>
                )}
              </span>
            ))}
          </nav>

          <div className="hidden lg:block flex-1 max-w-md mx-4">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search projects, stories, partners..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
                leftIcon={<Search className="w-4 h-4" />}
                size="sm"
                className="w-full"
              />
              {searchOpen && searchQuery && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg border border-border-light shadow-lg overflow-hidden z-[100]"
                >
                  <div className="p-2 space-y-1">
                    <p className="px-2 py-1.5 text-sm text-text-tertiary">No results for &ldquo;{searchQuery}&rdquo;</p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="hidden sm:flex" onClick={() => { /* create new */ }}>
            <Plus className="w-4 h-4" />
            <span>New</span>
          </Button>

          <div ref={notificationsRef} className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              aria-label={`Notifications${notificationItems.filter(n => n.unread).length > 0 ? `, ${notificationItems.filter(n => n.unread).length} unread` : ''}`}
              aria-expanded={notificationsOpen}
            >
              <span className="relative">
                <Bell className="w-5 h-5" />
                {notificationItems.filter(n => n.unread).length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-xs font-semibold flex items-center justify-center">
                    {notificationItems.filter(n => n.unread).length > 9 ? '9+' : notificationItems.filter(n => n.unread).length}
                  </span>
                )}
              </span>
            </Button>

            <AnimatePresence>
              {notificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                  className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg border border-border-light shadow-lg overflow-hidden z-[100]"
                  role="menu"
                >
                  <div className="p-3 border-b border-border-light flex items-center justify-between">
                    <h3 className="font-semibold text-text-primary">Notifications</h3>
                    <Button variant="ghost" size="xs">Mark all read</Button>
                  </div>
                  <div className="max-h-80 overflow-auto">
                    {notificationItems.map((notification, _index) => (
                      <Link
                        key={notification.href}
                        href={notification.href}
                        className={`flex items-start gap-3 p-3 hover:bg-bg-primary transition-colors ${notification.unread ? 'bg-blue-50/50' : ''}`}
                        role="menuitem"
                      >
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${notification.unread ? 'bg-brand-500' : 'bg-text-quaternary'}`} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${notification.unread ? 'font-medium text-text-primary' : 'text-text-secondary'}`}>{notification.label}</p>
                          <p className="text-xs text-text-tertiary">{notification.time}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="p-3 border-t border-border-light">
                    <Link href="/admin/notifications" className="text-sm font-medium text-brand-600 hover:text-brand-700 block text-center">View all notifications</Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div ref={userMenuRef} className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-bg-primary transition-colors"
              aria-label="User menu"
              aria-expanded={userMenuOpen}
            >
              <Avatar
                src={user?.photo_url}
                name={user?.display_name || user?.email}
                size="sm"
                status="online"
              />
              <span className="hidden sm:block text-sm font-medium text-text-primary">{user?.display_name || 'Admin'}</span>
              <ChevronDown className="w-4 h-4 text-text-tertiary hidden sm:block" />
            </button>

            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg border border-border-light shadow-lg overflow-hidden z-[100]"
                  role="menu"
                >
                  <div className="p-3 border-b border-border-light">
                    <p className="font-medium text-text-primary truncate">{user?.display_name || 'Admin'}</p>
                    <p className="text-xs text-text-tertiary truncate">{user?.email}</p>
                    <Badge variant="primary" size="xs" className="mt-1 inline-block">{user?.role || 'Admin'}</Badge>
                  </div>
                  <div className="py-1">
                    {userMenuItems.map((item, _index) => (
                      <button
                        key={item.label}
                        onClick={() => { if (item.action === 'signout') onSignOut?.(); else if (item.href) window.location.href = item.href; setUserMenuOpen(false); }}
                        className={`w-full px-3 py-2 text-sm text-left flex items-center gap-3 transition-colors hover:bg-bg-primary ${item.variant === 'danger' ? 'text-red-600' : 'text-text-primary'} ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        role="menuitem"
                        disabled={item.disabled}
                      >
                        {item.icon && <span className="w-5 h-5 flex-shrink-0" aria-hidden="true"><item.icon className="w-5 h-5" /></span>}
                        {item.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}