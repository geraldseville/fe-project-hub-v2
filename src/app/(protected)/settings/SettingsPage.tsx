'use client';

import clsx from 'clsx';

import { useMe } from '@/hooks/queries/useMe';

import { getFullName } from '@/utils/user.utils';

import AppShellHead from '@/components/AppShellHead';
import { IconColorPalette } from '@/components/svgs/icons';

import BasicInformation from './BasicInformation';
import ChangePassword from './ChangePassword';
import DateAndTime from './DateAndTime';
import DeleteAccount from './DeleteAccount';
import ProfileImage from './ProfileImage';
import Socials from './Socials';

export default function SettingsPage() {
  const { data: me } = useMe();

  const userFullName = getFullName(me?.firstName, me?.lastName);

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
        <div
          className={clsx(
            'w-full h-[192px]',
            'rounded-lg',
            'bg-linear-to-r from-[#8083FF] to-[#2D3449]',
          )}
        />
        <div
          className={clsx(
            'flex flex-row justify-start items-end gap-3',
            'mt-[-34px] px-4',
          )}
        >
          <ProfileImage />
          <div className="w-full pb-4">
            <div
              className={clsx(
                'font-hanken-grotesk',
                'text-[16px] leading-tight',
              )}
            >
              {userFullName ?? ''}
            </div>
            <div
              className={clsx(
                'font-inter',
                'text-[16px] leading-tight',
                'mt-1',
              )}
            >
              {me?.role ?? 'Set Role'}
            </div>
          </div>
        </div>
        {/* Basic Information */}
        <BasicInformation />
        {/* Security & Access */}
        <ChangePassword />
        {/* Date And Time */}
        <DateAndTime />
        <Socials />
        {/* My Colors */}
        <div
          className={clsx(
            'w-full',
            'mt-5 p-6',
            'rounded-lg',
            'bg-[#131B2E]',
            'border border-[#464554]',
          )}
        >
          <div
            className={clsx(
              'flex flex-row justify-start items-center gap-2',
              'mb-6 pb-2',
              'border-b border-[#464554]',
            )}
          >
            <IconColorPalette className="min-w-4 w-4 h-auto" />
            <div className="font-hanken-grotesk text-forground">My Colors</div>
          </div>
          {(me?.savedColors ?? []).length > 0 && (
            <div className="flex flex-wrap gap-4">
              {me?.savedColors.map((colorItem) => (
                <div
                  className="size-7 rounded-full"
                  key={`color-${colorItem}`}
                  style={{ backgroundColor: colorItem }}
                />
              ))}
            </div>
          )}
        </div>
        {/* Danger Zone */}
        <DeleteAccount />
      </div>
    </main>
  );
}
