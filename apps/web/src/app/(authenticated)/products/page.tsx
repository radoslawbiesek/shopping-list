import NextLink from 'next/link';

import { Button } from '@nextui-org/react';

import * as productsService from 'services/products.service';
import { ProductCard } from 'components/products/ProductCard';

export default async function ProductsPage() {
  const { data: products } = await productsService.getAll();

  return (
    <div className="w-full">
      <h1 className="my-6 text-center text-3xl font-semibold">Moje produkty</h1>
      <div className=" flex flex-col gap-4">
        {products?.map((product) => <ProductCard product={product} />)}
        <Button as={NextLink} href="/products/form/new" color="primary" fullWidth>
          Dodaj nowy produkt
        </Button>
      </div>
    </div>
  );
}
