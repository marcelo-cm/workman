"use client";

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
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InvoiceData } from "@/interfaces/common.interfaces";
import { MagnifyingGlassIcon, Pencil2Icon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { DatePickerWithRange } from "../ui/date-range-picker";
import { useEffect, useRef, useState } from "react";
import { InvoiceObject } from "@/models/Invoice";
import ExtractionReview from "../extraction/ExtractionReview";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onAction: (selectedFiles: InvoiceObject[]) => void;
  actionOnSelectText: string;
  actionIcon: React.ReactNode;
  filters?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onAction,
  actionOnSelectText,
  actionIcon,
  filters = true,
}: DataTableProps<TData, TValue>) {
  if (!columns || !data.length) {
    return (
      <>
        <div className="flex flex-row gap-4">
          <Button variant="secondary" disabled>
            {actionIcon}
            {actionOnSelectText}
          </Button>
          {filters ? (
            <>
              {" "}
              <div className="flex flex h-full w-[300px] flex-row items-center gap-2 rounded-md border bg-transparent px-3 py-1 text-sm text-wm-white-500 transition-colors">
                <MagnifyingGlassIcon
                  className="h-5 w-5 cursor-pointer"
                  onClick={() => searchFilterInputRef.current?.focus()}
                />
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
            </>
          ) : null}
        </div>
        <div>There are no invoices to show!</div>
      </>
    );
  }

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
    (key) => filteredData[parseInt(key)] as InvoiceObject,
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
      const invoiceDate = new Date((item as InvoiceObject).data.date).getTime();
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
      },
    },
  });

  const handleClearFilters = () => {
    setColumnFilters([]);
    setDateRange({ from: undefined, to: undefined });
    dateRangeRef.current?.clearDate();
  };

  return (
    <>
      <div className="flex flex-row gap-4">
        <Button
          variant="secondary"
          disabled={selectedFilesUrls.length === 0}
          onClick={() => onAction(selectedFilesUrls)}
        >
          {actionIcon}
          {actionOnSelectText}
        </Button>
        {filters ? (
          <>
            <div className="flex flex h-full w-[300px] flex-row items-center gap-2 rounded-md border bg-transparent px-3 py-1 text-sm text-wm-white-500 transition-colors">
              <MagnifyingGlassIcon
                className="h-5 w-5 cursor-pointer"
                onClick={() => searchFilterInputRef.current?.focus()}
              />
              <input
                ref={searchFilterInputRef}
                value={
                  (table
                    .getColumn("file_name&sender")
                    ?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table
                    .getColumn("file_name&sender")
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
                  data-state={row.getIsSelected() && "selected"}
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
                  <div className="text-muted-foreground flex-1 items-center text-sm">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} invoice(s)
                    selected.
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    Previous
                  </Button>
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
