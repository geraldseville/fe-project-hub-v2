'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import clsx from 'clsx';

import { useMe } from '@/hooks/queries/useMe';

import AppShell from '@/components/AppShell';
import LoaderSpinner from '@/components/elements/LoaderSpinner';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const { data: me, isPending, isError } = useMe();

  useEffect(() => {
    if (!isPending && (isError || !me)) {
      router.replace('/auth/login');
    }
  }, [isPending, isError, me, router]);

  if (isPending) {
    return (
      <main
        className={clsx(
          'text-foreground',
          'flex justify-center items-center',
          'min-h-screen',
          'bg-background',
        )}
      >
        <LoaderSpinner />
      </main>
    );
  }

  if (isError || !me) {
    return null;
  }

  return <AppShell>{children}</AppShell>;
}
