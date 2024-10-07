'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { MagnifyingGlassIcon, PaperPlaneIcon } from '@radix-ui/react-icons';
import { Ellipsis, ScanIcon } from 'lucide-react';

import {
  ColumnFiltersState,
  SortingState,
  Table as TableType,
  flexRender,
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
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useInvoice } from '@/lib/hooks/supabase/useInvoice';

import { useAppContext } from '@/app/(dashboards)/context';
import { InvoiceStatus } from '@/constants/enums';
import { InvoiceCounts } from '@/interfaces/db.interfaces';
import Invoice from '@/models/Invoice';

import { columns as processed_columns } from './columns-invoices-processed';
import { columns as unprocessed_columns } from './columns-invoices-unprocessed';
import { INVOICE_DATA_TABLE_TABS, TabValue } from './constants';

interface DataTableProps {
  onAction: ((selectedFiles: Invoice[]) => void) | (() => void);
  actionOnSelectText: string;
  actionIcon: React.ReactNode;
  canActionBeDisabled?: boolean;
  filters?: boolean;
  defaultInvoiceStatus?: InvoiceStatus;
}

const {
  getCompanyInvoicesByStates,
  getInvoicesAwaitingUserApproval,
  getInvoiceCounts,
} = useInvoice();

export function InvoiceDataTable<TData, TValue>({
  onAction,
  actionOnSelectText,
  actionIcon,
  canActionBeDisabled = true,
}: DataTableProps) {
  const { user } = useAppContext();
  const [data, setData] = useState<Invoice[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [dateRange, setDateRange] = useState({
    from: undefined,
    to: undefined,
  });
  const [filteredData, setFilteredData] = useState<Invoice[]>([]);
  const [tabValue, setTabValue] = useState<TabValue>();
  const [isUploading, setIsUploading] = useState(false);
  const [invoiceCounts, setInvoiceCounts] = useState<InvoiceCounts>();

  const searchFilterInputRef = useRef<HTMLInputElement>(null);
  const dateRangeRef = useRef<any>(null);
  const selectedFilesUrls = Object.keys(rowSelection).map(
    (key) => filteredData[parseInt(key)] as Invoice,
  );
  const tabs = useMemo(
    () => (user && INVOICE_DATA_TABLE_TABS(user)) || [],
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

    getCompanyInvoicesByStates([tabValue.state].flat(), setData);
  }, [JSON.stringify(tabValue)]);

  useEffect(() => {
    if (!data) return;

    updateFilteredData();
  }, [dateRange, data]);

  const columns =
    tabValue?.state === InvoiceStatus.UNPROCESSED
      ? unprocessed_columns
      : processed_columns;

  const table = useReactTable({
    data: filteredData,
    columns: columns,
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

    const filtered = data.filter((item) => {
      const invoiceDate = new Date((item as Invoice).data.date).getTime();
      const fromTime = dateRange.from && new Date(dateRange.from).getTime();
      const toTime = dateRange.to && new Date(dateRange.to).getTime();
      return (
        (!fromTime || invoiceDate >= fromTime) &&
        (!toTime || invoiceDate <= toTime)
      );
    });
    setFilteredData(filtered);
  };

  const FilterBar = () => {
    const handleClearFilters = () => {
      setColumnFilters([]);
      setDateRange({ from: undefined, to: undefined });
      dateRangeRef.current?.clearDate();
    };

    return (
      <div className="flex flex-row gap-2">
        <div className="flex h-10 w-[300px] flex-row items-center gap-2 rounded-md border bg-transparent px-3 py-1 text-sm text-wm-white-500 transition-colors">
          <MagnifyingGlassIcon
            className="h-5 w-5 cursor-pointer"
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
    );
  };

  const ActionBar = () => {
    const handleScanInvoices = async (selectedFiles: Invoice[]) => {
      setIsUploading(true);
      const scanPromises = selectedFiles.map(
        async (file) => await Invoice.scanAndUpdate(file.fileUrl),
      );
      await Promise.all(scanPromises).then(() => {
        tabValue &&
          getCompanyInvoicesByStates([tabValue.state].flat(), setData);
        setRowSelection({});
        setIsUploading(false);
      });
    };

    const quickSubmit = async () => {
      setIsUploading(true);
      const submitPromises = selectedFilesUrls.map(async (file) => {
        const transformedData =
          await Invoice.transformToQuickBooksInvoice(file);
        await Invoice.uploadToQuickbooks(transformedData);
      });
      await Promise.all(submitPromises).then(() => {
        tabValue &&
          getCompanyInvoicesByStates([tabValue.state].flat(), setData);
        setRowSelection({});
        setIsUploading(false);
      });
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
        <Button size={'icon'} variant={'outline'}>
          <Ellipsis className="h-4 w-4" />
        </Button>
        {Object.keys(rowSelection).length > 0 &&
          Object.keys(rowSelection).every(
            (index) => data[Number(index)].status === InvoiceStatus.APPROVED,
          ) && (
            <Button onClick={quickSubmit}>
              Quick Submit <PaperPlaneIcon className="h-4 w-4" />
            </Button>
          )}
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
          <FilterBar />
          <ActionBar />
        </div>
        <div className="rounded-b-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <DataTableFooter
              table={table}
              numCols={columns.length}
              numInvoices={data.length}
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

const DataTableFooter = ({
  table,
  numCols,
  numInvoices,
}: {
  table: TableType<Invoice>;
  numCols: number;
  numInvoices: number;
}) => {
  const { pageSize, pageIndex } = table.getState().pagination;
  const startIndex = pageSize * pageIndex + 1; //adding 1 to start counting from 1 for the invoices user is seeing (not 0-9)
  const endIndex = Math.min(pageSize * (pageIndex + 1), numInvoices); // Ensure it doesn't exceed total rows

  return (
    <TableFooter>
      <TableRow>
        <TableCell colSpan={numCols}>
          <div className="flex items-center justify-end space-x-2 ">
            <div className="flex-1">
              <div className="text-muted-foreground items-center text-sm">
                {table.getFilteredSelectedRowModel().rows.length} of{' '}
                {table.getFilteredRowModel().rows.length} invoice(s) selected.
              </div>
              <div className="text-xs font-normal">
                Viewing Invoices {startIndex}-{endIndex}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <div className="w-4 text-center">
              {table.getState().pagination.pageIndex + 1}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </TableCell>
      </TableRow>
    </TableFooter>
  );
};
