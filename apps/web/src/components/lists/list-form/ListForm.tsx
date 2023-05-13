'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import * as listsActions from '../../../actions/lists.actions';

import { Input } from '../../ui/input/Input';
import { Button } from '../../ui/button/Button';
import { ErrorMessage } from '../../error-message';

const defaultValues = {
  name: '',
};

const schema = z.object({
  name: z
    .string()
    .min(1, { message: 'Nazwa jest wymagana' })
    .max(25, { message: 'Nazwa użytkownika nie może mieć więcej niż 25 znaków' }),
});

export function ListForm() {
  const router = useRouter();

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

  const onSubmit = async (listData: typeof defaultValues) => {
    try {
      await listsActions.create(listData);
      router.push('/lists');
    } catch (error) {
      setError('root', { message: 'Coś poszło nie tak. Spróbuj ponownie później.' });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} onChange={() => clearErrors('root')}>
      <Input
        {...register('name')}
        label="Nazwa"
        placeholder="Nazwa"
        errorMessage={errors.name?.message}
      />
      {errors.root?.message && <ErrorMessage>{errors.root.message}</ErrorMessage>}
      <Button
        variant="primary"
        fullWidth
        loading={isSubmitting}
        disabled={isSubmitting}
        className="mt-6"
      >
        Zapisz
      </Button>
    </form>
  );
}
