import NextLink from 'next/link';

import { Button, Card, CardBody } from '@nextui-org/react';
import { XMarkIcon } from '@heroicons/react/20/solid';

import * as productsService from 'services/products.service';
import * as productsActions from 'actions/products.actions';
import { ServerActionButton } from 'components/common/ServerActionButton';

export default async function ProductsPage() {
  const { data: products } = await productsService.getAll();

  return (
    <div className="w-full">
      <h1 className="my-6 text-center text-3xl font-semibold">Moje produkty</h1>
      <div className=" flex flex-col gap-4">
        {products?.map((product) => (
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
        ))}
        <Button as={NextLink} href="/products/form/new" color="primary" fullWidth>
          Dodaj nowy produkt
        </Button>
      </div>
    </div>
  );
}
