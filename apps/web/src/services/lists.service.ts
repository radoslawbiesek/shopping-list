import { fetcher } from '../lib/fetcher';

export const create = fetcher.path('/lists').method('post').create();
export const getAll = fetcher.path('/lists').method('get').create();
