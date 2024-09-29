'use client';

import React from 'react';

import {
  PaginatedComboBox,
  Pagination,
} from '@/components/ui/paginated-combo-box';

import { useVendor } from '@/lib/hooks/quickbooks/useVendor';

import { Vendor } from '@/interfaces/quickbooks.interfaces';

const page = () => {
  const { getVendorList, getVendorByID } = useVendor();

  const fetchPaginatedVendorList = async (page: number, query: string) => {
    const columns: (keyof Vendor)[] = ['DisplayName', 'Id'];
    const startPos = (page - 1) * Pagination.DEFAULT_LIMIT;

    const sqlQuery = `${query ? `WHERE DisplayName LIKE '${query}'` : ''} ORDER BY DisplayName STARTPOSITION ${startPos} MAXRESULTS ${Pagination.DEFAULT_LIMIT}`;
    const vendors = await getVendorList(columns, sqlQuery);

    const response = {
      values: vendors,
      canFetchMore: vendors.length === Pagination.DEFAULT_LIMIT,
    };

    return response;
  };

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
        limit={10}
        threshold={5}
      />
    </div>
  );
};

export default page;
