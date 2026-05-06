/**
 * RejectModal — Dialog for entering a rejection reason.
 *
 * Reason is Zod-validated (min 10 chars). On confirm, calls onConfirm(reason).
 * Parent is responsible for the mutation call so this component stays pure UI.
 */

'use client';

import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import PropTypes from 'prop-types';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { rejectSchema } from '@/src/utils/validators';

export default function RejectModal({ open, onOpenChange, onConfirm, isLoading, contentTitle }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(rejectSchema),
    defaultValues: { reason: '' },
  });

  const handleClose = useCallback(() => {
    reset();
    onOpenChange(false);
  }, [reset, onOpenChange]);

  const onSubmit = useCallback(
    async ({ reason }) => {
      await onConfirm(reason);
      reset();
    },
    [onConfirm, reset]
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reject content</DialogTitle>
        </DialogHeader>

        {contentTitle && (
          <p className="text-sm text-slate-500 dark:text-slate-400 -mt-2">
            Rejecting: <span className="font-medium text-slate-700 dark:text-slate-300">{contentTitle}</span>
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="reason">Rejection reason</Label>
            <Textarea
              id="reason"
              placeholder="Explain why this content is being rejected (min. 10 characters)…"
              rows={4}
              aria-invalid={!!errors.reason}
              {...register('reason')}
            />
            {errors.reason && (
              <p className="text-xs text-red-500" role="alert">
                {errors.reason.message}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="destructive" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Rejecting…
                </>
              ) : (
                'Confirm rejection'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

RejectModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  contentTitle: PropTypes.string,
};
