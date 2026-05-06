/**
 * useApproval — TanStack Query wrappers for approval workflow.
 *
 * Mutations use optimistic updates: the UI reflects the change immediately
 * and rolls back if the server call fails.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import {
  getPendingContent,
  approveContent,
  rejectContent,
} from '@/src/services/approval.service';
import { QUERY_KEYS } from '@/src/utils/constants';

export function usePendingContent() {
  const { token } = useAuth();
  return useQuery({
    queryKey: [QUERY_KEYS.PENDING_CONTENT],
    queryFn: () => getPendingContent(token),
    enabled: !!token,
    staleTime: 15_000,
  });
}

export function useApproveContent() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contentId) => approveContent(token, contentId),

    // Optimistic update: remove item from pending list immediately
    onMutate: async (contentId) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.PENDING_CONTENT] });
      const previous = queryClient.getQueryData([QUERY_KEYS.PENDING_CONTENT]);
      queryClient.setQueryData([QUERY_KEYS.PENDING_CONTENT], (old) =>
        old ? old.filter((item) => item.id !== contentId) : old
      );
      return { previous };
    },

    onError: (_err, _contentId, context) => {
      // Roll back on failure
      if (context?.previous) {
        queryClient.setQueryData([QUERY_KEYS.PENDING_CONTENT], context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PENDING_CONTENT] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ALL_CONTENT] });
    },
  });
}

export function useRejectContent() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contentId, reason }) => rejectContent(token, contentId, reason),

    onMutate: async ({ contentId }) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.PENDING_CONTENT] });
      const previous = queryClient.getQueryData([QUERY_KEYS.PENDING_CONTENT]);
      queryClient.setQueryData([QUERY_KEYS.PENDING_CONTENT], (old) =>
        old ? old.filter((item) => item.id !== contentId) : old
      );
      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData([QUERY_KEYS.PENDING_CONTENT], context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PENDING_CONTENT] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ALL_CONTENT] });
    },
  });
}
