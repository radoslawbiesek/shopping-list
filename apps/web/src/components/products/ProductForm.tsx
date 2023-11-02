'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Textarea, Select, SelectItem } from '@nextui-org/react';

import * as productsActions from 'actions/products.actions';
import * as categoriesService from 'services/categories.service';
import { createProductRequestBodySchema } from 'api/src/products/products.schema';

const defaultValues = {
  name: '',
  description: '',
  image: '',
  categoryId: null,
};

export function ProductForm({
  categories,
}: {
  categories: Awaited<ReturnType<typeof categoriesService.getAll>>['data'];
}) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm({
    defaultValues,
    resolver: zodResolver(createProductRequestBodySchema),
  });

  const onSubmit = async (productData: typeof defaultValues) => {
    try {
      await productsActions.create(productData);
      router.push('/products');
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
        placeholder="Podaj nazwę"
        isInvalid={!!errors.name?.message}
        errorMessage={errors.name?.message}
        isRequired
      />
      <Textarea
        {...register('description')}
        label="Opis"
        placeholder="Podaj opis"
        isInvalid={!!errors.description?.message}
        errorMessage={errors.description?.message}
        maxRows={2}
      />
      <Input
        {...register('image')}
        label="Obraz"
        placeholder="Wklej link do obrazka"
        isInvalid={!!errors.image?.message}
        errorMessage={errors.image?.message}
      />
      <Select {...register('categoryId')} label="Kategoria" placeholder="Wybierz kategorię">
        {categories.map((category) => (
          <SelectItem key={category.id} value={category.id}>
            {category.name}
          </SelectItem>
        ))}
      </Select>
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
