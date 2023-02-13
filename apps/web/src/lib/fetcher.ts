import { Fetcher, Middleware } from 'openapi-typescript-fetch';

import type { paths } from '../types/openapi-types';
import { getToken } from '../services/token.service';

export const fetcher = Fetcher.for<paths>();

const addToken: Middleware = (url, init, next) => {
  init.headers.append('Authorization', `Bearer ${getToken()}`);
  return next(url, init);
};

fetcher.configure({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  use: [addToken],
});