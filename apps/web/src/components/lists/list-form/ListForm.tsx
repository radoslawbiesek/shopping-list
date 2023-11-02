'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from '@nextui-org/react';

import * as listsActions from 'actions/lists.actions';
import { createListRequestBodySchema } from 'api/src/lists/lists.schema';

const defaultValues = {
  name: '',
};

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
    resolver: zodResolver(createListRequestBodySchema),
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      onChange={() => clearErrors('root')}
      className="flex flex-col gap-4"
    >
      <Input
        {...register('name')}
        label="Nazwa"
        placeholder="Nazwa"
        isInvalid={!!errors.name?.message}
        errorMessage={errors.name?.message}
      />
      {errors.root?.message && <p className="text-danger">{errors.root.message}</p>}
      <Button
        type="submit"
        color="primary"
        fullWidth
        isLoading={isSubmitting}
        isDisabled={isSubmitting}
      >
        Zapisz
      </Button>
      <Button color="danger" fullWidth onClick={() => router.back()}>
        Anuluj
      </Button>
    </form>
  );
}
