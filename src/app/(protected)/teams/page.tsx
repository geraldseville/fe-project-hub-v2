'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import clsx from 'clsx';

import { useUsers } from '@/hooks/queries/useUsers';

import { getFullName } from '@/utils/user.utils';

import type { User } from '@/types/user.types';

import AppShellHead from '@/components/AppShellHead';
// import Button from '@/components/elements/Button';
import DataTable from '@/components/elements/DataTable';
import Avatar from '@/components/reusable/Avatar';
import Pagination from '@/components/reusable/Pagination';
import ProjectDropdown from '@/components/shared/projects/ProjectDropdown';
import TeamRoleUI from '@/components/shared/teams/TeamRoleUI';

export default function TeamsPage() {
  const router = useRouter();

  const [paginationOptions, setPaginationOptions] = useState({
    page: 1,
    limit: 10,
  });

  const { data: { users = [], pagination } = {}, isPending: isUsersPending } =
    useUsers({
      ...paginationOptions,
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
          'flex flex-col',
          'flex-1 min-h-0',
          'py-4 px-6',
        )}
      >
        {/*
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
        */}
        <div
          className={clsx(
            'overflow-hidden',
            'flex flex-col',
            'flex-1 w-full min-h-0',
            'rounded-lg',
            'bg-[#171F33]',
            'border border-[#464554]',
          )}
        >
          <DataTable
            classNames={{ root: 'flex-1 min-h-0' }}
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

                  return <TeamRoleUI role={row.role} />;
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
          {pagination && (
            <Pagination
              pagination={pagination}
              pageSizeOptions={[5, 10, 20, 30, 50]}
              onPageChange={(page) => {
                setPaginationOptions((prev) => ({
                  ...prev,
                  page,
                }));
              }}
              onLimitChange={(limit) => {
                setPaginationOptions({
                  page: 1,
                  limit,
                });
              }}
            />
          )}
        </div>
      </div>
    </main>
  );
}
