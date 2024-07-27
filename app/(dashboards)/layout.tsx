'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

import SideBar from '@/components/dashboards/SideBar';

import { useUser } from '@/lib/hooks/supabase/useUser';

import { Company } from '@/models/Company';
import { User } from '@/models/User';

const { fetchUserData } = useUser();

interface AppContext {
  user: User;
}

const defaultAppContext: AppContext = {
  user: {} as User,
};

export const AppContext = createContext<AppContext>(defaultAppContext);

export const useAppContext = () => {
  return useContext(AppContext);
};

const AppLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const [user, setUser] = useState<User>({} as User);

  useEffect(() => {
    fetchUserData().then(setUser);
  }, []);

  return (
    <div className="flex h-dvh w-dvw flex-row overflow-x-hidden bg-white text-black">
      <AppContext.Provider value={{ user }}>
        <SideBar />
        <main className="no-scrollbar flex h-dvh w-full items-center overflow-scroll">
          {children}
        </main>
      </AppContext.Provider>
    </div>
  );
};

export default AppLayout;
