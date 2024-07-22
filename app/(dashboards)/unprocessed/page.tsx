'use client';

import { useEffect, useState } from 'react';

import { MagicWandIcon } from '@radix-ui/react-icons';

import { useRouter } from 'next/navigation';

import { columns as EmailColumns } from '@/components/data tables/columns-email';
import { columns as InvoiceColumns } from '@/components/data tables/columns-unprocessed';
import { DataTable as EmailTable } from '@/components/data tables/data-table-emails';
import { DataTable as InvoiceTable } from '@/components/data tables/data-table-invoice';
import WorkmanLogo from '@/components/molecules/WorkmanLogo';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import LoadingState from '@/components/ui/empty-state';
import IfElseRender from '@/components/ui/if-else-renderer';

import { useGmail } from '@/lib/hooks/gmail/useGmail';
import { useInvoice } from '@/lib/hooks/supabase/useInvoice';

import { Email } from '@/app/api/v1/gmail/messages/route';
import { InvoiceState } from '@/constants/enums';
import Invoice from '@/models/Invoice';
import { createClient } from '@/utils/supabase/client';

const { getInvoicesByState } = useInvoice();

const Unprocessed = () => {
  const { getEmails, markAsScanned } = useGmail();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isLoadingInvoices, setIsLoadingInvoices] = useState<boolean>(true);
  const [isLoadingEmails, setIsLoadingEmails] = useState<boolean>(true);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [emails, setEmails] = useState<Email[]>([]);

  useEffect(() => {
    getInvoicesByState(InvoiceState.UNPROCESSED, async (invoices) => {
      setInvoices(invoices);
      setIsLoadingInvoices(false);
    });
    getEmails((emails) => {
      setEmails(emails);
      setIsLoadingEmails(false);
    });
  }, []);

  async function handleProcessSelected(selectedRows: Invoice[]) {
    setIsUploading(true);
    try {
      const scanAndUpdatePromises = selectedRows.map(async (row) => {
        await Invoice.scanAndUpdate(row.file_url);
      });

      const scanAndUpdateResolved = await Promise.all(scanAndUpdatePromises);

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error uploading files:', error);
    }
    setIsUploading(false);
  }

  async function handleProcessEmails(selectedRows: Email[]) {
    setIsUploading(true);
    try {
      for (const email of selectedRows) {
        const attachments = email.attachments;
        const allfile_urlPromises = attachments.map(
          async (attachment) => await Invoice.upload(attachment),
        );

        const file_urls = await Promise.all(allfile_urlPromises);

        const scanAllFilePromises = file_urls.map(async (file_url) => {
          await Invoice.scanAndUpdate(file_url);
        });

        await Promise.all(scanAllFilePromises);

        await markAsScanned(email.id);

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error('Error uploading files:', error);
    }
    setIsUploading(false);
  }

  return (
    <>
      <div className="flex h-full w-full flex-col gap-4 px-4 py-8">
        <BreadcrumbList className="text-wm-white-400">
          <BreadcrumbItem>Bills</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbLink className="text-black" href="/unprocessed">
            Unprocessed
          </BreadcrumbLink>
        </BreadcrumbList>
        <div className="flex w-full flex-row justify-between font-poppins text-4xl">
          Unprocessed Invoices
        </div>
        <p>
          Any invoices that have not been processed will be displayed here.
          Please select and process them as needed.
        </p>
        <IfElseRender
          condition={!isLoadingInvoices}
          ifTrue={
            <InvoiceTable
              data={invoices}
              columns={InvoiceColumns}
              onAction={handleProcessSelected}
              actionIcon={<MagicWandIcon />}
              actionOnSelectText="Process Selected Invoices"
              filters={false}
            />
          }
          ifFalse={<LoadingState message="Loading Invoices" />}
        />
        <IfElseRender
          condition={!isLoadingEmails}
          ifTrue={
            <EmailTable
              data={emails}
              columns={EmailColumns}
              onAction={handleProcessEmails}
              actionOnSelectText="Process Selected Emails"
              actionIcon={<MagicWandIcon />}
              filters={false}
            />
          }
          ifFalse={<LoadingState message="Loading Emails" />}
        />
      </div>
      <AlertDialog open={isUploading}>
        <AlertDialogContent className="justify-center">
          <AlertDialogHeader className="items-center">
            <WorkmanLogo className="w-32 animate-pulse" />
            <AlertDialogTitle>Uploading your Data Now!</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription className="text-center">
            It's important that you don't close this window while we're
            uploading your data.
          </AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Unprocessed;
