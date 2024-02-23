import { SVGProps, forwardRef } from 'react';
import { ICONS } from '@/constants';
import { cn } from '@/utils';
import { IIcons } from '../../../types';

interface SvgIconProps extends SVGProps<SVGSVGElement> {
  /**
   * viewBox for icon
   */

  viewBox?: string;

  /**
   * key of the icon
   */
  icon: keyof IIcons;
}

const SvgIcon = forwardRef<SVGSVGElement, SvgIconProps>(
  ({ icon, viewBox = '0 0 16 16', className, ...rest }, ref): JSX.Element => (
    <svg
      className={cn('fill-current h-4 w-4', className)}
      ref={ref}
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      {...rest}>
      {ICONS[`${icon}`]}
    </svg>
  ),
);

SvgIcon.displayName = 'SvgIcon';

export default SvgIcon;
