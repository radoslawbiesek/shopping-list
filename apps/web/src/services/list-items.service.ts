import { createFetcher } from 'lib/fetcher';

export const LIST_ITEMS_TAG = 'list-items';

const fetcher = createFetcher({ next: { tags: [LIST_ITEMS_TAG] } } as any);

export const create = fetcher.path('/lists/{listId}/items').method('post').create();
export const getAll = fetcher.path('/lists/{listId}/items').method('get').create();
export const remove = fetcher.path('/lists/{listId}/items/{id}').method('delete').create();
