'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

import { ErrorOption, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import * as listsService from '../../../services/lists.service';

import { Input } from '../../ui/input/Input';
import { Button } from '../../ui/button/Button';
import { ErrorMessage } from '../../error-message';

export function ListForm() {
  const router = useRouter();

  const defaultValues = {
    name: '',
  };

  const schema = z.object({
    name: z
      .string()
      .min(1, { message: 'Nazwa jest wymagana' })
      .max(25, { message: 'Nazwa użytkownika nie może mieć więcej niż 25 znaków' }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const setRootError = (error: ErrorOption) => {
    setError('root', error);
  };

  const clearRootError = () => {
    clearErrors('root');
  };

  const onSubmit = async (listData: typeof defaultValues) => {
    setIsSubmitting(true);
    try {
      await listsService.create(listData);
      router.push('/lists');
    } catch (error) {
      if (error instanceof listsService.create.Error) {
        setRootError({ message: error.data.message });
      } else {
        console.error(error);
        setRootError({ message: 'Coś poszło nie tak. Spróbuj ponownie później.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} onChange={clearRootError}>
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
