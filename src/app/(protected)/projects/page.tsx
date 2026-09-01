import type { Metadata } from 'next';

import ProjectsPage from './ProjectsPage';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Projects',
    description: 'Projects List',
  };
}

export default function Page() {
  return <ProjectsPage />;
}
