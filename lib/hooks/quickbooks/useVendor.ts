import { Dispatch, SetStateAction } from 'react';

import { toast } from '@/components/ui/use-toast';

import { useAppContext } from '@/app/(dashboards)/context';
import { Default_Vendor_Category } from '@/interfaces/db.interfaces';
import { Vendor } from '@/interfaces/quickbooks.interfaces';
import { createClient as createSupabaseClient } from '@/lib/utils/supabase/client';

const supabase = createSupabaseClient();

export const useVendor = () => {
  const { user } = useAppContext();
  const getVendorList = async (
    columns: (keyof Vendor)[] | ['*'] = ['*'],
    query: string | null = null,
    setVendorCallback?: Function | Dispatch<SetStateAction<Vendor[]>>,
  ): Promise<Vendor[]> => {
    try {
      const userId = user.id;
      const columnsToSelect = columns.join(',');

      const response = await fetch(
        `/api/v1/quickbooks/company/vendor?userId=${userId}&select=${columnsToSelect}${query ? `&where=${query}` : ''}`,
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

  const getAllVendors = async (
    setVendorCallback?: Function | Dispatch<SetStateAction<Vendor[]>>,
  ): Promise<Vendor[]> => {
    try {
      const userId = user.id;

      const response = await fetch(
        `/api/v1/quickbooks/company/vendor/all?userId=${userId}`,
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
          title: 'Error fetching vendors',
          description: response.statusText,
          variant: 'destructive',
        });
        throw new Error('Failed to fetch vendors');
      }

      const vendors = await response.json();

      setVendorCallback && setVendorCallback(vendors);
      return vendors;
    } catch (error) {
      throw new Error(`Failed to get all vendors ${error}`);
    }
  };

  const getVendorByID = async (
    vendorId: string,
    vendorCallback?: Function | Dispatch<SetStateAction<Vendor>>,
  ): Promise<Vendor> => {
    try {
      const userId = user.id;

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
    const company = user.company;

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
    getAllVendors,
    getVendorByID,
    getDefaultCategoryByVendorName,
    saveDefaultCategory,
  };
};
