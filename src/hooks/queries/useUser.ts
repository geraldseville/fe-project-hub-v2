import { useQuery } from '@tanstack/react-query';

import { getUser } from '@/api/user.api';

export function useUser(userId: string) {
  return useQuery({
    queryKey: ['users', userId],
    queryFn: async () => {
      const response = await getUser(userId);

      return response.data?.user ?? null;
    },
  });
}
