import OperatorThemeProvider from '@/theme/operator/OperatorThemeProvider';

import OperatorLayoutClient from './OperatorLayoutClient';

export default function OperatorDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <OperatorThemeProvider>
      <OperatorLayoutClient>{children}</OperatorLayoutClient>
    </OperatorThemeProvider>
  );
}
