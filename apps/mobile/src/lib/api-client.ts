import { createApiClient } from '@ve_xe_nhanh_ts/api-client';
import { env } from '@/lib/env';
import { tokenStorage } from '@/lib/token-storage';
import { useAuthStore } from '@/store/auth-store';

export const apiClient = createApiClient({
  baseURL: env.apiUrl,
  storage: tokenStorage,
  onAuthFailure: async () => {
    useAuthStore.getState().clearSession();
  },
});
