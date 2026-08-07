import { useMutation } from '@tanstack/react-query';

import { changeMyPassword } from '@/api/user.api';

export function useChangeMyPassword() {
  return useMutation({
    mutationFn: changeMyPassword,
  });
}
