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
  width,
  height,
  ...props
}: SvgIconBaseProps) {
  const resolvedWidth = width ?? (height == null ? size : undefined);
  const resolvedHeight = height ?? (width == null ? size : undefined);

  return (
    <svg
      width={resolvedWidth}
      height={resolvedHeight}
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
