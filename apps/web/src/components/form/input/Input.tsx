import * as React from 'react';

import { Input as DInput, InputProps as DInputProps } from 'react-daisyui';

type InputProps = React.ComponentPropsWithRef<'input'> &
  DInputProps & {
    label: string;
    errorMessage?: string;
  };

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ name, label, errorMessage, ...rest }, ref) => {
    return (
      <div className="mt-4">
        <label htmlFor={name} className="block text-sm font-medium mb-1">
          {label}
        </label>
        <DInput
          name={name}
          className={`block w-full ${errorMessage ? 'border-red-700' : 'border-base-300'}`}
          ref={ref}
          {...rest}
        />
        {errorMessage && <p className="my-1 text-sm text-red-700">{errorMessage}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';
