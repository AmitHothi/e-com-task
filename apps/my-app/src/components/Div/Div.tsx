import { HTMLAttributes, ReactNode, forwardRef } from 'react';
import { cn } from '@/utils';

export interface IDivProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * children element
   */
  children?: ReactNode;

  /**
   * For flex row
   */
  row?: boolean;

  /**
   * For align items center
   */
  itemsCenter?: boolean;

  /**
   * For align items start
   */
  itemsStart?: boolean;

  /**
   * For align items end
   */
  itemsEnd?: boolean;

  /**
   * For justify content center
   */
  justifyCenter?: boolean;

  /**
   * For justify content start
   */
  justifyStart?: boolean;

  /**
   * For justify content end
   */
  justifyEnd?: boolean;

  /**
   * classes for styling
   */
  className?: string;
}
const Div = forwardRef<HTMLDivElement, IDivProps>(
  (
    {
      children,
      row = false,
      itemsCenter = false,
      itemsStart = false,
      itemsEnd = false,
      justifyCenter = false,
      justifyStart = false,
      justifyEnd = false,
      className = '',
      ...restProps
    },
    ref,
  ): JSX.Element => (
    <div
      ref={ref}
      className={cn(
        {
          'flex flex-row': row,
          'flex items-center': itemsCenter,
          'flex items-start': itemsStart,
          'flex items-end': itemsEnd,
          'flex justify-center': justifyCenter,
          'flex justify-start': justifyStart,
          'flex justify-end': justifyEnd,
        },
        className,
      )}
      {...restProps}>
      {children}
    </div>
  ),
);

Div.displayName = 'Div';

export default Div;
