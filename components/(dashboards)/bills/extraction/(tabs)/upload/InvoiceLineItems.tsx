import { CaretDownIcon } from '@radix-ui/react-icons';

import { Checkbox } from '@/components/ui/checkbox';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import Invoice from '@/models/Invoice';

const InvoiceLineItems = ({ invoice }: { invoice: Invoice }) => {
  return (
    <Collapsible className="w-full">
      <CollapsibleContent className="flex flex-col gap-2">
        <Table>
          <TableHeader className="border-y">
            <TableHead>Category</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Billable</TableHead>
          </TableHeader>
          <TableBody>
            {invoice.lineItems.map((lineItem, idx) => (
              <TableRow key={idx}>
                <TableCell>{lineItem?.productCode || 'None'}</TableCell>
                <TableCell>{lineItem.description}</TableCell>
                <TableCell>
                  ${Number(lineItem.totalAmount).toFixed(2)}
                </TableCell>
                <TableCell>
                  <Checkbox checked={lineItem.billable} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CollapsibleContent>
      <CollapsibleTrigger className="flex w-full flex-row items-center justify-center border-t p-2 hover:bg-wm-white-50">
        View Line Items
        <CaretDownIcon className="transition-transform [[data-state=open]_&]:rotate-180" />
      </CollapsibleTrigger>
    </Collapsible>
  );
};

export default InvoiceLineItems;
