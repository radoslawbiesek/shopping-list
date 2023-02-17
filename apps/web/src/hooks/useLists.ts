import { useQuery, useQueryClient } from '@tanstack/react-query';

import * as listsService from '../services/lists.service';

const queryKey = ['lists'];

export function useLists() {
  const queryClient = useQueryClient();

  const { data: lists, ...rest } = useQuery({
    queryKey,
    queryFn: async function () {
      try {
        const data = await listsService.getAll({});
        return data.data;
      } catch (error) {
        if (error instanceof listsService.getAll.Error) {
          const { status } = error.getActualType();
          if (status >= 400 && status <= 499) {
            return null;
          }
        }

        throw error;
      }
    },
  });

  const refetchLists = async () => {
    await queryClient.refetchQueries({
      queryKey,
    });
  };

  return { lists, refetchLists, ...rest };
}
