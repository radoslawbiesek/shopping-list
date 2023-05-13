import { cookies as nextCookies } from 'next/headers';

export const cookies = () => {
  return nextCookies() as unknown as {
    set: (name: string, value: string) => void;
    get: (name: string) => { name: string; value: string };
  };
};
