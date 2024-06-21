'use client';

import Invoice from '@/classes/Invoice';
import UploadFileButton from '@/components/dashboards/UploadFileButton';
import { columns } from '@/components/data tables/columns-for-review';
import { DataTable } from '@/components/data tables/data-table-invoice';
import ExtractionReview from '@/components/extraction/ExtractionReview';
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { createClient } from '@/utils/supabase/client';
import { Pencil2Icon } from '@radix-ui/react-icons';
import { UserResponse } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

const supabase = createClient();

export default function ForApproval() {
  const [selectedFiles, setSelectedFiles] = useState<Invoice[]>([]); // Used for the Extraction Review component
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [review, setReview] = useState<boolean>(false);

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
      setInvoices(data as Invoice[]);
    }
  }

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
    </>
  );
}
