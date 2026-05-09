import type { SVGProps } from 'react';

export interface SvgIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
  title?: string;
}
