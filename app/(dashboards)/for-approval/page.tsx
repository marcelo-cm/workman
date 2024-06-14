'use client';

import Invoice from '@/classes/Invoice';
import UploadFileButton from '@/components/dashboards/UploadFileButton';
import { columns } from '@/components/data tables/columns-for-review';
import { DataTable } from '@/components/data tables/data-table-invoice';
import ExtractionReview from '@/components/extraction/ExtractionReview';
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
import { Button } from '@/components/ui/button';
import { InvoiceObject } from '@/interfaces/common.interfaces';
import { createClient } from '@/utils/supabase/client';
import { Pencil2Icon, UploadIcon } from '@radix-ui/react-icons';
import { UserResponse } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const supabase = createClient();

export default function ForApproval() {
  const fileInputRef = useRef<null | HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<InvoiceObject[]>([]); // Used for the Extraction Review component
  const [invoices, setInvoices] = useState<InvoiceObject[]>([]);
  const [review, setReview] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    getInvoices();
  }, []);

  async function fetchUser(): Promise<UserResponse> {
    const user = await supabase.auth.getUser();
    return user;
  }

  async function getInvoices() {
    const user = await fetchUser();
    const id = user.data.user?.id;

    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('status', 'FOR_REVIEW')
      .eq('owner', `${id}`);

    if (error) {
      console.error('Error fetching invoices:', error);
    } else {
      setInvoices(data as InvoiceObject[]);
    }
  }

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUpload = async (event: any) => {
    setIsUploading(true);
    const filesList = event.target.files;
    if (!filesList) {
      return;
    }

    const files = Array.from(filesList) as File[];

    try {
      const allFileUrlPromises = files.map(
        async (file) => await Invoice.upload(file),
      );
      const fileUrls = await Promise.all(allFileUrlPromises);

      const scanAllFilePromises = fileUrls.map(async (fileUrl) => {
        await Invoice.scanAndUpdate(fileUrl);
      });

      await Promise.all(scanAllFilePromises);

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error uploading files:', error);
    }
    setIsUploading(false);
  };

  const handleReviewSelected = async (files: InvoiceObject[]) => {
    setSelectedFiles(files);
    setReview(true);
  };

  return (
    <>
      {review ? (
        <ExtractionReview files={selectedFiles} />
      ) : (
        <div className="flex h-full w-full flex-col gap-4 px-4 py-8">
          <BreadcrumbList className="text-wm-white-400">
            <BreadcrumbItem>Bills</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbLink className="text-black" href="/for-approval">
              For Approval
            </BreadcrumbLink>
          </BreadcrumbList>
          <div className="flex w-full flex-row justify-between font-poppins text-4xl">
            Bills for Approval{' '}
            <Button onClick={handleButtonClick}>
              <input
                type="file"
                ref={fileInputRef}
                multiple
                accept="application/pdf"
                onChange={handleUpload}
                style={{ display: 'none' }}
              />
              <UploadIcon /> Upload Document
            </Button>
          </div>
          <p>
            For us to process your bills, forward the bills you receive to
            email@workman.so. We’ll process it for you right away!
          </p>
          <DataTable
            columns={columns}
            data={invoices}
            onAction={handleReviewSelected}
            actionIcon={<Pencil2Icon />}
            actionOnSelectText="Review Selected"
          />
        </div>
      )}
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
}
