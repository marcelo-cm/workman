import React from 'react';

import SideBar from '@/components/dashboards/SideBar';

const AppLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="flex h-dvh w-dvw flex-row overflow-x-hidden bg-white text-black">
      <SideBar />
      <main className="no-scrollbar flex h-dvh w-full items-center overflow-scroll">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
