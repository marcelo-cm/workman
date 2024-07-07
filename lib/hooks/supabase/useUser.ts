import { PostgrestSingleResponse, UserResponse } from '@supabase/supabase-js';

import { User } from '@/classes/User';
import { createClient as createSupabaseClient } from '@/utils/supabase/client';

const supabase = createSupabaseClient();

export const useUser = () => {
  const updateUser = async (column_value: { [column: string]: string }) => {
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
      throw new Error('Failed to get user');
    }

    const userId = userData?.user?.id;

    if (!userId) {
      throw new Error('User ID not found');
    }

    const { data, error } = await supabase
      .from('users')
      .upsert(column_value)
      .eq('user_id', userId);

    if (error) {
      throw new Error('Failed to update user');
    }

    return data;
  };

  const fetchUserData = async ({
    columns = ['*'],
  }: {
    columns: (keyof User)[] | ['*'];
  }): Promise<Partial<User>> => {
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
      throw new Error('Failed to get user');
    }

    const userId = userData?.user?.id;

    if (!userId) {
      throw new Error('User ID not found');
    }

    const columnsToFetch = columns.join(', ');

    const { data, error } = await supabase
      .from('users')
      .select(columnsToFetch as '*')
      .eq('id', userId)
      .single();

    if (error || !data) {
      throw new Error('Failed to fetch user data');
    }

    return data;
  };

  async function fetchUser(): Promise<UserResponse> {
    const user = await supabase.auth.getUser();
    return user;
  }

  return {
    updateUser,
    fetchUserData,
    fetchUser,
  };
};
