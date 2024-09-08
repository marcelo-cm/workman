'use client';

import { CaretDownIcon, CaretUpIcon } from '@radix-ui/react-icons';

import { ColumnDef } from '@tanstack/react-table';

import PDFViewer from '@/components/(shared)/PDF/PDFViewer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import Chip from '@/components/ui/chip';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { formatDate, sliceWithEllipsis } from '@/lib/utils';
import { Receipt } from '@/models/Receipt';

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

export const columns: ColumnDef<Receipt>[] = [
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
  },
  {
    id: 'supplier',
    accessorKey: 'data.supplierName',
    header: ({ column }) => {
      return <div>Vendor</div>;
    },
    cell: ({ row }) => {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipContent side="right">
              <div className="no-scrollbar max-w-[600px] overflow-x-hidden overflow-y-scroll">
                <img src={row.original.fileUrl} alt="Receipt" />
              </div>
            </TooltipContent>
            <TooltipTrigger>
              <div className="flex w-fit flex-col">
                <div className="w-fit">{row.original?.data?.supplierName}</div>
              </div>
            </TooltipTrigger>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    id: 'category',
    accessorKey: 'data.category',
    header: 'Category',
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          {row.original.data.category.map((cat) => (
            <Chip>{cat}</Chip>
          ))}
        </div>
      );
    },
  },
  {
    id: 'project',
    header: 'Project / Customer',
    cell: ({ row }) => {
      return (
        <span>
          {row.original.data.project == 'Unassigned' ? (
            <em className="text-wm-white-300">Unassigned</em>
          ) : (
            row.original.data.project
          )}
        </span>
      );
    },
  },
  {
    id: 'date',
    accessorKey: 'data.date',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="-translate-x-2 px-2 py-0"
      >
        Transaction Date
        {column.getIsSorted() === 'asc' ? (
          <CaretUpIcon className="h-4 w-4" />
        ) : (
          <CaretDownIcon className="h-4 w-4" />
        )}
      </Button>
    ),
    cell: ({ row }) => {
      return <div>{formatDate(new Date(row.original.data.date))}</div>;
    },
  },
  {
    id: 'total_amount',
    accessorKey: 'data.totalAmount',
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
      }).format(row.original.data.totalAmount);

      return <div>{formatted}</div>;
    },
  },
];
