'use client';

import { CaretDownIcon, CaretUpIcon } from '@radix-ui/react-icons';

import { ColumnDef } from '@tanstack/react-table';

import PDFViewer from '@/components/(shared)/PDF/PDFViewer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { formatDate, sliceWithEllipsis } from '@/lib/utils';
import Invoice from '@/models/Invoice';

// define badge type by status type
type BadgeType = 'success' | 'destructive' | 'warning' | 'info';
function getBadgeType(status: string): BadgeType {
  switch (status) {
    case 'APPROVED':
      return 'success';
    case 'PROCESSED':
      return 'success';
    case 'FOR_REVIEW':
      return 'warning';
    case 'UNPROCESSED':
      return 'destructive';
    default:
      return 'info';
  }
}

export const columns: ColumnDef<Invoice>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllRowsSelected() ||
          (table.getIsSomeRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'filterable',
    accessorFn: (row) =>
      decodeURI(row?.fileName + ' ' + row.data?.supplierName),
    header: ({ column }) => {
      return <div>Invoice Name & Company</div>;
    },
    cell: ({ row }) => {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipContent side="right">
              <div className="no-scrollbar max-h-[600px] overflow-x-hidden overflow-y-scroll">
                <PDFViewer file={row.original?.fileUrl} width={400} />
              </div>
            </TooltipContent>
            <TooltipTrigger asChild>
              <div className="flex w-fit flex-col">
                <div className="w-fit">{row.original?.data?.supplierName}</div>
                <div className="text-xs text-wm-white-300">
                  {sliceWithEllipsis(decodeURI(row.original?.fileName), 35)}
                </div>
              </div>
            </TooltipTrigger>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: 'data.invoiceNumber',
    header: 'Invoice No.',
    cell: ({ row }) => (
      <Badge variant="info">
        {row.original.data?.invoiceNumber || (
          <em className="text-wm-white-300">None</em>
        )}
      </Badge>
    ),
  },
  {
    accessorKey: 'date_due',
    accessorFn: (row) => new Date(row.data?.dueDate),
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="-translate-x-2 px-2 py-0"
      >
        Date Due
        {column.getIsSorted() === 'asc' ? (
          <CaretUpIcon className="h-4 w-4" />
        ) : (
          <CaretDownIcon className="h-4 w-4" />
        )}
      </Button>
    ),
    cell: ({ row }) => (
      <div>{formatDate(new Date(row.original.data?.dueDate))}</div>
    ),
  },
  {
    accessorKey: 'date_invoiced',
    accessorFn: (row) => new Date(row.data?.date),
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="-translate-x-2 px-2 py-0"
      >
        Date Invoiced
        {column.getIsSorted() === 'asc' ? (
          <CaretUpIcon className="h-4 w-4" />
        ) : (
          <CaretDownIcon className="h-4 w-4" />
        )}
      </Button>
    ),
    cell: ({ row }) => (
      <div>{formatDate(new Date(row.original.data?.date))}</div>
    ),
  },
  {
    accessorKey: 'balance',
    accessorFn: (row) => row.data.totalNet,
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="-translate-x-2 px-2 py-0"
      >
        Balance
        {column.getIsSorted() === 'asc' ? (
          <CaretUpIcon className="h-4 w-4" />
        ) : (
          <CaretDownIcon className="h-4 w-4" />
        )}
      </Button>
    ),
    cell: ({ row }) => {
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(row.original.data?.totalNet);

      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: () => <div>Status</div>,
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge variant={getBadgeType(status)}>
          {status?.replace('_', ' ')}
        </Badge>
      );
    },
  },
];
