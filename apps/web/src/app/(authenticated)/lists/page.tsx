import NextLink from 'next/link';

import { Button, Card, CardBody } from '@nextui-org/react';
import { XMarkIcon } from '@heroicons/react/20/solid';

import * as listsService from 'services/lists.service';
import * as listActions from 'actions/lists.actions';
import { ServerActionButton } from 'components/common/ServerActionButton';

export default async function Lists() {
  const { data: lists } = await listsService.getAll();

  return (
    <div className="w-full">
      <h1 className="my-4 text-3xl font-semibold">Moje listy</h1>
      <div className=" flex flex-col gap-4">
        {lists?.map((list) => (
          <Card fullWidth>
            <CardBody className="flex flex-row items-center justify-between">
              <NextLink className="w-full" href={`/lists/${list.id}`}>
                {list.name}
              </NextLink>
              <ServerActionButton
                isIconOnly
                color="danger"
                variant="light"
                action={async () => {
                  'use server';
                  await listActions.remove(list.id);
                }}
                size="sm"
              >
                <XMarkIcon />
              </ServerActionButton>
            </CardBody>
          </Card>
        ))}
        <Button as={NextLink} href="/lists/form/new" color="primary" fullWidth>
          Dodaj nową listę
        </Button>
      </div>
    </div>
  );
}
