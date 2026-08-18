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

import { TimeFormat } from '@/types/user.types';

import Button from '@/components/elements/Button';
import ErrorTextField from '@/components/elements/ErrorTextField';
import LabelField from '@/components/elements/LabelField';
import LoaderSpinner from '@/components/elements/LoaderSpinner';
import SingleSelect from '@/components/elements/SingleSelect';
import { IconCalendar2 } from '@/components/svgs/icons';

import {
  DEFAULT_TIME_FORMAT,
  DEFAULT_TIMEZONE,
  TIMEZONES,
} from '@/lib/date-time';

export default function DateAndTime() {
  const toast = useToastStore();
  const { data: me } = useMe();
  const updateMe = useUpdateMe();

  const [toggleUpdate, setToggleUpdate] = useState<boolean>(false);
  const [form, setForm] = useState<UpdateUserInput>({
    timezone: me?.timezone ?? DEFAULT_TIMEZONE,
    timeFormat: me?.timeFormat ?? DEFAULT_TIME_FORMAT,
  });
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const validationResult = validateUpdateUser(form);
  const errors = hasSubmitted ? validationResult.errors : {};

  const handleToggleUpdate = () => {
    setForm((prev) => ({
      ...prev,
      timezone: me?.timezone ?? DEFAULT_TIMEZONE,
      timeFormat: me?.timeFormat ?? DEFAULT_TIME_FORMAT,
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
        timezone: form.timezone,
        timeFormat: form.timeFormat,
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
          'mb-6 pb-4',
          'border-b border-[#464554]',
        )}
      >
        <IconCalendar2 className="min-w-4 w-4 h-4" />
        <div className="font-hanken-grotesk text-forground">Date & Time</div>
      </div>
      <div className="flex flex-wrap gap-4">
        {/* Timezones */}
        <div className="basis-[calc(50%-(16px/2))]">
          <LabelField id="timezones" text="Timezones" />
          <SingleSelect
            id="timezones"
            placeholder="Select Timezones..."
            searchable={true}
            value={{
              id: form.timezone ?? '',
              label: form.timezone?.replace('_', ' ') ?? '',
              value: form.timezone ?? '',
            }}
            options={TIMEZONES.map((item) => ({
              id: item,
              label: item.replace('_', ' '),
              value: item,
            }))}
            disabled={!toggleUpdate}
            onChange={(selected) => {
              setForm((prev) => ({
                ...prev,
                timezone: selected.value as string,
              }));
            }}
          />
          <ErrorTextField text={errors.timezone} />
        </div>
        {/* Time Format */}
        <div className="basis-[calc(50%-(16px/2))]">
          <LabelField id="timeFormat" text="Time Format" />
          <SingleSelect
            id="timeFormat"
            placeholder="Select Time Format..."
            value={
              form.timeFormat
                ? {
                    id: form.timeFormat,
                    label:
                      form.timeFormat === 'H12' ? '12hr Format' : '24hr Format',
                    value: form.timeFormat,
                  }
                : null
            }
            options={['H12', 'H24'].map((item) => ({
              id: item,
              label: item === 'H12' ? '12hr Format' : '24hr Format',
              value: item,
            }))}
            disabled={!toggleUpdate}
            onChange={(selected) => {
              setForm((prev) => ({
                ...prev,
                timeFormat: selected.value as TimeFormat,
              }));
            }}
          />
          <ErrorTextField text={errors.timeFormat} />
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
              text="Update"
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
