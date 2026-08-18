'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import clsx from 'clsx';

import { useUsers } from '@/hooks/queries/useUsers';

import { getFullName } from '@/utils/user.utils';

import type { User } from '@/types/user.types';

import AppShellHead from '@/components/AppShellHead';
import Button from '@/components/elements/Button';
import DataTable from '@/components/elements/DataTable';
import Avatar from '@/components/reusable/Avatar';
import ProjectDropdown from '@/components/shared/projects/ProjectDropdown';

export default function TeamsPage() {
  const router = useRouter();

  const { data: users = [], isPending: isUsersPending } = useUsers({
    excludeMe: true,
  });

  return (
    <main
      className={clsx('overflow-hidden', 'flex flex-col', 'w-full h-screen')}
    >
      {/* Head */}
      <AppShellHead />
      {/* Body */}
      <div
        className={clsx(
          'relative overflow-y-auto',
          'flex-1 min-h-0',
          'py-4 px-6',
        )}
      >
        <div className={clsx('flex justify-start items-center gap-4', 'mb-8')}>
          <Button
            className="ml-auto"
            buttonStyle="secondary"
            type="button"
            text="Export CSV"
            onClick={() => {}}
          />
          <Button
            buttonStyle="primary"
            type="button"
            text="Invite Members"
            onClick={() => {}}
          />
        </div>
        <div
          className={clsx(
            'overflow-hidden',
            'w-full',
            'rounded-lg',
            'bg-[#171F33]',
            'border border-[#464554]',
          )}
        >
          <DataTable
            value={users}
            isLoading={isUsersPending}
            columns={[
              {
                field: 'memeber',
                header: 'Member',
                render: (row: User) => {
                  return (
                    <div
                      className={clsx(
                        'relative',
                        'flex justify-start items-center gap-4',
                      )}
                    >
                      <div className={clsx('relative', 'min-w-10 w-10 h-10')}>
                        {row.imageUrl ? (
                          <Image
                            className={clsx(
                              'w-full h-full',
                              'object-cover object-top',
                              'rounded-full',
                            )}
                            src={row.imageUrl}
                            alt={getFullName(row.firstName, row.lastName) ?? ''}
                            title={
                              getFullName(row.firstName, row.lastName) ?? ''
                            }
                            width={40}
                            height={40}
                          />
                        ) : (
                          <Avatar initial={row.firstName?.charAt(0)} />
                        )}
                      </div>
                      <div className="flex-1">
                        <div
                          className={clsx(
                            'font-semibold',
                            'text-[16px] leading-tight',
                          )}
                        >
                          {getFullName(row.firstName, row.lastName)}
                        </div>
                        <div
                          className={clsx('text-[14px] leading-tight', 'mt-1')}
                        >
                          {row.email}
                        </div>
                      </div>
                    </div>
                  );
                },
              },
              {
                field: 'role',
                header: 'Role',
                render: (row: User) => {
                  if (!row.role) return;

                  return (
                    <div
                      className={clsx(
                        'font-jetbrains-mono font-medium',
                        'text-[#C0C1FF] text-[16px] leading-tight',
                        'relative',
                        'w-fit',
                        'py-1 px-4',
                        'rounded-full',
                        'bg-[#171F33]',
                        'border border-[#C0C1FF]/20',
                      )}
                    >
                      {row.role}
                    </div>
                  );
                },
              },
              {
                field: 'project',
                header: 'Projects',
                render: (row: User) => {
                  if (!row.memberProjects?.length) {
                    return <div>No Projects</div>;
                  }

                  return <ProjectDropdown projects={row.memberProjects} />;
                },
              },
              {
                field: 'status',
                header: 'Status',
                // render: (row: User) => {
                //   return <div className="relative"></div>;
                // },
              },
            ]}
            getRowId={(user) => user.id}
            onRowClick={(row) => {
              // console.log(row);
              router.push(`/teams/${row.id}`);
            }}
          />
        </div>
      </div>
    </main>
  );
}
