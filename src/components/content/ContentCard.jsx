/**
 * ContentCard — grid card for a single content item.
 * Memoized to avoid re-renders when sibling cards update.
 */

import { memo } from 'react';
import PropTypes from 'prop-types';
import { SUBJECTS } from '@/src/utils/constants';
import { formatDate } from '@/src/utils/formatters';
import StatusBadge from './StatusBadge';
import ScheduleBadge from './ScheduleBadge';
import FilePreview from './FilePreview';

const ContentCard = memo(function ContentCard({ item, onClick }) {
  const subjectLabel =
    SUBJECTS.find((s) => s.value === item.subject)?.label ?? item.subject;

  return (
    <button
      onClick={() => onClick?.(item)}
      className="w-full text-left bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 dark:focus-visible:ring-slate-100"
    >
      <FilePreview url={item.fileUrl} alt={item.title} className="h-40 w-full" />
      <div className="p-4">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 mb-1">
          {item.title}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{subjectLabel}</p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          <StatusBadge status={item.status} />
          <ScheduleBadge startTime={item.startTime} endTime={item.endTime} />
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          {formatDate(item.createdAt, { month: 'short', day: 'numeric', year: 'numeric', hour: undefined, minute: undefined })}
        </p>
      </div>
    </button>
  );
});

ContentCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    subject: PropTypes.string,
    fileUrl: PropTypes.string,
    status: PropTypes.string,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    createdAt: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func,
};

export default ContentCard;
