import type { ReactNode } from 'react';

import AdminThemeProvider from '@/theme/admin/AdminThemeProvider';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return <AdminThemeProvider>{children}</AdminThemeProvider>;
}
