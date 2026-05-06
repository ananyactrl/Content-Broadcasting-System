/**
 * Navbar — top bar with mobile hamburger, page context, and user info.
 */

'use client';

import PropTypes from 'prop-types';
import { Menu, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/src/hooks/useAuth';
import { Button } from '@/components/ui/button';

export default function Navbar({ onMenuClick }) {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-14 flex items-center px-4 gap-4">
      {/* Mobile hamburger */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-1.5 rounded-md text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        aria-label="Open navigation"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Dark mode toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        aria-label="Toggle theme"
        className="w-8 h-8"
      >
        <Sun className="w-4 h-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute w-4 h-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </Button>

      {/* User avatar */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-slate-100 flex items-center justify-center">
          <span className="text-xs font-semibold text-white dark:text-slate-900">
            {initials}
          </span>
        </div>
        <div className="hidden sm:block">
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100 leading-none">
            {user?.name ?? 'User'}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 capitalize">
            {user?.role ?? ''}
          </p>
        </div>
      </div>
    </header>
  );
}

Navbar.propTypes = {
  onMenuClick: PropTypes.func.isRequired,
};
