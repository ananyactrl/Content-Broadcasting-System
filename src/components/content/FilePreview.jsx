/**
 * FilePreview — renders an image thumbnail from a URL, data URL, or File object.
 *
 * Handles three source types:
 *   1. File object (pre-upload) — creates an object URL, revokes on unmount
 *   2. data: URL (base64, stored after upload in mock db) — rendered unoptimized
 *   3. External/local URL — rendered via next/image with optimisation where possible
 *
 * Falls back to a placeholder icon on error or missing src.
 */

'use client';

import { useState, useEffect, memo } from 'react';
import Image from 'next/image';
import PropTypes from 'prop-types';
import { ImageIcon } from 'lucide-react';

const FilePreview = memo(function FilePreview({ file, url, alt = 'Preview', className = '' }) {
  const [src, setSrc] = useState(url ?? null);
  const [error, setError] = useState(false);

  // Sync url prop changes (e.g. when parent swaps from placeholder to real URL)
  useEffect(() => {
    if (!file) {
      setSrc(url ?? null);
      setError(false);
    }
  }, [url, file]);

  // File object → object URL (pre-upload preview)
  useEffect(() => {
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setSrc(objectUrl);
    setError(false);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  if (!src || error) {
    return (
      <div className={`flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg ${className}`}>
        <ImageIcon className="w-8 h-8 text-slate-400" />
      </div>
    );
  }

  // data: URLs and blob: URLs cannot go through next/image optimisation
  const isUnoptimized =
    src.startsWith('data:') ||
    src.startsWith('blob:') ||
    src.endsWith('.svg');

  return (
    <div className={`relative overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800 ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        onError={() => setError(true)}
        sizes="(max-width: 768px) 100vw, 400px"
        unoptimized={isUnoptimized}
      />
    </div>
  );
});

FilePreview.propTypes = {
  file: PropTypes.instanceOf(File),
  url: PropTypes.string,
  alt: PropTypes.string,
  className: PropTypes.string,
};

export default FilePreview;
