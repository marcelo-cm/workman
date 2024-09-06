import { ReactNode } from 'react';

import { FileIcon } from '@radix-ui/react-icons';
import { ReceiptIcon } from 'lucide-react';

export const MENU_TABS: {
  name: string;
  route: string;
  trailingIcon?: ReactNode;
  actionIcon?: ReactNode;
  disabled: boolean;
}[] = [
  {
    name: 'Bills',
    route: '/bills',
    trailingIcon: <FileIcon className="h-4 w-4" />,
    disabled: false,
  },
  {
    name: 'Receipts',
    route: '/receipts',
    trailingIcon: <ReceiptIcon className="h-4 w-4" />,
    disabled: true,
  },
];
