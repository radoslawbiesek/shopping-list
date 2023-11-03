'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

import { Button, Input } from '@nextui-org/react';

import { Form } from 'components/form/Form';
import * as listsActions from 'actions/lists.actions';
import { createListRequestBodySchema } from 'api/src/lists/lists.schema';

const defaultValues = {
  name: '',
};

export function ListForm() {
  const router = useRouter();

  const onSubmit = async (listData: typeof defaultValues) => {
    await listsActions.create(listData);
    router.push('/lists');
  };

  return (
    <Form onSubmit={onSubmit} defaultValues={defaultValues} schema={createListRequestBodySchema}>
      <Input name="name" label="Nazwa" placeholder="Nazwa" isRequired />
      <Button type="submit" color="primary" fullWidth>
        Zapisz
      </Button>
      <Button color="danger" fullWidth onClick={() => router.back()}>
        Anuluj
      </Button>
    </Form>
  );
}
