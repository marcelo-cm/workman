'use client';

import React, { useEffect, useState } from 'react';

import SideBar from '@/components/dashboards/SideBar';

import { useUser } from '@/lib/hooks/supabase/useUser';

import { User } from '@/models/User';

import { AppContext } from './context';

const { fetchUserData } = useUser();

const AppLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const [user, setUser] = useState<User>({} as User);

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
        <main className="no-scrollbar flex h-dvh w-full items-center overflow-scroll">
          {children}
        </main>
      </AppContext.Provider>
    </div>
  );
};

export default AppLayout;
