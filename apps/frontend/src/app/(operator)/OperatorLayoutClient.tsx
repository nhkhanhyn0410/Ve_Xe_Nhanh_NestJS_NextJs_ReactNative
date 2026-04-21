'use client';

import clsx from 'clsx';
import { useState, type ComponentType, type ReactNode } from 'react';
import {
  CloseOutlined,
  MenuFoldOutlined,
  MenuOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Avatar, Button, ConfigProvider, Drawer, Input, Layout, Menu, type MenuProps } from 'antd';
import { useRouter, usePathname } from 'next/navigation';

import {
  OperatorBrandMarkIcon,
  OperatorBusIcon,
  OperatorDashboardIcon,
  OperatorEmployeeIcon,
  OperatorHelpIcon,
  OperatorNotificationIcon,
  // OperatorLaunchIcon,
  OperatorLogoutIcon,
  OperatorProfileIcon,
  OperatorReportIcon,
  OperatorRouteIcon,
  OperatorSearchIcon,
  OperatorSettingsIcon,
  OperatorStopPointIcon,
  OperatorTransactionIcon,
  OperatorTripIcon,
  OperatorVoucherIcon,
  type SvgIconProps,
} from '@/components/icons';

const { Header, Content, Sider } = Layout;
const DESKTOP_SIDER_WIDTH = 296;
const MOBILE_SIDER_WIDTH = 296;
const COLLAPSED_SIDER_WIDTH = 96;
const operatorLayoutColors = {
  primary: 'var(--operator-color-primary)',
  primaryHover: 'var(--operator-color-primary-hover)',
  textBase: 'var(--operator-color-text-base)',
  textMuted: 'var(--operator-color-text-muted)',
  textBrand: 'var(--operator-color-text-brand)',
  textBrandHover: 'var(--operator-color-text-brand-hover)',
  textLogo: 'var(--operator-palette-primary-900)',
  textField: 'var(--operator-palette-secondary-600)',
  textSecondaryStrong: 'var(--operator-palette-secondary-700)',
  bgPage: 'var(--operator-color-bg-panel)',
  bgSurface: 'var(--operator-color-bg-surface)',
  bgField: 'var(--operator-color-bg-field)',
  bgBrandSubtle: 'var(--operator-color-bg-brand-subtle)',
  bgGhostHover: 'var(--operator-color-interactive-ghost-hover)',
  border: 'var(--operator-color-border)',
  borderSubtle: 'var(--operator-color-border-subtle)',
  onColor: 'var(--operator-color-text-on-color)',
} as const;

interface NavItem {
  href: string;
  aliases?: string[];
  label: string;
  exact?: boolean;
  icon: ComponentType<SvgIconProps>;
}

const navItems: NavItem[] = [
  {
    href: '/operator/dashboard',
    aliases: ['/dashboard', '/operator'],
    label: 'Dashboard',
    exact: true,
    icon: OperatorDashboardIcon,
  },
  {
    href: '/operator/routes',
    aliases: ['/dashboard/routes', '/operator/dashboard/routes'],
    label: 'Quản lý tuyến đường',
    icon: OperatorRouteIcon,
  },
  {
    href: '/operator/stop-points',
    aliases: ['/dashboard/stop-points', '/operator/dashboard/stop-points'],
    label: 'Quản lý điểm dừng',
    icon: OperatorStopPointIcon,
  },
  {
    href: '/operator/buses',
    aliases: ['/dashboard/buses', '/operator/dashboard/buses'],
    label: 'Quản lý đội xe',
    icon: OperatorBusIcon,
  },
  {
    href: '/operator/employees',
    aliases: ['/dashboard/employees', '/operator/dashboard/employees'],
    label: 'Quản lý nhân viên',
    icon: OperatorEmployeeIcon,
  },
  {
    href: '/operator/trips',
    aliases: ['/dashboard/trips', '/operator/dashboard/trips'],
    label: 'Quản lý chuyến xe',
    icon: OperatorTripIcon,
  },
  {
    href: '/operator/transactions',
    aliases: ['/dashboard/transactions', '/operator/dashboard/transactions'],
    label: 'Quản lý giao dịch',
    icon: OperatorTransactionIcon,
  },
  {
    href: '/operator/vouchers',
    aliases: ['/dashboard/vouchers', '/operator/dashboard/vouchers'],
    label: 'Quản lý mã giảm',
    icon: OperatorVoucherIcon,
  },
  {
    href: '/operator/reports',
    aliases: ['/dashboard/reports', '/operator/dashboard/reports'],
    label: 'Báo cáo',
    icon: OperatorReportIcon,
  },
];

function isNavItemActive(pathname: string, item: NavItem): boolean {
  const candidates = [item.href, ...(item.aliases ?? [])];

  return candidates.some((candidate) => {
    if (item.exact) {
      return pathname === candidate;
    }

    return pathname === candidate || pathname.startsWith(`${candidate}/`);
  });
}

function getSelectedNavKey(pathname: string): string[] {
  const activeItem = navItems.find((item) => isNavItemActive(pathname, item));

  return activeItem ? [activeItem.href] : [];
}

function createMenuItems(): MenuProps['items'] {
  return navItems.map((item) => {
    const Icon = item.icon;

    return {
      key: item.href,
      title: item.label,
      icon: <Icon size={24} className="shrink-0" />,
      label: <span className="text-[16px] font-normal">{item.label}</span>,
    };
  });
}

function HeaderActionButton({ label, icon }: { label: string; icon: ReactNode }) {
  return (
    <Button
      type="text"
      aria-label={label}
      icon={icon}
      className="h-10! w-10! rounded-xl!"
      style={{
        color: operatorLayoutColors.textMuted,
      }}
    />
  );
}

function OperatorSidebar({
  pathname,
  onNavigate,
  onLogout,
  collapsed,
}: {
  pathname: string;
  onNavigate: (href: string) => void;
  onLogout: () => void;
  collapsed: boolean;
}) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: operatorLayoutColors.primary,
          colorText: operatorLayoutColors.textBase,
          colorBgContainer: operatorLayoutColors.bgSurface,
          borderRadius: 12,
        },
        components: {
          Menu: {
            itemBg: operatorLayoutColors.bgSurface,
            itemColor: operatorLayoutColors.textMuted,
            itemSelectedBg: operatorLayoutColors.bgBrandSubtle,
            itemSelectedColor: operatorLayoutColors.primary,
            itemHoverBg: operatorLayoutColors.bgGhostHover,
            itemHoverColor: operatorLayoutColors.textBrandHover,
            itemBorderRadius: 6,
            itemHeight: 48,
            itemMarginBlock: 4,
            itemMarginInline: 8,
            itemPaddingInline: 16,
          },
        },
      }}
    >
      <div
        className="flex h-full flex-col"
        style={{
          background: operatorLayoutColors.bgSurface,
        }}
      >
        <div
          className={clsx(
            'flex min-h-25 items-center border-b',
            collapsed ? 'justify-center px-4' : 'px-5 lg:px-6',
          )}
          style={{
            borderBottomColor: operatorLayoutColors.borderSubtle,
          }}
        >
          <button
            type="button"
            onClick={() => onNavigate('/operator/dashboard')}
            className={clsx(
              'flex items-center text-left',
              collapsed ? 'justify-center' : 'gap-3.5',
            )}
            style={{
              color: operatorLayoutColors.textLogo,
            }}
            aria-label="Về dashboard nhà xe"
          >
            <OperatorBrandMarkIcon size={48} />
            {collapsed ? null : (
              <div className="max-w-45.5 text-[18px] leading-[1.05] font-medium">
                Trang quản lý nhà xe
              </div>
            )}
          </button>
        </div>

        <div className={clsx('flex min-h-0 flex-1 flex-col px-3', collapsed ? 'py-6' : 'py-7')}>
          <Menu
            mode="inline"
            inlineCollapsed={collapsed}
            selectedKeys={getSelectedNavKey(pathname)}
            items={createMenuItems()}
            onClick={({ key }) => onNavigate(String(key))}
            className="border-e-0 bg-transparent!"
            style={{
              borderInlineEnd: 'none',
              background: 'transparent',
            }}
          />

          <div className={clsx('mt-auto px-2', collapsed ? 'pt-4' : 'pt-6')}>
            <Button
              type="text"
              icon={<OperatorLogoutIcon size={20} className="shrink-0" />}
              onClick={onLogout}
              className={clsx(
                'flex! h-12! w-full! items-center! rounded-md! text-[16px]! font-normal!',
                collapsed ? 'justify-center! px-0!' : 'justify-start! gap-4! px-4!',
              )}
              style={{
                color: operatorLayoutColors.textMuted,
              }}
              aria-label="Đăng xuất"
            >
              {collapsed ? null : 'Logout'}
            </Button>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}

export default function OperatorDashboardLayoutClient({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleNavigate = (href: string) => {
    setIsSidebarOpen(false);
    router.push(href);
  };

  const handleLogout = () => {
    setIsSidebarOpen(false);
    router.push('/operator/login');
  };

  return (
    <Layout
      className="h-dvh"
      style={{
        background: operatorLayoutColors.bgPage,
      }}
    >
      <div className="hidden h-dvh shrink-0 md:block">
        <Sider
          collapsible
          collapsed={isSidebarCollapsed}
          collapsedWidth={COLLAPSED_SIDER_WIDTH}
          width={DESKTOP_SIDER_WIDTH}
          breakpoint="xl"
          onBreakpoint={(broken) => setIsSidebarCollapsed(broken)}
          theme="light"
          trigger={null}
          className="h-dvh"
          style={{
            height: '100dvh',
            minHeight: '100dvh',
            background: operatorLayoutColors.bgSurface,
            borderRight: `1px solid ${operatorLayoutColors.borderSubtle}`,
          }}
        >
          <OperatorSidebar
            pathname={pathname}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            collapsed={isSidebarCollapsed}
          />
        </Sider>
      </div>

      <Drawer
        open={isSidebarOpen}
        placement="left"
        closable={false}
        size={MOBILE_SIDER_WIDTH}
        onClose={() => setIsSidebarOpen(false)}
        styles={{
          body: {
            padding: 0,
            background: operatorLayoutColors.bgSurface,
          },
        }}
      >
        <OperatorSidebar
          pathname={pathname}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          collapsed={false}
        />
      </Drawer>

      <Layout
        className="min-w-0"
        style={{
          background: operatorLayoutColors.bgPage,
        }}
      >
        <Header
          className="sticky top-0 z-30"
          style={{
            height: 'auto',
            padding: 0,
            lineHeight: 'normal',
            background: operatorLayoutColors.bgSurface,
            borderBottom: `1px solid ${operatorLayoutColors.borderSubtle}`,
            backdropFilter: 'blur(6px)',
          }}
        >
          <div className="flex min-h-25 w-full flex-col gap-4 px-5 py-4 lg:px-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <Button
                type="default"
                aria-label={isSidebarCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
                icon={isSidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setIsSidebarCollapsed((current: boolean) => !current)}
                className="hidden h-10! w-10! items-center! justify-center! rounded-xl! border! md:inline-flex!"
                style={{
                  background: operatorLayoutColors.bgSurface,
                  borderColor: operatorLayoutColors.borderSubtle,
                  color: operatorLayoutColors.textMuted,
                  boxShadow: 'none',
                }}
              />

              <Button
                type="default"
                aria-label={isSidebarOpen ? 'Đóng menu' : 'Mở menu'}
                icon={isSidebarOpen ? <CloseOutlined /> : <MenuOutlined />}
                onClick={() => setIsSidebarOpen((current: boolean) => !current)}
                className="inline-flex! h-10! w-10! items-center! justify-center! rounded-xl! border! md:hidden!"
                style={{
                  background: operatorLayoutColors.bgSurface,
                  borderColor: operatorLayoutColors.borderSubtle,
                  color: operatorLayoutColors.textMuted,
                  boxShadow: 'none',
                }}
              />

              <Input
                prefix={<OperatorSearchIcon size={20} style={{ color: operatorLayoutColors.textField }} />}
                placeholder="Tìm kiếm"
                variant="borderless"
                className="w-full max-w-71.75"
                style={{
                  height: 44,
                  background: operatorLayoutColors.bgField,
                  borderRadius: 12,
                  paddingInline: 13,
                  color: operatorLayoutColors.textField,
                  boxShadow: 'none',
                }}
              />
            </div>

            <div className="flex items-center justify-end gap-1 sm:gap-2">
              <HeaderActionButton label="Mở nhanh" icon={<OperatorNotificationIcon size={24} />} />
              <HeaderActionButton label="Trợ giúp" icon={<OperatorHelpIcon size={24} />} />
              <HeaderActionButton label="Cài đặt" icon={<OperatorSettingsIcon size={24} />} />

              <div className="ml-1 flex items-center gap-3 pl-1">
                <Avatar
                  size={40}
                  icon={<OperatorProfileIcon size={20} />}
                  style={{
                    backgroundColor: operatorLayoutColors.primary,
                    border: `2px solid ${operatorLayoutColors.bgSurface}`,
                    color: operatorLayoutColors.onColor,
                  }}
                />
                <div className="hidden text-left sm:block">
                  <div
                    className="text-[18px] leading-none font-medium"
                    style={{
                      color: operatorLayoutColors.textBrand,
                    }}
                  >
                    Nhà xe Phương Trang
                  </div>
                  <div
                    className="mt-1 text-[14px] leading-none"
                    style={{
                      color: operatorLayoutColors.textSecondaryStrong,
                    }}
                  >
                    phuongtrang@mail.com
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Header>

        <Content
          className="min-h-0 overflow-y-auto p-4 md:p-6"
          style={{
            background: operatorLayoutColors.bgPage,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
