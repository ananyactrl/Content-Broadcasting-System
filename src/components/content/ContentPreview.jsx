/**
 * ContentPreview — full detail view of a content item.
 * Used inside the principal's approval modal and the teacher's preview.
 */

import PropTypes from 'prop-types';
import { SUBJECTS } from '@/src/utils/constants';
import { formatDate, formatFileSize } from '@/src/utils/formatters';
import StatusBadge from './StatusBadge';
import ScheduleBadge from './ScheduleBadge';
import FilePreview from './FilePreview';

function DetailRow({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
        {label}
      </span>
      <span className="text-sm text-slate-900 dark:text-slate-100">{value}</span>
    </div>
  );
}

DetailRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.node.isRequired,
};

export default function ContentPreview({ item }) {
  if (!item) return null;

  const subjectLabel =
    SUBJECTS.find((s) => s.value === item.subject)?.label ?? item.subject;

  return (
    <div className="space-y-4">
      {/* Image */}
      <FilePreview
        url={item.fileUrl}
        alt={item.title}
        className="w-full h-52"
      />

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        <StatusBadge status={item.status} />
        <ScheduleBadge startTime={item.startTime} endTime={item.endTime} />
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 gap-4">
        <DetailRow label="Subject" value={subjectLabel} />
        <DetailRow label="Teacher" value={item.teacherName ?? '—'} />
        <DetailRow label="Start" value={formatDate(item.startTime)} />
        <DetailRow label="End" value={formatDate(item.endTime)} />
        {item.fileSize && (
          <DetailRow label="File size" value={formatFileSize(item.fileSize)} />
        )}
        {item.rotationDuration && (
          <DetailRow label="Rotation" value={`${item.rotationDuration}s`} />
        )}
      </div>

      {/* Description */}
      {item.description && (
        <div>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Description
          </span>
          <p className="mt-1 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {item.description}
          </p>
        </div>
      )}

      {/* Rejection reason */}
      {item.rejectionReason && (
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3">
          <p className="text-xs font-medium text-red-700 dark:text-red-400 mb-1">
            Rejection reason
          </p>
          <p className="text-sm text-red-600 dark:text-red-300">{item.rejectionReason}</p>
        </div>
      )}
    </div>
  );
}

ContentPreview.propTypes = {
  item: PropTypes.shape({
    fileUrl: PropTypes.string,
    title: PropTypes.string,
    status: PropTypes.string,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    subject: PropTypes.string,
    teacherName: PropTypes.string,
    fileSize: PropTypes.number,
    rotationDuration: PropTypes.number,
    description: PropTypes.string,
    rejectionReason: PropTypes.string,
  }),
};
