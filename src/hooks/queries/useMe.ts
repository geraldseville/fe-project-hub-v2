import { useQuery } from '@tanstack/react-query';

import { authMe } from '@/api/auth.api';

export function useMe() {
  return useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const response = await authMe();

      return response.data.user ?? response.data ?? null;
    },
  });
}
