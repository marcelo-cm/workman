'use client';

import {
  CaretDownIcon,
  CaretUpIcon,
  ExternalLinkIcon,
} from '@radix-ui/react-icons';

import { ColumnDef } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';

import { formatDate } from '@/lib/utils';
import Invoice from '@/models/Invoice';

// define badge type by status type
type BadgeType = 'success' | 'destructive' | 'warning' | 'info';
function getBadgeType(status: string): BadgeType {
  switch (status) {
    case 'SUCCESS':
      return 'success';
    case 'MISSING_FIELDS':
      return 'destructive';
    case 'MANUAL_REVIEW':
      return 'warning';
    default:
      return 'info';
  }
}

export const columns: ColumnDef<Invoice>[] = [
  {
    accessorKey: 'file_name&sender',
    accessorFn: (row) =>
      decodeURI(
        row.fileUrl.split('/')[8]?.split('.pdf')[0] +
          ' ' +
          row.data.supplierName,
      ),
    header: ({ column }) => {
      return <div>Invoice Name & Company</div>;
    },
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            {decodeURI(row.original.fileUrl.split('/')[8].split('.pdf')[0])}
            <p className="text-xs text-wm-white-200">[{row.original.id}]</p>
          </div>
          <div className="text-xs">{row.original.data.supplierName}</div>
        </div>
      );
    },
  },
  // {
  //   accessorKey: "project_code",
  //   header: () => <div>Project</div>,
  //   cell: ({ row }) => (
  //     <Badge variant="info">{row.original.data.shippingAddress}</Badge>
  //   ),
  // },
  {
    accessorKey: 'date_due',
    accessorFn: (row) => new Date(row.data.dueDate),
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="p-0"
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
      <div>{formatDate(new Date(row.original.data.dueDate))}</div>
    ),
  },
  {
    accessorKey: 'date_invoiced',
    accessorFn: (row) => new Date(row.data.date),
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="p-0"
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
      <div>{formatDate(new Date(row.original.data.date))}</div>
    ),
  },
  {
    accessorKey: 'balance',
    accessorFn: (row) => row.data.totalNet,
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="p-0"
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
      }).format(row.original.data.totalNet);

      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: 'view',
    header: ({ column }) => (
      <div className="flex w-full justify-end">View File</div>
    ),
    cell: ({ row }) => (
      <Button
        variant={'ghost'}
        className="flex w-full justify-end p-0 hover:text-wm-orange-500"
        onClick={() => {
          window.open(row.original.fileUrl, '_blank');
        }}
      >
        View File <ExternalLinkIcon className="h-4 w-4" />
      </Button>
    ),
  },
];
