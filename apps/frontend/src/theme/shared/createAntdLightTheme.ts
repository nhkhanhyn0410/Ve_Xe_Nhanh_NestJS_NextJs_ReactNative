import { theme as antdTheme, type ThemeConfig } from 'antd';

type AntdThemeAppName = 'operator' | 'admin';

function cssVariable(name: string, fallback: string): string {
  return `var(${name}, ${fallback})`;
}

export function createAntdLightTheme(appName: AntdThemeAppName): ThemeConfig {
  const prefix = `--${appName}-color`;

  return {
    algorithm: antdTheme.defaultAlgorithm,
    token: {
      colorPrimary: cssVariable(`${prefix}-primary`, '#1677ff'),
      colorInfo: cssVariable(`${prefix}-info`, cssVariable(`${prefix}-primary`, '#1677ff')),
      colorSuccess: cssVariable(`${prefix}-success`, '#16a34a'),
      colorWarning: cssVariable(`${prefix}-warning`, '#d97706'),
      colorError: cssVariable(`${prefix}-error`, '#dc2626'),
      colorTextBase: cssVariable(`${prefix}-text-base`, '#0f172a'),
      colorBgBase: cssVariable(`${prefix}-bg-base`, '#f8fafc'),
      colorBgContainer: cssVariable(`${prefix}-bg-surface`, '#ffffff'),
      colorBorder: cssVariable(`${prefix}-border`, '#d9d9d9'),
      colorLink: cssVariable(`${prefix}-link`, cssVariable(`${prefix}-primary`, '#1677ff')),
      fontFamily: 'var(--font-geist-sans), sans-serif',
      borderRadius: 16,
    },
  };
}
