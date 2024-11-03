'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { MagnifyingGlassIcon, TrashIcon } from '@radix-ui/react-icons';
import { Ellipsis, ScanIcon } from 'lucide-react';

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import IfElseRender from '@/components/ui/if-else-renderer';
import { Table } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useInvoice } from '@/lib/hooks/supabase/useInvoice';

import { useAppContext } from '@/app/(dashboards)/context';
import { Email } from '@/app/api/v1/gmail/messages/route';
import { InvoiceStatus } from '@/constants/enums';
import { InvoiceCounts } from '@/interfaces/db.interfaces';
import Invoice from '@/models/Invoice';

import {
  BILLS_DATA_TABLE_TABS,
  InvoiceTabValue as TabValue,
} from './constants';
import { DataTableFooter } from './data-table-footer';
import { columns as email_columns } from './email/columns-email';
import { columns as processed_columns } from './invoice/columns-invoices-processed';
import { columns as unprocessed_columns } from './invoice/columns-invoices-unprocessed';
import { InvoiceTableBody } from './invoice/table-body';

interface DataTableProps {
  onAction: ((selectedFiles: Invoice[]) => void) | (() => void);
  actionOnSelectText: string;
  actionIcon: React.ReactNode;
  canActionBeDisabled?: boolean;
  defaultInvoiceStatus?: InvoiceStatus;
}

export function InvoiceDataTable<TData, TValue>({
  onAction,
  actionOnSelectText,
  actionIcon,
  canActionBeDisabled = true,
}: DataTableProps) {
  const {
    getCompanyInvoicesByStates,
    getCompanyInvoicesFromGmailInbox,
    getInvoicesAwaitingUserApproval,
    getInvoiceCounts,
    deleteInvoices,
  } = useInvoice();
  const { user } = useAppContext();
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
  const [isUploading, setIsUploading] = useState(false);
  const [invoiceCounts, setInvoiceCounts] = useState<InvoiceCounts>();

  const searchFilterInputRef = useRef<HTMLInputElement>(null);
  const dateRangeRef = useRef<any>(null);
  const selectedFilesUrls = Object.keys(rowSelection).map(
    (key) => filteredData[parseInt(key)] as Invoice,
  );
  const tabs = useMemo(
    () => (user && BILLS_DATA_TABLE_TABS(user)) || [],
    [user],
  );

  useEffect(() => {
    getInvoiceCounts().then(setInvoiceCounts);
  }, []);

  useEffect(() => {
    if (!tabs.length) return;

    setTabValue(tabs[0].value as TabValue);
  }, [tabs]);

  useEffect(() => {
    if (!tabValue) return;

    setData([]);
    setRowSelection({});

    if (tabValue.approverId) {
      getInvoicesAwaitingUserApproval(tabValue.approverId, setData);
      return;
    }

    if (tabValue.state) {
      getCompanyInvoicesByStates([tabValue.state].flat(), setData);
    } else if (tabValue.companyId) {
      getCompanyInvoicesFromGmailInbox(tabValue.companyId, setData);
    }
  }, [JSON.stringify(tabValue)]);

  useEffect(() => {
    if (!data) return;

    updateFilteredData();
  }, [dateRange, data]);

  const columns = tabValue?.state
    ? tabValue.state === InvoiceStatus.UNPROCESSED
      ? unprocessed_columns
      : processed_columns
    : tabValue?.companyId
      ? email_columns
      : [];

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

  const ActionBar = () => {
    const handleScanInvoices = async (selectedInvoices: Invoice[]) => {
      setIsUploading(true);
      const scanPromises = selectedInvoices.map(
        async (invoice) => await invoice.scan(),
      );
      await Promise.all(scanPromises).then(() => {
        tabValue?.state &&
          getCompanyInvoicesByStates([tabValue.state].flat(), setData);
        setRowSelection({});
        setIsUploading(false);
      });
      getInvoiceCounts().then(setInvoiceCounts);
    };

    const deleteInvoicesBulk = async () => {
      setIsUploading(true);
      const invoiceIds = selectedFilesUrls.map((inv) => inv.id);
      await deleteInvoices(invoiceIds).then(() => {
        tabValue?.state &&
          getCompanyInvoicesByStates([tabValue.state].flat(), setData);
        setRowSelection({});
        setIsUploading(false);
      });
      getInvoiceCounts().then(setInvoiceCounts);
    };

    const MoreOptionsButton = () => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size={'icon'}
              variant={'outline'}
              disabled={!Object.keys(rowSelection).length}
            >
              <Ellipsis className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mr-4">
            <DropdownMenuItem onClick={deleteInvoicesBulk} asChild>
              <Button
                size={'sm'}
                className="!h-fit w-48 justify-start gap-2 p-2"
                variant={'ghost'}
                appearance={'destructive-strong'}
              >
                <TrashIcon className="size-4" />
                Delete
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    };

    return (
      <div className="flex flex-row gap-2">
        <IfElseRender
          condition={tabValue?.state === InvoiceStatus.UNPROCESSED}
          ifTrue={
            <Button
              variant="secondary"
              disabled={canActionBeDisabled && selectedFilesUrls.length === 0}
              onClick={() => handleScanInvoices(selectedFilesUrls)}
            >
              <ScanIcon className="h-4 w-4" />
              Scan Selected
            </Button>
          }
          ifFalse={
            <Button
              variant="secondary"
              disabled={canActionBeDisabled && selectedFilesUrls.length === 0}
              onClick={() => onAction(selectedFilesUrls)}
            >
              {actionIcon}
              {actionOnSelectText}
            </Button>
          }
        />
        <MoreOptionsButton />
      </div>
    );
  };

  return (
    <>
      <UploadingAlertDialog
        isUploading={isUploading}
        n={selectedFilesUrls.length}
      />
      <div>
        <Tabs
          defaultValue={tabs && (tabs[0]?.value as unknown as string)}
          onValueChange={(value) => setTabValue(value as unknown as TabValue)}
          value={tabValue as unknown as string}
        >
          <TabsList className="h-fit rounded-b-none rounded-t-md border border-b-0">
            {tabs &&
              tabs.map((tab) => (
                <TabsTrigger
                  key={tab.title}
                  value={tab.value as unknown as string}
                  className="flex h-10 grow justify-start gap-2 data-[state=active]:border-b data-[state=active]:border-wm-orange data-[state=active]:text-wm-orange"
                >
                  {tab.icon}
                  {tab.title}
                  {tab.countKey && invoiceCounts && (
                    <Button
                      asChild
                      className={`ml-1 !h-6 !w-5 text-xs ${tabValue != tab.value ? 'bg-gray-400' : ''}`}
                      size={'sm'}
                      type="button"
                    >
                      <span>{invoiceCounts[tab.countKey]}</span>
                    </Button>
                  )}
                </TabsTrigger>
              ))}
          </TabsList>
        </Tabs>
        <div className="flex w-full flex-row items-center justify-between rounded-tr-md border-x border-t p-2">
          <div className="flex flex-row gap-2">
            <div className="flex h-10 w-[300px] flex-row items-center gap-2 rounded-md border bg-transparent px-3 py-1 text-sm text-wm-white-500 transition-colors">
              <MagnifyingGlassIcon
                className="pointer-events-none h-5 w-5 cursor-pointer"
                onClick={() => searchFilterInputRef.current?.focus()}
              />
              <input
                ref={searchFilterInputRef}
                value={
                  (table
                    .getColumn('file_name&sender')
                    ?.getFilterValue() as string) ?? ''
                }
                onChange={(event) =>
                  table
                    .getColumn('file_name&sender')
                    ?.setFilterValue(event.target.value)
                }
                placeholder="Filter by invoice name or sender"
                className="h-full w-full appearance-none bg-transparent text-black outline-none placeholder:text-wm-white-500 disabled:cursor-not-allowed disabled:opacity-50"
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
          <ActionBar />
        </div>
        <div className="rounded-b-md border">
          <Table>
            <InvoiceTableBody table={table as TableType<Invoice>} />
            <DataTableFooter
              table={table}
              numCols={columns.length}
              numRows={data.length}
            />
          </Table>
        </div>
      </div>
    </>
  );
}

const UploadingAlertDialog = ({
  isUploading,
  n,
}: {
  isUploading: boolean;
  n: number;
}) => (
  <AlertDialog open={isUploading}>
    <AlertDialogContent className="justify-center">
      <AlertDialogHeader className="items-center">
        <WorkmanLogo className="w-32 animate-pulse" />
        <AlertDialogTitle>Uploading your Data Now!</AlertDialogTitle>
      </AlertDialogHeader>
      <AlertDialogDescription className="text-center">
        It's important that you don't close this window while we're uploading
        your data. We are uploading {n} files.
      </AlertDialogDescription>
    </AlertDialogContent>
  </AlertDialog>
);
