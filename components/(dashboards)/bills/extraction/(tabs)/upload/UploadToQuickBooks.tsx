import React, { useEffect, useState } from 'react';

import { ArrowLeftIcon } from '@radix-ui/react-icons';
import { HammerIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ComboBox } from '@/components/ui/combo-box';
import LoadingState from '@/components/ui/empty-state';
import IfElseRender from '@/components/ui/if-else-renderer';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Invoice_Quickbooks, Vendor } from '@/interfaces/quickbooks.interfaces';
import Invoice from '@/models/Invoice';

import { useInvoiceExtractionReview } from '../../InvoiceExtractionReview';
import InvoiceDataTable from './InvoiceDataTable';

const UploadToQuickBooks = () => {
  const { files, accounts, vendors, customers, activeIndex, setActiveIndex } =
    useInvoiceExtractionReview();
  const [uploadedFileIndexes, setUploadedFileIndexes] = useState<number[]>([]);
  const [transformedFiles, setTransformedFiles] = useState<
    Invoice_Quickbooks[]
  >([]);

  const initialLoading = !(
    vendors.length &&
    customers.length &&
    accounts.length &&
    transformedFiles.length
  );

  useEffect(() => {
    setActiveIndex(0);
  }, []);

  useEffect(() => {
    transformData();
  }, [files]);

  useEffect(() => {
    if (uploadedFileIndexes.length === files.length) {
      window.location.reload();
    }
  }, [uploadedFileIndexes]);

  const transformData = async () => {
    const transformed: Invoice_Quickbooks[] = await Promise.all(
      files.map(async (file) => {
        const parsedInvoice = await Invoice.transformToQuickBooksInvoice(file);
        return parsedInvoice;
      }),
    );
    setTransformedFiles(transformed as unknown as Invoice_Quickbooks[]);
  };

  const handleVendorSelect = (value: Vendor, fileIndex: number) => {
    const updatedFiles = [...transformedFiles];
    updatedFiles[fileIndex].data.vendorId = value.Id;
    setTransformedFiles(updatedFiles);
  };

  return (
    <>
      <div className="flex h-full flex-col gap-4 p-4 ">
        <IfElseRender
          condition={initialLoading}
          ifTrue={<LoadingState />}
          ifFalse={files.map((file, fileIndex) => (
            <div key={file.id}>
              <IfElseRender
                condition={activeIndex == fileIndex}
                ifTrue={
                  <div className="rounded-t-md bg-wm-orange-500 px-2 py-1 text-xs font-medium text-white">
                    Currently Viewing This File
                  </div>
                }
              />
              <div
                className={`space-y-3 rounded-md border  ${activeIndex == fileIndex ? 'rounded-t-none border-l-2 border-t-0 border-l-wm-orange-500' : null}`}
              >
                <div
                  className={`flex w-full items-center justify-between border-b p-2 text-sm font-medium `}
                >
                  <div className="flex flex-col gap-1">
                    <ComboBox
                      options={vendors}
                      valueToMatch={file.data.supplierName}
                      callBackFunction={(value) =>
                        handleVendorSelect(value, fileIndex)
                      }
                      getOptionLabel={(option) => option?.DisplayName}
                    />{' '}
                    <p className="ml-2 mt-1 text-xs leading-none text-wm-white-500">
                      {file.data.supplierName}
                    </p>
                    <p className="ml-2 text-xs leading-none text-wm-white-500">
                      {file.data.customerAddress}
                    </p>
                  </div>
                  <div className="flex flex-col items-end font-normal">
                    <Badge className="text-wm-black-500 mb-1 font-medium">
                      No. {file.data.invoiceNumber}
                    </Badge>
                    <div>
                      <p className="inline font-medium">Txn Date: </p>
                      {file.data.date}
                    </div>
                    <div>
                      <p className="inline font-medium">Due Date: </p>
                      {file.data.dueDate}
                    </div>
                  </div>
                </div>
                <div className={`gap-3 !pt-0`}>
                  <InvoiceDataTable
                    file={file}
                    fileIndex={fileIndex}
                    transformedFiles={transformedFiles}
                    setTransformedFiles={setTransformedFiles}
                    uploadedFileIndexes={uploadedFileIndexes}
                    setUploadedFileIndexes={setUploadedFileIndexes}
                  />
                </div>
              </div>
            </div>
          ))}
        />
      </div>
      <div className="sticky bottom-0 flex h-14 min-h-14 w-full items-center justify-end gap-2 border-t bg-white pl-2 pr-8 ">
        <TabsList>
          <TabsTrigger value="1" asChild>
            <Button variant={'secondary'}>
              <ArrowLeftIcon /> Continue Editing
            </Button>
          </TabsTrigger>
        </TabsList>
        <Button onClick={() => window.location.reload()}>
          <HammerIcon className="h-4 w-4" /> Done
        </Button>
      </div>
    </>
  );
};

export default UploadToQuickBooks;
