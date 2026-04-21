import type { ReactNode } from 'react';

import AntdLightThemeProvider from '@/theme/shared/AntdLightThemeProvider';

import { operatorAntdTheme } from './operatorAntdTheme';

interface OperatorThemeProviderProps {
  children: ReactNode;
}

export default function OperatorThemeProvider({
  children,
}: OperatorThemeProviderProps) {
  return (
    <AntdLightThemeProvider appName="operator" themeConfig={operatorAntdTheme}>
      {children}
    </AntdLightThemeProvider>
  );
}
