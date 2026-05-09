import * as SecureStore from 'expo-secure-store';
import type { TokenPair } from '@ve_xe_nhanh_ts/api-client';

const ACCESS_TOKEN_KEY = 've_xe_nhanh_access_token';
const REFRESH_TOKEN_KEY = 've_xe_nhanh_refresh_token';

export const tokenStorage = {
  async getAccessToken() {
    return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  },

  async getRefreshToken() {
    return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  },

  async setTokens(tokens: TokenPair) {
    await Promise.all([
      SecureStore.setItemAsync(ACCESS_TOKEN_KEY, tokens.accessToken),
      SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refreshToken),
    ]);
  },

  async clearTokens() {
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
    ]);
  },
};
