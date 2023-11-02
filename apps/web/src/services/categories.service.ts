import { createFetcher } from 'lib/fetcher';

export const CATEGORIES_TAG = 'categories';

const fetcher = createFetcher({ next: { tags: [CATEGORIES_TAG] } } as any);

export const create = fetcher.path('/categories/').method('post').create();
export const getAll = () => fetcher.path('/categories/').method('get').create()({});
export const remove = fetcher.path('/categories/{id}').method('delete').create();
