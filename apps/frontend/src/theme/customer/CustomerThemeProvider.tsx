import type { ReactNode } from 'react';

import ThemeScope from '@/theme/shared/ThemeScope';

interface CustomerThemeProviderProps {
  children: ReactNode;
}

export default function CustomerThemeProvider({
  children,
}: CustomerThemeProviderProps) {
  return <ThemeScope appName="customer">{children}</ThemeScope>;
}
