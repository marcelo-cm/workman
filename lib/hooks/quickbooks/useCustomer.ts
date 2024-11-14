import { SetStateAction } from 'react';

import { toast } from '@/components/ui/use-toast';

import { useAppContext } from '@/app/(dashboards)/context';
import { Customer } from '@/interfaces/quickbooks.interfaces';

export const useCustomer = () => {
  const { user } = useAppContext();
  const companyId = user.company.id;

  const getCustomerList = async (
    columns: (keyof Customer)[] | ['*'] = ['*'],
    where: string | null = null,
    setCustomerCallback?: React.Dispatch<SetStateAction<Customer[]>>,
  ) => {
    try {
      const columnsToSelect = columns.join(',');

      const response = await fetch(
        `/api/v1/quickbooks/company/customer?companyId=${companyId}&select=${columnsToSelect}${where ? `&where=${where}` : ''}`,
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
    try {
      const response = await fetch(
        `/api/v1/quickbooks/company/customer/all?companyId=${companyId}`,
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

      setCustomerCallback?.(customers);
      return customers;
    } catch (error: unknown) {
      throw new Error(`Failed to get Customer list ${error}`);
    }
  };

  return { getCustomerList, getAllCustomers };
};
