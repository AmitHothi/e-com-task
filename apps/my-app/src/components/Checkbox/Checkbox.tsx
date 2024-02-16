import { ChangeEvent, HTMLAttributes } from 'react';
import { cn } from '@/utils';

interface CheckboxProps extends HTMLAttributes<HTMLInputElement> {
  /**
   * labels
   */
  label?: string;

  /**
   * checked
   */
  checked?: boolean;

  /**
   * position class
   */
  positionClass?: string;

  /**
   * checkbox position
   */
  checkboxPosition?: 'left' | 'right';

  /**
   * checkbox className
   */
  className?: string;

  /**
   * text className
   */
  textClass?: string;

  /**
   * checkbox size
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * handle check
   */
  handleCheck?: (checked: boolean, e: ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox = ({
  label = '',
  positionClass,
  className,
  textClass,
  checked,
  size = 'small',
  checkboxPosition = 'left',
  handleCheck = () => null,
  ...restProps
}: CheckboxProps) => (
  <div
    className={cn(
      {
        'flex items-center gap-2': checkboxPosition === 'left',
        'flex flex-row-reverse justify-end items-center gap-2': checkboxPosition === 'right',
      },
      positionClass,
    )}>
    <input
      type="checkbox"
      className={cn(
        'rounded border-gray-300 text-primary-600 focus:ring-primary-600',
        {
          'h-4 w-4 text-red-400': size === 'small',
          'h-6 w-6': size === 'medium',
          'h-8 w-8': size === 'large',
        },
        className,
      )}
      checked={checked}
      onChange={(e) => handleCheck(e.target.checked, e)}
      {...restProps}
    />
    <span className={cn(textClass)}>{label}</span>
  </div>
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
