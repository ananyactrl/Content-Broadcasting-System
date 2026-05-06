/**
 * FileDropZone — drag-and-drop / click-to-browse file input.
 *
 * Extracted from UploadForm to keep that component under 150 lines.
 * Handles both the empty state (drop zone) and the selected state (preview + clear).
 */

'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import PropTypes from 'prop-types';
import { Upload as UploadIcon, X } from 'lucide-react';
import { FILE_LIMITS } from '@/src/utils/constants';
import { formatFileSize } from '@/src/utils/formatters';
import FilePreview from '@/src/components/content/FilePreview';

export default function FileDropZone({ file, onFileSelect, onFileClear, error }) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      const f = acceptedFiles[0];
      if (f) onFileSelect(f);
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
    },
    maxFiles: 1,
    multiple: false,
  });

  return (
    <div className="space-y-1.5">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
        Content file * ({FILE_LIMITS.ACCEPTED_LABEL}, max {FILE_LIMITS.MAX_SIZE_LABEL})
      </span>

      {!file ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-slate-900 dark:border-slate-100 bg-slate-50 dark:bg-slate-800'
              : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600'
          }`}
        >
          <input {...getInputProps()} />
          <UploadIcon className="w-8 h-8 mx-auto mb-3 text-slate-400" />
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            {isDragActive ? 'Drop the file here' : 'Drag and drop a file, or click to browse'}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {FILE_LIMITS.ACCEPTED_LABEL} up to {FILE_LIMITS.MAX_SIZE_LABEL}
          </p>
        </div>
      ) : (
        <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 flex items-start gap-4">
          <FilePreview file={file} className="w-20 h-20 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
              {file.name}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {formatFileSize(file.size)}
            </p>
          </div>
          <button
            type="button"
            onClick={onFileClear}
            className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            aria-label="Remove file"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

FileDropZone.propTypes = {
  file: PropTypes.instanceOf(File),
  onFileSelect: PropTypes.func.isRequired,
  onFileClear: PropTypes.func.isRequired,
  error: PropTypes.string,
};
