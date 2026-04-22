import Link from 'next/link';
import { EyeInvisibleOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';

import {
  OperatorBrandMarkIcon,
  OperatorInformationBubbleIcon,
  OperatorShieldCheckIcon,
} from '@/components/icons';

const operatorAuthColors = {
  background: 'var(--operator-color-bg-surface)',
  panel: 'var(--operator-color-bg-brand-muted)',
  surface: 'var(--operator-color-bg-surface)',
  primary: 'var(--operator-color-primary)',
  primaryHover: 'var(--operator-color-primary-hover)',
  tertiary: 'var(--operator-color-tertiary)',
  textBase: 'var(--operator-color-text-base)',
  textMuted: 'var(--operator-color-text-muted)',
  textDisabled: 'var(--operator-color-text-disabled)',
  textBrand: 'var(--operator-color-text-brand)',
  border: 'var(--operator-color-primary)',
  borderSubtle: 'var(--operator-color-border-subtle)',
  onColor: 'var(--operator-color-text-on-color)',
  whiteGlass: 'rgba(255, 255, 255, 0.75)',
} as const;

const operatorFeatureItems = [
  {
    title: 'Quản lý an toàn',
    description: 'Mọi dữ liệu nội bộ của đối tác đều được bảo mật',
    icon: OperatorShieldCheckIcon,
  },
  {
    title: 'Dễ dàng sử dụng',
    description: 'Giao diện hiện đại, thân thiện thích nghi với người dùng',
    icon: OperatorInformationBubbleIcon,
  },
] as const;

export default function OperatorLoginPage() {
  return (
    <main
      className="min-h-screen"
      style={{
        background: operatorAuthColors.background,
      }}
    >
      <div className="grid min-h-screen lg:grid-cols-[minmax(360px,680px)_minmax(420px,1fr)]">
        <section
          className="relative flex min-h-[360px] flex-col justify-center gap-8 overflow-hidden px-7 py-10 lg:min-h-screen lg:px-9 lg:py-9"
          style={{
            background: operatorAuthColors.panel,
          }}
        >
          <div className="flex max-w-[572px] flex-col gap-8">
            <OperatorLoginLogo />

            <p
              className="text-center text-[18px] leading-[1.2] font-medium lg:text-left"
              style={{
                color: operatorAuthColors.textBase,
              }}
            >
              Hệ thống quản lý dành cho đối tác nhà xe hiện đại chuyên nghiệp
            </p>

            <div className="flex flex-col gap-6">
              {operatorFeatureItems.map((item) => (
                <OperatorFeatureItem
                  key={item.title}
                  icon={<item.icon size={24} />}
                  title={item.title}
                  description={item.description}
                />
              ))}
            </div>
          </div>

          <div className="mt-4 lg:absolute lg:bottom-9 lg:left-6 lg:mt-0">
            <div
              className="inline-flex items-center gap-2 rounded-full px-6 py-3"
              style={{
                background: operatorAuthColors.primary,
              }}
            >
              <span
                className="size-5 rounded-full"
                style={{
                  background: operatorAuthColors.tertiary,
                }}
              />
              <span
                className="text-[16px] leading-none font-normal"
                style={{
                  color: operatorAuthColors.onColor,
                }}
              >
                Giao diện
              </span>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center bg-surface px-6 py-12 lg:px-10 lg:py-[138px]">
          <div className="w-full max-w-[444px]">
            <div className="flex flex-col gap-3">
              <h1
                className="text-center text-[28px] leading-none font-semibold"
                style={{
                  color: operatorAuthColors.textBase,
                }}
              >
                Đăng nhập nhà xe
              </h1>

              <p
                className="max-w-[297px] text-[22px] leading-[1.2] font-medium"
                style={{
                  color: operatorAuthColors.textBase,
                }}
              >
                Truy cập vào hệ thống quản lý của quý đối tác
              </p>
            </div>

            <div className="pt-6">
              <div className="flex flex-col gap-6 rounded-2xl py-6">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="operator-code"
                    className="text-[18px] leading-[1.2] font-medium"
                    style={{
                      color: operatorAuthColors.textBase,
                    }}
                  >
                    Mã đăng nhập
                  </label>
                  <Input
                    id="operator-code"
                    placeholder="OP-ABC-101"
                    size="large"
                    className="h-14"
                    styles={{
                      input: {
                        fontSize: 16,
                        lineHeight: 1,
                        color: operatorAuthColors.textBase,
                      },
                    }}
                    style={{
                      height: 56,
                      borderRadius: 8,
                      borderColor: operatorAuthColors.border,
                      boxShadow: 'none',
                      paddingInline: 16,
                    }}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="operator-password"
                    className="text-[18px] leading-[1.2] font-medium"
                    style={{
                      color: operatorAuthColors.textBase,
                    }}
                  >
                    Mật khẩu
                  </label>
                  <Input
                    id="operator-password"
                    type="password"
                    placeholder="••••••••"
                    size="large"
                    suffix={<EyeInvisibleOutlined style={{ color: operatorAuthColors.primary }} />}
                    className="h-14"
                    styles={{
                      input: {
                        fontSize: 16,
                        lineHeight: 1,
                        color: operatorAuthColors.textBase,
                      },
                      suffix: {
                        color: operatorAuthColors.primary,
                      },
                    }}
                    style={{
                      height: 56,
                      borderRadius: 8,
                      borderColor: operatorAuthColors.border,
                      boxShadow: 'none',
                      paddingInline: 16,
                    }}
                  />
                </div>

                <Button
                  type="primary"
                  size="large"
                  className="h-14 rounded-lg border-none text-[22px] leading-[1.2] font-medium shadow-none!"
                  style={{
                    background: operatorAuthColors.primary,
                    color: operatorAuthColors.onColor,
                  }}
                >
                  Đăng nhập
                </Button>

                <p
                  className="text-center text-[18px] leading-[1.2] font-medium"
                  style={{
                    color: operatorAuthColors.textBase,
                  }}
                >
                  Gặp vấn đề khi đăng nhập liên hệ{' '}
                  <Link
                    href="mailto:hotro@vexenhanh.vn"
                    className="transition-colors"
                    style={{
                      color: operatorAuthColors.textBrand,
                    }}
                  >
                    Bộ phận hỗ trợ
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function OperatorLoginLogo() {
  return (
    <div className="flex items-center gap-4">
      <OperatorBrandMarkIcon size={72} />
      <div className="flex items-baseline text-[38px] leading-none font-semibold tracking-[-0.02em] sm:text-[40px]">
        <span style={{ color: 'var(--operator-palette-primary-500)' }}>VéXe</span>
        <span style={{ color: 'var(--operator-palette-tertiary-500)' }}>Nhanh</span>
      </div>
    </div>
  );
}

function OperatorFeatureItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex max-w-[572px] items-center gap-[10px]">
      <div
        className="flex size-12 shrink-0 items-center justify-center rounded-lg"
        style={{
          background: operatorAuthColors.whiteGlass,
          color: operatorAuthColors.primary,
        }}
      >
        {icon}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <p
          className="text-[18px] leading-[1.2] font-medium"
          style={{
            color: operatorAuthColors.textBase,
          }}
        >
          {title}
        </p>
        <p
          className="text-[14px] leading-[1.2] font-medium tracking-[0.14px]"
          style={{
            color: operatorAuthColors.textMuted,
          }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
