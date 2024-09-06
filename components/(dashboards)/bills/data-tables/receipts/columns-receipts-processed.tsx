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

export const columns: ColumnDef<Receipt>[] = [];
