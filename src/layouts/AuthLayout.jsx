/**
 * AuthLayout — centered card shell for login page.
 */

'use client';

import PropTypes from 'prop-types';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <div className="w-full max-w-md">
        {/* Brand mark */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-slate-100 flex items-center justify-center">
              <span className="text-white dark:text-slate-900 text-sm font-bold">CB</span>
            </div>
            <span className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
              BroadcastEd
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Content Broadcasting System
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
