import type { Metadata } from 'next';

import LoginPage from './LoginPage';

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: 'Login',
    description: 'Login to your account',
  };
};

export default function Page() {
  return <LoginPage />;
}
