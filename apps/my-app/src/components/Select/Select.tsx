import { SelectHTMLAttributes, forwardRef } from 'react';
import Div from '@/components/Div';
import Text from '@/components/Text';
import { cn } from '@/utils';
import { ISelectOption } from '../../../types';

export interface ISelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  /**
   * label for select
   */
  label?: string;

  /**
   * label class
   */
  labelClass?: string; 

  /**
   * placeholder for select
   */
  placeholder?: string;

  /**
   * options
   */
  options?: ISelectOption[];

  /**
   * value
   */
  value?: string | number;

  /**
   * size
   */
  selectSize?: 'small' | 'medium' | 'large';

  /**
   * error message
   */
  errorMessage?: string;

  /**
   * variant
   */
  variant?: 'filled' | 'standard' | 'outlined';

  /**
   * classes for error styling
   */
  errorClass?: string;

  /**
   * classes for styling
   */
  className?: string;
}

const Select = forwardRef<HTMLSelectElement, ISelectProps>(
  (
    {
      label = 'Default',
      selectSize = 'small',
      placeholder = 'Select',
      variant = 'filled',
      options = [],
      errorMessage,
      labelClass,
      className = '',
      errorClass,
      value,
      ...restProps
    },
    ref,
  ): JSX.Element => (
    <div>
      <Text className={cn(' font-bold text-sm', labelClass)}>{label}</Text>
      <select
        ref={ref}
        value={value}
        className={cn(
          'w-full mt-1 border-2 border-solid border-black-300 hover:border-primary hover:outline-none p-2 rounded-md',
          {
            'text-sm  py-2 px-2': selectSize === 'small',
            'text-xl py-3 px-3': selectSize === 'medium',
            'text-2xl py-4 px-4': selectSize === 'large',
            'border-0 border-b-2 border-gray-200 focus:border-0 focus:ring-0 focus:border-b-2 focus:border-primary rounded-none':
              variant === 'standard',
            'border focus:outline ': variant === 'outlined',
            'border bg-gray-300 focus:outline': variant === 'filled',
            'border-red-600 focus:border-red-600 hover:border-red-600 focus:ring-0': errorMessage,
          },
          className,
        )}
        {...restProps}>
        <option disabled value="">
          {placeholder}
        </option>
        {options.map((val, index) => (
          <option key={`index_${index + 1}`} value={val.value}>
            {val.label}
          </option>
        ))}
      </select>
      {errorMessage && (
        <Div className="pl-">
          <Text className={cn('text-red-600', errorClass)}>{errorMessage}</Text>
        </Div>
      )}
    </div>
  ),
);

Select.displayName = 'Select';

export default Select;
