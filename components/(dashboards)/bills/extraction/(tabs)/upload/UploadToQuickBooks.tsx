import React, { useEffect, useState } from 'react';

import { ArrowLeftIcon } from '@radix-ui/react-icons';
import { HammerIcon } from 'lucide-react';

import { UUID } from 'crypto';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Container from '@/components/ui/container';
import LoadingState from '@/components/ui/empty-state';
import IfElseRender from '@/components/ui/if-else-renderer';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';

import { useUser } from '@/lib/hooks/supabase/useUser';

import { InvoiceStatus } from '@/constants/enums';
import { findMostSimilar } from '@/lib/utils';
import Invoice from '@/models/Invoice';

import { useInvoiceExtractionReview } from '../../InvoiceExtractionReview';
import InvoiceActionBar from './InvoiceActionBar';
import InvoiceDetails from './InvoiceDetails';
import InvoiceLineItems from './InvoiceLineItems';

const UploadToQuickBooks = () => {
  const { files, accounts, vendors, customers, activeIndex, setActiveIndex } =
    useInvoiceExtractionReview();
  const { fetchUserData } = useUser();
  const [uploadedFileIndexes, setUploadedFileIndexes] = useState<number[]>([]);

  const initialLoading = !(
    vendors.length &&
    customers.length &&
    accounts.length
  );

  useEffect(() => {
    setActiveIndex(0);
  }, []);

  useEffect(() => {
    if (uploadedFileIndexes.length === files.length) {
      window.location.reload();
    }
  }, [uploadedFileIndexes]);

  const handleProcess = async (fileIndex: number) => {
    setUploadedFileIndexes([...uploadedFileIndexes, fileIndex]);
  };

  const handleUploadToQuickBooks = async (
    invoice: Invoice,
    idx: number,
    userId?: UUID,
  ) => {
    let id = userId;

    if (!id) {
      const userData = await fetchUserData();
      id = userData.id;
    }

    const matchedCustomer = findMostSimilar(
      invoice.customerAddress,
      customers,
      (customer) => customer.DisplayName,
    );

    const matchedVendor = findMostSimilar(
      invoice.supplierName,
      vendors,
      (vendor) => vendor.DisplayName,
    );

    const invoiceWithMatchedValues = {
      ...invoice,
      customerAddress: matchedCustomer,
      supplierName: matchedVendor,
      data: {
        ...invoice.data,
        lineItems: invoice.lineItems.map((lineItem) => {
          const matchedAccount = lineItem.productCode
            ? findMostSimilar(
                lineItem.productCode,
                accounts,
                (account) => account.Name,
              )
            : null;

          return {
            ...lineItem,
            productCode: matchedAccount,
          };
        }),
      },
    };

    const response = await fetch('/api/v1/quickbooks/company/bill', {
      method: 'POST',
      body: JSON.stringify({
        userId: id,
        invoice: invoiceWithMatchedValues,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      invoice.updateStatus(InvoiceStatus.PROCESSED);
      handleProcess(idx);
    } else {
      toast({
        title: 'Error',
        description: 'Failed to send the bill to QuickBooks',
        variant: 'destructive',
      });
    }
  };

  const handleUploadAllToQuickBooks = async () => {
    const { id } = await fetchUserData();
    await Promise.all(
      files.map((file, idx) => handleUploadToQuickBooks(file, idx, id)),
    ).then(() => {
      console.log('All files uploaded');
    });
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
              <Container
                className={`rounded-md border ${activeIndex == fileIndex ? 'rounded-t-none border-l-2 border-t-0 border-l-wm-orange-500' : null}`}
                innerClassName=" text-sm flex flex-col justify-between"
                header={
                  <>
                    {file.fileName}
                    <Badge className="ml-auto">No. {file.invoiceNumber}</Badge>
                  </>
                }
              >
                <InvoiceDetails invoice={file} />
                <InvoiceLineItems invoice={file} />
                <InvoiceActionBar
                  invoice={file}
                  idx={fileIndex}
                  onUpload={handleUploadToQuickBooks}
                  onSaveAsDraft={handleProcess}
                />
              </Container>
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
        <Button onClick={() => handleUploadAllToQuickBooks()}>
          <HammerIcon className="h-4 w-4" /> Submit All
        </Button>
      </div>
    </>
  );
};

export default UploadToQuickBooks;
