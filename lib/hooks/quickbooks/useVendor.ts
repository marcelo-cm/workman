import { SetStateAction } from 'react';

import { toast } from '@/components/ui/use-toast';

import { Vendor } from '@/interfaces/quickbooks.interfaces';
import { createClient as createSupabaseClient } from '@/utils/supabase/client';

export const useVendor = () => {
  const supabase = createSupabaseClient();

  const getVendorList = async (
    columns: (keyof Vendor)[] | ['*'] = ['*'],
    where: string | null = null,
    setVendorCallback?: React.Dispatch<SetStateAction<Vendor[]>>,
  ): Promise<Vendor[]> => {
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
        `/api/v1/quickbooks/company/vendor?userId=${userId}&select=${columnsToSelect}${where ? `&where=${where}` : ''}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        toast({
          title: 'Error fetching vendors',
          description: response.statusText,
          variant: 'destructive',
        });
        throw new Error('Failed to fetch vendors');
      }

      const responseData = await response.json();
      const vendors = responseData.QueryResponse.Vendor.filter(
        (vendor: any) => vendor.DisplayName,
      );

      if (setVendorCallback) {
        setVendorCallback(vendors);
        toast({
          title: 'Vendors fetched successfully',
        });
      }
      return vendors;
    } catch (error) {
      throw new Error(`Failed to get vendor list ${error}`);
    }
  };

  return { getVendorList };
};
