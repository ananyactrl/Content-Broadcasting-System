/**
 * UploadForm — content upload form.
 *
 * Fields: title, subject, description, file, startTime, endTime, rotationDuration.
 * Zod validation with .refine() for endTime > startTime.
 * File validation via useFileValidation hook — errors surface immediately on select.
 * File drop zone extracted to FileDropZone component.
 * On success: invalidates queries, shows toast, redirects to My Content.
 */

'use client';

import { useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { uploadSchema } from '@/src/utils/validators';
import { useFileValidation } from '@/src/hooks/useFileValidation';
import { useUploadContent } from '@/src/hooks/useContent';
import { SUBJECTS } from '@/src/utils/constants';
import FileDropZone from './FileDropZone';

export default function UploadForm() {
  const router = useRouter();
  const { error: fileError, validate: validateFile, clearError: clearFileError } = useFileValidation();
  const uploadMutation = useUploadContent();
  const [selectedFile, setSelectedFile] = useState(null);

  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: zodResolver(uploadSchema),
    defaultValues: { title: '', subject: '', description: '', startTime: '', endTime: '', rotationDuration: undefined },
  });

  const handleFileSelect = useCallback((file) => {
    const isValid = validateFile(file);
    if (isValid) setSelectedFile(file);
  }, [validateFile]);

  const handleFileClear = useCallback(() => {
    setSelectedFile(null);
    clearFileError();
  }, [clearFileError]);

  const onSubmit = useCallback(async (data) => {
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }
    // Pass the File object directly — content.service.js converts it to
    // a base64 data URL before storing in the mock db.
    const payload = {
      ...data,
      file: selectedFile,
      fileName: selectedFile.name,
      fileSize: selectedFile.size,
      fileType: selectedFile.type,
      rotationDuration: data.rotationDuration ? Number(data.rotationDuration) : undefined,
    };
    try {
      await uploadMutation.mutateAsync(payload);
      toast.success('Content uploaded successfully!');
      router.push('/dashboard/teacher/my-content');
    } catch (err) {
      toast.error(err?.message ?? 'Upload failed. Please try again.');
    }
  }, [selectedFile, uploadMutation, router]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6 max-w-2xl">
      <div className="space-y-1.5">
        <Label htmlFor="title">Title *</Label>
        <Input id="title" placeholder="e.g. Introduction to Quadratic Equations" aria-invalid={!!errors.title} {...register('title')} />
        {errors.title && <p className="text-xs text-red-500" role="alert">{errors.title.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="subject">Subject *</Label>
        <Controller name="subject" control={control} render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger id="subject" aria-invalid={!!errors.subject}>
              <SelectValue placeholder="Select a subject" />
            </SelectTrigger>
            <SelectContent>
              {SUBJECTS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
        )} />
        {errors.subject && <p className="text-xs text-red-500" role="alert">{errors.subject.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea id="description" placeholder="Brief description of the content…" rows={3} {...register('description')} />
        {errors.description && <p className="text-xs text-red-500" role="alert">{errors.description.message}</p>}
      </div>

      <FileDropZone
        file={selectedFile}
        onFileSelect={handleFileSelect}
        onFileClear={handleFileClear}
        error={fileError}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="startTime">Start time *</Label>
          <Input id="startTime" type="datetime-local" aria-invalid={!!errors.startTime} {...register('startTime')} />
          {errors.startTime && <p className="text-xs text-red-500" role="alert">{errors.startTime.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="endTime">End time *</Label>
          <Input id="endTime" type="datetime-local" aria-invalid={!!errors.endTime} {...register('endTime')} />
          {errors.endTime && <p className="text-xs text-red-500" role="alert">{errors.endTime.message}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="rotationDuration">Rotation duration (seconds, optional)</Label>
        <Input id="rotationDuration" type="number" min="1" placeholder="e.g. 30" {...register('rotationDuration', { valueAsNumber: true })} />
        {errors.rotationDuration && <p className="text-xs text-red-500" role="alert">{errors.rotationDuration.message}</p>}
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={uploadMutation.isPending}>
          {uploadMutation.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Uploading…</> : 'Upload content'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={uploadMutation.isPending}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
