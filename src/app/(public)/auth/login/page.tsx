'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import clsx from 'clsx';

import { useLogin } from '@/hooks/mutations/useLogin';
import { useMe } from '@/hooks/queries/useMe';

import { validateLogin } from '@/validators/auth.validator';

import ErrorTextField from '@/components/elements/ErrorTextField';
import InputCheckbox from '@/components/elements/InputCheckbox';
import LabelField from '@/components/elements/LabelField';
import LoaderSpinner from '@/components/elements/LoaderSpinner';
import SingleLineField from '@/components/elements/SingleLineField';
import {
  // IconGoogle1,
  IconEnvelope,
  IconGlobe,
  IconLock2,
  IconShield2,
  IconShieldCheck,
} from '@/components/svgs/icons';

export default function Login() {
  const router = useRouter();

  const { data: me, isPending: isMePending } = useMe();

  const loginMutation = useLogin();

  const [loginForm, setLoginForm] = useState<{
    email: string;
    password: string;
    persist: boolean; // means sign-in 30 days
  }>({
    email: '',
    password: '',
    persist: false,
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [hasSubmitted, setHasSubmitted] = useState(false);

  const validationResult = validateLogin(loginForm);

  const errors = hasSubmitted ? validationResult.errors : {};

  const isSubmitting = loginMutation.isPending;

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setHasSubmitted(true);

    if (!validationResult.success) {
      return;
    }

    try {
      await loginMutation.mutateAsync({
        email: loginForm.email,
        password: loginForm.password,
      });

      // router.replace('/dashboard');
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Unable to sign in.',
      );
    }
  };

  useEffect(() => {
    if (!isMePending && me) {
      router.replace('/dashboard');
    }
  }, [isMePending, me, router]);

  if (isMePending || me) {
    return (
      <main
        className={clsx(
          'text-foreground',
          'flex justify-center items-center',
          'min-h-screen',
          'bg-background',
        )}
      >
        <LoaderSpinner />
      </main>
    );
  }

  return (
    <main
      className={clsx(
        'flex items-center justify-center',
        'min-h-screen',
        'px-4 py-10',
        'bg-background',
        isSubmitting && 'is-disabled',
      )}
    >
      {/* Container */}
      <div className="max-w-[480px] w-full mx-auto">
        <div className="mb-8">
          <h1 className="font-bold text-[16px] text-primary text-center tracking-tight mb-1">
            Project Hub
          </h1>
          <div className="text-center">
            Enterprise Suite &bull; Source of Truth
          </div>
        </div>
        {/* Card */}
        <div
          className={clsx(
            'relative',
            'flex flex-col gap-lg',
            'p-8',
            'border border-[rgb(68_71_78/0.3)]/30',
            'rounded-xl',
            'bg-[#1D2537]/60',
            'shadow-[0_4px_24px_-2px_rgba(0,0,0,0.4),0_2px_12px_-1px_rgba(0,0,0,0.2)]',
          )}
          aria-busy={isSubmitting}
        >
          <div className="font-medium text-center">Welcome Back</div>
          <div className="font-medium text-center mb-6">
            Please enter your details to sign in
          </div>
          {/* Form */}
          <form className="flex flex-col gap-4" onSubmit={handleLogin}>
            {errorMessage ? (
              <div className="rounded-lg border border-red-700 bg-red-950/70 px-4 py-3 text-sm text-red-200">
                {errorMessage}
              </div>
            ) : null}
            {/* Email Address Field */}
            <div className="relative w-full">
              <LabelField id="email" text="Email Address" />
              <SingleLineField
                id="email"
                type="email"
                placeholder="you@company.com"
                icon={
                  <IconEnvelope
                    className={clsx('text-[#8E9099]', 'min-w-4 w-4 h-auto')}
                  />
                }
                disabled={isSubmitting}
                autoComplete="nope"
                value={loginForm.email}
                onChange={(e) => {
                  const newValue = e.target.value;

                  setLoginForm((prev) => ({
                    ...prev,
                    email: newValue,
                  }));

                  setErrorMessage(null);
                }}
              />
              <ErrorTextField text={errors.email} />
            </div>
            {/* Password with eye toggle */}
            <div className="relative w-full">
              <LabelField id="password" text="Password" />
              <SingleLineField
                id="password"
                type="password"
                placeholder="Enter your password"
                icon={
                  <IconLock2
                    className={clsx('text-[#8E9099]', 'min-w-3.5 w-3.5 h-auto')}
                  />
                }
                disabled={isSubmitting}
                autoComplete="nope"
                value={loginForm.password}
                onChange={(e) => {
                  const newValue = e.target.value;

                  setLoginForm((prev) => ({
                    ...prev,
                    password: newValue,
                  }));

                  setErrorMessage(null);
                }}
              />
              <ErrorTextField text={errors.password} />
            </div>
            {/* Stay signed up checkbox */}
            <p className="leading-relaxed w-full">
              <InputCheckbox
                id="persist"
                value={loginForm.persist}
                onChange={() => {
                  setLoginForm((prev) => ({
                    ...prev,
                    persist: !prev.persist,
                  }));
                }}
              />
              <span className="text-[#C4C6D0] text-left select-none inline ml-2">
                Stay signed up for 30 days
              </span>
            </p>
            {/* Sign In Button */}
            <button
              className={clsx(
                'flex flex-row justify-center items-center gap-4',
                'w-full h-[56px]',
                'mt-2 py-3 px-4',
                'rounded-lg',
                'bg-primary',
                'shadow-[0_10px_15px_-3px_rgb(99_102_241/0.2),0_4px_6px_-4px_rgb(99_102_241/0.2)]',
                isSubmitting
                  ? 'opacity-70 cursor-not-allowed'
                  : 'hover:bg-primary/90',
              )}
              type="submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting && <LoaderSpinner className="w-6! h-6!" />}
              <div className={clsx('font-medium', 'text-white')}>Sign In</div>
            </button>
          </form>
          {/* Sign-In via Google
          <div className="w-full mt-[24px]">
            <div className="relative flex flex-row justify-center items-center gap-4">
              <div className="flex-1 h-[1px] bg-[#44474E]/30" />
              <div className="text-[#8E9099] text-[16px] text-center uppercase tracking-[1.6px]">
                OR CONTINUE WITH
              </div>
              <div className="flex-1 h-[1px] bg-[#44474E]/30" />
            </div>
            <button
              className={clsx(
                'flex flex-row justify-center items-center gap-4',
                'w-full h-[58px]',
                'mt-[24px]',
                'rounded-[8px]',
                'border',
                'bg-[#272F42]',
                'border-[#44474E]',
              )}
              type="button"
              onClick={() => {
                console.log('Login to Google');
              }}
              disabled={isSubmitting}
            >
              <IconGoogle1 className="min-w-[18px] w-[18px] h-auto" />
              <div className="text-[#E2E2E6 text-[16px] leading-tight">Login with Google</div>
            </button>
          </div>
          */}
          {/* Create New */}
          <div className={clsx('text-center', 'mt-6')}>
            Don&apos;t have an account?{' '}
            <Link className="text-primary" href="/auth/register">
              Create New
            </Link>
          </div>
        </div>
        <div
          className={clsx(
            'flex flex-row justify-center items-center gap-4',
            'mt-8',
          )}
        >
          {[IconShieldCheck, IconShield2, IconGlobe].map((Icon) => (
            <div
              className={clsx(
                'flex justify-center items-center',
                'min-w-8 w-8 h-8',
                'rounded-full',
                'bg-[#272F42]',
              )}
              key={`icon-${Icon.name}`}
            >
              <Icon className="w-auto h-3.5" />
            </div>
          ))}
        </div>
        <p
          className={clsx(
            'text-[#8E9099] text-[16px] text-center leading-tight',
            'max-w-[350px] w-full',
            'mt-2 mx-auto',
          )}
        >
          Your data is protected with 256-bit encryption and ISO-certified
          security protocols.
        </p>
      </div>
    </main>
  );
}
