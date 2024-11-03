'use client';

import { useState } from 'react';

import { CaretDownIcon, CaretUpIcon } from '@radix-ui/react-icons';

import { ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

import { Email } from '@/app/api/v1/gmail/messages/route';
import { formatDate, sliceWithEllipsis } from '@/lib/utils';

export const columns: ColumnDef<Email>[] = [
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
    accessorKey: 'filterable',
    accessorFn: (data) => data.subject + ' ' + data.from,
    header: 'Subject and Sender',
    cell: ({ row }) => {
      return (
        <div className="flex w-fit flex-col">
          <div className="w-fit">{row.original.subject}</div>
          <div className="text-xs text-wm-white-300">{row.original?.from}</div>
        </div>
      );
    },
  },
  {
    accessorKey: 'date',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="-translate-x-2 px-2 py-0"
      >
        Date Received
        {column.getIsSorted() === 'asc' ? (
          <CaretUpIcon className="h-4 w-4" />
        ) : (
          <CaretDownIcon className="h-4 w-4" />
        )}
      </Button>
    ),
    cell: ({ row }) => formatDate(new Date(row.original?.date)),
  },
  {
    header: 'Status',
    cell: () => (
      <div className="w-full">
        <Badge variant={'warning'}>UNPROCESSED</Badge>
      </div>
    ),
  },
];
