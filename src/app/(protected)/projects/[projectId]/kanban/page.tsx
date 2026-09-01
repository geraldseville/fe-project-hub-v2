import type { Metadata } from 'next';

import ProjectKanbanPage from './ProjectKanbanPage';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Project Kanban',
    description: 'Project Kanban',
  };
}

export default function Page() {
  return <ProjectKanbanPage />;
}
