import type { Metadata } from 'next';

import DashboardPage from './DashboardPage';

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: 'Dashboard',
    description: 'Dashboard details',
  };
};

export default function Page() {
  return <DashboardPage />;
}
