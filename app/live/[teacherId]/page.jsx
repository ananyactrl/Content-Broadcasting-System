/**
 * Public Live Broadcast Page — /live/[teacherId]
 *
 * No authentication required. Full-page broadcast display.
 * Auto-refreshes every 30 seconds via TanStack Query refetchInterval.
 * "Updated X seconds ago" counter ticks every second.
 *
 * Two states:
 *   - Empty: animated broadcast icon + waiting message
 *   - Active: cinematic 16:9 image + info strip + LIVE badge
 */

'use client';

import { use, useState, useEffect, memo } from 'react';
import Image from 'next/image';
import PropTypes from 'prop-types';
import { Radio, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useLiveContent } from '@/src/hooks/useContent';
import { db } from '@/src/mocks/db';
import { SUBJECTS, SUBJECT_COLORS } from '@/src/utils/constants';
import { formatDate } from '@/src/utils/formatters';
import ScheduleBadge from '@/src/components/content/ScheduleBadge';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getTeacherName(teacherId) {
  return db.users.find((u) => u.id === teacherId)?.name ?? null;
}

function SubjectPill({ subject }) {
  const label = SUBJECTS.find((s) => s.value === subject)?.label ?? subject;
  const colors = SUBJECT_COLORS[subject] ?? { bg: 'bg-slate-500/20', text: 'text-slate-300', border: 'border-slate-500/30' };
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${colors.bg} ${colors.text} ${colors.border}`}>
      {label}
    </span>
  );
}
SubjectPill.propTypes = { subject: PropTypes.string };

// ─── Last updated counter ─────────────────────────────────────────────────────

const LastUpdated = memo(function LastUpdated({ dataUpdatedAt }) {
  const [secondsAgo, setSecondsAgo] = useState(0);

  useEffect(() => {
    if (!dataUpdatedAt) return;
    const tick = () => setSecondsAgo(Math.floor((Date.now() - dataUpdatedAt) / 1000));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [dataUpdatedAt]);

  if (!dataUpdatedAt) return null;

  const label = secondsAgo < 5 ? 'just now' : secondsAgo < 60 ? `${secondsAgo}s ago` : `${Math.floor(secondsAgo / 60)}m ago`;

  return (
    <div className="flex items-center gap-1.5 text-xs text-slate-500">
      <RefreshCw className="w-3 h-3 spin-slow" />
      <span>Updated {label}</span>
    </div>
  );
});
LastUpdated.propTypes = { dataUpdatedAt: PropTypes.number };

// ─── Top bar ──────────────────────────────────────────────────────────────────

function TopBar({ teacherName, subject, isLive, dataUpdatedAt }) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-white/5">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-md bg-white/10 flex items-center justify-center">
          <Radio className="w-4 h-4 text-white" />
        </div>
        <span className="font-semibold text-white text-sm tracking-tight">BroadcastEd</span>
      </div>

      {/* Channel name */}
      {teacherName && (
        <p className="hidden sm:block text-sm text-slate-400 font-medium">
          {teacherName}&apos;s Channel
          {subject && <> · <SubjectPill subject={subject} /></>}
        </p>
      )}

      {/* Right: LIVE badge + updated */}
      <div className="flex items-center gap-3">
        {isLive && (
          <span className="live-glow inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-600 text-white text-xs font-bold tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            LIVE
          </span>
        )}
        <LastUpdated dataUpdatedAt={dataUpdatedAt} />
      </div>
    </header>
  );
}
TopBar.propTypes = {
  teacherName: PropTypes.string,
  subject: PropTypes.string,
  isLive: PropTypes.bool,
  dataUpdatedAt: PropTypes.number,
};

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function LiveSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-4">
      <Skeleton className="h-6 w-32 bg-white/10" />
      <Skeleton className="w-full aspect-video rounded-xl bg-white/10" />
      <Skeleton className="h-6 w-3/4 bg-white/10" />
      <Skeleton className="h-4 w-1/2 bg-white/10" />
    </div>
  );
}

// ─── Empty / waiting state ────────────────────────────────────────────────────

function NoContent() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 py-24 text-center px-4">
      {/* Three concentric broadcast arcs */}
      <div className="relative w-20 h-20 mb-8 flex items-center justify-center">
        <span className="broadcast-arc-1 absolute inset-0 rounded-full border-2 border-slate-600" />
        <span className="broadcast-arc-2 absolute inset-3 rounded-full border-2 border-slate-500" />
        <span className="broadcast-arc-3 absolute inset-6 rounded-full border-2 border-slate-400" />
        <Radio className="relative w-6 h-6 text-slate-400" />
      </div>

      <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
        No active broadcast
      </p>
      <h2 className="text-2xl font-light text-slate-200 mb-3">
        Waiting for content
      </h2>
      <p className="text-sm text-slate-500 max-w-sm leading-relaxed mb-6">
        This channel will automatically display content when a broadcast goes live.
      </p>

      <div className="w-30 h-px bg-slate-800 mb-6" />

      <div className="flex items-center gap-2 text-xs text-slate-600">
        <RefreshCw className="w-3 h-3 spin-slow" />
        Auto-refreshes every 30 seconds
      </div>
    </div>
  );
}

// ─── Active content card ──────────────────────────────────────────────────────

function LiveCard({ item }) {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Image — 16:9, scanline overlay, fade-in on load */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-800 mb-5 scanlines shadow-2xl shadow-black/50">
        <Image
          src={item.fileUrl ?? '/placeholder-content.svg'}
          alt={item.title}
          fill
          className={`object-cover transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          sizes="(max-width: 768px) 100vw, 896px"
          priority
          onLoad={() => setImgLoaded(true)}
          unoptimized={
            !item.fileUrl ||
            item.fileUrl.startsWith('data:') ||
            item.fileUrl.startsWith('/') ||
            item.fileUrl.endsWith('.svg')
          }
        />
        {!imgLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-slate-600 border-t-slate-400 animate-spin" />
          </div>
        )}
      </div>

      {/* Info strip */}
      <div className="bg-white/5 border border-white/8 rounded-xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Left: title + subject + teacher */}
        <div>
          <h1 className="text-xl font-semibold text-white mb-2 leading-tight">
            {item.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <SubjectPill subject={item.subject} />
          </div>
          {item.teacherName && (
            <p className="text-sm text-slate-400">
              by <span className="text-slate-300">{item.teacherName}</span>
            </p>
          )}
          {item.description && (
            <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-2">
              {item.description}
            </p>
          )}
        </div>

        {/* Right: schedule info */}
        <div className="sm:text-right">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Broadcast window
          </p>
          <p className="text-xs text-slate-400 mb-1">{formatDate(item.startTime)}</p>
          <p className="text-xs text-slate-500 mb-3">→ {formatDate(item.endTime)}</p>
          <ScheduleBadge startTime={item.startTime} endTime={item.endTime} />
        </div>
      </div>
    </div>
  );
}
LiveCard.propTypes = {
  item: PropTypes.shape({
    fileUrl: PropTypes.string,
    title: PropTypes.string.isRequired,
    teacherName: PropTypes.string,
    subject: PropTypes.string,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    rotationDuration: PropTypes.number,
    description: PropTypes.string,
  }).isRequired,
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LivePage({ params }) {
  const { teacherId } = use(params);
  const { data: liveContent, isLoading, isError, dataUpdatedAt } = useLiveContent(teacherId);

  const teacherName = getTeacherName(teacherId);
  const activeItem = liveContent?.[0] ?? null;
  const isLive = !!activeItem;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'linear-gradient(160deg, #0d1424 0%, #0a0f1e 60%, #080c18 100%)' }}
    >
      <TopBar
        teacherName={teacherName}
        subject={activeItem?.subject}
        isLive={isLive}
        dataUpdatedAt={dataUpdatedAt}
      />

      <div className="flex-1 flex flex-col">
        {isLoading ? (
          <LiveSkeleton />
        ) : isError ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-red-400">Failed to load broadcast. Please refresh.</p>
          </div>
        ) : !isLive ? (
          <NoContent />
        ) : (
          <LiveCard item={activeItem} />
        )}
      </div>

      <footer className="text-center py-4 text-xs text-slate-700">
        Powered by BroadcastEd
      </footer>
    </div>
  );
}
