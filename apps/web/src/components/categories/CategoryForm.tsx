'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

import { Button, Input } from '@nextui-org/react';

import * as categoriesActions from 'actions/categories.actions';
import { createCategoryRequestBodySchema } from 'api/src/categories/categories.schema';
import { Form } from 'components/form/Form';

const defaultValues = {
  name: '',
};

export function CategoryForm() {
  const router = useRouter();

  const onSubmit = async (data: typeof defaultValues) => {
    await categoriesActions.create(data);
    router.push('/categories');
  };

  return (
    <Form
      defaultValues={defaultValues}
      schema={createCategoryRequestBodySchema}
      onSubmit={onSubmit}
    >
      <Input name="name" label="Nazwa" placeholder="Podaj nazwę" isRequired />
      <Button type="submit" color="primary" fullWidth>
        Zapisz
      </Button>
      <Button color="danger" fullWidth onClick={() => router.back()}>
        Anuluj
      </Button>
    </Form>
  );
}
