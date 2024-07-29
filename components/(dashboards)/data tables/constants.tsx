import { ReactNode, useMemo } from 'react';

import { Check, Inbox, Scan } from 'lucide-react';

import { InvoiceStatus } from '@/constants/enums';
import { User } from '@/models/User';

export interface TabValue {
  state: InvoiceStatus | InvoiceStatus[];
  approverId: string | null;
}

export const INVOICE_DATA_TABLE_TABS = (
  user: User,
): {
  title: string;
  icon: ReactNode;
  value: TabValue;
}[] => {
  return [
    {
      title: 'Company Inbox',
      icon: <Inbox className="w-4 h-4" />,
      value: {
        state: [InvoiceStatus.FOR_REVIEW, InvoiceStatus.APPROVED],
        approverId: null,
      },
    },
    {
      title: 'Awaiting Your Review',
      icon: <Inbox className="w-4 h-4" />,
      value: {
        state: InvoiceStatus.FOR_REVIEW,
        approverId: user.id,
      },
    },
    {
      title: 'Awaiting Scan',
      icon: <Scan className="w-4 h-4" />,
      value: {
        state: InvoiceStatus.UNPROCESSED,
        approverId: null,
      },
    },
    {
      title: 'Completed',
      icon: <Check className="w-4 h-4" />,
      value: {
        state: InvoiceStatus.PROCESSED,
        approverId: null,
      },
    },
  ];
};
