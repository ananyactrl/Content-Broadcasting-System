/**
 * useContent — TanStack Query wrappers for content fetching.
 *
 * All server state lives here. Components never call services directly.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import {
  getMyContent,
  getAllContent,
  getLiveContent,
  uploadContent,
} from '@/src/services/content.service';
import { QUERY_KEYS } from '@/src/utils/constants';

export function useMyContent() {
  const { token } = useAuth();
  return useQuery({
    queryKey: [QUERY_KEYS.MY_CONTENT],
    queryFn: () => getMyContent(token),
    enabled: !!token,
    staleTime: 30_000,
  });
}

export function useAllContent() {
  const { token } = useAuth();
  return useQuery({
    queryKey: [QUERY_KEYS.ALL_CONTENT],
    queryFn: () => getAllContent(token),
    enabled: !!token,
    staleTime: 30_000,
  });
}

export function useLiveContent(teacherId) {
  return useQuery({
    queryKey: [QUERY_KEYS.LIVE_CONTENT, teacherId],
    queryFn: () => getLiveContent(teacherId),
    enabled: !!teacherId,
    refetchInterval: 30_000, // auto-refresh every 30s for live page
    staleTime: 0,
  });
}

export function useUploadContent() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => uploadContent(token, payload),
    onSuccess: () => {
      // Invalidate both teacher's list and all-content so principal sees it too
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MY_CONTENT] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ALL_CONTENT] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PENDING_CONTENT] });
    },
  });
}
