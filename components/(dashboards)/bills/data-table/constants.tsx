import { ReactNode } from 'react';

import { Check, Inbox, Mail, Scan } from 'lucide-react';

import { InvoiceStatus } from '@/constants/enums';
import { InvoiceCountResponseKeys } from '@/interfaces/db.interfaces';
import { User } from '@/models/User';

export interface InvoiceTabValue {
  state?: InvoiceStatus | InvoiceStatus[];
  approverId?: string;
  companyId?: string;
}

export const BILLS_DATA_TABLE_TABS = (
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
      title: 'Email Inbox',
      icon: <Mail className="h-4 w-4" />,
      value: {
        companyId: user.company.id,
      },
    },
    {
      title: 'Awaiting Scan',
      icon: <Scan className="h-4 w-4" />,
      value: {
        state: InvoiceStatus.UNPROCESSED,
      },
    },
    {
      title: 'Completed',
      icon: <Check className="h-4 w-4" />,
      value: {
        state: InvoiceStatus.PROCESSED,
      },
    },
  ];
};
