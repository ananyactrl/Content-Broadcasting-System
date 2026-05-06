/**
 * Teacher Upload Page — full content upload form.
 * UploadForm is lazy-loaded because it pulls in react-dropzone.
 */

import dynamic from 'next/dynamic';
import PageHeader from '@/src/components/common/PageHeader';
import { Skeleton } from '@/components/ui/skeleton';

const UploadForm = dynamic(() => import('@/src/components/forms/UploadForm'), {
  loading: () => (
    <div className="space-y-6 max-w-2xl">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-1.5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
  ),
});

export const metadata = {
  title: 'Upload Content — BroadcastEd',
};

export default function TeacherUploadPage() {
  return (
    <div>
      <PageHeader
        title="Upload content"
        subtitle="Submit new content for principal review"
      />
      <UploadForm />
    </div>
  );
}
