import Link from 'next/link';
import { EyeInvisibleOutlined } from '@ant-design/icons';

import {
  OperatorBrandMarkIconFullSize,
  OperatorInformationBubbleIcon,
  OperatorShieldCheckIcon,
} from '@/components/icons';
import styles from './page.module.css';

const operatorAuthColors = {
  background: 'var(--operator-color-bg-surface)',
  panel: 'var(--operator-color-bg-brand-muted)',
  surface: 'var(--operator-color-bg-surface)',
  primary: 'var(--operator-color-primary)',
  tertiary: 'var(--operator-color-tertiary)',
  textBase: 'var(--operator-color-text-base)',
  textMuted: 'var(--operator-color-text-muted)',
  textDisabled: 'var(--operator-color-text-disabled)',
  textBrand: 'var(--operator-color-text-brand)',
  borderBrand: 'var(--operator-color-border-brand)',
  borderFocus: 'var(--operator-color-border-focus)',
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
      <div className={styles.shell}>
        <div className={styles.frame}>
          <div className={styles.layout}>
            <section
              className="relative flex flex-col overflow-hidden px-6 py-8 md:px-8 md:py-10 lg:min-h-full lg:px-6 lg:py-0"
              style={{
                background: operatorAuthColors.panel,
              }}
            >
              <div className="relative z-10 flex flex-1 items-center">
                <div className={`${styles.leftPanelContent} flex flex-col gap-8`}>
                  <div className="flex flex-col gap-3">
                    <OperatorBrandMarkIconFullSize
                      width={376}
                      height={96}
                      className="h-auto w-full max-w-94"
                    />

                    <p
                      className="text-[18px] leading-[1.2] font-medium"
                      style={{
                        color: operatorAuthColors.textBase,
                      }}
                    >
                      Hệ thống quản lý dành cho đối tác nhà xe hiện đại chuyên nghiệp
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
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
              </div>

              <div className="relative z-10 mt-8 lg:absolute lg:bottom-9 lg:left-6 lg:mt-0">
                <div
                  className="inline-flex h-10 w-43 items-center justify-center gap-2 rounded-full px-4 py-2"
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

            <section
              className="flex items-center justify-center px-6 py-10 md:px-8 lg:min-h-full lg:px-6 lg:py-0"
              style={{
                background: operatorAuthColors.surface,
              }}
            >
              <div className={styles.rightPanelContent}>
                <div className="flex flex-col gap-2.5">
                  <h1
                    className="text-center text-[28px] leading-none font-semibold"
                    style={{
                      color: operatorAuthColors.textBase,
                    }}
                  >
                    Đăng nhập nhà xe
                  </h1>

                  <p
                    className="text-[22px] leading-[1.2] font-medium"
                    style={{
                      color: operatorAuthColors.textBase,
                      maxWidth: 297,
                    }}
                  >
                    Truy cập vào hệ thống quản lý của quý đối tác
                  </p>
                </div>

                <form className="mt-8 flex flex-col gap-6" noValidate>
                  <OperatorAuthField
                    id="operator-code"
                    label="Mã đăng nhập"
                    name="operatorCode"
                    type="text"
                    placeholder="OP-ABC-101"
                    autoComplete="username"
                  />

                  <OperatorAuthField
                    id="operator-password"
                    label="Mật khẩu"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    suffix={
                      <span
                        className="flex size-5 shrink-0 items-center justify-center"
                        style={{
                          color: operatorAuthColors.primary,
                        }}
                      >
                        <EyeInvisibleOutlined style={{ fontSize: 18 }} />
                      </span>
                    }
                  />

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center rounded-lg border-0 text-[22px] leading-[1.2] font-medium transition-colors"
                    style={{
                      height: 54,
                      background: operatorAuthColors.primary,
                      color: operatorAuthColors.onColor,
                    }}
                  >
                    Đăng nhập
                  </button>

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
                </form>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

function OperatorAuthField({
  id,
  label,
  name,
  type,
  placeholder,
  autoComplete,
  suffix,
}: {
  id: string;
  label: string;
  name: string;
  type: 'text' | 'password';
  placeholder: string;
  autoComplete: string;
  suffix?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="text-[18px] leading-[1.2] font-medium"
        style={{
          color: operatorAuthColors.textBase,
        }}
      >
        {label}
      </label>

      <div
        className={`${styles.authField} flex h-14 items-center gap-3 rounded-lg border px-4 transition-[border-color,box-shadow]`}
        style={{
          borderColor: operatorAuthColors.borderBrand,
          boxShadow: 'none',
          background: operatorAuthColors.surface,
        }}
      >
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          autoCapitalize="none"
          spellCheck={false}
          className={`${styles.loginInput} block h-full w-full border-0 bg-transparent text-base leading-none outline-none placeholder:font-normal`}
          style={{
            caretColor: operatorAuthColors.primary,
          }}
        />

        {suffix}
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
    <div className="flex w-full max-w-143 items-center gap-2.5">
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
