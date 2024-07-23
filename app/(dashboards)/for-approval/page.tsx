'use client';

import { useEffect, useState } from 'react';

import { MagnifyingGlassIcon, Pencil2Icon } from '@radix-ui/react-icons';

import { columns } from '@/components/data tables/columns-for-review';
import { InvoiceDataTable } from '@/components/data tables/data-table-invoice';
import ExtractionReview from '@/components/extraction/ExtractionReview';
import UploadFileButton from '@/components/general/UploadFileButton';
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import LoadingState from '@/components/ui/empty-state';
import IfElseRender from '@/components/ui/if-else-renderer';

import { useInvoice } from '@/lib/hooks/supabase/useInvoice';

import { InvoiceState } from '@/constants/enums';
import Invoice from '@/models/Invoice';

const { getInvoicesByState } = useInvoice();

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
            <BreadcrumbItem>Bills</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbLink className="text-black" href="/for-approval">
              For Approval
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
