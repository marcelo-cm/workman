import { ReactNode } from 'react';

import { Check, Inbox, Scan } from 'lucide-react';

import { ReceiptStatus } from '@/constants/enums';
import { ReceiptCountResponseKeys } from '@/interfaces/db.interfaces';
import { User } from '@/models/User';

export const RECEIPT_DATA_TABLE_TABS = (
  user: User,
): {
  title: string;
  icon: ReactNode;
  value: ReceiptTabValue;
  countKey?: ReceiptCountResponseKeys;
}[] => {
  return [
    {
      title: 'Company Inbox',
      icon: <Inbox className="h-4 w-4" />,
      value: {
        state: [ReceiptStatus.FOR_REVIEW, ReceiptStatus.APPROVED],
        approverId: null,
      },
      countKey: ReceiptCountResponseKeys.COMPANY_INBOX,
    },
    {
      title: 'Awaiting Your Review',
      icon: <Inbox className="h-4 w-4" />,
      value: {
        state: ReceiptStatus.FOR_REVIEW,
        approverId: user.id,
      },
      countKey: ReceiptCountResponseKeys.AWAITING_REVIEW,
    },
    {
      title: 'Awaiting Scan',
      icon: <Scan className="h-4 w-4" />,
      value: {
        state: ReceiptStatus.UNPROCESSED,
        approverId: null,
      },
    },
    {
      title: 'Completed',
      icon: <Check className="h-4 w-4" />,
      value: {
        state: ReceiptStatus.PROCESSED,
        approverId: null,
      },
    },
  ];
};

export interface ReceiptTabValue {
  state: ReceiptStatus | ReceiptStatus[];
  approverId: string | null;
}
