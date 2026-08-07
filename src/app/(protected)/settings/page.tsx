'use client';

import clsx from 'clsx';

import { useMe } from '@/hooks/queries/useMe';

import { getFullName } from '@/utils/user.utils';

import BasicInformation from './BasicInformation';
import ChangePassword from './ChangePassword';
import DeleteAccount from './DeleteAccount';
import ProfileImage from './ProfileImage';

export default function SettingsPage() {
  const { data: me } = useMe();

  const userFullName = getFullName(me?.firstName, me?.lastName);

  return (
    <main className={clsx('overflow-auto', 'w-full h-screen', 'py-10 px-4')}>
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
          <div className="font-hanken-grotesk text-[16px] leading-tight">
            {userFullName ?? ''}
          </div>
          <div className="font-inter text-[16px] leading-tight">
            {me?.role ?? 'Set Role'}
          </div>
        </div>
      </div>
      {/* Basic Information */}
      <BasicInformation />
      {/* Security & Access */}
      <ChangePassword />
      {/* Danger Zone */}
      <DeleteAccount />
    </main>
  );
}
