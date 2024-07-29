'use client';

import { useState } from 'react';

import { Pencil2Icon } from '@radix-ui/react-icons';

import { InvoiceDataTable } from '@/components/(dashboards)/bills/data-tables/data-table-invoice';
import ExtractionReview from '@/components/(dashboards)/bills/extraction/ExtractionReview';
import UploadFileButton from '@/components/(shared)/general/UploadFileButton';
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

import Invoice from '@/models/Invoice';

export default function ForApproval() {
  const [selectedFiles, setSelectedFiles] = useState<Invoice[]>([]); // Used for the Extraction Review component
  const [review, setReview] = useState<boolean>(false);

  const handleReviewSelected = async (files: Invoice[]) => {
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
            <BreadcrumbItem>Dashboard</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbLink className="text-black" href="/bills">
              Bills
            </BreadcrumbLink>
          </BreadcrumbList>
          <div className="flex w-full flex-row justify-between font-poppins text-4xl">
            Bills for Approval <UploadFileButton />
          </div>
          <p>
            Upload your file and we'll process it for you. Select multiple files
            to below to review the scan and upload to QuickBooks.
          </p>
          <InvoiceDataTable
            onAction={handleReviewSelected}
            actionIcon={<Pencil2Icon />}
            actionOnSelectText="Review Selected"
          />
        </div>
      )}
    </>
  );
}
