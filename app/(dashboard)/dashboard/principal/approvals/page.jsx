/**
 * Principal Pending Approvals Page.
 *
 * Each item is expandable via a Dialog showing full ContentPreview.
 * Approve: optimistic update, success toast, item removed from list.
 * Reject: opens RejectModal, on confirm calls mutation, item removed.
 */

'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import PropTypes from 'prop-types';
import { CheckSquare, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import PageHeader from '@/src/components/common/PageHeader';
import EmptyState from '@/src/components/common/EmptyState';
import ContentPreview from '@/src/components/content/ContentPreview';
import StatusBadge from '@/src/components/content/StatusBadge';
import ScheduleBadge from '@/src/components/content/ScheduleBadge';
import RejectModal from '@/src/components/forms/RejectModal';
import { usePendingContent, useApproveContent, useRejectContent } from '@/src/hooks/useApproval';
import { SUBJECTS } from '@/src/utils/constants';
import { formatDate } from '@/src/utils/formatters';
import FilePreview from '@/src/components/content/FilePreview';

function ApprovalCard({ item, onPreview, onApprove, onReject, isApproving, isRejecting }) {
  const subjectLabel = SUBJECTS.find((s) => s.value === item.subject)?.label ?? item.subject;

  return (
    <div className="bg-white dark:bg-slate-900/80 rounded-xl border-l-4 border-l-amber-400 dark:border-l-amber-500 border border-slate-200/80 dark:border-slate-800 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="flex gap-4 p-4">
        {/* Thumbnail — 120×90 for better visual weight */}
        <button
          onClick={() => onPreview(item)}
          className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 rounded-lg"
          aria-label={`Preview ${item.title}`}
        >
          <FilePreview url={item.fileUrl} alt={item.title} className="w-[120px] h-[90px]" />
        </button>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <button onClick={() => onPreview(item)} className="text-left w-full">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-1 hover:underline">
              {item.title}
            </p>
          </button>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {subjectLabel} · {item.teacherName}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            <StatusBadge status={item.status} />
            <ScheduleBadge startTime={item.startTime} endTime={item.endTime} />
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">
            {formatDate(item.startTime)} → {formatDate(item.endTime)}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 px-4 pb-4">
        <Button
          size="sm"
          onClick={() => onApprove(item.id)}
          disabled={isApproving || isRejecting}
          className="bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-emerald-500/30 hover:shadow-md transition-shadow"
        >
          <Check className="w-3.5 h-3.5 mr-1.5" />
          Approve
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onReject(item)}
          disabled={isApproving || isRejecting}
          className="text-red-600 border-red-200 hover:bg-red-50 hover:shadow-red-500/20 hover:shadow-md dark:border-red-800 dark:hover:bg-red-900/20 transition-shadow"
        >
          <X className="w-3.5 h-3.5 mr-1.5" />
          Reject
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onPreview(item)}
          className="ml-auto"
        >
          Preview
        </Button>
      </div>
    </div>
  );
}

ApprovalCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    subject: PropTypes.string,
    teacherName: PropTypes.string,
    fileUrl: PropTypes.string,
    status: PropTypes.string,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
  }).isRequired,
  onPreview: PropTypes.func.isRequired,
  onApprove: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  isApproving: PropTypes.bool,
  isRejecting: PropTypes.bool,
};

export default function PrincipalApprovalsPage() {
  const { data: pending, isLoading, isError } = usePendingContent();
  const approveMutation = useApproveContent();
  const rejectMutation = useRejectContent();

  const [previewItem, setPreviewItem] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);

  const handleApprove = useCallback(
    async (contentId) => {
      try {
        await approveMutation.mutateAsync(contentId);
        toast.success('Content approved');
      } catch {
        toast.error('Failed to approve content');
      }
    },
    [approveMutation]
  );

  const handleRejectConfirm = useCallback(
    async (reason) => {
      if (!rejectTarget) return;
      try {
        await rejectMutation.mutateAsync({ contentId: rejectTarget.id, reason });
        toast.success('Content rejected');
        setRejectTarget(null);
      } catch {
        toast.error('Failed to reject content');
      }
    },
    [rejectMutation, rejectTarget]
  );

  return (
    <div>
      <PageHeader
        title="Pending approvals"
        subtitle={pending ? `${pending.length} item${pending.length !== 1 ? 's' : ''} awaiting review` : 'Review submitted content'}
      />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-32 rounded-xl border border-slate-200 dark:border-slate-800 animate-pulse bg-slate-50 dark:bg-slate-800/50"
            />
          ))}
        </div>
      ) : isError ? (
        <p className="text-sm text-red-500">Failed to load pending content.</p>
      ) : !pending || pending.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="All caught up"
          description="There's no content waiting for review right now."
        />
      ) : (
        <div className="space-y-3">
          {pending.map((item) => (
            <ApprovalCard
              key={item.id}
              item={item}
              onPreview={setPreviewItem}
              onApprove={handleApprove}
              onReject={setRejectTarget}
              isApproving={approveMutation.isPending}
              isRejecting={rejectMutation.isPending}
            />
          ))}
        </div>
      )}

      {/* Preview dialog */}
      <Dialog open={!!previewItem} onOpenChange={() => setPreviewItem(null)}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="line-clamp-2">{previewItem?.title}</DialogTitle>
          </DialogHeader>
          <ContentPreview item={previewItem} />
        </DialogContent>
      </Dialog>

      {/* Reject modal */}
      <RejectModal
        open={!!rejectTarget}
        onOpenChange={(open) => !open && setRejectTarget(null)}
        onConfirm={handleRejectConfirm}
        isLoading={rejectMutation.isPending}
        contentTitle={rejectTarget?.title}
      />
    </div>
  );
}
