/**
 * ScheduleBadge — shows Scheduled / Active (with pulse) / Expired.
 * Memoized for list performance.
 */

import { memo } from 'react';
import PropTypes from 'prop-types';
import { getScheduleStatus } from '@/src/utils/scheduleUtils';
import { getScheduleColor, capitalise } from '@/src/utils/formatters';

const ScheduleBadge = memo(function ScheduleBadge({ startTime, endTime }) {
  const scheduleStatus = getScheduleStatus(startTime, endTime);
  const colors = getScheduleColor(scheduleStatus);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${colors.bg} ${colors.text} ${colors.border}`}
    >
      {colors.pulse && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
        </span>
      )}
      {capitalise(scheduleStatus)}
    </span>
  );
});

ScheduleBadge.propTypes = {
  startTime: PropTypes.string,
  endTime: PropTypes.string,
};

export default ScheduleBadge;
