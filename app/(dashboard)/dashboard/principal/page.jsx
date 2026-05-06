/**
 * Principal Dashboard — stats + quick-link cards.
 */

'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { CheckSquare, List, Clock, CheckCircle, XCircle, FileText } from 'lucide-react';
import PageHeader from '@/src/components/common/PageHeader';
import StatsGrid from '@/src/components/dashboard/StatsGrid';
import { useAllContent } from '@/src/hooks/useContent';
import { useAuth } from '@/src/hooks/useAuth';
import { STATUS } from '@/src/utils/constants';

function getGreeting(name) {
  const hour = new Date().getHours();
  const salutation = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  return name ? `${salutation}, ${name.split(' ')[0]}` : salutation;
}

function QuickLinkCard({ href, icon: Icon, title, description, count }) {
  return (
    <Link
      href={href}
      className="group block bg-white dark:bg-slate-900/80 rounded-xl border border-slate-200/80 dark:border-slate-800 p-5 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
          <Icon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </div>
        {count !== undefined && count > 0 && (
          <span className="text-xs font-bold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800">
            {count}
          </span>
        )}
      </div>
      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">{title}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
    </Link>
  );
}

QuickLinkCard.propTypes = {
  href: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  count: PropTypes.number,
};

export default function PrincipalDashboardPage() {
  const { data: content, isLoading } = useAllContent();
  const { user } = useAuth();

  const stats = useMemo(() => {
    if (!content) return null;
    const pendingCount = content.filter((c) => c.status === STATUS.PENDING).length;
    return [
      {
        label: 'Total content',
        value: content.length,
        icon: FileText,
        colorClass: 'bg-slate-100 dark:bg-slate-800',
        accentColor: 'slate',
      },
      {
        label: 'Pending review',
        value: pendingCount,
        icon: Clock,
        colorClass: 'bg-amber-50 dark:bg-amber-900/20',
        accentColor: 'amber',
      },
      {
        label: 'Approved',
        value: content.filter((c) => c.status === STATUS.APPROVED).length,
        icon: CheckCircle,
        colorClass: 'bg-emerald-50 dark:bg-emerald-900/20',
        accentColor: 'emerald',
      },
      {
        label: 'Rejected',
        value: content.filter((c) => c.status === STATUS.REJECTED).length,
        icon: XCircle,
        colorClass: 'bg-rose-50 dark:bg-rose-900/20',
        accentColor: 'rose',
      },
    ];
  }, [content]);

  const pendingCount = useMemo(
    () => content?.filter((c) => c.status === STATUS.PENDING).length ?? 0,
    [content]
  );

  const subtitle = content
    ? pendingCount > 0
      ? `${pendingCount} item${pendingCount !== 1 ? 's' : ''} pending review`
      : 'All content is up to date'
    : 'Content approval overview';

  return (
    <div>
      <PageHeader
        title={getGreeting(user?.name)}
        subtitle={subtitle}
      />

      <StatsGrid stats={stats ?? []} isLoading={isLoading} />

      <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 tracking-wide">
        Quick actions
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <QuickLinkCard
          href="/dashboard/principal/approvals"
          icon={CheckSquare}
          title="Pending approvals"
          description="Review and approve or reject submitted content from teachers."
          count={pendingCount}
        />
        <QuickLinkCard
          href="/dashboard/principal/all-content"
          icon={List}
          title="All content"
          description="Browse all content across every status and teacher."
        />
      </div>
    </div>
  );
}
