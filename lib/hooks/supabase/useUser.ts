import { UserResponse, createClient } from '@supabase/supabase-js';
import { UUID } from 'crypto';
import { redirect } from 'next/navigation';

import { useAppContext } from '@/app/(dashboards)/context';
import { User_Update } from '@/interfaces/db.interfaces';
import { getGoogleMailToken, getQuickBooksToken } from '@/lib/actions/actions';
import { createAdminClient } from '@/lib/utils/supabase/admin';
import { createClient as createSupabaseClient } from '@/lib/utils/supabase/client';
import { User } from '@/models/User';

export const useUser = () => {
  // const { user } = useAppContext();
  const supabase = createSupabaseClient();
  const supabaseAdmin = createAdminClient();

  const createUser = async (
    company_id: UUID,
    name: string,
    password: string,
    email: string,
    roles: string[],
  ) => {
    // Step 1: Sign up the user using Supabase Auth
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
    });

    if (error) {
      throw new Error(`Failed to create user, ${error.message}`);
    }

    // Step 2: Ensure the user data is available from the sign-up process
    if (!data.user) {
      throw new Error('User data is missing after sign-up');
    }

    // Step 3: Insert the user into the custom 'users' table
    const { data: newUser, error: userError } = await supabase
      .from('users')
      .insert({
        id: data.user.id, // Use the 'id' field from the Auth response
        email: email,
        company_id: company_id,
        roles: roles,
        name: name,
      })
      .select();

    if (userError) {
      throw new Error(
        `Error when inserting user into the users table, ${userError.message}`,
      );
    }

    return newUser[0];
  };

  const updateUser = async (column_value: User_Update) => {
    const { data: userData } = await fetchUser();

    const { data, error } = await supabase
      .from('users')
      .update(column_value)
      .eq('id', userData.user?.id);

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
      .eq('company_id', company_id)
      .order('created_at', { ascending: false });

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

  const updateUserData = async (id: UUID, column_value: User_Update) => {
    const { error } = await supabase
      .from('users')
      .update(column_value)
      .eq('id', id);

    if (error) {
      throw new Error('Failed to update user data');
    }

    return;
  };

  const deleteUserDB = async (userID: UUID) => {
    const { data, error } = await supabase
      .from('users')
      .delete()
      .eq('id', userID);

    if (error) {
      throw new Error(`Failed to delete user from DB ${error}`);
    }

    return;
  };

  const deleteUserAuth = async (userID: UUID) => {
    const { data, error } = await supabaseAdmin.auth.admin.deleteUser(userID);

    if (error) {
      throw new Error(`Failed to delete user from Auth ${error}`);
    }

    return;
  };

  return {
    createUser,
    updateUser,
    fetchUserData,
    fetchUser,
    getUserById,
    getUsersByCompanyId,
    getNangoIntegrationsById,
    updateUserData,
    deleteUserDB,
    deleteUserAuth,
  };
};
