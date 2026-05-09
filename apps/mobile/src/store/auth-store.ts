import { create } from 'zustand';
import type { TokenPair } from '@ve_xe_nhanh_ts/api-client';

interface AuthSession extends Partial<TokenPair> {
  userId?: string;
}

interface AuthState {
  session: AuthSession;
  setSession: (session: AuthSession) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: {},
  setSession: (session) => set({ session }),
  clearSession: () => set({ session: {} }),
}));
