'use server';

import { revalidateTag } from 'next/cache';

import * as productsService from 'services/products.service';

export async function create(data: Parameters<typeof productsService.create>[0]) {
  const response = productsService.create(data);
  revalidateTag(productsService.PRODUCTS_TAG);

  return response;
}

export async function remove(id: number) {
  const response = await productsService.remove({ id });
  revalidateTag(productsService.PRODUCTS_TAG);

  return response;
}
