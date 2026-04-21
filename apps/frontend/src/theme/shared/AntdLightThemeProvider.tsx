'use client';

import type { ReactNode } from 'react';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { App, ConfigProvider, type ThemeConfig } from 'antd';

import ThemeScope from './ThemeScope';
import type { AppThemeName } from './theme.types';

interface AntdLightThemeProviderProps {
  appName: AppThemeName;
  themeConfig: ThemeConfig;
  children: ReactNode;
}

export default function AntdLightThemeProvider({
  appName,
  themeConfig,
  children,
}: AntdLightThemeProviderProps) {
  return (
    <AntdRegistry>
      <ConfigProvider theme={themeConfig}>
        <App>
          <ThemeScope appName={appName}>{children}</ThemeScope>
        </App>
      </ConfigProvider>
    </AntdRegistry>
  );
}
