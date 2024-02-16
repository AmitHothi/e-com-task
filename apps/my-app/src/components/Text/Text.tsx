import { HTMLAttributes, ReactNode, forwardRef } from 'react';
import { cn } from '@/utils';

export interface ITextProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * children element
   */
  children: ReactNode;

  /**
   * classes for styling
   */
  className?: string;
}
const Text = forwardRef<HTMLSpanElement, ITextProps>(
  ({ children, className = '', ...restProps }, ref): JSX.Element => (
    <span ref={ref} className={cn('text-black', className)} {...restProps}>
      {children}
    </span>
  ),
);

Text.displayName = 'Text';

export default Text;
