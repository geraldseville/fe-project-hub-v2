import type { Metadata } from 'next';

import NotificationsPage from './NotificationsPage';

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: 'Notifications',
    description: 'Notifications details',
  };
};

export default function Page() {
  return <NotificationsPage />;
}
