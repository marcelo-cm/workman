'use client';

import { useEffect, useMemo, useRef, useState, useTransition } from 'react';

import { MagnifyingGlassIcon } from '@radix-ui/react-icons';

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  Table as TableType,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import WorkmanLogo from '@/components/molecules/WorkmanLogo';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import IfElseRender from '@/components/ui/if-else-renderer';
import { Table } from '@/components/ui/table';

import { useInvoice } from '@/lib/hooks/supabase/useInvoice';

import { Email } from '@/app/api/v1/gmail/messages/interfaces';
import Invoice from '@/models/Invoice';

import { TabValue } from './constants';
import DataTableFooter from './data-table-footer';
import DataTableTabs, { DataTableTabsRef } from './data-table-tabs';
import DataTableEmailActionBar from './email/action-bar';
import { columns as email_columns } from './email/columns-email';
import { EmailTableBody } from './email/table-body';
import DataTableInvoiceActionBar from './invoice/action-bar';
import { columns as invoice_columns } from './invoice/columns-invoice';
import { InvoiceTableBody } from './invoice/table-body';

interface DataTableProps {
  onAction: ((selectedFiles: Invoice[]) => void) | (() => void);
}

export function InvoiceDataTable<TData, TValue>({ onAction }: DataTableProps) {
  const {
    getCompanyInvoicesByStates,
    getCompanyInvoicesFromGmailInbox,
    getInvoicesAwaitingUserApproval,
  } = useInvoice();

  const [data, setData] = useState<Invoice[] | Email[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [dateRange, setDateRange] = useState({
    from: undefined,
    to: undefined,
  });
  const [filteredData, setFilteredData] = useState<Invoice[] | Email[]>([]);
  const [tabValue, setTabValue] = useState<TabValue>();
  const [isUploading, startUploading] = useTransition();

  const tabsRef = useRef<DataTableTabsRef>(null);
  const dateRangeRef = useRef<any>(null);

  const columns = useMemo(() => {
    if (tabValue?.type == 'Invoice') {
      return invoice_columns;
    }

    if (tabValue?.type === 'Email') {
      return email_columns;
    }

    return [];
  }, [tabValue?.type]);

  useEffect(() => {
    if (!tabValue) return;

    setData([]);
    setRowSelection({});

    if (tabValue.approverId) {
      getInvoicesAwaitingUserApproval(tabValue.approverId, setData);
      return;
    }

    if (tabValue.type === 'Invoice' && tabValue.state) {
      getCompanyInvoicesByStates([tabValue.state].flat(), setData);
    } else if (tabValue.type === 'Email' && tabValue.companyId) {
      getCompanyInvoicesFromGmailInbox(tabValue.companyId, setData);
    }
  }, [JSON.stringify(tabValue)]);

  useEffect(() => {
    if (!data) return;

    updateFilteredData();
  }, [dateRange, data]);

  const table = useReactTable<Email | Invoice>({
    data: filteredData,
    columns: columns as ColumnDef<Invoice | Email, any>[],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 10,
        pageIndex: 0,
      },
    },
  });

  const updateFilteredData = () => {
    if (!dateRange.from && !dateRange.to) {
      setFilteredData(data);
      return;
    }

    const filtered: Invoice[] | Email[] = data.filter((item) => {
      const date = new Date(item.date).getTime();
      const fromTime = dateRange.from && new Date(dateRange.from).getTime();
      const toTime = dateRange.to && new Date(dateRange.to).getTime();
      return (!fromTime || date >= fromTime) && (!toTime || date <= toTime);
    }) as Invoice[] | Email[];
    setFilteredData(filtered);
  };

  const handleClearFilters = () => {
    setColumnFilters([]);
    setDateRange({ from: undefined, to: undefined });
    dateRangeRef.current?.clearDate();
  };

  const handleEmailAction = async () => {
    tabValue?.companyId &&
      (await getCompanyInvoicesFromGmailInbox(tabValue.companyId, setData));
    setRowSelection({});
    tabsRef.current?.refreshInvoiceCounts();
  };

  const handleInvoiceAction = async () => {
    tabValue?.state &&
      (await getCompanyInvoicesByStates([tabValue.state].flat(), setData));
    setRowSelection({});
    tabsRef.current?.refreshInvoiceCounts();
  };

  return (
    <>
      <div>
        <DataTableTabs
          tabValue={tabValue}
          setTabValue={setTabValue}
          ref={tabsRef}
        />
        <div className="flex w-full flex-row items-center justify-between rounded-tr-md border-x border-t p-2">
          <div className="flex flex-row gap-2">
            <div className="relative flex h-10 w-[300px] flex-row items-center gap-2 rounded-md border bg-transparent px-3 py-1 text-sm text-wm-white-500 transition-colors">
              <MagnifyingGlassIcon className="pointer-events-none absolute h-5 w-5" />
              <input
                value={
                  (table.getColumn('filterable')?.getFilterValue() as string) ??
                  ''
                }
                onChange={(event) =>
                  table
                    .getColumn('filterable')
                    ?.setFilterValue(event.target.value)
                }
                placeholder="Filter by invoice name or sender"
                className="h-full w-full appearance-none bg-transparent pl-6 text-black outline-none placeholder:text-wm-white-500 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <DatePickerWithRange
              placeholder="Filter by Date Invoiced"
              onDateChange={setDateRange}
              ref={dateRangeRef}
            />
            <Button
              variant="ghost"
              onClick={handleClearFilters}
              className={
                columnFilters.length === 0 && !dateRange.from ? 'hidden' : ''
              }
            >
              Clear Filters
            </Button>
          </div>
          <IfElseRender
            condition={tabValue?.type === 'Invoice'}
            ifTrue={
              <DataTableInvoiceActionBar
                rowSelection={rowSelection}
                data={filteredData as Invoice[]}
                onAction={onAction}
                afterAction={handleInvoiceAction}
              />
            }
            ifFalse={
              <DataTableEmailActionBar
                rowSelection={rowSelection}
                data={filteredData as Email[]}
                afterAction={handleEmailAction}
              />
            }
          />
        </div>
        <div className="rounded-b-md border">
          <Table>
            <IfElseRender
              condition={tabValue?.type === 'Invoice'}
              ifTrue={<InvoiceTableBody table={table as TableType<Invoice>} />}
              ifFalse={<EmailTableBody table={table as TableType<Email>} />}
            />
            <DataTableFooter
              table={table}
              numCols={columns.length}
              numRows={data.length}
            />
          </Table>
        </div>
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
}
