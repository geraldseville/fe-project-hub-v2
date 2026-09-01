import type { Metadata } from 'next';

import SettingsPage from './SettingsPage';

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: 'Settings',
    description: 'Settings details',
  };
};

export default function Page() {
  return <SettingsPage />;
}
