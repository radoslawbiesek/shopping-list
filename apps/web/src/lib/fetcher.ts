import { getServerSession } from 'next-auth';
import { Fetcher, Middleware } from 'openapi-typescript-fetch';

import { authOptions } from '../pages/api/auth/[...nextauth]';

import type { paths } from '../types/openapi-types';

const addToken: Middleware = async (url, init, next) => {
  try {
    const isServer = typeof window === 'undefined';
    if (isServer) {
      const apiUrl = process.env.API_URL + url;
      const session = await getSession();
      if (session) {
        const { accessToken } = session;
        if (accessToken) {
          init.headers.append('Authorization', `Bearer ${accessToken}`);
        }
      }

      return next(apiUrl, init);
    }

    return next(url, init);
  } catch (error) {
    console.error(error);
    return next(url, init);
  }
};

const fetcher = Fetcher.for<paths>();

fetcher.configure({
  use: [addToken],
});

async function getSession() {
  try {
    const session = (await getServerSession(authOptions)) as { accessToken: string };
    return session;
  } catch {
    return null;
  }
}

export { fetcher };
