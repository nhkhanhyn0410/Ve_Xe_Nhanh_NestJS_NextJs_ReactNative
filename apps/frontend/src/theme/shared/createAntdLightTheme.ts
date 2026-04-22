import { theme as antdTheme, type ThemeConfig } from 'antd';

type AntdThemeAppName = 'operator' | 'admin';

function cssVariable(name: string, fallback: string): string {
  return `var(${name}, ${fallback})`;
}

export function createAntdLightTheme(appName: AntdThemeAppName): ThemeConfig {
  const prefix = `--${appName}-color`;
  const primary = cssVariable(`${prefix}-primary`, '#1677ff');
  const primaryHover = cssVariable(`${prefix}-primary-hover`, primary);
  const primaryActive = cssVariable(`${prefix}-primary-active`, primaryHover);
  const success = cssVariable(`${prefix}-success`, '#16a34a');
  const warning = cssVariable(`${prefix}-warning`, '#d97706');
  const error = cssVariable(`${prefix}-error`, '#dc2626');
  const info = cssVariable(`${prefix}-info`, primary);
  const textBase = cssVariable(`${prefix}-text-base`, '#0f172a');
  const textMuted = cssVariable(`${prefix}-text-muted`, '#475569');
  const textSubtle = cssVariable(`${prefix}-text-subtle`, textMuted);
  const textDisabled = cssVariable(`${prefix}-text-disabled`, textSubtle);
  const textOnColor = cssVariable(`${prefix}-text-on-color`, '#ffffff');
  const bgBase = cssVariable(`${prefix}-bg-base`, '#f8fafc');
  const bgPanel = cssVariable(`${prefix}-bg-panel`, bgBase);
  const bgSurface = cssVariable(`${prefix}-bg-surface`, '#ffffff');
  const bgElevated = cssVariable(`${prefix}-bg-elevated`, bgSurface);
  const bgSpotlight = cssVariable(`${prefix}-bg-inverse`, '#0f172a');
  const border = cssVariable(`${prefix}-border`, '#d9d9d9');
  const borderSubtle = cssVariable(`${prefix}-border-subtle`, border);
  const brandSubtle = cssVariable(`${prefix}-bg-brand-subtle`, bgPanel);
  const brandMuted = cssVariable(`${prefix}-bg-brand-muted`, brandSubtle);
  const borderBrandSubtle = cssVariable(`${prefix}-border-brand-subtle`, primary);
  const link = cssVariable(`${prefix}-link`, cssVariable(`${prefix}-text-brand`, primary));
  const linkHover = cssVariable(
    `${prefix}-link-hover`,
    cssVariable(`${prefix}-text-brand-hover`, primaryHover),
  );

  return {
    algorithm: antdTheme.defaultAlgorithm,
    token: {
      colorPrimary: primary,
      colorPrimaryHover: primaryHover,
      colorPrimaryActive: primaryActive,
      colorPrimaryBg: brandSubtle,
      colorPrimaryBgHover: brandMuted,
      colorPrimaryBorder: borderBrandSubtle,
      colorPrimaryBorderHover: primary,
      colorInfo: info,
      colorInfoBg: cssVariable(`${prefix}-info-bg`, brandSubtle),
      colorSuccess: success,
      colorSuccessBg: cssVariable(`${prefix}-success-bg`, '#f0fdf4'),
      colorWarning: warning,
      colorWarningBg: cssVariable(`${prefix}-warning-bg`, '#fffbeb'),
      colorError: error,
      colorErrorBg: cssVariable(
        `${prefix}-error-bg`,
        cssVariable(`${prefix}-danger-bg`, '#fef2f2'),
      ),
      colorTextBase: textBase,
      colorText: textBase,
      colorTextSecondary: textMuted,
      colorTextTertiary: textSubtle,
      colorTextQuaternary: textDisabled,
      colorTextLightSolid: textOnColor,
      colorBgBase: bgBase,
      colorBgLayout: bgPanel,
      colorBgContainer: bgSurface,
      colorBgElevated: bgElevated,
      colorBgSpotlight: bgSpotlight,
      colorBorder: border,
      colorBorderSecondary: borderSubtle,
      colorFillSecondary: cssVariable(`${prefix}-interactive-ghost-hover`, bgPanel),
      colorFillTertiary: cssVariable(`${prefix}-interactive-ghost-pressed`, borderSubtle),
      colorLink: link,
      colorLinkHover: linkHover,
      colorLinkActive: primaryActive,
      fontFamily: 'var(--font-geist-sans), sans-serif',
      borderRadius: 16,
    },
  };
}
