/**
 * Sidebar — role-aware navigation panel.
 *
 * On desktop: fixed left column (w-64).
 * On mobile: slide-over controlled by parent via isOpen/onClose props.
 */

'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import {
  LayoutDashboard,
  Upload,
  FileText,
  CheckSquare,
  List,
  X,
  LogOut,
  Radio,
} from 'lucide-react';
import { useAuth } from '@/src/hooks/useAuth';
import { logout } from '@/src/services/auth.service';
import { ROLES } from '@/src/utils/constants';
import { cn } from '@/lib/utils';

const TEACHER_NAV = [
  { href: '/dashboard/teacher', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/teacher/upload', label: 'Upload Content', icon: Upload },
  { href: '/dashboard/teacher/my-content', label: 'My Content', icon: FileText },
];

const PRINCIPAL_NAV = [
  { href: '/dashboard/principal', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/principal/approvals', label: 'Pending Approvals', icon: CheckSquare },
  { href: '/dashboard/principal/all-content', label: 'All Content', icon: List },
];

function NavItem({ href, label, icon: Icon, exact }) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
        isActive
          ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
      )}
    >
      <Icon className="w-4 h-4 shrink-0" />
      {label}
    </Link>
  );
}

NavItem.propTypes = {
  href: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  exact: PropTypes.bool,
};

export default function Sidebar({ isOpen, onClose }) {
  const { role, token, clearAuth } = useAuth();
  const router = useRouter();

  const navItems = role === ROLES.PRINCIPAL ? PRINCIPAL_NAV : TEACHER_NAV;

  const handleLogout = useCallback(async () => {
    try {
      await logout(token);
    } catch {
      // Proceed with local logout even if server call fails
    }
    clearAuth();
    // Clear middleware cookies
    document.cookie = 'cbs-token=; path=/; max-age=0';
    document.cookie = 'cbs-role=; path=/; max-age=0';
    router.push('/login');
  }, [token, clearAuth, router]);

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-slate-900 dark:bg-slate-100 flex items-center justify-center">
            <Radio className="w-4 h-4 text-white dark:text-slate-900" />
          </div>
          <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm tracking-tight">
            BroadcastEd
          </span>
        </div>
        {/* Close button — mobile only */}
        <button
          onClick={onClose}
          className="lg:hidden p-1 rounded text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
          aria-label="Close sidebar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Role label */}
      <div className="px-4 pt-4 pb-2">
        <span className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          {role === ROLES.PRINCIPAL ? 'Principal' : 'Teacher'}
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile slide-over */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-30 flex flex-col transition-transform duration-200 lg:hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
