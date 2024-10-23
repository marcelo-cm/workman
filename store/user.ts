import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { UUID } from 'crypto';

import { Company } from '@/models/Company';
import { User } from '@/models/User';

export interface UserState {
  user: User;
}

const initialState: UserState = {
  user: null as unknown as User,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null as unknown as User;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
