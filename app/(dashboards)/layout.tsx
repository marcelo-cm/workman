'use client';

import React, { useEffect, useState } from 'react';

import SideBar from '@/components/(dashboards)/layout/SideBar';
import WorkmanLogo from '@/components/molecules/WorkmanLogo';
import IfElseRender from '@/components/ui/if-else-renderer';

import { useUser } from '@/lib/hooks/supabase/useUser';

import { User } from '@/models/User';

import { AppContext } from './context';

const AppLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const { fetchUserData } = useUser();
  const [user, setUser] = useState<User>(null as unknown as User);

  useEffect(() => {
    refetchUser();
  }, []);

  const refetchUser = () => {
    fetchUserData().then(setUser);
  };

  return (
    <div className="flex h-dvh w-dvw flex-row overflow-x-hidden bg-white text-black">
      <AppContext.Provider value={{ user, refetchUser }}>
        <SideBar />
        <IfElseRender
          condition={!!user}
          ifTrue={
            <main className="no-scrollbar flex h-dvh w-full items-center overflow-scroll">
              {children}
            </main>
          }
          ifFalse={
            <WorkmanLogo className="mx-auto my-auto w-64 animate-pulse " />
          }
        />
      </AppContext.Provider>
    </div>
  );
};

export default AppLayout;
