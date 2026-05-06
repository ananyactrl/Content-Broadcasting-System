/**
 * Teacher Dashboard — stats overview + recent uploads table.
 */

'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Upload, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import PageHeader from '@/src/components/common/PageHeader';
import StatsGrid from '@/src/components/dashboard/StatsGrid';
import ContentTable from '@/src/components/content/ContentTable';
import EmptyState from '@/src/components/common/EmptyState';
import { useMyContent } from '@/src/hooks/useContent';
import { useAuth } from '@/src/hooks/useAuth';
import { STATUS } from '@/src/utils/constants';

function getGreeting(name) {
  const hour = new Date().getHours();
  const salutation = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  return name ? `${salutation}, ${name.split(' ')[0]}` : salutation;
}

export default function TeacherDashboardPage() {
  const { data: content, isLoading, isError } = useMyContent();
  const { user } = useAuth();

  const stats = useMemo(() => {
    if (!content) return null;
    const pendingCount = content.filter((c) => c.status === STATUS.PENDING).length;
    return [
      {
        label: 'Total uploaded',
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

  const recentContent = useMemo(() => content?.slice(0, 5) ?? [], [content]);

  const pendingCount = content?.filter((c) => c.status === STATUS.PENDING).length ?? 0;
  const subtitle = content
    ? pendingCount > 0
      ? `${pendingCount} upload${pendingCount !== 1 ? 's' : ''} awaiting approval`
      : 'All your uploads are up to date'
    : 'Overview of your uploaded content';

  return (
    <div>
      <PageHeader
        title={getGreeting(user?.name)}
        subtitle={subtitle}
        action={
          <Link href="/dashboard/teacher/upload" className={buttonVariants({ size: 'sm' })}>
            <Upload className="w-4 h-4 mr-2" />
            Upload content
          </Link>
        }
      />

      <StatsGrid stats={stats ?? []} isLoading={isLoading} />

      <div>
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 tracking-wide">
          Recent uploads
        </h2>

        {isLoading ? (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-12 border-b border-slate-100 dark:border-slate-800 last:border-0 animate-pulse bg-slate-50 dark:bg-slate-800/50"
              />
            ))}
          </div>
        ) : isError ? (
          <p className="text-sm text-red-500">Failed to load content.</p>
        ) : recentContent.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No content yet"
            description="Upload your first piece of content to get started. It will appear here once submitted."
            action={
              <Link href="/dashboard/teacher/upload" className={buttonVariants({ size: 'sm' })}>
                Upload now
              </Link>
            }
          />
        ) : (
          <ContentTable items={recentContent} />
        )}
      </div>
    </div>
  );
}
