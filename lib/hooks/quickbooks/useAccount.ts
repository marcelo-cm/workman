import { SetStateAction } from 'react';

import { toast } from '@/components/ui/use-toast';

import { createClient as createSupabaseClient } from '@/lib/utils/supabase/client';

export const useAccount = () => {
  const supabase = createSupabaseClient();

  const getAccountList = async (
    columns: string[] | ['*'] = ['*'],
    where: string | null = null,
    setAccountCallback?: React.Dispatch<SetStateAction<any[]>>,
  ) => {
    try {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        throw new Error('Failed to get user');
      }

      const userId = data?.user?.id;

      if (!userId) {
        throw new Error('User ID not found');
      }

      const columnsToSelect = columns.join(',');

      const response = await fetch(
        `/api/v1/quickbooks/company/account?userId=${userId}&select=${columnsToSelect}${where ? `&where=${where}` : ''}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        toast({
          title: 'Error fetching accounts',
          description: response.statusText,
          variant: 'destructive',
        });
        throw new Error('Failed to fetch accounts');
      }

      const responseData = await response.json();
      const customers = responseData.QueryResponse.Account.filter(
        (account: any) => account.Name,
      );

      if (setAccountCallback) {
        setAccountCallback(customers);
      }

      return customers;
    } catch (error) {
      throw new Error(`Failed to get Account list ${error}`);
    }
  };

  return { getAccountList };
};
