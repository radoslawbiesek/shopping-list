import { useQuery, useQueryClient } from '@tanstack/react-query';

import * as authService from '../services/auth.service';
import { deleteToken } from '../services/token.service';

const queryKey = ['user'];

export function useUser() {
  const queryClient = useQueryClient();

  const { data: user, ...rest } = useQuery({
    queryKey,
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
    staleTime: Infinity,
  });

  const refetchUser = async () => {
    await queryClient.refetchQueries({
      queryKey,
    });
  };

  const logout = () => {
    deleteToken();
    queryClient.setQueryData(queryKey, null);
  };

  return { user, refetchUser, logout, ...rest };
}
