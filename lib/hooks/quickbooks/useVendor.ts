import { Dispatch, SetStateAction } from 'react';

import { toast } from '@/components/ui/use-toast';

import { Default_Vendor_Category } from '@/interfaces/db.interfaces';
import { Vendor } from '@/interfaces/quickbooks.interfaces';
import { createClient as createSupabaseClient } from '@/lib/utils/supabase/client';

import { useUser } from '../supabase/useUser';

const supabase = createSupabaseClient();

const { fetchUserData } = useUser();

export const useVendor = () => {
  const getVendorList = async (
    columns: (keyof Vendor)[] | ['*'] = ['*'],
    query: string | null = null,
    setVendorCallback?: Function | Dispatch<SetStateAction<Vendor[]>>,
  ): Promise<Vendor[]> => {
    try {
      const userData = await fetchUserData();
      const userId = userData.id;
      const columnsToSelect = columns.join(',');

      const response = await fetch(
        `/api/v1/quickbooks/company/vendor?userId=${userId}&select=${columnsToSelect}${query && `&where=${query}`}`,
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
      const vendors =
        responseData.QueryResponse.Vendor?.filter(
          (vendor: any) => vendor.DisplayName,
        ) ?? [];

      setVendorCallback && setVendorCallback(vendors);
      return vendors;
    } catch (error) {
      throw new Error(`Failed to get vendor list ${error}`);
    }
  };

  const getVendorByID = async (
    vendorId: string,
    vendorCallback?: Function | Dispatch<SetStateAction<Vendor>>,
  ): Promise<Vendor> => {
    try {
      const userData = await fetchUserData();
      const userId = userData.id;

      const response = await fetch(
        `/api/v1/quickbooks/company/vendor/${vendorId}?userId=${userId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        toast({
          title: 'Error fetching vendor',
          description: response.statusText,
          variant: 'destructive',
        });
        throw new Error('Failed to fetch vendor');
      }

      const responseData = await response.json();
      const vendor = responseData.Vendor;
      vendorCallback && vendorCallback(vendor);
      return vendor;
    } catch (error) {
      throw new Error(`Failed to get vendor by ID ${error}`);
    }
  };

  const getDefaultCategoryByVendorName = async (
    vendorName: string,
    categoryCallback?:
      | Function
      | Dispatch<SetStateAction<Default_Vendor_Category>>,
  ): Promise<Default_Vendor_Category | null> => {
    const user = await fetchUserData();

    if (!user.company) throw new Error('Company ID not found');

    const { data, error } = await supabase
      .from('default_vendor_categories')
      .select('*')
      .eq('vendor_name', vendorName)
      .eq('company_id', user.company.id)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to get default category, ${error.message}`);
    }

    categoryCallback?.(data);
    return data;
  };

  const saveDefaultCategory = async (
    vendor_name: string,
    category: string,
  ): Promise<Default_Vendor_Category> => {
    const { company } = await fetchUserData();

    if (!company) {
      throw new Error(
        'Company ID not found, you must have a company to save default category',
      );
    }

    const { data, error } = await supabase
      .from('default_vendor_categories')
      .upsert(
        {
          vendor_name,
          company_id: company.id,
          category,
        },
        { onConflict: 'vendor_name, company_id' },
      )
      .select('*')
      .single();

    if (error) {
      throw new Error(`Failed to save default category, ${error.message}`);
    }

    return data;
  };

  return {
    getVendorList,
    getVendorByID,
    getDefaultCategoryByVendorName,
    saveDefaultCategory,
  };
};
