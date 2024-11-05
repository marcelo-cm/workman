import { UserResponse } from '@supabase/supabase-js';
import { UUID } from 'crypto';

import { useAppContext } from '@/app/(dashboards)/context';
import { User_Update } from '@/interfaces/db.interfaces';
import { getGoogleMailToken, getQuickBooksToken } from '@/lib/actions/actions';
import { createClient as createSupabaseClient } from '@/lib/utils/supabase/client';
import { User } from '@/models/User';

export const useUser = () => {
  const supabase = createSupabaseClient();
  const { user } = useAppContext();
  // const createUser = async (company_id: UUID): Promise<User> => {
  //   const { data: userData } = await fetchUser();

  //   const { data, error } = await supabase
  //     .from('users')
  //     .insert({
  //       user_id: userData.user?.id,
  //       ignore_label_id: null,
  //       scanned_label_id: null,
  //       gmail_integration_status: false,
  //       quickbooks_integration_status: false,
  //       email: userData?.user?.email,
  //       company_id: company_id,
  //     })
  //     .select('*')
  //     .single();

  //   if (error) {
  //     throw new Error(`Failed to create user, ${error.message}`);
  //   }

  //   return new User(data);
  // };

  const updateUser = async (column_value: User_Update) => {
    const { data: userData } = await fetchUser();

    const { data, error } = await supabase
      .from('users')
      .update(column_value)
      .eq('id', userData?.user?.id);

    if (error) {
      throw new Error(`Failed to update user, ${error.message}`);
    }

    return data;
  };

  const fetchUserData = async (
    columns: (keyof User)[] | ['*'] = ['*'],
  ): Promise<User> => {
    const { data: userData } = await fetchUser();

    const columnsToFetch = columns.join(', ');

    const { data, error } = await supabase
      .from('users')
      .select(`${columnsToFetch}, company: companies(*)` as '*')
      .eq('id', userData?.user?.id)
      .single();

    if (error || !data) {
      throw new Error('Failed to fetch user data');
    }

    return new User(data);
  };

  async function fetchUser(): Promise<UserResponse> {
    const user = await supabase.auth.getUser();

    if (user.error) {
      throw new Error(`Failed to fetch user. ${user.error.message}`);
    }

    if (!user.data?.user) {
      throw new Error('User not found');
    }

    return user;
  }

  async function getUserById(id: UUID): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new Error('Failed to fetch user');
    }

    return new User(data);
  }

  async function getUsersByCompanyId(company_id: UUID): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('company_id', company_id);

    if (error || !data) {
      throw new Error('Failed to fetch users');
    }

    return data.map((user) => new User(user));
  }

  const getNangoIntegrationsById = async (id: UUID) => {
    const gmailToken = await getGoogleMailToken(id);
    const quickbooksToken = await getQuickBooksToken(id);
    return {
      gmail: gmailToken,
      quickbooks: quickbooksToken,
    };
  };

  return {
    // createUser,
    updateUser,
    fetchUserData,
    fetchUser,
    getUserById,
    getUsersByCompanyId,
    getNangoIntegrationsById,
  };
};
