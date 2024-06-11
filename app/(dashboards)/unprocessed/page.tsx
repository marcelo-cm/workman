'use client';

import { Email } from '@/app/api/v1/gmail/messages/route';
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
import { toast } from '@/components/ui/use-toast';
import { InvoiceObject } from '@/interfaces/common.interfaces';
import { useGmail } from '@/lib/hooks/gmail/useGmail';
import Invoice from '@/classes/Invoice';
import { createClient } from '@/utils/supabase/client';
import { MagicWandIcon } from '@radix-ui/react-icons';
import { decode } from 'base64-arraybuffer';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const getInvoices = async () => {
  const supabase = createClient();
  const { data: userDataRes, error: userDataError } =
    await supabase.auth.getUser();

  if (userDataError) {
    throw userDataError;
  }

  const { data: invoices, error: invoicesError } = await supabase
    .from('invoices')
    .select('*')
    .eq('owner', userDataRes.user.id)
    .eq('status', 'UNPROCESSED');

  if (invoicesError) {
    throw invoicesError;
  }

  return invoices;
};

const supabase = createClient();

const Unprocessed = () => {
  const { getEmails, markAsScanned } = useGmail();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [invoices, setInvoices] = useState<InvoiceObject[]>([]);
  const [emails, setEmails] = useState<Email[]>([]);
  const router = useRouter();

  async function fetchInvoices() {
    const incomingInvoices = await getInvoices();
    setInvoices(incomingInvoices);
  }

  async function fetchEmails() {
    await getEmails(setEmails);
  }

  useEffect(() => {
    fetchInvoices();
    fetchEmails();
  }, []);

  async function handleProcessSelected(selectedRows: InvoiceObject[]) {
    setIsUploading(true);
    try {
      const scanAndUpdatePromises = selectedRows.map(async (row) => {
        await Invoice.scanAndUpdate(row.fileUrl);
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
        const allFileUrlPromises = attachments.map(
          async (attachment) => await Invoice.upload(attachment),
        );

        const fileUrls = await Promise.all(allFileUrlPromises);

        const scanAllFilePromises = fileUrls.map(async (fileUrl) => {
          await Invoice.scanAndUpdate(fileUrl);
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
        <InvoiceTable
          data={invoices}
          columns={InvoiceColumns}
          onAction={handleProcessSelected}
          actionIcon={<MagicWandIcon />}
          actionOnSelectText="Process Selected Invoices"
          filters={false}
        />
        <EmailTable
          data={emails}
          columns={EmailColumns}
          onAction={handleProcessEmails}
          actionOnSelectText="Process Selected Emails"
          actionIcon={<MagicWandIcon />}
          filters={false}
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
