import { useEffect, useState } from 'react';

import clsx from 'clsx';

import { useUpdateMe } from '@/hooks/mutations/useUpdateMe';
import { useMe } from '@/hooks/queries/useMe';
import { useDebouncedCallback } from '@/hooks/ui/useDebounceCallback';
import { useToastStore } from '@/hooks/ui/useToastStore';

import { SOCIAL_CONFIG } from '@/utils/user.utils';

import type { Social } from '@/types/user.types';

import Button from '@/components/elements/Button';
import LabelField from '@/components/elements/LabelField';
import SingleLineField from '@/components/elements/SingleLineField';
import SingleSelect from '@/components/elements/SingleSelect';
import { IconBin2, IconShare2 } from '@/components/svgs/icons';

export default function Socials() {
  const toast = useToastStore();
  const { data: me } = useMe();
  const { mutate: updateMe } = useUpdateMe();

  const [socials, setSocials] = useState(me?.socials ?? {});
  const [selectedSocial, setSelectedSocial] = useState<Social | null>(null);
  const [socialUrl, setSocialUrl] = useState<string>('');

  const SelectedSocialIcon = selectedSocial
    ? SOCIAL_CONFIG[selectedSocial].icon
    : null;

  const debouncedUpdateSocial = useDebouncedCallback(
    (social: Social, value: string) => {
      setSocials((prev) => {
        const updatedSocials = {
          ...prev,
          [social]: value,
        };

        updateMe(
          {
            socials: updatedSocials,
          },
          {
            onSuccess: () => {
              toast.success('social link updated successfully.');
            },
            onError: () => {
              toast.failed('failed to update social link.');
            },
          },
        );

        return updatedSocials;
      });
    },
    1000,
  );

  const handleAddSocial = () => {
    if (!selectedSocial || !socialUrl.trim()) return;

    updateMe(
      {
        socials: {
          ...(me?.socials ?? {}),
          [selectedSocial]: socialUrl.trim(),
        },
      },
      {
        onSuccess: () => {
          toast.success('social link added successfully.');
        },
        onError: () => {
          toast.failed('failed to add social link.');
        },
      },
    );

    setSelectedSocial(null);
    setSocialUrl('');
  };

  const handleDeleteSocial = (social: Social) => {
    const { [social]: _, ...remainingSocials } = me?.socials ?? {};

    updateMe(
      {
        socials: remainingSocials,
      },
      {
        onSuccess: () => {
          toast.success('social link deleted successfully.');
        },
        onError: () => {
          toast.failed('failed to delete social link.');
        },
      },
    );
  };

  useEffect(() => {
    if (me?.socials) {
      setSocials(me.socials);
    }
  }, [me?.socials]);

  return (
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
          'mb-6 pb-4',
          'border-b border-[#464554]',
        )}
      >
        <IconShare2 className="min-w-4 w-4 h-4" />
        <div className="font-hanken-grotesk text-forground">Social Profile</div>
      </div>
      <div className="basis-full mb-6">
        <div className="flex flex-col gap-4">
          {Object.entries(socials).map(([key, value]) => {
            const social = key as Social;
            const label = SOCIAL_CONFIG[social].label;
            const Icon = SOCIAL_CONFIG[social].icon;

            return (
              <div
                className="flex justify-start items-center gap-4"
                key={social}
              >
                <div
                  className={clsx(
                    'flex justify-center items-center',
                    'min-w-10 w-10 h-10',
                    'rounded-sm',
                    'bg-[#DAE2FD]/20',
                  )}
                >
                  <Icon className="min-w-3.5 w-3.5 h-3.5" />
                </div>
                <LabelField
                  className="min-w-[200px] w-[200px] m-0!"
                  text={label}
                />
                <SingleLineField
                  classNames={{ root: 'flex-1' }}
                  id="github"
                  value={value}
                  onChange={(e) => {
                    const newValue = e.target.value;

                    setSocials((prev) => ({
                      ...prev,
                      [social]: newValue,
                    }));

                    debouncedUpdateSocial(social, newValue);
                  }}
                />
                <button
                  className={clsx(
                    'text-primary hover:text-[#e90f1e]',
                    'flex justify-center items-center',
                    'min-w-10 w-10 h-10',
                  )}
                  type="button"
                  onClick={() => {
                    handleDeleteSocial(social);
                  }}
                >
                  <IconBin2 className="min-w-3.5 w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <div className="basis-full">
        <LabelField text="Add Social Link" />
        <div className="flex flex-wrap gap-4">
          <div
            className={clsx('flex justify-start items-center gap-4', 'flex-1')}
          >
            <SingleSelect
              classNames={{ root: 'min-w-[200px]! w-[200px]!' }}
              id="select-social"
              placeholder="Select Social..."
              value={
                selectedSocial
                  ? {
                      id: `social-${selectedSocial}`,
                      label: SOCIAL_CONFIG[selectedSocial].label,
                      value: selectedSocial,
                      custom: (
                        <div className="flex justify-start items-center gap-4">
                          {SelectedSocialIcon && (
                            <SelectedSocialIcon className="min-w-3.5 w-3.5 h-3.5" />
                          )}
                          <span>{SOCIAL_CONFIG[selectedSocial].label}</span>
                        </div>
                      ),
                    }
                  : null
              }
              options={Object.entries(SOCIAL_CONFIG).map(([value, config]) => ({
                id: `social-${value}`,
                label: config.label,
                value,
                custom: (
                  <div className="flex justify-start items-center gap-4">
                    <config.icon className="min-w-3.5 w-3.5 h-3.5" />
                    <span>{config.label}</span>
                  </div>
                ),
              }))}
              onChange={(selected) => {
                setSelectedSocial(selected.value as Social);
              }}
            />
            <SingleLineField
              classNames={{ root: 'w-full' }}
              id="input-social"
              placeholder="Social URL..."
              disabled={!!!selectedSocial}
              value={socialUrl}
              onChange={(event) => {
                setSocialUrl(event.target.value);
              }}
            />
            <Button
              buttonStyle="secondary"
              type="button"
              text="Add Social"
              disabled={!!!selectedSocial}
              onClick={handleAddSocial}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
