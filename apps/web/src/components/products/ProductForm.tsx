'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

import { Button, Input, Textarea, Select, SelectItem } from '@nextui-org/react';

import * as productsActions from 'actions/products.actions';
import * as categoriesService from 'services/categories.service';
import { createProductRequestBodySchema } from 'api/src/products/products.schema';
import { Form } from 'components/form/Form';

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

  const onSubmit = async (productData: typeof defaultValues) => {
    await productsActions.create(productData);
    router.push('/products');
  };

  return (
    <Form defaultValues={defaultValues} schema={createProductRequestBodySchema} onSubmit={onSubmit}>
      <Input name="name" label="Nazwa" placeholder="Podaj nazwę" isRequired />
      <Textarea name="description" label="Opis" placeholder="Podaj opis" maxRows={2} />
      <Input name="image" label="Obraz" placeholder="Wklej link do obrazka" />
      <Select name="categoryId" label="Kategoria" placeholder="Wybierz kategorię">
        {categories.map((category) => (
          <SelectItem key={category.id} value={category.id}>
            {category.name}
          </SelectItem>
        ))}
      </Select>
      <Button type="submit" color="primary" fullWidth>
        Zapisz
      </Button>
      <Button color="danger" fullWidth onClick={() => router.back()}>
        Anuluj
      </Button>
    </Form>
  );
}
