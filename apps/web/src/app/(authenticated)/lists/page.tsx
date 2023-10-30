import NextLink from 'next/link';
import { revalidateTag } from 'next/cache';

import { Button, Card, CardBody } from '@nextui-org/react';

import * as listsService from 'services/lists.service';
import * as listActions from 'actions/lists.actions';
import { TAGS } from 'constants/tags';

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
            <CardBody className="flex flex-row items-center justify-between">
              {list.name}
              <form
                action={async () => {
                  'use server';
                  listActions.remove(list.id);
                  revalidateTag(TAGS.lists);
                }}
              >
                <Button color="danger" size="sm" type="submit">
                  Usuń
                </Button>
              </form>
            </CardBody>
          </Card>
        ))}
        <Button as={NextLink} href="/lists/create" color="primary" fullWidth>
          Dodaj nową listę
        </Button>
      </div>
    </div>
  );
}
