import type { Metadata } from 'next';

import ProjectTablePage from './ProjectTablePage';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Project Table',
    description: 'Project Table',
  };
}

export default function Page() {
  return <ProjectTablePage />;
}
