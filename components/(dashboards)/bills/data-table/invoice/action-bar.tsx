import { memo } from 'react';

import { Pencil2Icon, TrashIcon } from '@radix-ui/react-icons';
import { Ellipsis } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useInvoice } from '@/lib/hooks/supabase/useInvoice';

import Invoice from '@/models/Invoice';

const DataTableInvoiceActionBar = ({
  rowSelection,
  data,
  onAction,
  afterAction,
}: {
  rowSelection: Record<string, boolean>;
  data: Invoice[];
  onAction: (invoices: Invoice[]) => void;
  afterAction: () => Promise<void>;
}) => {
  const { deleteInvoices } = useInvoice();
  const selectedInvoices = Object.keys(rowSelection).map(
    (key) => data[parseInt(key)] as Invoice,
  );

  const deleteInvoicesBulk = async () => {
    const invoiceIds = selectedInvoices.map((inv) => inv.id);

    await deleteInvoices(invoiceIds);
    await afterAction();
  };

  const MoreOptionsButton = () => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size={'icon'}
            variant={'outline'}
            disabled={!Object.keys(rowSelection).length}
          >
            <Ellipsis className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mr-4">
          <DropdownMenuItem onClick={deleteInvoicesBulk} asChild>
            <Button
              size={'sm'}
              className="!h-fit w-48 justify-start gap-2 p-2"
              variant={'ghost'}
              appearance={'destructive-strong'}
            >
              <TrashIcon className="size-4" />
              Delete
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div className="flex flex-row gap-2">
      <Button
        variant="secondary"
        disabled={selectedInvoices.length === 0}
        onClick={() => onAction(selectedInvoices as Invoice[])}
      >
        <Pencil2Icon />
        Review Selected
      </Button>
      <MoreOptionsButton />
    </div>
  );
};

export default memo(DataTableInvoiceActionBar);
