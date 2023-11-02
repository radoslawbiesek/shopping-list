import { createFetcher } from 'lib/fetcher';

export const PRODUCTS_TAG = 'products';

const fetcher = createFetcher({ next: { tags: [PRODUCTS_TAG] } } as any);

export const create = fetcher.path('/products/').method('post').create();
export const getAll = () => fetcher.path('/products/').method('get').create()({});
export const remove = fetcher.path('/products/{id}').method('delete').create();
