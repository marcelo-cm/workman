import { UserResponse } from '@supabase/supabase-js';
import { UUID } from 'crypto';

<<<<<<< Updated upstream
=======
import { User_Update } from '@/interfaces/db.interfaces';
import { Company } from '@/models/Company';
>>>>>>> Stashed changes
import { User } from '@/models/User';
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

    return new User(data);
  };

  const updateUser = async (column_value: User_Update) => {
    const { data: userData } = await fetchUser();

    const { data, error } = await supabase
      .from('users')
      .upsert(column_value)
      .eq('id', userData?.user?.id);

    if (error) {
      throw new Error('Failed to update user');
    }

    return data;
  };

  const fetchUserData = async (
    columns: (keyof User)[] | ['*'] = ['*'],
  ): Promise<Partial<User>> => {
    const { data: userData } = await fetchUser();

    const columnsToFetch = columns.join(', ');

    const { data, error } = await supabase
      .from('users')
      .select(columnsToFetch as '*')
      .eq('id', userData?.user?.id)
      .single();

    if (error || !data) {
      throw new Error('Failed to fetch user data');
    }

<<<<<<< Updated upstream
    return data;
=======
    const { company_id, companies, ...rest } = data;

    return new User({
      ...rest,
      company: companies,
    });
>>>>>>> Stashed changes
  };

  async function fetchUser(): Promise<UserResponse> {
    const user = await supabase.auth.getUser();

    if (user.error) {
      throw new Error('Failed to fetch user');
    }

    if (!user.data?.user) {
      throw new Error('User not found');
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
