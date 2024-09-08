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
    id: 'file_name&sender',
    accessorFn: (row) => {
      return `${row.fileName} - ${row.data.supplierName}`;
    },
    header: ({ column }) => {
      return <div>Invoice Name & Company</div>;
    },
    cell: ({ row }) => {
      return (
        <TooltipProvider>
          <TooltipTrigger>
            <div className="no-scrollbar max-h-[600px] overflow-x-hidden overflow-y-scroll">
              <img src={row.original.fileUrl} alt="Receipt" />
            </div>
          </TooltipTrigger>
          <TooltipContent>Sort by supplier name</TooltipContent>
        </TooltipProvider>
      );
    },
  },
];
