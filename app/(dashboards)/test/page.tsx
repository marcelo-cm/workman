'use client';

import React, { useEffect, useState } from 'react';

import PDFViewer from '@/components/(shared)/PDF/PDFViewer';
import { Button } from '@/components/ui/button';
import { ComboBox } from '@/components/ui/combo-box';
import Container from '@/components/ui/container';
import { Input } from '@/components/ui/input';
import {
  PaginatedComboBox,
  Pagination,
} from '@/components/ui/paginated-combo-box';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useVendor } from '@/lib/hooks/quickbooks/useVendor';

import { Vendor } from '@/interfaces/quickbooks.interfaces';
import Invoice from '@/models/Invoice';

const page = () => {
  const { getVendorList, getVendorByID, getAllVendors } = useVendor();
  const [vendors, setVendors] = React.useState<Vendor[]>([]);
  const [file, setFile] = useState<File>();
  const [invoice, setInvoice] = React.useState<Invoice>();

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

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    console.log(e.target.files[0]);
    setFile(e.target.files[0]);
  };

  return (
    <Tabs className="flex h-full w-full flex-col" defaultValue="2">
      <TabsList className="border-b border-orange-500">
        <TabsTrigger value="1" className="w-full">
          Tab 1 — Comboboxes
        </TabsTrigger>
        <TabsTrigger value="2" className="w-full">
          Tab 2 — Server-Side Bill Processing
        </TabsTrigger>
        <TabsTrigger value="3" className="w-full">
          Tab 3 — <em>(Empty)</em>
        </TabsTrigger>
      </TabsList>
      <section className="flex h-full w-full flex-col items-center justify-center">
        <TabsContent value="1">
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
        </TabsContent>
        <TabsContent value="2" className="flex flex-col items-center gap-8">
          <Container className="p-4">
            {file?.name ?? 'No file selected'}
            {file && <PDFViewer file={file} />}
          </Container>
          <Input
            type="file"
            onChange={onInputChange}
            accept="application/pdf"
          />
          <Button>Upload</Button>
        </TabsContent>
      </section>
    </Tabs>
  );
};

export default page;
