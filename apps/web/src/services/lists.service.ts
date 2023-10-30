import { createFetcher } from 'lib/fetcher';
import { TAGS } from 'constants/tags';

const fetcher = createFetcher({ next: { tags: [TAGS.lists] } } as any);

export const create = fetcher.path('/lists').method('post').create();
export const getAll = fetcher.path('/lists').method('get').create();
export const remove = fetcher.path('/lists/{id}').method('delete').create();
