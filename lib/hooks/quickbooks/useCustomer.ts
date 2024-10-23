import { SetStateAction } from 'react';

import { toast } from '@/components/ui/use-toast';

import { useAppContext } from '@/app/(dashboards)/context';
import { Customer } from '@/interfaces/quickbooks.interfaces';
import { createClient as createSupabaseClient } from '@/lib/utils/supabase/client';

export const useCustomer = () => {
  const supabase = createSupabaseClient();
  const { user } = useAppContext();

  const getCustomerList = async (
    columns: (keyof Customer)[] | ['*'] = ['*'],
    where: string | null = null,
    setCustomerCallback?: React.Dispatch<SetStateAction<Customer[]>>,
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
        `/api/v1/quickbooks/company/customer?userId=${userId}&select=${columnsToSelect}${where ? `&where=${where}` : ''}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        toast({
          title: 'Error fetching customers',
          description: response.statusText,
          variant: 'destructive',
        });
        throw new Error('Failed to fetch customers');
      }

      const responseData = await response.json();
      const customers =
        responseData.QueryResponse.Customer?.filter(
          (customer: any) => customer.DisplayName,
        ) ?? [];

      if (setCustomerCallback) {
        setCustomerCallback(customers);
      }

      return customers;
    } catch (error) {
      throw new Error(`Failed to get Customer list ${error}`);
    }
  };

  const getAllCustomers = async (
    setCustomerCallback?: React.Dispatch<SetStateAction<Customer[]>>,
  ) => {
    const userId = user.id;

    const response = await fetch(
      `/api/v1/quickbooks/company/customer/all?userId=${userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        next: {
          revalidate: 900,
        },
      },
    );

    if (!response.ok) {
      toast({
        title: 'Error fetching customers',
        description: response.statusText,
        variant: 'destructive',
      });
      throw new Error('Failed to fetch customers');
    }

    const customers = await response.json();

    setCustomerCallback && setCustomerCallback(customers);
    return customers;
  };

  return { getCustomerList, getAllCustomers };
};
