import { Card, CardBody } from '@nextui-org/react';
import { XMarkIcon } from '@heroicons/react/20/solid';

import * as listItemsActions from 'actions/list-items.actions';
import { ServerActionButton } from 'components/common/ServerActionButton';
import { ListItem } from 'services/list-items.service.type';

export function ManageListItemCard({ listItem, listId }: { listItem: ListItem; listId: number }) {
  return (
    <Card fullWidth>
      <CardBody className="flex flex-row items-center justify-between">
        <div>
          <p className="font-semibold">{listItem.product.name}</p>
        </div>
        <ServerActionButton
          isIconOnly
          color="danger"
          variant="light"
          action={async () => {
            'use server';
            await listItemsActions.remove(listId, listItem.id);
          }}
          size="sm"
        >
          <XMarkIcon />
        </ServerActionButton>
      </CardBody>
    </Card>
  );
}
