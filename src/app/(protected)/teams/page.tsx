'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import clsx from 'clsx';

import { useUsers } from '@/hooks/queries/useUsers';

import { getFullName } from '@/utils/user.utils';

import type { User } from '@/types/user.types';

import Button from '@/components/elements/Button';
import DataTable from '@/components/elements/DataTable';
import Avatar from '@/components/reusable/Avatar';
import ProjectDropdown from '@/components/shared/projects/ProjectDropdown';

export default function TeamsListPage() {
  const router = useRouter();

  const { data: users = [], isPending: isUsersPending } = useUsers({
    excludeMe: true,
  });

  // console.log({ users });

  return (
    <main className={clsx('overflow-auto', 'w-full h-screen', 'py-10 px-4')}>
      {/* Head */}
      <div className="flex justify-between items-center gap-4 max-[1080px]:flex-wrap">
        <div className="flex-1 max-[1080px]:basis-full">
          <div
            className={clsx(
              'font-hanken-grotesk font-bold',
              'text-[#DAE2FD] text-[24px] leading-tight',
            )}
          >
            Teams Page
          </div>
          <div
            className={clsx(
              'font-inter',
              'text-[#C7C4D7] text-[16px] leading-tight',
              'mt-1',
            )}
          >
            Manage and track your ongoing enterprise workstreams.
          </div>
        </div>
        <Button
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
      {/* Body */}
      <div className="mt-10">
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
