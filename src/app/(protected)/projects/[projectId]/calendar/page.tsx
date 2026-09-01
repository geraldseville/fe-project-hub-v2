import type { Metadata } from 'next';

import ProjectCalendarPage from './ProjectCalendarPage';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Project Calendar',
    description: 'Project Calendar',
  };
}

export default function Page() {
  return <ProjectCalendarPage />;
}
