'use client';

import { useState } from 'react';

import clsx from 'clsx';

import { useUpdateMe } from '@/hooks/mutations/useUpdateMe';
import { useMe } from '@/hooks/queries/useMe';
import { useToastStore } from '@/hooks/ui/useToastStore';

import {
  type UpdateUserInput,
  validateUpdateUser,
} from '@/validators/user.validator';

import Button from '@/components/elements/Button';
import ErrorTextField from '@/components/elements/ErrorTextField';
import LabelField from '@/components/elements/LabelField';
import LoaderSpinner from '@/components/elements/LoaderSpinner';
import MultiLineField from '@/components/elements/MultiLineField';
import SingleLineField from '@/components/elements/SingleLineField';
import { IconProfile1 } from '@/components/svgs/icons';

export default function BasicInformation() {
  const toast = useToastStore();
  const { data: me } = useMe();
  const updateMe = useUpdateMe();

  const [toggleUpdate, setToggleUpdate] = useState<boolean>(false);
  const [form, setForm] = useState<UpdateUserInput>({
    firstName: me?.firstName ?? '',
    lastName: me?.lastName ?? '',
    role: me?.role ?? null,
    bio: me?.bio ?? null,
  });
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const validationResult = validateUpdateUser(form);
  const errors = hasSubmitted ? validationResult.errors : {};

  const handleToggleUpdate = () => {
    setForm((prev) => ({
      ...prev,
      email: me?.email ?? '',
      firstName: me?.firstName ?? '',
      lastName: me?.lastName ?? '',
      bio: me?.bio ?? '',
      role: me?.role ?? '',
    }));
  };

  const handleSave = async () => {
    setHasSubmitted(true);

    if (!validationResult.success) {
      return;
    }

    setIsSubmitting(true);

    try {
      await updateMe.mutateAsync({
        firstName: form.firstName,
        lastName: form.lastName,
        bio: form.bio,
        role: form.role,
      });

      setToggleUpdate(false);

      toast.success('user updated successfuly.');
    } catch (err) {
      toast.failed(
        err instanceof Error ? err.message : 'failed to update user.',
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
        'mt-16 p-6',
        'rounded-lg',
        'bg-[#131B2E]',
        'border border-[#464554]',
        isSubmitting && 'is-disabled',
      )}
    >
      <div
        className={clsx(
          'flex flex-row justify-start items-center gap-2',
          'mb-6 pb-4',
          'border-b border-[#464554]',
        )}
      >
        <IconProfile1 className="min-w-4 w-4 h-4" />
        <div className="font-hanken-grotesk text-forground">
          Basic Information
        </div>
      </div>
      <div className="flex flex-wrap gap-4">
        {/* First Name */}
        <div className="basis-[calc(50%-0.5rem)]">
          <LabelField id="firstName" text="FIrst Name" />
          <SingleLineField
            id="firstName"
            type="text"
            placeholder="Your First Name"
            disabled={!toggleUpdate}
            value={form.firstName ?? ''}
            onChange={(e) => {
              const newValue = e.target.value;
              setForm((prev) => ({
                ...prev,
                firstName: newValue,
              }));
            }}
          />
          <ErrorTextField text={errors.firstName} />
        </div>
        {/* Last Name */}
        <div className="basis-[calc(50%-0.5rem)]">
          <LabelField id="lastName" text="Last Name" />
          <SingleLineField
            id="lastName"
            type="text"
            placeholder="Your Last Name"
            disabled={!toggleUpdate}
            value={form.lastName ?? ''}
            onChange={(e) => {
              const newValue = e.target.value;
              setForm((prev) => ({
                ...prev,
                lastName: newValue,
              }));
            }}
          />
          <ErrorTextField text={errors.lastName} />
        </div>
        {/* Email Address */}
        <div className="basis-[calc(50%-0.5rem)]">
          <LabelField id="email" text="Email" />
          <SingleLineField
            id="email"
            type="email"
            placeholder="Your Last Name"
            disabled={!toggleUpdate}
            value={me?.email ?? ''}
            onChange={(e) => {
              const newValue = e.target.value;
              setForm((prev) => ({
                ...prev,
                email: newValue,
              }));
            }}
          />
        </div>
        {/* Role */}
        <div className="basis-[calc(50%-0.5rem)]">
          <LabelField id="role" text="Role" />
          <SingleLineField
            id="role"
            type="text"
            placeholder="Your Role"
            disabled={!toggleUpdate}
            value={form.role ?? ''}
            onChange={(e) => {
              const newValue = e.target.value;
              setForm((prev) => ({
                ...prev,
                role: newValue,
              }));
            }}
          />
          <ErrorTextField text={errors.role} />
        </div>
        {/* Bio */}
        <div className="basis-full">
          <LabelField id="bio" text="Bio" />
          <MultiLineField
            id="bio"
            placeholder="About Yourself..."
            value={form.bio ?? ''}
            onChange={(e) => {
              const newValue = e.target.value;
              setForm((prev) => ({
                ...prev,
                bio: newValue,
              }));
            }}
            disabled={!toggleUpdate}
          />
          <ErrorTextField text={errors.bio} />
        </div>
        <div className="basis-full flex flex-row justify-end items-center gap-4">
          {toggleUpdate ? (
            <>
              <Button
                buttonStyle="secondary"
                text="Cancel"
                onClick={() => {
                  setHasSubmitted(false);
                  handleToggleUpdate();
                  setToggleUpdate(false);
                }}
              />
              <Button
                buttonStyle="primary"
                type="button"
                icon={isSubmitting && <LoaderSpinner className="w-4! h-4!" />}
                text={isSubmitting ? 'Saving...' : 'Save Changes'}
                onClick={handleSave}
                disabled={isSubmitting}
              />
            </>
          ) : (
            <Button
              buttonStyle="secondary"
              type="button"
              text="Update Information"
              onClick={() => {
                setToggleUpdate(true);
                handleToggleUpdate();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
