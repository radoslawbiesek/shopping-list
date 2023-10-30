import { cookies } from 'next/headers';

import { Fetcher, Middleware } from 'openapi-typescript-fetch';
import { FetchConfig } from 'openapi-typescript-fetch/dist/cjs/types';

import type { paths } from 'types/openapi-types';

const addToken: Middleware = async (url, init, next) => {
  try {
    const token = cookies().get('token');
    if (token) {
      init.headers.append('Authorization', `Bearer ${token.value}`);
    }
    return next(url, init);
  } catch (error) {
    return next(url, init);
  }
};

export function createFetcher(config?: FetchConfig) {
  const fetcher = Fetcher.for<paths>();

  fetcher.configure({
    baseUrl: process.env.API_URL,
    use: [addToken],
    ...config,
  });

  return fetcher;
}

export const fetcher = createFetcher();
