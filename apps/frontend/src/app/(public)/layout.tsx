import React from 'react';
import Link from 'next/link';

import CustomerThemeProvider from '@/theme/customer/CustomerThemeProvider';

/**
 * Layout cho các trang public của khách hàng
 * Bao gồm Header và Footer chung
 */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <CustomerThemeProvider>
      <div className="flex min-h-screen flex-col">
        {/* Header đơn giản */}
        <header className="sticky top-0 z-50 border-b border-border bg-surface">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <Link href="/" className="text-2xl font-bold text-brand">
                  VeXeNhanh
                </Link>
                <nav className="hidden md:ml-8 md:flex md:space-x-8">
                  <Link
                    href="/trips"
                    className="px-3 py-2 text-sm font-medium text-muted hover:text-brand"
                  >
                    Chuyến xe
                  </Link>
                  <Link href="/operators" className="px-3 py-2 text-sm font-medium text-brand">
                    Nhà xe
                  </Link>
                  <Link
                    href="/news"
                    className="px-3 py-2 text-sm font-medium text-muted hover:text-brand"
                  >
                    Tin tức
                  </Link>
                </nav>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/login"
                  className="px-3 py-2 text-sm font-medium text-muted hover:text-brand"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/auth/register"
                  className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-hover"
                >
                  Đăng ký
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow bg-background">{children}</main>

        {/* Footer đơn giản */}
        <footer className="border-t border-border bg-surface py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div>
                <h3 className="mb-4 text-lg font-bold text-foreground">VeXeNhanh</h3>
                <p className="text-sm text-muted">
                  Hệ thống đặt vé xe khách trực tuyến nhanh chóng và tiện lợi nhất Việt Nam.
                </p>
              </div>
              <div>
                <h4 className="mb-4 text-md font-semibold text-foreground">Liên kết</h4>
                <ul className="space-y-2 text-sm text-muted">
                  <li>
                    <Link href="/about" className="hover:text-foreground">
                      Về chúng tôi
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="hover:text-foreground">
                      Liên hệ
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="hover:text-foreground">
                      Điều khoản sử dụng
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="mb-4 text-md font-semibold text-foreground">Liên hệ</h4>
                <p className="text-sm text-muted">Email: support@vexenhanh.vn</p>
                <p className="text-sm text-muted">Hotline: 1900 xxxx</p>
              </div>
            </div>
            <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted">
              © {new Date().getFullYear()} VeXeNhanh. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </CustomerThemeProvider>
  );
}
