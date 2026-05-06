/**
 * StatusBadge — color-coded approval status pill.
 * Memoized because it renders in every row of every list.
 */

import { memo } from 'react';
import PropTypes from 'prop-types';
import { getStatusColor, capitalise } from '@/src/utils/formatters';

const StatusBadge = memo(function StatusBadge({ status }) {
  const colors = getStatusColor(status);
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${colors.bg} ${colors.text} ${colors.border}`}
    >
      {capitalise(status ?? 'unknown')}
    </span>
  );
});

StatusBadge.propTypes = {
  status: PropTypes.string,
};

export default StatusBadge;
