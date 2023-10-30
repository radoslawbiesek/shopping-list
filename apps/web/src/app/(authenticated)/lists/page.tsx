import NextLink from 'next/link';

import { Button, Card, CardBody, CardFooter } from '@nextui-org/react';

import * as listsService from 'services/lists.service';

async function getAllLists() {
  const { data } = await listsService.getAll({});
  return data;
}

export default async function Lists() {
  const lists = await getAllLists();

  return (
    <div className="w-full">
      <h1 className="my-4 text-3xl font-semibold">Moje listy</h1>
      <div className=" flex flex-col gap-4">
        {lists?.map((list) => (
          <Card isPressable fullWidth as={NextLink} href={`/lists/${list.id}`}>
            <CardBody>{list.name}</CardBody>
          </Card>
        ))}
        <Button as={NextLink} href="/lists/create" color="primary" fullWidth>
          Dodaj nową listę
        </Button>
      </div>
    </div>
  );
}
