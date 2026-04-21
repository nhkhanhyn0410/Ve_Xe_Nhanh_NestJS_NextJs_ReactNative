import type { ReactNode } from 'react';

import type { SvgIconProps } from './types';

interface SvgIconBaseProps extends SvgIconProps {
  children: ReactNode;
  viewBox?: string;
}

export function SvgIconBase({
  size = 24,
  title,
  children,
  viewBox = '0 0 24 24',
  className,
  ...props
}: SvgIconBaseProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : 'presentation'}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}
