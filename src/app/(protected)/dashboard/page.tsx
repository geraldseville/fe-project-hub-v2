'use client';

import { useRouter } from 'next/navigation';

import clsx from 'clsx';

import { useLogout } from '@/hooks/mutations/useLogout';
import { useMe } from '@/hooks/queries/useMe';

export default function Dashboard() {
  const router = useRouter();

  const { data: me, isPending: isMePending } = useMe();

  const logoutMutation = useLogout();

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();

    router.replace('/auth/login');
  };

  return (
    <main
      className={clsx(
        'text-foreground',
        'flex flex-col justify-center items-center gap-4',
        'flex-1 w-full',
        'py-10 px-4',
      )}
    >
      <div className="text-3xl font-semibold">Welcome</div>
      <div>Name: {me?.name ?? 'N/A'}</div>
      <div>Email: {me?.email ?? 'N/A'}</div>
      <button
        className="rounded-lg bg-primary px-5 py-3 text-white hover:bg-primary/90"
        type="button"
        onClick={handleLogout}
      >
        Logout
      </button>
    </main>
  );
}
