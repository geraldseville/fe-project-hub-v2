'use client';

import { useState } from 'react';

import clsx from 'clsx';

import { useUpdateMe } from '@/hooks/mutations/useUpdateMe';
import { useMe } from '@/hooks/queries/useMe';
import { useToastStore } from '@/hooks/ui/useToastStore';

import {
  type UserUpdateInput,
  validateUpdateUser,
} from '@/validators/user.validator';

import Button from '@/components/elements/Button';
import ErrorTextField from '@/components/elements/ErrorTextField';
import LabelField from '@/components/elements/LabelField';
import LoaderSpinner from '@/components/elements/LoaderSpinner';
import MultiLineField from '@/components/elements/MultiLineField';
import SingleLineField from '@/components/elements/SingleLineField';
import SingleSelect from '@/components/elements/SingleSelect';
import { IconProfile1 } from '@/components/svgs/icons';

import { timezones } from '@/lib/date-time';

export default function BasicInformation() {
  const toast = useToastStore();

  const { data: me } = useMe();

  const updateMe = useUpdateMe();

  const [toggleUpdate, setToggleUpdate] = useState<boolean>(false);

  const [basicInformationForm, setBasicInformationForm] =
    useState<UserUpdateInput>({
      firstName: me?.firstName ?? '',
      lastName: me?.lastName ?? '',
      role: me?.role ?? '',
      bio: me?.bio ?? '',
      timezone: me?.timezone ?? '',
    });

  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const validationResult = validateUpdateUser(basicInformationForm);

  const errors = hasSubmitted ? validationResult.errors : {};

  const handleToggleUpdate = () => {
    setBasicInformationForm((prev) => ({
      ...prev,
      email: me?.email ?? '',
      firstName: me?.firstName ?? '',
      lastName: me?.lastName ?? '',
      bio: me?.bio ?? '',
      role: me?.role ?? '',
    }));
  };

  const handleSaveMyInformation = async () => {
    setHasSubmitted(true);

    if (!validationResult.success) {
      return;
    }

    setIsSubmitting(true);

    try {
      await updateMe.mutateAsync({
        firstName: basicInformationForm.firstName,
        lastName: basicInformationForm.lastName,
        bio: basicInformationForm.bio,
        role: basicInformationForm.role,
        timezone: basicInformationForm.timezone,
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
            value={basicInformationForm.firstName ?? ''}
            onChange={(e) => {
              const newValue = e.target.value;
              setBasicInformationForm((prev) => ({
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
            value={basicInformationForm.lastName ?? ''}
            onChange={(e) => {
              const newValue = e.target.value;
              setBasicInformationForm((prev) => ({
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
            value={me.email}
            onChange={(e) => {
              const newValue = e.target.value;
              setBasicInformationForm((prev) => ({
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
            value={basicInformationForm.role ?? ''}
            onChange={(e) => {
              const newValue = e.target.value;
              setBasicInformationForm((prev) => ({
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
            value={basicInformationForm.bio ?? ''}
            onChange={(e) => {
              const newValue = e.target.value;
              setBasicInformationForm((prev) => ({
                ...prev,
                bio: newValue,
              }));
            }}
            disabled={!toggleUpdate}
          />
          <ErrorTextField text={errors.bio} />
        </div>
        {/* Timezones */}
        <div className="basis-full">
          <LabelField id="timezones" text="Timezones" />
          <SingleSelect
            id="timezones"
            placeholder="Select Timezones..."
            searchable={true}
            value={{
              id: basicInformationForm.timezone ?? '',
              label: basicInformationForm.timezone ?? '',
              value: basicInformationForm.timezone ?? '',
            }}
            options={timezones.map((item) => ({
              id: item,
              label: item,
              value: item,
            }))}
            disabled={!toggleUpdate}
            onChange={(selected) => {
              setBasicInformationForm((prev) => ({
                ...prev,
                timezone: selected.value,
              }));
            }}
          />
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
                onClick={handleSaveMyInformation}
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
