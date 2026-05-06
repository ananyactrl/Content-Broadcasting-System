/**
 * ContentTable — tabular list of content items.
 *
 * Row hover: translateX(2px) lift + status-colored left border accent.
 * Used on teacher My Content and principal All Content pages.
 */

import { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Eye } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { SUBJECTS, STATUS } from '@/src/utils/constants';
import { formatDate } from '@/src/utils/formatters';
import StatusBadge from './StatusBadge';
import ScheduleBadge from './ScheduleBadge';

const STATUS_ROW_ACCENT = {
  [STATUS.PENDING]:  'hover:border-l-amber-400 dark:hover:border-l-amber-500',
  [STATUS.APPROVED]: 'hover:border-l-emerald-400 dark:hover:border-l-emerald-500',
  [STATUS.REJECTED]: 'hover:border-l-rose-400 dark:hover:border-l-rose-500',
};

const ContentRow = memo(function ContentRow({ item, onView, showTeacher }) {
  const subjectLabel = useMemo(
    () => SUBJECTS.find((s) => s.value === item.subject)?.label ?? item.subject,
    [item.subject]
  );

  const accentClass = STATUS_ROW_ACCENT[item.status] ?? '';

  return (
    <TableRow
      className={`table-row-hover border-l-2 border-l-transparent hover:bg-slate-50 dark:hover:bg-slate-800/60 ${accentClass}`}
    >
      <TableCell className="font-medium text-slate-900 dark:text-slate-100 max-w-[200px] truncate">
        {item.title}
      </TableCell>
      <TableCell className="text-slate-600 dark:text-slate-400 text-sm">
        {subjectLabel}
      </TableCell>
      {showTeacher && (
        <TableCell className="text-slate-600 dark:text-slate-400 text-sm">
          {item.teacherName}
        </TableCell>
      )}
      <TableCell>
        <StatusBadge status={item.status} />
      </TableCell>
      <TableCell>
        <ScheduleBadge startTime={item.startTime} endTime={item.endTime} />
      </TableCell>
      <TableCell className="text-slate-500 dark:text-slate-400 text-sm whitespace-nowrap">
        {formatDate(item.startTime, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
      </TableCell>
      {onView && (
        <TableCell>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(item)}
            className="h-7 px-2"
          >
            <Eye className="w-3.5 h-3.5 mr-1" />
            View
          </Button>
        </TableCell>
      )}
    </TableRow>
  );
});

ContentRow.propTypes = {
  item: PropTypes.object.isRequired,
  onView: PropTypes.func,
  showTeacher: PropTypes.bool,
};

export default function ContentTable({ items, onView, showTeacher = false }) {
  return (
    <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/60">
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300 tracking-wide text-xs uppercase">Title</TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300 tracking-wide text-xs uppercase">Subject</TableHead>
            {showTeacher && (
              <TableHead className="font-semibold text-slate-700 dark:text-slate-300 tracking-wide text-xs uppercase">Teacher</TableHead>
            )}
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300 tracking-wide text-xs uppercase">Status</TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300 tracking-wide text-xs uppercase">Schedule</TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300 tracking-wide text-xs uppercase">Start Time</TableHead>
            {onView && <TableHead />}
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <ContentRow
              key={item.id}
              item={item}
              onView={onView}
              showTeacher={showTeacher}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

ContentTable.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  onView: PropTypes.func,
  showTeacher: PropTypes.bool,
};
