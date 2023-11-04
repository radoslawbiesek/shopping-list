'use client';

import * as React from 'react';

import { useForm, DeepPartial } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

export type FormProps<T extends z.ZodTypeAny, U extends Record<string, any>> = {
  schema: T;
  defaultValues: DeepPartial<U>;
  children: React.ReactElement[];
  onSubmit: (data: U) => Promise<void>;
};

export function Form<T extends z.ZodTypeAny, U extends Record<string, any>>({
  defaultValues,
  schema,
  children,
  onSubmit,
}: FormProps<T, U>) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const onFormSubmit = async (data: U) => {
    try {
      await onSubmit(data);
    } catch (error) {
      setError('root', { message: 'Coś poszło nie tak. Spróbuj ponownie później.' });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      onChange={() => clearErrors('root')}
      className="flex flex-col gap-4"
    >
      {React.Children.map(children, (child) => {
        const name: string | undefined = child.props.name;
        if (name) {
          return React.createElement(child.type, {
            ...{
              ...child.props,
              ...register(child.props.name),
              key: child.props.name,
              isInvalid: !!errors?.[name]?.message,
              errorMessage: errors?.[name]?.message,
            },
          });
        }

        if (child.props.type === 'submit') {
          return React.createElement(child.type, {
            ...{
              ...child.props,
              isLoading: isSubmitting,
              isDisabled: isSubmitting,
            },
          });
        }

        return child;
      })}
      {errors.root?.message && <p className="text-danger">{errors.root.message}</p>}
    </form>
  );
}
