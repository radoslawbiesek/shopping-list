import { Fetcher } from 'openapi-typescript-fetch';

import type { paths } from '../types/openapi-types';

const fetcher = Fetcher.for<paths>();

export const login = fetcher.path('/auth/login').method('post').create();
export const me = fetcher.path('/auth/me').method('get').create();
export const register = fetcher.path('/auth/register').method('post').create();
