import { SVGProps, forwardRef } from 'react';
import { ICONS } from '@/constants';
import { IIcons } from '../../../types';
// import { cn } from '@/utils';

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
      className="fill-current h-4 w-4"
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
