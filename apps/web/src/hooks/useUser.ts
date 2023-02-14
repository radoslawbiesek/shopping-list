import { useQuery } from '@tanstack/react-query';

import * as authService from '../services/auth.service';

export function useUser() {
  const { data: userData, ...rest } = useQuery({
    queryKey: ['user'],
    queryFn: async function () {
      try {
        const data = await authService.me({});
        return data.data;
      } catch (error) {
        if (error instanceof authService.me.Error) {
          const { status } = error.getActualType();
          if (status >= 400 && status <= 499) {
            return null;
          }
        }

        throw error;
      }
    },
  });

  return { userData, ...rest };
}
