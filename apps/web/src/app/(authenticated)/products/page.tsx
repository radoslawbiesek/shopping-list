import NextLink from 'next/link';

import { Button, Card, CardBody } from '@nextui-org/react';

import * as productsService from 'services/products.service';
import * as productsActions from 'actions/products.actions';

async function getAllProducts() {
  const { data } = await productsService.getAll();

  return data;
}

export default async function Products() {
  const products = await getAllProducts();

  return (
    <div className="w-full">
      <h1 className="my-4 text-center text-3xl font-semibold">Moje produkty</h1>
      <div className=" flex flex-col gap-4">
        {products?.map((product) => (
          <Card isPressable fullWidth as={NextLink} href={`/products/${product.id}`}>
            <CardBody className="flex flex-row items-center justify-between">
              {product.name}
              <form
                action={async () => {
                  'use server';
                  await productsActions.remove(product.id);
                }}
              >
                <Button color="danger" size="sm" type="submit">
                  Usuń
                </Button>
              </form>
            </CardBody>
          </Card>
        ))}
        <Button as={NextLink} href="/products/create" color="primary" fullWidth>
          Dodaj nowy produkt
        </Button>
      </div>
    </div>
  );
}
