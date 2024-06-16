'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { formatDate } from '@/lib/utils';
import { CaretDownIcon, CaretUpIcon } from '@radix-ui/react-icons';
import { ColumnDef } from '@tanstack/react-table';
import { ExternalLinkIcon } from 'lucide-react';
import { Button } from '../ui/button';
import Invoice from '@/classes/Invoice';

export const columns: ColumnDef<Invoice>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
    accessorKey: 'file_name',
    accessorFn: (row) =>
      decodeURI(
        row.fileUrl.split('/')[8]?.split('.pdf')[0] +
          ' ' +
          row.data.supplierName,
      ),
    header: ({ column }) => {
      return <div>File Name</div>;
    },
    cell: ({ row }) => {
      return (
        <div className="flex flex-row items-center gap-1">
          {decodeURI(row.original.fileUrl.split('/')[8].split('.pdf')[0])}
          <p className="text-xs text-wm-white-200">({row.original.id})</p>
        </div>
      );
    },
  },
  {
    accessorKey: 'created_at',
    accessorFn: (row) => new Date(row.created_at),
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="p-0"
      >
        Date Uploaded
        {column.getIsSorted() === 'asc' ? (
          <CaretUpIcon className="h-4 w-4" />
        ) : (
          <CaretDownIcon className="h-4 w-4" />
        )}
      </Button>
    ),
    cell: ({ row }) => (
      <div>{formatDate(new Date(row.original.created_at))}</div>
    ),
  },
  {
    accessorKey: 'view',
    header: ({ column }) => <div>View File</div>,
    cell: ({ row }) => (
      <Button
        variant={'ghost'}
        className="p-0 hover:text-wm-orange-500"
        onClick={() => {
          window.open(row.original.fileUrl, '_blank');
        }}
      >
        View File <ExternalLinkIcon className="h-4 w-4" />
      </Button>
    ),
  },
];
