import { createContext, useContext } from 'react';

import { User } from '@/models/User';

interface AppContext {
  user: User;
  refetchUser: Function;
}

const defaultAppContext: AppContext = {
  user: {} as User,
  refetchUser: () => {},
};

export const AppContext = createContext<AppContext>(defaultAppContext);

export const useAppContext = () => {
  return useContext(AppContext);
};
