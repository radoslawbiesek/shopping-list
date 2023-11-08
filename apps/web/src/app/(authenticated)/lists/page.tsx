import NextLink from 'next/link';

import { Button } from '@nextui-org/react';

import * as listsService from 'services/lists.service';
import { ListCard } from 'components/lists/ListCard';

export default async function Lists() {
  const { data: lists } = await listsService.getAll();

  return (
    <div className="w-full">
      <h1 className="my-6 text-3xl font-semibold">Moje listy</h1>
      <div className=" flex flex-col gap-4">
        {lists?.map((list) => <ListCard list={list} />)}
        <Button as={NextLink} href="/lists/form/new" color="primary" fullWidth>
          Dodaj nową listę
        </Button>
      </div>
    </div>
  );
}
