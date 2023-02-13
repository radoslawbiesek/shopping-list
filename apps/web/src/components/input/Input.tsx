import * as React from 'react';
import classNames from 'classnames';

import { Size, Variant, WithClassName } from '../../types/styles';

type InputProps = React.ComponentPropsWithRef<'input'> &
  WithClassName<{
    label: string;
    errorMessage?: string;
    bordered?: boolean;
    variant?: Variant;
    size?: Size;
  }>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ name, label, bordered, errorMessage, className, ...rest }, ref) => {
    return (
      <div className="form-control mt-4">
        <label htmlFor={name} className="label text-sm mb-0 p-1 font-medium">
          {label}
        </label>
        <input
          name={name}
          className={classNames(
            'input',
            { 'input-bordered': bordered },
            { 'border-base-200': !errorMessage },
            { 'border-red-700': errorMessage },
            'block',
            'w-full',
            className,
          )}
          ref={ref}
          {...rest}
        />
        {errorMessage && <p className="my-1 text-sm text-red-700">{errorMessage}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';
