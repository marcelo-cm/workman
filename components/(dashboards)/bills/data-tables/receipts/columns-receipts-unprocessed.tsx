'use client';

import { CaretDownIcon, CaretUpIcon } from '@radix-ui/react-icons';
import { ExternalLinkIcon } from 'lucide-react';

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

import { formatDate } from '@/lib/utils';
import Invoice from '@/models/Invoice';
import { Receipt } from '@/models/Receipt';

export const columns: ColumnDef<Receipt>[] = [];
