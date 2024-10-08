'use client';

import React, { useEffect } from 'react';

import { ComboBox } from '@/components/ui/combo-box';
import {
  PaginatedComboBox,
  Pagination,
} from '@/components/ui/paginated-combo-box';

import { useVendor } from '@/lib/hooks/quickbooks/useVendor';

import { Vendor } from '@/interfaces/quickbooks.interfaces';

const page = () => {
  const { getVendorList, getVendorByID, getAllVendors } = useVendor();
  const [vendors, setVendors] = React.useState<Vendor[]>([]);

  const fetchPaginatedVendorList = async (page: number, query: string) => {
    const columns: (keyof Vendor)[] = ['DisplayName', 'Id'];
    const startPos = (page - 1) * Pagination.DEFAULT_LIMIT;

    const sqlQuery = `${query ? `WHERE DisplayName LIKE '${query}'` : ''} ORDER BY DisplayName startPosition ${startPos} maxResults ${Pagination.DEFAULT_LIMIT}`;
    const vendors = await getVendorList(columns, sqlQuery);

    const response = {
      values: vendors,
      canFetchMore: vendors.length === Pagination.DEFAULT_LIMIT,
    };

    return response;
  };

  useEffect(() => {
    getAllVendors(setVendors);
  }, []);

  return (
    <div className="flex h-full w-full flex-row items-center justify-center">
      <PaginatedComboBox
        getOptionLabel={(option: Vendor) => option.DisplayName}
        getOptionValue={(option: Vendor) => option?.Id}
        initialValue={
          { Id: '1763', DisplayName: 'Option 1' } as unknown as Vendor
        }
        matchOnMount
        fetchOnMount={getVendorByID}
        fetchNextPage={fetchPaginatedVendorList}
      />
      <ComboBox
        getOptionLabel={(option: Vendor) => option.DisplayName}
        options={vendors}
        valueToMatch={'1forall Software'}
      />
    </div>
  );
};

export default page;
