'use server';

import { revalidateTag } from 'next/cache';

import * as listItemsService from 'services/list-items.service';

export async function create(data: Parameters<typeof listItemsService.create>[0]) {
  const response = listItemsService.create(data);
  revalidateTag(listItemsService.LIST_ITEMS_TAG);

  return response;
}

export async function remove(listId: number, listItemId: number) {
  const response = await listItemsService.remove({ id: listItemId, listId });
  revalidateTag(listItemsService.LIST_ITEMS_TAG);

  return response;
}
