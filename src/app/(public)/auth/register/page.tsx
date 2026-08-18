'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import clsx from 'clsx';

import { useRegister } from '@/hooks/mutations/useRegister';
import { useMe } from '@/hooks/queries/useMe';

import { getPasswordRules, splitFullName } from '@/utils/auth.utils';

import { validateRegister } from '@/validators/auth.validator';

import ErrorTextField from '@/components/elements/ErrorTextField';
import InputCheckbox from '@/components/elements/InputCheckbox';
import LabelField from '@/components/elements/LabelField';
import LoaderSpinner from '@/components/elements/LoaderSpinner';
import SingleLineField from '@/components/elements/SingleLineField';
import {
  // IconGoogle1,
  IconAnalytics2,
  IconAnalytics3,
  IconArrowRight,
  IconCheckCircle2,
  IconEnvelope,
  IconLock2,
  IconProfile1,
} from '@/components/svgs/icons';

import { DEFAULT_TIMEZONE } from '@/lib/date-time';

type RegisterForm = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
};

export default function Register() {
  const router = useRouter();

  const { data: me, isPending: isMePending } = useMe();

  const registerMutation = useRegister();

  const [registerForm, setRegisterForm] = useState<RegisterForm>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  const validationResult = validateRegister(registerForm);

  const errors = hasSubmitted ? validationResult.errors : {};

  const isSubmitting = registerMutation.isPending;

  const passwordRules = getPasswordRules(registerForm.password);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();

    setHasSubmitted(true);

    if (!validationResult.success) {
      return;
    }

    try {
      const { firstName, lastName } = splitFullName(registerForm.name);

      await registerMutation.mutateAsync({
        email: registerForm.email,
        password: registerForm.password,
        firstName,
        lastName,
        timezone: DEFAULT_TIMEZONE,
      });

      router.push('/dashboard');
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Unable to register.',
      );
    }
  };

  useEffect(() => {
    if (!isMePending && me) {
      router.push('/dashboard');
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
        'w-full min-h-screen',
        'px-4 py-10',
        'bg-background',
        isSubmitting && 'is-disabled',
      )}
    >
      <div className="flex justify-center items-center gap-12">
        {/* Left */}
        <div className="max-w-[528px] w-full">
          <h2
            className={clsx(
              'font-hanken-grotesk font-bold',
              'text-[#C0C1FF] text-[48px] leading-snug',
            )}
          >
            Project Hub
          </h2>
          <p
            className={clsx(
              'text-[#C7C4D7] text-[18px] leading-normal',
              'max-w-[418px]',
              'mt-4',
            )}
          >
            The enterprise-grade workspace for high- performance teams.
            Streamline your workflow, manage complex projects, and achieve
            structural clarity.
          </p>
          <div
            className={clsx(
              'flex flex-row justify-start items-between gap-4',
              'mt-10',
            )}
          >
            {[
              {
                icon: IconAnalytics2,
                title: 'Agile Boards',
                description: 'Real-time collaboration accross teams',
              },
              {
                icon: IconAnalytics3,
                title: 'Advanced Analytics',
                description: 'Data-driven insights for every project.',
              },
            ].map((featureItem) => {
              const Icon = featureItem.icon;

              return (
                <div
                  className={clsx(
                    'w-full',
                    'p-4',
                    'rounded-lg',
                    'bg-[#222A3D]',
                    'border border-[#464554]',
                  )}
                  key={featureItem.title}
                >
                  <Icon className="min-w-4.5 w-4.5 h-auto" />
                  <div
                    className={clsx(
                      'font-hanken-grotesk',
                      'text-[#DAE2FD] text-[18px]',
                      'mt-2',
                    )}
                  >
                    {featureItem.title}
                  </div>
                  <div
                    className={clsx('text-[#C7C4D7] leading-normal', 'mt-1')}
                  >
                    {featureItem.description}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Right */}
        <div className="max-w-[480px] w-full">
          {/* Card */}
          <div
            className={clsx(
              'flex flex-col gap-lg',
              'p-10',
              'rounded-xl',
              'bg-[#1D2537]/60',
              'border border-[#464554]/30',
              'shadow-[0_4px_24px_-2px_rgba(0,0,0,0.4),0_2px_12px_-1px_rgba(0,0,0,0.2)]',
            )}
          >
            <h1
              className={clsx(
                'font-hanken-grotesk',
                'text-[#DAE2FD] text-[32px] leading-tight',
              )}
            >
              Create an account
            </h1>
            <div className="font-medium">
              Start your 14-day free trial today.
            </div>
            {/* Continue with Google
              <div className="w-full mt-[40px]">
                <button
                  className={clsx(
                    'flex flex-row justify-center items-center gap-4',
                    'w-full h-[58px]',
                    'rounded-[8px]',
                    'border',
                    'bg-[#272F42]',
                    'border-[#44474E]',
                    isSubmitting && 'opacity-60 cursor-not-allowed',
                  )}
                  type="button"
                  onClick={() => {
                    if (isSubmitting) return;
                    console.log('Login to Google');
                  }}
                  disabled={isSubmitting}
                >
                  <IconGoogle1 className="min-w-[18px] w-[18px] h-auto" />
                  <div className="text-[#E2E2E6 text-[16px] leading-tight">Continue with Google</div>
                </button>
                <div className="relative flex flex-row justify-center items-center gap-4 mt-[16px]">
                  <div className="flex-1 h-[1px] bg-[#44474E]/30" />
                  <div className="text-[#8E9099] text-[16px] text-center uppercase tracking-[1.6px]">
                    OR USE EMAIL
                  </div>
                  <div className="flex-1 h-[1px] bg-[#44474E]/30" />
                </div>
              </div>
            */}
            {/* Form */}
            <form
              className={clsx('flex flex-col gap-4', 'mt-10')}
              noValidate
              onSubmit={handleRegister}
            >
              {errorMessage && (
                <div
                  className={clsx(
                    'text-sm text-red-200',
                    'px-4 py-3',
                    'rounded-md',
                    'bg-red-950/70',
                    'border border-red-700',
                  )}
                >
                  {errorMessage}
                </div>
              )}

              {/* Full Name Field */}
              <div className="relative w-full">
                <LabelField id="fullName" text="Full Name" />
                <SingleLineField
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={registerForm.name}
                  onChange={(e) => {
                    const newValue = e.target.value;

                    setRegisterForm((prev) => ({
                      ...prev,
                      name: newValue,
                    }));

                    if (errorMessage) {
                      setErrorMessage(null);
                    }
                  }}
                  icon={
                    <IconProfile1
                      className={clsx('text-[#8E9099]', 'min-w-4 w-4 h-auto')}
                    />
                  }
                  disabled={isSubmitting}
                  required
                />
                <ErrorTextField text={errors.name} />
              </div>
              {/* Email Address Field */}
              <div className="relative w-full">
                <LabelField id="email" text="Email Address" />
                <SingleLineField
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={registerForm.email}
                  onChange={(e) => {
                    const newValue = e.target.value;

                    setRegisterForm((prev) => ({
                      ...prev,
                      email: newValue,
                    }));

                    if (errorMessage) {
                      setErrorMessage(null);
                    }
                  }}
                  icon={
                    <IconEnvelope
                      className={clsx('text-[#8E9099]', 'min-w-4 w-4 h-auto')}
                    />
                  }
                  disabled={isSubmitting}
                  required
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
                  value={registerForm.password}
                  onChange={(e) => {
                    const newValue = e.target.value;

                    setRegisterForm((prev) => ({
                      ...prev,
                      password: newValue,
                    }));

                    if (errorMessage) {
                      setErrorMessage(null);
                    }
                  }}
                  icon={
                    <IconLock2
                      className={clsx('text-[#8E9099]', 'min-w-4 w-4 h-auto')}
                    />
                  }
                  disabled={isSubmitting}
                  required
                  aria-describedby="password-requirements"
                />
                <ul
                  className={clsx('mt-2 space-y-1', 'text-[#C4C6D0] text-sm')}
                  id="password-requirements"
                >
                  <li
                    className={clsx(
                      'flex flex-row justify-start items-center gap-2',
                      passwordRules.hasMinimumLength
                        ? 'text-green-400'
                        : undefined,
                    )}
                  >
                    <IconCheckCircle2 /> <span>At least 8 characters</span>
                  </li>
                  <li
                    className={clsx(
                      'flex flex-row justify-start items-center gap-2',
                      passwordRules.hasLetter ? 'text-green-400' : undefined,
                    )}
                  >
                    <IconCheckCircle2 /> <span>At least one letter</span>
                  </li>
                  <li
                    className={clsx(
                      'flex flex-row justify-start items-center gap-2',
                      passwordRules.hasNumber ? 'text-green-400' : undefined,
                    )}
                  >
                    <IconCheckCircle2 /> <span>At least one number</span>
                  </li>
                  <li
                    className={clsx(
                      'flex flex-row justify-start items-center gap-2',
                      passwordRules.isNotCommon ? 'text-green-400' : undefined,
                    )}
                  >
                    <IconCheckCircle2 />{' '}
                    <span>Not a commonly used password</span>
                  </li>
                </ul>
                <ErrorTextField text={errors.password} />
              </div>
              {/* Confirm Password with eye toggle */}
              <div className="relative w-full">
                <LabelField id="confirmPassword" text="Confirm Password" />
                <SingleLineField
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={registerForm.confirmPassword}
                  onChange={(e) => {
                    const newValue = e.target.value;

                    setRegisterForm((prev) => ({
                      ...prev,
                      confirmPassword: newValue,
                    }));

                    if (errorMessage) {
                      setErrorMessage(null);
                    }
                  }}
                  icon={
                    <IconLock2
                      className={clsx('text-[#8E9099]', 'min-w-4 w-4 h-auto')}
                    />
                  }
                  disabled={isSubmitting}
                  required
                />
                <ErrorTextField text={errors.confirmPassword} />
              </div>
              {/* Agree Terms of Service and Privacy Policy */}
              <div className="flex items-start gap-2">
                <p className="leading-relaxed w-full">
                  <InputCheckbox
                    id="agreeTerms"
                    value={registerForm.agreeTerms}
                    onChange={() =>
                      setRegisterForm((prev) => ({
                        ...prev,
                        agreeTerms: !prev.agreeTerms,
                      }))
                    }
                  />
                  <span className="text-[#C4C6D0] text-left select-none inline ml-2">
                    I agree to the{' '}
                    <Link
                      className={clsx('font-semibold', 'text-[#C0C1FF]')}
                      href="/terms-of-service"
                    >
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link
                      className={clsx('font-semibold', 'text-[#C0C1FF]')}
                      href="/privacy-policy"
                    >
                      Privacy Policy
                    </Link>
                  </span>
                </p>
              </div>
              <ErrorTextField text={errors.agreeTerms} />
              {/* Create Account Button */}
              <button
                className={clsx(
                  'flex flex-row justify-center items-center gap-4',
                  'w-full h-14',
                  'mt-2 py-3 px-4',
                  'rounded-lg',
                  'bg-[#C0C1FF]',
                  'shadow-[0_20px_25px_-5px_rgb(192_193_255/0.2),0_8px_10px_-6px_rgb(192_193_255/0.2)]',
                  isSubmitting
                    ? 'opacity-70 cursor-not-allowed'
                    : 'hover:bg-[#d0daff]',
                )}
                type="submit"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
              >
                {isSubmitting && <LoaderSpinner className="w-6! h-6!" />}
                <div className="font-medium text-[#1000A9]">Create Account</div>
                <IconArrowRight
                  className={clsx('text-[#1000A9]', 'min-w-4 w-4 h-auto')}
                />
              </button>
            </form>
            {/* Login */}
            <div className="text-center mt-14">
              Already have an account?{' '}
              <Link className="text-primary" href="/auth/login">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
