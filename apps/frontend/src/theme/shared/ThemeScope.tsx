import type { ReactNode } from 'react';

import type { AppThemeName } from './theme.types';

interface ThemeScopeProps {
  appName: AppThemeName;
  children: ReactNode;
  className?: string;
}

export default function ThemeScope({
  appName,
  children,
  className,
}: ThemeScopeProps) {
  const rootClassName = className
    ? `min-h-screen bg-background text-foreground ${className}`
    : 'min-h-screen bg-background text-foreground';

  return (
    <div data-app-theme={appName} className={rootClassName}>
      {children}
    </div>
  );
}
