import type { Metadata } from 'next';

import ProjectOverviewPage from './ProjectOverviewPage';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Project Overview',
    description: 'Project Overview',
  };
}

export default function Page() {
  return <ProjectOverviewPage />;
}
