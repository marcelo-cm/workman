'use client';

import { useEffect, useState } from 'react';

import {
  EnvelopeClosedIcon,
  MagnifyingGlassIcon,
  Pencil2Icon,
} from '@radix-ui/react-icons';

import { useRouter } from 'next/navigation';

import { columns } from '@/components/data tables/columns-completed';
import { DataTable } from '@/components/data tables/data-table-invoice';
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
import { createClient } from '@/utils/supabase/client';

const { getInvoicesByState } = useInvoice();

const CompletedBills = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const router = useRouter();

  useEffect(() => {
    getInvoicesByState(InvoiceState.PROCESSED, async (invoices) => {
      setInvoices(invoices);
      setIsLoading(false);
    });
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
      <IfElseRender
        condition={!isLoading}
        ifTrue={
          <DataTable
            columns={columns}
            data={invoices}
            onAction={() => router.push('mailto:admin@workman.so')}
            actionIcon={<EnvelopeClosedIcon />}
            actionOnSelectText="Email Founders"
            canActionBeDisabled={false}
            filters={false}
          />
        }
        ifFalse={
          <>
            <div className="flex flex-row gap-4">
              <Button variant="secondary" disabled>
                <EnvelopeClosedIcon />
                Email Founders
              </Button>
              <div className="flex h-full w-[300px] flex-row items-center gap-2 rounded-md border bg-transparent px-3 py-1 text-sm text-wm-white-500 transition-colors">
                <MagnifyingGlassIcon className="h-5 w-5 cursor-pointer" />
                <input
                  disabled
                  placeholder="Filter by invoice name or sender"
                  className="h-full w-full appearance-none bg-transparent text-black outline-none placeholder:text-wm-white-500 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <DatePickerWithRange placeholder="Filter by Date Invoiced" />
              <Button variant="outline" disabled>
                Clear Filters
              </Button>
            </div>
            <LoadingState />
          </>
        }
      />
    </div>
  );
};

export default CompletedBills;
