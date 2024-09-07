'use client';

import { useState } from 'react';

import { Pencil2Icon } from '@radix-ui/react-icons';

import { ReceiptDataTable } from '@/components/(dashboards)/bills/data-tables/receipts/data-table-receipts';
import ExtractionReview from '@/components/(dashboards)/bills/extraction/ExtractionReview';
import UploadReceiptButton from '@/components/(shared)/general/UploadReceiptButton';
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

import { Receipt } from '@/models/Receipt';

export default function ForApproval() {
  const [selectedFiles, setSelectedFiles] = useState<Receipt[]>([]); // Used for the Extraction Review component
  const [review, setReview] = useState<boolean>(false);

  const handleReviewSelected = async (files: Receipt[]) => {
    setSelectedFiles(files);
    setReview(true);
  };

  return (
    <>
      {review ? (
        <ExtractionReview files={[]} />
      ) : (
        <div className="flex h-full w-full flex-col gap-4 px-4 py-8">
          <BreadcrumbList className="text-wm-white-400">
            <BreadcrumbItem>Dashboard</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbLink className="text-black" href="/bills">
              Receipts
            </BreadcrumbLink>
          </BreadcrumbList>
          <div className="flex w-full flex-row justify-between font-poppins text-4xl">
            Receipts <UploadReceiptButton />
          </div>
          <p>
            Upload your file and we'll process it for you. Select multiple files
            to below to review the scan and upload to QuickBooks.
          </p>
          <ReceiptDataTable
            onAction={handleReviewSelected}
            actionIcon={<Pencil2Icon />}
            actionOnSelectText="Review Selected"
          />
        </div>
      )}
    </>
  );
}
