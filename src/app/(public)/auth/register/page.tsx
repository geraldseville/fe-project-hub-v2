import type { Metadata } from 'next';

import RegisterPage from './RegisterPage';

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: 'Register',
    description: 'Create a new account',
  };
};

export default function Page() {
  return <RegisterPage />;
}
