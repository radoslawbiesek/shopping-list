import NextLink from 'next/link';

import { Card, CardBody } from '@nextui-org/react';
import { XMarkIcon } from '@heroicons/react/20/solid';

import * as listActions from 'actions/lists.actions';
import { ServerActionButton } from 'components/common/ServerActionButton';
import { List } from 'services/lists.service.types';

export function ListCard({ list }: { list: List }) {
  return (
    <Card fullWidth>
      <CardBody className="flex flex-row items-center justify-between">
        <NextLink className="w-full" href={`/lists/${list.id}`}>
          <p className="font-semibold">{list.name}</p>
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
  );
}
