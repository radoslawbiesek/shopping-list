import { Card, CardBody } from '@nextui-org/react';
import { XMarkIcon } from '@heroicons/react/20/solid';

import { Product } from 'services/products.service.types';
import * as productsActions from 'actions/products.actions';
import { ServerActionButton } from 'components/common/ServerActionButton';

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card fullWidth>
      <CardBody className="flex flex-row items-center justify-between">
        <div>
          <p className="font-semibold">{product.name}</p>
          <span className="text-foreground/80 text-xs">{product.category.name}</span>
        </div>
        <ServerActionButton
          isIconOnly
          color="danger"
          variant="light"
          action={async () => {
            'use server';
            await productsActions.remove(product.id);
          }}
          size="sm"
        >
          <XMarkIcon />
        </ServerActionButton>
      </CardBody>
    </Card>
  );
}
