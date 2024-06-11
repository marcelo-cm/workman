'use client';

import { columns } from '@/components/data tables/columns-completed';
import { DataTable } from '@/components/data tables/data-table-invoice';
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { InvoiceObject } from '@/interfaces/common.interfaces';
import { createClient } from '@/utils/supabase/client';
import { EnvelopeClosedIcon } from '@radix-ui/react-icons';
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
    .eq('status', 'PROCESSED');

  if (invoicesError) {
    throw invoicesError;
  }

  return invoices;
};

const CompletedBills = () => {
  const [invoices, setInvoices] = useState<InvoiceObject[]>([]);
  const router = useRouter();

  async function fetchInvoices() {
    const incomingInvoices = await getInvoices();
    setInvoices(incomingInvoices);
  }

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <div className="flex h-full w-full flex-col gap-4 px-4 py-8">
      <BreadcrumbList className="text-wm-white-400">
        <BreadcrumbItem>Bills</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbLink className="text-black" href="/unprocessed">
          Completed
        </BreadcrumbLink>
      </BreadcrumbList>
      <div className="flex w-full flex-row justify-between font-poppins text-4xl">
        Completed Invoices
      </div>
      <p>
        Any invoices that have already been processed will be displayed here.
      </p>
      <DataTable
        data={invoices}
        columns={columns}
        onAction={() => router.push('mailto:admin@workman.so')}
        actionIcon={<EnvelopeClosedIcon />}
        actionOnSelectText="Email Founders"
        canActionBeDisabled={false}
        filters={false}
      />
    </div>
  );
};

export default CompletedBills;
