/**
 * Teacher My Content Page — paginated list of the teacher's own content.
 *
 * Shows rejection reason inline when status is Rejected.
 * Uses ContentTable for the list and a Dialog for full preview.
 */

'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Upload, FileText } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import PageHeader from '@/src/components/common/PageHeader';
import ContentTable from '@/src/components/content/ContentTable';
import ContentPreview from '@/src/components/content/ContentPreview';
import EmptyState from '@/src/components/common/EmptyState';
import { useMyContent } from '@/src/hooks/useContent';
import { PAGINATION } from '@/src/utils/constants';

const PAGE_SIZE = PAGINATION.DEFAULT_PAGE_SIZE;

export default function TeacherMyContentPage() {
  const { data: content, isLoading, isError } = useMyContent();
  const [page, setPage] = useState(1);
  const [previewItem, setPreviewItem] = useState(null);

  const paginated = useMemo(() => {
    if (!content) return [];
    const start = (page - 1) * PAGE_SIZE;
    return content.slice(start, start + PAGE_SIZE);
  }, [content, page]);

  const totalPages = useMemo(
    () => Math.ceil((content?.length ?? 0) / PAGE_SIZE),
    [content]
  );

  const handleView = useCallback((item) => setPreviewItem(item), []);
  const handleClosePreview = useCallback(() => setPreviewItem(null), []);

  return (
    <div>
      <PageHeader
        title="My content"
        subtitle="All content you've uploaded"
        action={
          <Link href="/dashboard/teacher/upload" className={buttonVariants({ size: 'sm' })}>
            <Upload className="w-4 h-4 mr-2" />
            Upload new
          </Link>
        }
      />

      {isLoading ? (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-12 border-b border-slate-100 dark:border-slate-800 last:border-0 animate-pulse bg-slate-50 dark:bg-slate-800/50"
            />
          ))}
        </div>
      ) : isError ? (
        <p className="text-sm text-red-500">Failed to load your content.</p>
      ) : content?.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No content yet"
          description="Your uploaded content will appear here once you submit something."
          action={
            <Link href="/dashboard/teacher/upload" className={buttonVariants({ size: 'sm' })}>
              Upload now
            </Link>
          }
        />
      ) : (
        <>
          <ContentTable items={paginated} onView={handleView} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Page {page} of {totalPages} · {content.length} items
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Preview dialog */}
      <Dialog open={!!previewItem} onOpenChange={handleClosePreview}>
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
