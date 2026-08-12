import { redirect } from 'next/navigation';

interface ProjectPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { projectId } = await params;

  redirect(`/projects/${projectId}/overview`);
}

// 'use client';

// import { useParams } from 'next/navigation';

// import clsx from 'clsx';

// import { useProject } from '@/hooks/queries/useProject';

// import ProjectOverview from './ProjectOverview';
// import ProjectStatusCard from './ProjectStatus';
// import ProjectTaskTable from './ProjectTaskTable';
// import ProjectTeamMembers from './ProjectTeamMembers';

// export default function ProjectItemPage() {
//   const params = useParams();

//   const projectId = params.id as string;

//   const { data: project = null, isPending: isProjectPending } =
//     useProject(projectId);

//   return (
//     <>
//       {/* Body */}
//       <div className={clsx('flex justify-between items-start gap-4', 'mt-6')}>
//         <div className={clsx('flex flex-col gap-4', 'flex-1')}>
//           <ProjectOverview
//             project={project}
//             isProjectPending={isProjectPending}
//           />
//           <ProjectTaskTable
//             project={project}
//             isProjectPending={isProjectPending}
//           />
//         </div>
//         <div
//           className={clsx('flex flex-col gap-4', 'basis-[305px] min-w-[305px]')}
//         >
//           <ProjectStatusCard
//             project={project}
//             isProjectPending={isProjectPending}
//           />
//           <ProjectTeamMembers
//             project={project}
//             isProjectPending={isProjectPending}
//           />
//         </div>
//       </div>
//     </>
//   );
// }
