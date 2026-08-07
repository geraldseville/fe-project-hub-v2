import clsx from 'clsx';

import Sidebar from '@/components/Sidebar';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={clsx(
        'overflow-hidden',
        'flex flex-row',
        'w-full min-h-screen h-screen',
      )}
    >
      <Sidebar
        onNewProject={() => {
          console.log('onNewProject');
        }}
      />
      {children}
    </div>
  );
}
