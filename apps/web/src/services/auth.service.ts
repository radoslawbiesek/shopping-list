import { fetcher } from '../lib/fetcher';

export const login = fetcher.path('/auth/login').method('post').create();

export const me = fetcher.path('/auth/me').method('get').create();

export const register = fetcher.path('/auth/register').method('post').create();
