import React, { useEffect, useState, useTransition } from 'react';

import {
  ArrowLeftIcon,
  BookmarkIcon,
  EyeOpenIcon,
} from '@radix-ui/react-icons';
import { HammerIcon, Loader2Icon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ComboBox } from '@/components/ui/combo-box';
import Container from '@/components/ui/container';
import LoadingState from '@/components/ui/empty-state';
import IfElseRender from '@/components/ui/if-else-renderer';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';

import { useUser } from '@/lib/hooks/supabase/useUser';

import { InvoiceStatus } from '@/constants/enums';
import { InvoiceData } from '@/interfaces/common.interfaces';
import { findMostSimilar } from '@/lib/utils';
import Invoice from '@/models/Invoice';

import { useInvoiceExtractionReview } from '../../InvoiceExtractionReview';
import InvoiceLineItems from './InvoiceLineItems';

const UploadToQuickBooks = () => {
  const { files, accounts, vendors, customers, activeIndex, setActiveIndex } =
    useInvoiceExtractionReview();
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
                  onProcess={handleProcess}
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
        <Button onClick={() => window.location.reload()}>
          <HammerIcon className="h-4 w-4" /> Done
        </Button>
      </div>
    </>
  );
};

export default UploadToQuickBooks;

const InvoiceActionBar = ({
  invoice,
  idx,
  onProcess,
}: {
  invoice: Invoice;
  idx: number;
  onProcess: (idx: number) => void;
}) => {
  const [isSubmitting, startSubmitting] = useTransition();
  const { fetchUserData } = useUser();
  const { files, accounts, vendors, customers, activeIndex, setActiveIndex } =
    useInvoiceExtractionReview();

  const handleProcess = async () => {
    startSubmitting(async () => {
      const { id } = await fetchUserData();
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
        // invoice.updateStatus(InvoiceStatus.PROCESSED);
        onProcess(idx);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to send the bill to QuickBooks',
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <div className="flex w-full flex-row justify-between border-t p-2">
      <Button variant={'outline'} onClick={() => setActiveIndex(idx)}>
        <EyeOpenIcon className="h-4 w-4" /> View
      </Button>
      <div className="flex flex-row gap-2">
        <Button
          variant={'ghost'}
          onClick={() => startSubmitting(() => onProcess(idx))}
          disabled={isSubmitting}
        >
          <BookmarkIcon /> Save as Draft
        </Button>
        <Button
          variant={'secondary'}
          disabled={isSubmitting || invoice.status !== InvoiceStatus.APPROVED}
          onClick={() => handleProcess()}
        >
          <IfElseRender
            condition={isSubmitting}
            ifTrue={
              <>
                <Loader2Icon className="h-4 w-4 animate-spin" /> Submitting...
              </>
            }
            ifFalse={
              <>
                <HammerIcon className="h-4 w-4" /> Submit
              </>
            }
          />
        </Button>
      </div>
    </div>
  );
};

const InvoiceDetails = ({ invoice }: { invoice: InvoiceData }) => {
  return (
    <div className="flex w-full flex-row p-2">
      <div className="mr-auto flex flex-col leading-tight">
        <p>
          <span className="font-medium">Total: </span>
          {invoice.totalNet} (incl. tax)
        </p>
        <p>
          <span className="font-medium">Vendor: </span>
          {invoice.supplierName}
        </p>
        <p>
          <span className="font-medium">Customer: </span>
          {invoice.customerAddress}
        </p>
      </div>
      <div className="ml-auto flex flex-col text-right leading-tight">
        <p>
          <span className="font-medium">Transaction Date: </span>
          {invoice.date}
        </p>
        <p>
          <span className="font-medium">Date Due: </span>
          {invoice.dueDate}
        </p>
      </div>
    </div>
  );
};
