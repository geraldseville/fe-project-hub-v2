import type { Metadata } from 'next';
import { cookies } from 'next/headers';

import { apiClient } from '@/api/api';

import { getFullName } from '@/utils/user.utils';

import type { User } from '@/types/user.types';

import TeamPage from './TeamPage';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ userId: string }>;
}): Promise<Metadata> {
  const { userId } = await params;

  const cookieStore = await cookies();

  const response = await apiClient<{ user: User }>(`/users/${userId}`, {
    method: 'GET',
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  const user = response.data?.user ?? null;

  const userFullName = getFullName(user?.firstName, user?.lastName);

  return {
    title: userFullName ? `Teams | ${userFullName}` : 'Teams',
    description: 'Teams List',
  };
}

export default function Page() {
  return <TeamPage />;
}
