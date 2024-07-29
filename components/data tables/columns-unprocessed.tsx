'use client';

import { CaretDownIcon, CaretUpIcon } from '@radix-ui/react-icons';
import { ExternalLinkIcon } from 'lucide-react';

import { ColumnDef } from '@tanstack/react-table';

import { Button } from '../ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { Checkbox } from '@/components/ui/checkbox';

import { formatDate, sliceWithEllipsis } from '@/lib/utils';
import Invoice from '@/models/Invoice';

import PDFViewer from '../PDF/PDFViewer';

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
        <TooltipProvider>
          <Tooltip>
            <TooltipContent side="right">
              <div className="max-h-[600px] overflow-scroll">
                <PDFViewer file={row.original.fileUrl} width={400} />
              </div>
            </TooltipContent>
            <TooltipTrigger asChild>
              <div className="flex w-fit flex-col">
                {decodeURI(row.original.fileUrl.split('/')[8].split('.pdf')[0])}
              </div>
            </TooltipTrigger>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: 'created_at',
    accessorFn: (row) => new Date(row.createdAt),
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
      <div>{formatDate(new Date(row.original.createdAt))}</div>
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
