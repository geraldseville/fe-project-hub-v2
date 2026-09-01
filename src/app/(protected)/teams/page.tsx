import type { Metadata } from 'next';

import TeamsPage from './TeamsPage';

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: 'Teams',
    description: 'Teams List',
  };
};

export default function Page() {
  return <TeamsPage />;
}
