'use server';

import { revalidateTag } from 'next/cache';

import * as categoriesService from 'services/categories.service';

export async function create(data: Parameters<typeof categoriesService.create>[0]) {
  const response = categoriesService.create(data);
  revalidateTag(categoriesService.CATEGORIES_TAG);

  return response;
}

export async function remove(id: number) {
  const response = await categoriesService.remove({ id });
  revalidateTag(categoriesService.CATEGORIES_TAG);

  return response;
}
