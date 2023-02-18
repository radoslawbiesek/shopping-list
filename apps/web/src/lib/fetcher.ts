import { Fetcher } from 'openapi-typescript-fetch';

import type { paths } from '../types/openapi-types';

export const fetcher = Fetcher.for<paths>();

fetcher.configure({
  baseUrl: process.env.API_URL,
});
