import { UserResponse } from '@supabase/supabase-js';
import { UUID } from 'crypto';

import { User } from '@/classes/User';
import { createClient as createSupabaseClient } from '@/utils/supabase/client';

const supabase = createSupabaseClient();

export const useUser = () => {
  const createUser = async (company_id: UUID): Promise<User> => {
    const { data: userData } = await fetchUser();

    const { data, error } = await supabase
      .from('users')
      .insert({
        user_id: userData.user?.id,
        ignore_label_id: null,
        scanned_label_id: null,
        gmail_integration_status: false,
        quickbooks_integration_status: false,
        email: userData?.user?.email,
        company_id: company_id,
      })
      .select('*')
      .single();

    if (error) {
      throw new Error('Failed to create user');
    }

    return data;
  };

  const updateUser = async (column_value: Partial<User>) => {
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
      .eq('id', userId);

    if (error) {
      throw new Error('Failed to update user');
    }

    return data;
  };

  const fetchUserData = async (
    columns: (keyof User)[] | ['*'] = ['*'],
  ): Promise<Partial<User>> => {
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

    if (user.error) {
      throw new Error('Failed to fetch user');
    }

    return user;
  }

  return {
    createUser,
    updateUser,
    fetchUserData,
    fetchUser,
  };
};
