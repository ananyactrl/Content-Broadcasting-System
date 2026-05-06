/**
 * Dashboard route group layout — applies the sidebar + topbar shell.
 */

import DashboardLayout from '@/src/layouts/DashboardLayout';

export default function DashboardGroupLayout({ children }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
