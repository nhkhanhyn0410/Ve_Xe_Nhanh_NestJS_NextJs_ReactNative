import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios';
import type { ApiErrorResponse } from '@ve_xe_nhanh_ts/shared-types';
import type {
  AdminLoginResponse,
  ApiResult,
  CreateApiClientOptions,
  LoginPayload,
  LogoutResponse,
  OperatorLoginResponse,
  RefreshTokenPayload,
  RegisterPayload,
  RegisterResponse,
  RequestConfig,
  TokenPair,
  UserLoginResponse,
} from './types.js';

interface RetriableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const isApiErrorResponse = (value: unknown): value is ApiErrorResponse => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    candidate.success === false &&
    typeof candidate.message === 'string' &&
    typeof candidate.statusCode === 'number'
  );
};

const toRequestConfig = (
  config?: RequestConfig,
): Pick<AxiosRequestConfig, 'headers' | 'signal'> => ({
  headers: config?.headers,
  signal: config?.signal,
});

export const createApiClient = (options: CreateApiClientOptions) => {
  const http = axios.create({
    baseURL: options.baseURL,
    timeout: options.timeout ?? 10000,
    withCredentials: options.withCredentials ?? false,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  let refreshPromise: Promise<TokenPair | null> | null = null;

  const getAccessToken = async () =>
    (await options.storage?.getAccessToken()) ?? null;

  const getRefreshToken = async () =>
    (await options.storage?.getRefreshToken()) ?? null;

  const setTokens = async (tokens: TokenPair) => {
    await options.storage?.setTokens(tokens);
  };

  const clearTokens = async () => {
    await options.storage?.clearTokens();
  };

  const notifyAuthFailure = async (error: unknown) => {
    await options.onAuthFailure?.(error);
  };

  const refreshAccessToken = async (): Promise<TokenPair | null> => {
    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
      return null;
    }

    const response = await http.post<TokenPair>('/auth/refresh', {
      refreshToken,
    } satisfies RefreshTokenPayload);

    await setTokens(response.data);
    return response.data;
  };

  http.interceptors.request.use(
    async (config) => {
      const accessToken = await getAccessToken();

      if (accessToken) {
        config.headers.set('Authorization', `Bearer ${accessToken}`);
      }

      return config;
    },
    async (error) => Promise.reject(error),
  );

  http.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ApiErrorResponse>) => {
      const originalRequest = error.config as RetriableRequestConfig | undefined;

      if (
        error.response?.status !== 401 ||
        !originalRequest ||
        originalRequest._retry ||
        originalRequest.url?.includes('/auth/refresh')
      ) {
        if (error.response?.status === 401) {
          await clearTokens();
          await notifyAuthFailure(error.response?.data ?? error);
        }

        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        refreshPromise ??= refreshAccessToken().finally(() => {
          refreshPromise = null;
        });

        const tokens = await refreshPromise;

        if (!tokens) {
          await clearTokens();
          await notifyAuthFailure(error.response?.data ?? error);
          return Promise.reject(error);
        }

        originalRequest.headers.set(
          'Authorization',
          `Bearer ${tokens.accessToken}`,
        );

        return http(originalRequest);
      } catch (refreshError) {
        await clearTokens();
        await notifyAuthFailure(refreshError);
        return Promise.reject(refreshError);
      }
    },
  );

  const unwrap = <T>(result: ApiResult<T>): T => {
    if (
      result &&
      typeof result === 'object' &&
      'success' in result &&
      (result as { success?: boolean }).success === true &&
      'data' in result
    ) {
      return (result as { data: T }).data;
    }

    return result as T;
  };

  const auth = {
    register: async (payload: RegisterPayload, config?: RequestConfig) => {
      const response = await http.post<RegisterResponse>(
        '/auth/register',
        payload,
        toRequestConfig(config),
      );

      await setTokens({
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      });

      return response.data;
    },

    login: async (payload: LoginPayload, config?: RequestConfig) => {
      const response = await http.post<UserLoginResponse>(
        '/auth/login',
        payload,
        toRequestConfig(config),
      );

      await setTokens({
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      });

      return response.data;
    },

    operatorLogin: async (payload: LoginPayload, config?: RequestConfig) => {
      const response = await http.post<OperatorLoginResponse>(
        '/auth/operator/login',
        payload,
        toRequestConfig(config),
      );

      await setTokens({
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      });

      return response.data;
    },

    adminLogin: async (payload: LoginPayload, config?: RequestConfig) => {
      const response = await http.post<AdminLoginResponse>(
        '/auth/admin/login',
        payload,
        toRequestConfig(config),
      );

      await setTokens({
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      });

      return response.data;
    },

    refresh: async (payload?: RefreshTokenPayload, config?: RequestConfig) => {
      const refreshToken = payload?.refreshToken ?? (await getRefreshToken());

      if (!refreshToken) {
        return null;
      }

      const response = await http.post<TokenPair>(
        '/auth/refresh',
        { refreshToken },
        toRequestConfig(config),
      );

      await setTokens(response.data);
      return response.data;
    },

    logout: async (config?: RequestConfig) => {
      const response = await http.post<LogoutResponse>(
        '/auth/logout',
        undefined,
        toRequestConfig(config),
      );

      await clearTokens();
      return response.data;
    },
  };

  return {
    http,
    auth,
    getAccessToken,
    getRefreshToken,
    setTokens,
    clearTokens,
    get: async <T>(url: string, config?: RequestConfig) => {
      const response = await http.get<ApiResult<T>>(url, toRequestConfig(config));
      return unwrap(response.data);
    },
    post: async <TResponse, TBody = unknown>(
      url: string,
      body?: TBody,
      config?: RequestConfig,
    ) => {
      const response = await http.post<ApiResult<TResponse>>(
        url,
        body,
        toRequestConfig(config),
      );
      return unwrap(response.data);
    },
    put: async <TResponse, TBody = unknown>(
      url: string,
      body?: TBody,
      config?: RequestConfig,
    ) => {
      const response = await http.put<ApiResult<TResponse>>(
        url,
        body,
        toRequestConfig(config),
      );
      return unwrap(response.data);
    },
    patch: async <TResponse, TBody = unknown>(
      url: string,
      body?: TBody,
      config?: RequestConfig,
    ) => {
      const response = await http.patch<ApiResult<TResponse>>(
        url,
        body,
        toRequestConfig(config),
      );
      return unwrap(response.data);
    },
    delete: async <TResponse>(url: string, config?: RequestConfig) => {
      const response = await http.delete<ApiResult<TResponse>>(
        url,
        toRequestConfig(config),
      );
      return unwrap(response.data);
    },
  };
};

export type ApiClient = ReturnType<typeof createApiClient>;
export type ApiClientHttp = AxiosInstance;
export { isApiErrorResponse };
