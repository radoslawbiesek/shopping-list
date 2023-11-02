import { createFetcher } from 'lib/fetcher';

export const LISTS_TAG = 'lists';

const fetcher = createFetcher({ next: { tags: [LISTS_TAG] } } as any);

export const create = fetcher.path('/lists/').method('post').create();
export const getAll = fetcher.path('/lists/').method('get').create();
export const remove = fetcher.path('/lists/{id}').method('delete').create();
