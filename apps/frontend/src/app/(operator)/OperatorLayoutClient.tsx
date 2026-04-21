'use client';

import { useState, type ComponentType, type ReactNode } from 'react';
import { CloseOutlined, MenuOutlined } from '@ant-design/icons';
import {
  Avatar,
  Button,
  ConfigProvider,
  Drawer,
  Input,
  Layout,
  Menu,
  type MenuProps,
} from 'antd';
import { useRouter, usePathname } from 'next/navigation';

import {
  OperatorBrandMarkIcon,
  OperatorBusIcon,
  OperatorDashboardIcon,
  OperatorEmployeeIcon,
  OperatorHelpIcon,
  OperatorLaunchIcon,
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
      icon: <Icon size={24} className="shrink-0" />,
      label: <span className="text-[16px] font-normal">{item.label}</span>,
    };
  });
}

function HeaderActionButton({
  label,
  icon,
}: {
  label: string;
  icon: ReactNode;
}) {
  return (
    <Button
      type="text"
      aria-label={label}
      icon={icon}
      className="!h-10 !w-10 !rounded-xl !text-[#475569] hover:!bg-white hover:!text-[#123d5c]"
    />
  );
}

function OperatorSidebar({
  pathname,
  onNavigate,
  onLogout,
}: {
  pathname: string;
  onNavigate: (href: string) => void;
  onLogout: () => void;
}) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#2b7ead',
          colorText: '#123d5c',
          colorBgContainer: '#f8fafc',
          borderRadius: 12,
        },
        components: {
          Menu: {
            itemBg: '#f8fafc',
            itemColor: '#475569',
            itemSelectedBg: '#eff6ff',
            itemSelectedColor: '#2b7ead',
            itemHoverBg: '#f2f6fb',
            itemHoverColor: '#123d5c',
            itemBorderRadius: 6,
            itemHeight: 48,
            itemMarginBlock: 4,
            itemMarginInline: 8,
            itemPaddingInline: 16,
          },
        },
      }}
    >
      <div className="flex h-full flex-col bg-[#f8fafc]">
        <div className="flex h-[72px] items-center px-6 py-2">
          <button
            type="button"
            onClick={() => onNavigate('/operator/dashboard')}
            className="flex items-center gap-3 text-left text-[#0a2840]"
          >
            <OperatorBrandMarkIcon size={40} />
            <div className="max-w-[140px] text-[18px] font-medium leading-[1.05]">
              Trang quản lý nhà xe
            </div>
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col px-2 py-8">
          <Menu
            mode="inline"
            selectedKeys={getSelectedNavKey(pathname)}
            items={createMenuItems()}
            onClick={({ key }) => onNavigate(String(key))}
            className="border-e-0 !bg-transparent"
            style={{
              borderInlineEnd: 'none',
              background: 'transparent',
            }}
          />

          <div className="mt-auto px-2 pt-6">
            <Button
              type="text"
              icon={<OperatorLogoutIcon size={20} className="shrink-0" />}
              onClick={onLogout}
              className="!flex !h-12 !w-full !items-center !justify-start !gap-4 !rounded-md !px-4 !text-[16px] !font-normal !text-[#475569] hover:!bg-[#f2f6fb] hover:!text-[#123d5c]"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}

export default function OperatorDashboardLayoutClient({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleNavigate = (href: string) => {
    setIsSidebarOpen(false);
    router.push(href);
  };

  const handleLogout = () => {
    setIsSidebarOpen(false);
    router.push('/operator/login');
  };

  return (
    <Layout className="!h-dvh !bg-[#f1f3fd]">
      <div className="hidden h-dvh shrink-0 md:block">
        <Sider
          width={256}
          theme="light"
          trigger={null}
          className="!h-dvh"
          style={{
            height: '100dvh',
            minHeight: '100dvh',
            background: '#f8fafc',
            borderRight: '1px solid #edf1f7',
          }}
        >
          <OperatorSidebar
            pathname={pathname}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        </Sider>
      </div>

      <Drawer
        open={isSidebarOpen}
        placement="left"
        closable={false}
        width={256}
        onClose={() => setIsSidebarOpen(false)}
        styles={{
          body: {
            padding: 0,
            background: '#f8fafc',
          },
        }}
      >
        <OperatorSidebar
          pathname={pathname}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      </Drawer>

      <Layout className="min-w-0 !bg-[#f1f3fd]">
        <Header
          className="!sticky !top-0 !z-30 !h-auto !bg-white/80 !px-4 !py-4 md:!px-6"
          style={{
            lineHeight: 'normal',
            borderBottom: '1px solid #edf1f7',
            backdropFilter: 'blur(6px)',
          }}
        >
          <div className="flex w-full flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-3">
              <Button
                type="text"
                aria-label={isSidebarOpen ? 'Đóng menu' : 'Mở menu'}
                icon={isSidebarOpen ? <CloseOutlined /> : <MenuOutlined />}
                onClick={() => setIsSidebarOpen((current: boolean) => !current)}
                className="!inline-flex !h-10 !w-10 !items-center !justify-center !rounded-xl !border !border-[#e7ebf2] !bg-white !text-[#475569] hover:!text-[#123d5c] md:!hidden"
              />

              <Input
                prefix={<OperatorSearchIcon size={20} className="text-[#4f6677]" />}
                placeholder="Tìm kiếm"
                bordered={false}
                className="w-full max-w-[287px]"
                style={{
                  height: 44,
                  background: '#ebeef7',
                  borderRadius: 2,
                  paddingInline: 13,
                  color: '#4f6677',
                  boxShadow: 'none',
                }}
              />
            </div>

            <div className="flex items-center justify-end gap-1 sm:gap-2">
              <HeaderActionButton
                label="Mở nhanh"
                icon={<OperatorLaunchIcon size={24} />}
              />
              <HeaderActionButton
                label="Trợ giúp"
                icon={<OperatorHelpIcon size={24} />}
              />
              <HeaderActionButton
                label="Cài đặt"
                icon={<OperatorSettingsIcon size={24} />}
              />

              <div className="ml-1 flex items-center gap-3 pl-1">
                <Avatar
                  size={40}
                  icon={<OperatorProfileIcon size={20} />}
                  style={{
                    backgroundColor: '#2b7ead',
                    border: '2px solid #f9f9ff',
                    color: '#ffffff',
                  }}
                />
                <div className="hidden text-left sm:block">
                  <div className="text-[18px] font-medium leading-none text-[#123d5c]">
                    Nhà xe Phương Trang
                  </div>
                  <div className="mt-1 text-[14px] leading-none text-[#3d5060]">
                    phuongtrang@mail.com
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Header>

        <Content className="min-h-0 overflow-y-auto !bg-[#f1f3fd] p-4 md:p-6">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
