import type { ReactNode } from 'react';

import AntdLightThemeProvider from '@/theme/shared/AntdLightThemeProvider';

import { adminAntdTheme } from './adminAntdTheme';

interface AdminThemeProviderProps {
  children: ReactNode;
}

export default function AdminThemeProvider({ children }: AdminThemeProviderProps) {
  return (
    <AntdLightThemeProvider appName="admin" themeConfig={adminAntdTheme}>
      {children}
    </AntdLightThemeProvider>
  );
}
