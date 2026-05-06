/**
 * StatsCard — single metric tile for the dashboard stats grid.
 *
 * Each card has a colored left-border accent and a subtle hover glow
 * that matches the accent color. The accent is driven by the accentColor
 * prop so the parent controls the palette without hardcoding here.
 *
 * Memoized because the grid renders 4 simultaneously.
 */

import { memo } from 'react';
import PropTypes from 'prop-types';
import { cn } from '@/lib/utils';

const ACCENT_STYLES = {
  slate:   { border: 'border-l-slate-400 dark:border-l-slate-500',   glow: 'hover:shadow-slate-200/60 dark:hover:shadow-slate-700/40'   },
  amber:   { border: 'border-l-amber-400 dark:border-l-amber-500',   glow: 'hover:shadow-amber-200/60 dark:hover:shadow-amber-900/40'   },
  emerald: { border: 'border-l-emerald-400 dark:border-l-emerald-500', glow: 'hover:shadow-emerald-200/60 dark:hover:shadow-emerald-900/40' },
  rose:    { border: 'border-l-rose-400 dark:border-l-rose-500',     glow: 'hover:shadow-rose-200/60 dark:hover:shadow-rose-900/40'     },
};

const StatsCard = memo(function StatsCard({
  label,
  value,
  icon: Icon,
  trend,
  colorClass,
  accentColor = 'slate',
}) {
  const accent = ACCENT_STYLES[accentColor] ?? ACCENT_STYLES.slate;

  return (
    <div
      className={cn(
        'bg-white dark:bg-slate-900/80 rounded-xl border border-slate-200/80 dark:border-slate-800',
        'border-l-4 p-5 transition-shadow duration-200',
        'hover:shadow-md',
        accent.border,
        accent.glow
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            {label}
          </p>
          <p className="text-4xl font-bold text-slate-900 dark:text-slate-100 tabular-nums leading-none">
            {value ?? '—'}
          </p>
          {trend && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{trend}</p>
          )}
        </div>
        {Icon && (
          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', colorClass ?? 'bg-slate-100 dark:bg-slate-800')}>
            <Icon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </div>
        )}
      </div>
    </div>
  );
});

StatsCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  icon: PropTypes.elementType,
  trend: PropTypes.string,
  colorClass: PropTypes.string,
  accentColor: PropTypes.oneOf(['slate', 'amber', 'emerald', 'rose']),
};

export default StatsCard;
