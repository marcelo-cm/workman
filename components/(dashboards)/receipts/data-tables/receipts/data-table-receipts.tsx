'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { MagnifyingGlassIcon, PaperPlaneIcon } from '@radix-ui/react-icons';
import { ScanIcon } from 'lucide-react';

import {
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useSelector } from 'react-redux';

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

import { useReceipt } from '@/lib/hooks/supabase/useReceipts';

import { ReceiptStatus } from '@/constants/enums';
import { ReceiptCounts } from '@/interfaces/db.interfaces';
import { Receipt } from '@/models/Receipt';
import { RootState } from '@/store/store';

import {
  RECEIPT_DATA_TABLE_TABS,
  ReceiptTabValue as TabValue,
} from '../constants';
import { columns as processed_columns } from './columns-receipts-processed';
import { columns as unprocessed_columns } from './columns-receipts-unprocessed';

interface DataTableProps {
  onAction: ((selectedFiles: Receipt[]) => void) | (() => void);
  actionOnSelectText: string;
  actionIcon: React.ReactNode;
  canActionBeDisabled?: boolean;
  defaultReceiptStatus?: ReceiptStatus;
}

const {
  getCompanyReceiptsByStates,
  getReceiptsAwaitingUserApproval,
  getReceiptCounts,
} = useReceipt();

export function ReceiptDataTable<TData, TValue>({
  onAction,
  actionOnSelectText,
  actionIcon,
  canActionBeDisabled = true,
}: DataTableProps) {
  const [data, setData] = useState<Receipt[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [dateRange, setDateRange] = useState({
    from: undefined,
    to: undefined,
  });
  const [filteredData, setFilteredData] = useState<Receipt[]>([]);
  const [tabValue, setTabValue] = useState<TabValue>();
  const [isUploading, setIsUploading] = useState(false);
  const [receiptCounts, setReceiptCounts] = useState<ReceiptCounts>();

  const user = useSelector((state: RootState) => state.user.user);
  const searchFilterInputRef = useRef<HTMLInputElement>(null);
  const dateRangeRef = useRef<any>(null);
  const selectedFilesUrls = Object.keys(rowSelection).map(
    (key) => filteredData[parseInt(key)] as Receipt,
  );
  const tabs = useMemo(
    () => (user && RECEIPT_DATA_TABLE_TABS(user)) || [],
    [user],
  );

  useEffect(() => {
    getReceiptCounts().then(setReceiptCounts);
  }, []);

  useEffect(() => {
    if (!tabs.length) return;

    setTabValue(tabs[0].value as TabValue);
  }, [tabs]);

  useEffect(() => {
    if (!tabValue) return;

    setRowSelection({});

    if (tabValue.approverId) {
      getReceiptsAwaitingUserApproval(tabValue.approverId, setData);
      return;
    }

    getCompanyReceiptsByStates([tabValue.state].flat(), setData);
  }, [JSON.stringify(tabValue)]);

  useEffect(() => {
    if (!data) return;

    updateFilteredData();
  }, [dateRange, data]);

  const columns =
    tabValue?.state === ReceiptStatus.UNPROCESSED
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

  const { pageSize, pageIndex } = table.getState().pagination;
  const startIndex = pageSize * pageIndex + 1; //adding 1 to start counting from 1 for the receipts user is seeing (not 0-9)
  const endIndex = Math.min(pageSize * (pageIndex + 1), data.length); // Ensure it doesn't exceed total rows

  const updateFilteredData = () => {
    if (!dateRange.from && !dateRange.to) {
      setFilteredData(data);
      return;
    }

    const filtered = data.filter((item) => {
      const receiptDate = new Date((item as Receipt).data.date).getTime();
      const fromTime = dateRange.from && new Date(dateRange.from).getTime();
      const toTime = dateRange.to && new Date(dateRange.to).getTime();
      return (
        (!fromTime || receiptDate >= fromTime) &&
        (!toTime || receiptDate <= toTime)
      );
    });
    setFilteredData(filtered);
  };

  const handleClearFilters = () => {
    setColumnFilters([]);
    setDateRange({ from: undefined, to: undefined });
    dateRangeRef.current?.clearDate();
  };

  const handleScanReceipts = async (selectedFiles: Receipt[]) => {
    //   setIsUploading(true);
    //   const scanPromises = selectedFiles.map(
    //     async (file) => await Receipt.scanAndUpdate(file.fileUrl),
    //   );
    //   await Promise.all(scanPromises).then(() => {
    //     tabValue && getCompanyReceiptsByStates([tabValue.state].flat(), setData);
    //     setRowSelection({});
    //     setIsUploading(false);
    //   });
  };

  const quickSubmit = async () => {
    //   setIsUploading(true);
    //   const submitPromises = selectedFilesUrls.map(async (file) => {
    //     const transformedData = await Receipt.transformToQuickBooksReceipt(file);
    //     await Receipt.uploadToQuickbooks(transformedData);
    //   });
    //   await Promise.all(submitPromises).then(() => {
    //     tabValue && getCompanyReceiptsByStates([tabValue.state].flat(), setData);
    //     setRowSelection({});
    //     setIsUploading(false);
    //   });
  };

  return (
    <>
      <div className="flex flex-row gap-4">
        <AlertDialog open={isUploading}>
          <AlertDialogContent className="justify-center">
            <AlertDialogHeader className="items-center">
              <WorkmanLogo className="w-32 animate-pulse" />
              <AlertDialogTitle>Uploading your Data Now!</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription className="text-center">
              It's important that you don't close this window while we're
              uploading your data. We are uploading {selectedFilesUrls.length}{' '}
              files.
            </AlertDialogDescription>
          </AlertDialogContent>
        </AlertDialog>
        <IfElseRender
          condition={tabValue?.state === ReceiptStatus.UNPROCESSED}
          ifTrue={
            <Button
              variant="secondary"
              disabled={canActionBeDisabled && selectedFilesUrls.length === 0}
              onClick={() => handleScanReceipts(selectedFilesUrls)}
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
        {Object.keys(rowSelection).length > 0 &&
          Object.keys(rowSelection).every(
            (index) => data[Number(index)].status === ReceiptStatus.APPROVED,
          ) && (
            <Button onClick={quickSubmit}>
              Quick Submit <PaperPlaneIcon className="h-4 w-4" />
            </Button>
          )}
        <div className="flex h-full w-[300px] flex-row items-center gap-2 rounded-md border bg-transparent px-3 py-1 text-sm text-wm-white-500 transition-colors">
          <MagnifyingGlassIcon
            className="pointer-events-none h-5 w-5 cursor-pointer"
            onClick={() => searchFilterInputRef.current?.focus()}
          />
          <input
            ref={searchFilterInputRef}
            value={
              (table.getColumn('supplier')?.getFilterValue() as string) ?? ''
            }
            onChange={(event) =>
              table.getColumn('supplier')?.setFilterValue(event.target.value)
            }
            placeholder="Filter by receipt name or sender"
            className="h-full w-full appearance-none bg-transparent text-black outline-none placeholder:text-wm-white-500 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <DatePickerWithRange
          placeholder="Filter by Transaction Date"
          onDateChange={setDateRange}
          ref={dateRangeRef}
        />
        <Button
          variant="outline"
          disabled={columnFilters.length === 0 && !dateRange.from}
          onClick={handleClearFilters}
        >
          Clear Filters
        </Button>
      </div>
      <div>
        <IfElseRender
          condition={tabs.length > 0}
          ifTrue={
            <Tabs
              defaultValue={tabs && (tabs[0]?.value as unknown as string)}
              onValueChange={(value) =>
                setTabValue(value as unknown as TabValue)
              }
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
                      {tab.countKey && receiptCounts && (
                        <Button
                          asChild
                          className={`ml-1 !h-6 !w-5 text-xs ${tabValue != tab.value ? 'bg-gray-400' : ''}`}
                          size={'sm'}
                          type="button"
                        >
                          <span>{receiptCounts[tab.countKey]}</span>
                        </Button>
                      )}
                    </TabsTrigger>
                  ))}
              </TabsList>
            </Tabs>
          }
          ifFalse={null}
        />
        <div className="rounded-md rounded-tl-none border">
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
            <TableFooter>
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <div className="flex items-center justify-end space-x-2 ">
                    <div className="flex-1">
                      <div className="text-muted-foreground items-center text-sm">
                        {table.getFilteredSelectedRowModel().rows.length} of{' '}
                        {table.getFilteredRowModel().rows.length} receipt(s)
                        selected.
                      </div>
                      <div className="text-xs font-normal">
                        Viewing Receipts {startIndex}-{endIndex}
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
          </Table>
        </div>
      </div>
    </>
  );
}
