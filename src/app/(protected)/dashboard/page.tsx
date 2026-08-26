'use client';

import { useRouter } from 'next/navigation';

import clsx from 'clsx';

import { useLogout } from '@/hooks/mutations/useLogout';
import { useMe } from '@/hooks/queries/useMe';
import { useUsers } from '@/hooks/queries/useUsers';

import { getFullName } from '@/utils/user.utils';

import AppShellHead from '@/components/AppShellHead';

export default function DashboardPage() {
  const router = useRouter();

  const { data: me } = useMe();

  const { data: { users = [], pagination } = {} } = useUsers();

  const logoutMutation = useLogout();

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();

    router.replace('/auth/login');
  };

  return (
    <main
      className={clsx('overflow-hidden', 'flex flex-col', 'w-full h-screen')}
    >
      {/* Head */}
      <AppShellHead />
      <div
        className={clsx(
          'text-foreground',
          'flex flex-col justify-center items-center gap-4',
          'flex-1 w-full',
          'py-10 px-4',
        )}
      >
        <div className="text-3xl font-semibold">Welcome</div>
        <div>Name: {getFullName(me?.firstName, me?.lastName) || 'N/A'}</div>
        <div>Email: {me?.email ?? 'N/A'}</div>
        <button
          className="rounded-lg bg-primary px-5 py-3 text-white hover:bg-primary/90"
          type="button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </main>
  );
}
