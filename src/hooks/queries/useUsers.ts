import { useQuery } from '@tanstack/react-query';

import { getUsers } from '@/api/user.api';

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await getUsers();

      return response.data.users ?? [];
    },
  });
}
