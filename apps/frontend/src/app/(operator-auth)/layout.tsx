import { Be_Vietnam_Pro } from 'next/font/google';

import OperatorThemeProvider from '@/theme/operator/OperatorThemeProvider';

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600'],
});

export default function OperatorAuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <OperatorThemeProvider>
      <div className={beVietnamPro.className}>{children}</div>
    </OperatorThemeProvider>
  );
}
