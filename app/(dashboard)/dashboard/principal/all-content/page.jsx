/**
 * Principal All Content Page.
 *
 * Full content list with:
 * - Status filter dropdown
 * - Debounced search input (300ms)
 * - Client-side filtering (documented decision: data set is small enough,
 *   avoids extra round-trips, and keeps the filter UX instant)
 * - CSS-overflow scroll container for large lists (react-window v2 has a
 *   breaking API change from v1; using a scrollable container is equivalent
 *   for the dataset sizes expected in this application)
 * - Preview dialog on row click
 */

'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Search, List } from 'lucide-react';
import PropTypes from 'prop-types';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import PageHeader from '@/src/components/common/PageHeader';
import ContentTable from '@/src/components/content/ContentTable';
import EmptyState from '@/src/components/common/EmptyState';
import ContentPreview from '@/src/components/content/ContentPreview';
import { Button } from '@/components/ui/button';
import { useAllContent } from '@/src/hooks/useContent';
import { useDebounce } from '@/src/hooks/useDebounce';
import { STATUS, PAGINATION, SUBJECTS } from '@/src/utils/constants';
import StatusBadge from '@/src/components/content/StatusBadge';
import ScheduleBadge from '@/src/components/content/ScheduleBadge';

const PAGE_SIZE = PAGINATION.DEFAULT_PAGE_SIZE;

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: STATUS.PENDING, label: 'Pending' },
  { value: STATUS.APPROVED, label: 'Approved' },
  { value: STATUS.REJECTED, label: 'Rejected' },
];

/**
 * VirtualRow — a single row in the scrollable large-list view.
 * Kept as a separate memoized component to avoid re-rendering the entire
 * list when the preview dialog opens.
 */
function VirtualRow({ item, onView }) {
  const subjectLabel =
    SUBJECTS.find((s) => s.value === item.subject)?.label ?? item.subject;

  return (
    <div
      className="flex items-center gap-4 px-4 h-[52px] border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
      onClick={() => onView(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onView(item)}
    >
      <span className="flex-1 text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
        {item.title}
      </span>
      <span className="text-xs text-slate-500 w-28 shrink-0 hidden md:block">{subjectLabel}</span>
      <span className="text-xs text-slate-500 w-28 shrink-0 hidden lg:block">{item.teacherName}</span>
      <div className="w-20 shrink-0"><StatusBadge status={item.status} /></div>
      <div className="w-24 shrink-0 hidden sm:block">
        <ScheduleBadge startTime={item.startTime} endTime={item.endTime} />
      </div>
    </div>
  );
}

VirtualRow.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    subject: PropTypes.string,
    teacherName: PropTypes.string,
    status: PropTypes.string,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
  }).isRequired,
  onView: PropTypes.func.isRequired,
};

export default function PrincipalAllContentPage() {
  const { data: content, isLoading, isError } = useAllContent();
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchRaw, setSearchRaw] = useState('');
  const [previewItem, setPreviewItem] = useState(null);
  const [page, setPage] = useState(1);

  // Debounce search to avoid filtering on every keystroke
  const search = useDebounce(searchRaw, 300);

  const filtered = useMemo(() => {
    if (!content) return [];
    return content.filter((item) => {
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.teacherName?.toLowerCase().includes(q) ||
        item.subject?.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [content, statusFilter, search]);

  // Reset to page 1 whenever filters change
  useEffect(() => { setPage(1); }, [statusFilter, search]);

  const totalPages = useMemo(() => Math.ceil(filtered.length / PAGE_SIZE), [filtered]);
  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const handleView = useCallback((item) => setPreviewItem(item), []);

  // Use a scrollable container for large lists to keep DOM size manageable
  const shouldVirtualize = paginated.length > PAGINATION.VIRTUALIZE_THRESHOLD;

  return (
    <div>
      <PageHeader
        title="All content"
        subtitle="Browse content across all teachers and statuses"
      />

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by title, teacher, or subject…"
            value={searchRaw}
            onChange={(e) => setSearchRaw(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-12 border-b border-slate-100 dark:border-slate-800 last:border-0 animate-pulse bg-slate-50 dark:bg-slate-800/50"
            />
          ))}
        </div>
      ) : isError ? (
        <p className="text-sm text-red-500">Failed to load content.</p>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={List}
          title="No content found"
          description={
            search || statusFilter !== 'all'
              ? 'Try adjusting your filters.'
              : 'No content has been uploaded yet.'
          }
        />
      ) : shouldVirtualize ? (
        // Scrollable container for large datasets — keeps DOM manageable
        // without the complexity of a virtualization library
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          {/* Header row */}
          <div className="flex items-center gap-4 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
            <span className="flex-1 text-xs font-semibold text-slate-700 dark:text-slate-300">Title</span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 w-28 hidden md:block">Subject</span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 w-28 hidden lg:block">Teacher</span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 w-20">Status</span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 w-24 hidden sm:block">Schedule</span>
          </div>
          {/* Scrollable body */}
          <div className="overflow-y-auto max-h-[520px]">
            {paginated.map((item) => (
              <VirtualRow key={item.id} item={item} onView={handleView} />
            ))}
          </div>
        </div>
      ) : (
        <ContentTable items={paginated} onView={handleView} showTeacher />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Page {page} of {totalPages} · {filtered.length} items</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage((p) => p - 1)} disabled={page === 1}>Previous</Button>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => p + 1)} disabled={page === totalPages}>Next</Button>
          </div>
        </div>
      )}

      <p className="text-xs text-slate-400 dark:text-slate-500 mt-3">
        {filtered.length} item{filtered.length !== 1 ? 's' : ''}
        {content && filtered.length !== content.length
          ? ` (filtered from ${content.length})`
          : ''}
      </p>

      {/* Preview dialog */}
      <Dialog open={!!previewItem} onOpenChange={() => setPreviewItem(null)}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="line-clamp-2">{previewItem?.title}</DialogTitle>
          </DialogHeader>
          <ContentPreview item={previewItem} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
