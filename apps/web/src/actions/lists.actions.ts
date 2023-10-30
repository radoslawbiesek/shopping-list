'use server';

import { revalidateTag } from 'next/cache';

import * as listsService from 'services/lists.service';

export async function create(data: Parameters<typeof listsService.create>[0]) {
  const response = listsService.create(data);
  revalidateTag(listsService.LISTS_TAG);

  return response;
}

export async function remove(id: number) {
  const response = await listsService.remove({ id });
  revalidateTag(listsService.LISTS_TAG);

  return response;
}
