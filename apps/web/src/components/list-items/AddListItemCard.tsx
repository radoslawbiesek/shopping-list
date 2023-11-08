import { Card, CardBody } from '@nextui-org/react';
import { PlusIcon } from '@heroicons/react/20/solid';

import { Product } from 'services/products.service.types';
import * as listItemsActions from 'actions/list-items.actions';
import { ServerActionButton } from 'components/common/ServerActionButton';

export function AddListItemCard({ product, listId }: { product: Product; listId: number }) {
  return (
    <Card fullWidth>
      <CardBody className="flex flex-row items-center justify-between">
        <div>
          <p className="font-semibold">{product.name}</p>
          <span className="text-foreground/80 text-xs">{product.category.name}</span>
        </div>
        <ServerActionButton
          isIconOnly
          color="success"
          variant="light"
          action={async () => {
            'use server';
            await listItemsActions.create({ listId, productId: product.id });
          }}
          size="sm"
        >
          <PlusIcon />
        </ServerActionButton>
      </CardBody>
    </Card>
  );
}
