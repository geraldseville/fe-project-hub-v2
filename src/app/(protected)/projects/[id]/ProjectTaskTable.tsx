// import React, { useState } from 'react';

import clsx from 'clsx';

// import { Task } from '@/types/task.types';
// import DataTable from '@/components/elements/DataTable';

interface ProjectTaskTableProps {
  // tasks: Task[];
  tasks: [];
}

export default function ProjectTaskTable({ tasks }: ProjectTaskTableProps) {
  // const [selectedTasks, setSelectedTasks] = useState<Task[]>([]);

  return (
    <div
      className={clsx(
        'w-full',
        'rounded-lg',
        'bg-[#171F33]',
        'border border-[#464554]',
      )}
    >
      <div className="p-6">
        <div
          className={clsx(
            'font-hanken-grotesk font-semibold',
            'text-[#DAE2FD] text-[24px]',
          )}
        >
          Active Task
        </div>
      </div>
      {/* <DataTable
        value={tasks}
        columns={[
          {
            field: 'title',
            header: 'Task Name',
            // render: (row) => {},
          },
          {
            field: 'status',
            header: 'Status',
            // render: (row) => {},
          },
          {
            field: 'priority',
            header: 'Priority',
            // render: (row) => {},
          },
          // {
          //   field: 'assignee',
          //   header: 'Assignee',
          //   render: (row: Project) => {
          //     return (
          //       <div className={clsx('relative', 'min-w-10 w-10 h-10')}>
          //         {row.owner?.imageUrl ? (
          //           <Image
          //             className={clsx(
          //               'w-full h-full',
          //               'object-cover object-top',
          //               'rounded-full',
          //             )}
          //             src={row.owner.imageUrl}
          //             alt={row.owner.name}
          //             title={row.owner.name}
          //             width={40}
          //             height={40}
          //             draggable={false}
          //           />
          //         ) : null}
          //         {false && (
          //           <div
          //             className={clsx(
          //               'absolute z-2 bottom-0 right-0',
          //               'min-w-2.5 w-2.5 h-2.5',
          //               'rounded-full',
          //               'bg-[#22C55E]',
          //               'border border-white',
          //             )}
          //           />
          //         )}
          //       </div>
          //     );
          //   },
          // },
        ]}
        selectionMode="multiple"
        selectedRows={selectedTasks}
        onSelectionChange={setSelectedTasks}
        getRowId={(project) => project.id}
      /> */}
    </div>
  );
}
