'use client';

import React, { useEffect, useState } from 'react';

import PDFViewer from '@/components/(shared)/PDF/PDFViewer';
import { Button } from '@/components/ui/button';
import Container from '@/components/ui/container';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/paginated-combo-box';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useVendor } from '@/lib/hooks/quickbooks/useVendor';

import { Vendor } from '@/interfaces/quickbooks.interfaces';
import Invoice from '@/models/Invoice';

const page = () => {
  const { getVendorList, getVendorByID, getAllVendors } = useVendor();
  const [vendors, setVendors] = React.useState<Vendor[]>([]);
  const [file, setFile] = useState<File>();
  const [invoice, setInvoice] = React.useState<Invoice>();
  const [invoiceURL, setInvoiceURL] = React.useState<string>();
  const [base64, setBase64] = React.useState<string>();

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
    // getAllVendors(setVendors);
  }, []);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;

    const file = fileList[0];

    console.log(file);
    setFile(file);
  };

  const uploadInvoice = async () => {
    if (!file) return;

    const fileUrl = await Invoice.uploadToStorage(file);
    const invoice = await Invoice.create(fileUrl);
    setInvoice(invoice);
  };

  const scanInvoice = async () => {
    if (!invoice) return;

    const data = await invoice.scan();
    console.log(data);
    setInvoice(data);
  };

  const fetchBlob = async () => {
    if (!invoiceURL) return;

    const response = await fetch(invoiceURL);
    if (!response.ok) {
      throw new Error(`Failed to fetch the PDF: ${response.statusText}`);
    }

    // Convert the response into a Blob
    const blob = await response.blob();

    // Create a FileReader to convert Blob to Base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      // Once reading is complete, get the Base64 result
      reader.onloadend = () => resolve(reader.result as string);

      // On error, reject the promise
      reader.onerror = reject;

      // Read the Blob as a Base64 string
      reader.readAsDataURL(blob);
    });
  };

  const handleFetchingBlob = async () => {
    try {
      const data = await fetchBlob();
      setBase64(data as string);
    } catch (e) {
      console.error(e);
    }
  };

  function stripBase64Prefix(base64: string): string {
    return base64.split(',')[1]; // Removes the 'data:application/pdf;base64,' prefix
  }

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
          {/* <PaginatedComboBox
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
          /> */}
        </TabsContent>
        <TabsContent value="2" className="flex flex-col items-center gap-8">
          <Container className="p-4">
            <PDFViewer
              file={file ? file : ''}
              customPageHeader={
                <p className="text-xs">{file?.name ?? 'No file selected'}</p>
              }
              width={250}
            />
          </Container>
          <Input
            type="file"
            onChange={onInputChange}
            accept="application/pdf"
          />
          <Button onClick={uploadInvoice} disabled={!file || !!invoice}>
            Upload
          </Button>
          <Button onClick={scanInvoice} disabled={!invoice}>
            Scan
          </Button>
          <Container className="w-96 max-w-96 p-4 ">
            <p>{JSON.stringify(invoice)}</p>
          </Container>
        </TabsContent>
        <TabsContent value="3">
          <PDFViewer file={invoiceURL || ''} width={250} />
          <Input
            type="text"
            value={invoiceURL}
            onInput={(e) => setInvoiceURL(e.currentTarget.value)}
          />
          <Button onClick={handleFetchingBlob} disabled={!invoiceURL}>
            Fetch Blob
          </Button>
          <iframe src={base64} className="h-96 w-96" />
        </TabsContent>
      </section>
    </Tabs>
  );
};

export default page;
