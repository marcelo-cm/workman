'use client';

import React from 'react';

import SideBar from '@/components/(dashboards)/layout/SideBar';

import { useUser } from '@/lib/hooks/supabase/useUser';

import { StoreProvider } from '@/store/StoreProvider';

const AppLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <StoreProvider>
      <div className="flex h-dvh w-dvw flex-row overflow-x-hidden bg-white text-black">
        <SideBar />
        <main className="no-scrollbar flex h-dvh w-full items-center overflow-scroll">
          {children}
        </main>
      </div>
    </StoreProvider>
  );
};

export default AppLayout;
