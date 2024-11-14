import { UserResponse } from '@supabase/supabase-js';
import { UUID } from 'crypto';

import { User_Update } from '@/interfaces/db.interfaces';
import { getGoogleMailToken, getQuickBooksToken } from '@/lib/actions/actions';
import { createClient as createSupabaseClient } from '@/lib/utils/supabase/client';
import { User } from '@/models/User';

const supabase = createSupabaseClient();

export const useUser = () => {
  const createUser = async (
    company_id: UUID,
    name: string,
    password: string,
    email: string,
    roles: string[],
  ) => {
    // Step 1: Sign up the user using Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      console.log('Error during sign-up:', error.message);
      throw new Error(`Failed to create user, ${error.message}`);
    }

    // Step 2: Ensure the user data is available from the sign-up process
    if (!data.user) {
      console.log('No user data returned from sign-up');
      throw new Error('User data is missing after sign-up');
    }

    // Step 3: Insert the user into the custom 'users' table
    const { error: userError } = await supabase.from('users').insert({
      id: data.user.id, // Use the 'id' field from the Auth response
      email: email,
      company_id: company_id,
      roles: roles,
      name: name,
    });

    if (userError) {
      console.log(
        'Error when inserting user into the users table:',
        userError.message,
      );
      throw new Error(
        `Failed to create user in the custom table, ${userError.message}`,
      );
    }

    console.log('User created successfully');
    return;
  };

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
  return {
    createUser,
    updateUser,
    fetchUserData,
    fetchUser,
    getUserById,
    getUsersByCompanyId,
    getNangoIntegrationsById,
    updateUserData,
  };
};
