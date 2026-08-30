// providers/AppProvider.tsx

'use client';

import QueryProvider from '@/providers/QueryProvider';
import SocketProvider from '@/providers/SocketProvider';

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <SocketProvider>{children}</SocketProvider>
    </QueryProvider>
  );
}
