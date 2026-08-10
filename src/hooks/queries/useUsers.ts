import { useQuery } from '@tanstack/react-query';

import { getUsers, type GetUsersOptions } from '@/api/user.api';

export function useUsers(options?: GetUsersOptions) {
  return useQuery({
    queryKey: ['users', options],
    queryFn: async () => {
      const response = await getUsers(options);

      return response.data?.users ?? [];
    },
  });
}
