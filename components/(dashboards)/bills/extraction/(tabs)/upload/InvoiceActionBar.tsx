import React, { useTransition } from 'react';

import { BookmarkIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import { HammerIcon, Loader2Icon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import IfElseRender from '@/components/ui/if-else-renderer';

import { InvoiceStatus } from '@/constants/enums';
import Invoice from '@/models/Invoice';

import { useInvoiceExtractionReview } from '../../InvoiceExtractionReview';

const InvoiceActionBar = ({
  invoice,
  idx,
  onUpload,
  onSaveAsDraft,
}: {
  invoice: Invoice;
  idx: number;
  onUpload: (invoice: Invoice, idx: number) => void;
  onSaveAsDraft: (idx: number) => void;
}) => {
  const [isSubmitting, startSubmitting] = useTransition();
  const { setActiveIndex } = useInvoiceExtractionReview();

  return (
    <div className="flex w-full flex-row justify-between border-t p-2">
      <Button variant={'outline'} onClick={() => setActiveIndex(idx)}>
        <EyeOpenIcon className="h-4 w-4" /> View
      </Button>
      <div className="flex flex-row gap-2">
        <Button
          variant={'ghost'}
          onClick={() => startSubmitting(async () => onSaveAsDraft(idx))}
          disabled={isSubmitting}
        >
          <BookmarkIcon /> Save as Draft
        </Button>
        <Button
          variant={'secondary'}
          disabled={isSubmitting || invoice.status !== InvoiceStatus.APPROVED}
          onClick={() => startSubmitting(async () => onUpload(invoice, idx))}
        >
          <IfElseRender
            condition={isSubmitting}
            ifTrue={
              <>
                <Loader2Icon className="h-4 w-4 animate-spin" /> Submitting...
              </>
            }
            ifFalse={
              <>
                <HammerIcon className="h-4 w-4" /> Submit
              </>
            }
          />
        </Button>
      </div>
    </div>
  );
};

export default InvoiceActionBar;
