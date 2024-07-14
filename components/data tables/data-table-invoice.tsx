'use client';

import { useEffect, useRef, useState } from 'react';

import { MagnifyingGlassIcon } from '@radix-ui/react-icons';

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { Button } from '../ui/button';
import { DatePickerWithRange } from '../ui/date-range-picker';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Email } from '@/app/api/v1/gmail/messages/route';
import Invoice from '@/models/Invoice';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onAction: ((selectedFiles: Invoice[]) => void) | (() => void);
  actionOnSelectText: string;
  actionIcon: React.ReactNode;
  canActionBeDisabled?: boolean;
  filters?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onAction,
  actionOnSelectText,
  actionIcon,
  canActionBeDisabled = true,
  filters = true,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [dateRange, setDateRange] = useState({
    from: undefined,
    to: undefined,
  });
  const [filteredData, setFilteredData] = useState(data);
  const searchFilterInputRef = useRef<HTMLInputElement>(null);
  const dateRangeRef = useRef<any>(null);
  const selectedFilesUrls = Object.keys(rowSelection).map(
    (key) => filteredData[parseInt(key)] as Invoice,
  );

  useEffect(() => {
    updateFilteredData();
  }, [dateRange]);

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

  const table = useReactTable({
    data: filteredData,
    columns,
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

  const handleClearFilters = () => {
    setColumnFilters([]);
    setDateRange({ from: undefined, to: undefined });
    dateRangeRef.current?.clearDate();
  };

  const { pageSize, pageIndex } = table.getState().pagination;

  const startIndex = pageSize * pageIndex + 1; //adding 1 to start counting from 1 for the invoices user is seeing (not 0-9)
  const endIndex = Math.min(pageSize * (pageIndex + 1), data.length); // Ensure it doesn't exceed total rows

  return (
    <>
      <div className="flex flex-row gap-4">
        <Button
          variant="secondary"
          disabled={canActionBeDisabled && selectedFilesUrls.length === 0}
          onClick={() => onAction(selectedFilesUrls)}
        >
          {actionIcon}
          {actionOnSelectText}
        </Button>
        {filters ? (
          <>
            <div className="flex h-full w-[300px] flex-row items-center gap-2 rounded-md border bg-transparent px-3 py-1 text-sm text-wm-white-500 transition-colors">
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
              variant="outline"
              disabled={columnFilters.length === 0 && !dateRange.from}
              onClick={handleClearFilters}
            >
              Clear Filters
            </Button>
          </>
        ) : null}
      </div>
      <div className="rounded-md border">
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
                      {table.getFilteredRowModel().rows.length} invoice(s)
                      selected.
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
        </Table>
      </div>
    </>
  );
}
