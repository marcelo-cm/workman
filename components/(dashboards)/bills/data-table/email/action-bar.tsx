import React, { memo, useEffect, useTransition } from 'react';

import { BellOffIcon, Ellipsis, ScanIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useGmail } from '@/lib/hooks/gmail/useGmail';
import { useInvoice } from '@/lib/hooks/supabase/useInvoice';

import { useAppContext } from '@/app/(dashboards)/context';
import { Email } from '@/app/api/v1/gmail/messages/interfaces';
import Invoice from '@/models/Invoice';

const DataTableEmailActionBar = ({
  rowSelection,
  data,
  afterAction,
}: {
  rowSelection: Record<string, boolean>;
  data: Email[];
  afterAction: () => Promise<void>;
}) => {
  const { addIgnoreLabelToEmails, addProcessedLabelToEmails } = useGmail();
  const { processInvoicesByFileURLs } = useInvoice();
  const [isUploading, startUploading] = useTransition();
  const selectedInvoices = Object.keys(rowSelection).map(
    (key) => data[parseInt(key)] as Email,
  );

  const ignoreEmails = async () => {
    const emailIds = selectedInvoices.map((email) => email.id);
    await addIgnoreLabelToEmails(emailIds);
    await afterAction();
  };

  const handleScanEmails = async (selectedEmails: Email[]) => {
    startUploading(async () => {
      const uploadedFileURLs = await Promise.all(
        selectedEmails.flatMap((email) =>
          email.attachments.map((attachment) =>
            Invoice.uploadToStorage(attachment),
          ),
        ),
      );

      const invoices = await Promise.all(
        uploadedFileURLs.map((fileURL, index) => {
          processInvoicesByFileURLs([fileURL]);
        }),
      )
        .then(async () => {
          // Optimistic update @todo fix logic to make sense
          addProcessedLabelToEmails(selectedEmails.map((email) => email.id));
        })
        .finally(async () => {
          await afterAction();
        });
    });
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
          <DropdownMenuItem onClick={ignoreEmails} asChild>
            <Button
              size={'sm'}
              className="!h-fit w-48 justify-start gap-2 p-2"
              variant={'ghost'}
              appearance={'destructive-strong'}
            >
              <BellOffIcon className="size-4" />
              Ignore
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
        onClick={() => handleScanEmails(selectedInvoices as Email[])}
      >
        <ScanIcon className="h-4 w-4" />
        Scan Selected
      </Button>

      <MoreOptionsButton />
    </div>
  );
};

export default memo(DataTableEmailActionBar);
