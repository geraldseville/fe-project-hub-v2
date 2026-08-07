'use client';

import { useState } from 'react';

import clsx from 'clsx';

import { useChangeMyPassword } from '@/hooks/mutations/useChangeMyPassword';
import { useToastStore } from '@/hooks/ui/useToastStore';

import { validateChangePassword } from '@/validators/user.validator';

import Button from '@/components/elements/Button';
import ErrorTextField from '@/components/elements/ErrorTextField';
import LabelField from '@/components/elements/LabelField';
import LoaderSpinner from '@/components/elements/LoaderSpinner';
import SingleLineField from '@/components/elements/SingleLineField';
import { IconProfile1 } from '@/components/svgs/icons';

export default function ChangePassword() {
  const toast = useToastStore();

  const changeMyPasswordMutation = useChangeMyPassword();

  const [passwordForm, setPasswordForm] = useState<{
    toggleUpdate: boolean;
    newPassword: string;
    confirmNewPassword: string;
  }>({
    toggleUpdate: false,
    newPassword: '',
    confirmNewPassword: '',
  });

  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const validationResult = validateChangePassword(passwordForm);

  const errors = hasSubmitted ? validationResult.errors : {};

  const handleToggleUpdate = () => {
    setPasswordForm((prev) => ({
      ...prev,
      toggleUpdate: !prev.toggleUpdate,
      newPassword: '',
      confirmNewPassword: '',
    }));
  };

  const handleSavePassword = async () => {
    setHasSubmitted(true);

    if (!validationResult.success) {
      return;
    }

    setIsSubmitting(true);

    try {
      await changeMyPasswordMutation.mutateAsync({
        newPassword: passwordForm.newPassword,
      });

      toast.success('password changed successfully.');

      setPasswordForm({
        toggleUpdate: false,
        newPassword: '',
        confirmNewPassword: '',
      });
    } catch (err) {
      toast.failed(
        err instanceof Error ? err.message : 'failed to update password.',
      );
    } finally {
      setHasSubmitted(false);
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={clsx(
        'w-full',
        'mt-5 p-6',
        'rounded-lg',
        'bg-[#131B2E]',
        'border border-[#464554]',
        isSubmitting && 'is-disabled',
      )}
    >
      <div
        className={clsx(
          'flex flex-row justify-start items-center gap-2',
          'mb-6 pb-2',
          'border-b border-[#464554]',
        )}
      >
        <IconProfile1 className="min-w-4 w-4 h-4" />
        <div className="font-hanken-grotesk text-forground">
          Security & Access
        </div>
      </div>
      <div className="flex flex-wrap gap-4">
        {/* New Password */}
        <div className="basis-full">
          <LabelField id="newPassword" text="New Password" />
          <SingleLineField
            classNames={{
              input: errors.newPassword && 'border-red-400',
            }}
            id="newPassword"
            type="password"
            placeholder=""
            value={passwordForm.newPassword}
            onChange={(e) => {
              const newValue = e.target.value;

              setPasswordForm((prev) => ({
                ...prev,
                newPassword: newValue,
              }));
            }}
            disabled={!passwordForm.toggleUpdate}
          />
          <ErrorTextField text={errors.newPassword} />
        </div>
        {/* Confirm New Password */}
        <div className="basis-full">
          <LabelField id="confirmNewPassword" text="Confirm New Password" />
          <SingleLineField
            classNames={{
              input: errors.confirmNewPassword && 'border-red-400',
            }}
            id="confirmNewPassword"
            type="password"
            placeholder=""
            value={passwordForm.confirmNewPassword}
            onChange={(e) => {
              const newValue = e.target.value;

              setPasswordForm((prev) => ({
                ...prev,
                confirmNewPassword: newValue,
              }));
            }}
            disabled={!passwordForm.toggleUpdate}
          />
          <ErrorTextField text={errors.confirmNewPassword} />
        </div>
        <div className="basis-full flex flex-row justify-end items-center gap-4">
          {passwordForm.toggleUpdate ? (
            <>
              <Button
                buttonStyle="secondary"
                text="Cancel"
                onClick={() => {
                  setHasSubmitted(false);
                  handleToggleUpdate();
                }}
              />
              <Button
                buttonStyle="primary"
                icon={isSubmitting && <LoaderSpinner className="w-4! h-4!" />}
                text={isSubmitting ? 'Saving...' : 'Save Password'}
                onClick={handleSavePassword}
                disabled={isSubmitting}
              />
            </>
          ) : (
            <Button
              buttonStyle="secondary"
              type="button"
              text="Change Password"
              onClick={handleToggleUpdate}
            />
          )}
        </div>
      </div>
    </div>
  );
}
