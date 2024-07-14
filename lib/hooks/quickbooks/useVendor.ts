import { SetStateAction } from 'react';

import { toast } from '@/components/ui/use-toast';

import { Default_Vendor_Category } from '@/interfaces/db.interfaces';
import { Vendor } from '@/interfaces/quickbooks.interfaces';
import { createClient as createSupabaseClient } from '@/utils/supabase/client';

import { useUser } from '../supabase/useUser';

const supabase = createSupabaseClient();

const { fetchUserData } = useUser();

export const useVendor = () => {
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
      }
      return vendors;
    } catch (error) {
      throw new Error(`Failed to get vendor list ${error}`);
    }
  };

  const getDefaultCategoryByVendorId = async (
    vendorId: string,
  ): Promise<Default_Vendor_Category> => {
    const { company_id: companyId } = await fetchUserData(['company_id']);

    if (!companyId) {
      throw new Error(
        'Company ID not found, you must have a company to get default category',
      );
    }

    const { data, error } = await supabase
      .from('default_vendor_categories')
      .select('*')
      .eq('vendor_id', vendorId)
      .eq('company_id', companyId)
      .single();

    if (error) {
      throw new Error('Failed to get default category');
    }

    return data;
  };

  const saveDefaultCategory = async (
    vendorId: string,
    category: string,
  ): Promise<Default_Vendor_Category> => {
    const { company_id: companyId } = await fetchUserData(['company_id']);

    if (!companyId) {
      throw new Error(
        'Company ID not found, you must have a company to save default category',
      );
    }

    const { data, error } = await supabase
      .from('default_vendor_categories')
      .upsert({
        vendor_id: vendorId,
        company_id: companyId,
        category,
      })
      .select('*')
      .single();

    if (error) {
      throw new Error('Failed to save default category');
    }

    return data;
  };

  return { getVendorList, getDefaultCategoryByVendorId, saveDefaultCategory };
};
