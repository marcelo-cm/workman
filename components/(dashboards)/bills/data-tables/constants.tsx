import { ReactNode } from 'react';

import { Check, Inbox, Scan } from 'lucide-react';

import { InvoiceStatus, ReceiptStatus } from '@/constants/enums';
import {
  InvoiceCountResponseKeys,
  ReceiptCountResponseKeys,
} from '@/interfaces/db.interfaces';
import { User } from '@/models/User';

export interface InvoiceTabValue {
  state: InvoiceStatus | InvoiceStatus[];
  approverId: string | null;
}

export const INVOICE_DATA_TABLE_TABS = (
  user: User,
): {
  title: string;
  icon: ReactNode;
  value: InvoiceTabValue;
  countKey?: InvoiceCountResponseKeys;
}[] => {
  return [
    {
      title: 'Company Inbox',
      icon: <Inbox className="h-4 w-4" />,
      value: {
        state: [InvoiceStatus.FOR_REVIEW, InvoiceStatus.APPROVED],
        approverId: null,
      },
      countKey: InvoiceCountResponseKeys.COMPANY_INBOX,
    },
    {
      title: 'Awaiting Your Review',
      icon: <Inbox className="h-4 w-4" />,
      value: {
        state: InvoiceStatus.FOR_REVIEW,
        approverId: user.id,
      },
      countKey: InvoiceCountResponseKeys.AWAITING_REVIEW,
    },
    {
      title: 'Awaiting Scan',
      icon: <Scan className="h-4 w-4" />,
      value: {
        state: InvoiceStatus.UNPROCESSED,
        approverId: null,
      },
    },
    {
      title: 'Completed',
      icon: <Check className="h-4 w-4" />,
      value: {
        state: InvoiceStatus.PROCESSED,
        approverId: null,
      },
    },
  ];
};
