import { useState } from 'react';
import { useRouter } from 'next/navigation';

import clsx from 'clsx';

import { useDeleteMyAccount } from '@/hooks/mutations/useDeleteMyAccount';
// import { deleteMyAccount } from '@/api/user.api';
//
// import { useToastStore } from '@/store/use-toast-store';
import { useToastStore } from '@/hooks/ui/useToastStore';

import Button from '@/components/elements/Button';
import LabelField from '@/components/elements/LabelField';
import Modal from '@/components/elements/Modal';
import SingleLineField from '@/components/elements/SingleLineField';

export default function DeleteAccount() {
  const router = useRouter();

  const toast = useToastStore();

  const deleteMyAccount = useDeleteMyAccount();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [password, setPassword] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleOpenModal = () => {
    setPassword('');
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    if (isSubmitting) return;
    setIsOpen(false);
    setPassword('');
  };

  const handleDeleteMyAccount = async () => {
    setIsSubmitting(true);

    try {
      await deleteMyAccount.mutateAsync();

      toast.success('successfully deleted your account.', { duration: 3000 });

      let seconds = 5;

      const interval = setInterval(() => {
        if (seconds > 0) {
          toast.success(
            `redirecting back to login in ${seconds} second${seconds === 1 ? '' : 's'}...`,
            {
              duration: 3000,
            },
          );

          seconds--;
        } else {
          clearInterval(interval);

          // Redirect
          router.push('/auth/login');
        }
      }, 1000);
    } catch (err) {
      toast.failed(
        err instanceof Error ? err.message : 'failed to delete user.',
      );
    } finally {
      setIsOpen(false);

      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div
        className={clsx(
          'w-full',
          'mt-5 p-6',
          'rounded-lg',
          'border border-[#FFB4AB]/40',
          'bg-[#93000A]/10',
        )}
      >
        <div className="flex justify-between items-center gap-4">
          <div className="flex-1">
            <div className="font-hanken-grotesk text-[#FFB4AB] text-[16px]">
              Danger Zone
            </div>
            <div className="font-inter text-[#C7C4D7]">
              Once you delete your account, there is no going back. Please be
              certain.
            </div>
          </div>
          <Button
            className="text-[#690005] bg-[#FFB4AB] hover:bg-[#FFB4AB]/60"
            text="Delete Account"
            onClick={handleOpenModal}
          />
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      >
        <div
          className={clsx(
            'relative z-2',
            'max-w-md w-full',
            'p-6',
            'rounded-2xl',
            'bg-[#1F1A1C]',
            'border border-[#FFB4AB]/20',
            'shadow-xl',
          )}
        >
          <h3
            className={clsx(
              'font-hanken-grotesk font-bold',
              'text-[#FFB4AB] text-[20px]',
              'mb-2',
            )}
          >
            Confirm Account Deletion
          </h3>
          <p className={clsx('font-inter', 'text-[#C7C4D7]', 'mb-4')}>
            This action cannot be undone. Please enter your password to verify
            ownership of this account.
          </p>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleDeleteMyAccount}
          >
            <div>
              <LabelField id="password" text="Password" />
              <SingleLineField
                classNames={{
                  input: '',
                }}
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div className="flex justify-end gap-3 mt-2">
              <Button
                className="flex-1 min-w-0!"
                buttonStyle="secondary"
                type="button"
                text="Cancel"
                onClick={handleCloseModal}
                disabled={isSubmitting}
              />
              <Button
                className={clsx(
                  'text-[#690005]',
                  'flex-1 min-w-0!',
                  'bg-[#FFB4AB] hover:bg-[#FFB4AB]/60',
                  'disabled:opacity-50',
                )}
                buttonStyle="primary"
                type="submit"
                text={isSubmitting ? 'Deleting...' : 'Confirm Delete'}
                disabled={isSubmitting}
              />
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
