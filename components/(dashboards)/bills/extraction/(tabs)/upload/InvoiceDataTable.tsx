import React, { Dispatch, SetStateAction, useState } from 'react';

import { BookmarkIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import { HammerIcon, Loader2Icon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ComboBox } from '@/components/ui/combo-box';
import IfElseRender from '@/components/ui/if-else-renderer';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { InvoiceStatus } from '@/constants/enums';
import { Invoice_Quickbooks } from '@/interfaces/quickbooks.interfaces';
import Invoice from '@/models/Invoice';

import { useInvoiceExtractionReview } from '../../InvoiceExtractionReview';

const InvoiceDataTable = ({
  file,
  fileIndex,
  transformedFiles,
  setTransformedFiles,
  uploadedFileIndexes,
  setUploadedFileIndexes,
}: {
  file: Invoice;
  fileIndex: number;
  transformedFiles: Invoice_Quickbooks[];
  setTransformedFiles: Dispatch<SetStateAction<Invoice_Quickbooks[]>>;
  uploadedFileIndexes: number[];
  setUploadedFileIndexes: Dispatch<SetStateAction<number[]>>;
}) => {
  const { accounts, customers, activeIndex, setActiveIndex } =
    useInvoiceExtractionReview();
  const [isLoading, setIsLoading] = useState(false);

  const handleCustomerSelect = (
    value: { sparse: boolean; Id: string; DisplayName: string },
    fileIndex: number,
    lineItemIndex: number,
  ) => {
    const updatedFiles = [...transformedFiles];
    updatedFiles[fileIndex].data.lineItems[lineItemIndex].customerId = value.Id;
    setTransformedFiles(updatedFiles);
  };

  const handleBillableChange = (
    value: boolean,
    fileIndex: number,
    lineItemIndex: number,
  ) => {
    const updatedFiles = [...transformedFiles];
    updatedFiles[fileIndex].data.lineItems[lineItemIndex].billable = value;
    setTransformedFiles(updatedFiles);
  };

  const handleAccountSelect = (
    value: { sparse: boolean; Id: string; Name: string },
    fileIndex: number,
    lineItemIndex: number,
  ) => {
    const updatedFiles = [...transformedFiles];
    updatedFiles[fileIndex].data.lineItems[lineItemIndex].accountId = value.Id;
    setTransformedFiles(updatedFiles);
  };

  async function uploadToQuickBooks(fileIndex: number) {
    setIsLoading(true);
    await Invoice.uploadToQuickbooks(transformedFiles[fileIndex]);
    setUploadedFileIndexes([...uploadedFileIndexes, fileIndex]);
    setIsLoading(false);
  }

  return (
    <div className={`gap-3 !pt-0`}>
      <Table key={file.id}>
        <TableHeader>
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Billable</TableHead>
            <TableHead>Customer</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {file.data.lineItems.map((lineItem, lineItemIndex) => (
            <TableRow key={lineItemIndex + file.id + lineItem.productCode}>
              <TableCell>
                <ComboBox
                  options={accounts}
                  valueToMatch={lineItem.productCode || 'General'}
                  callBackFunction={(value) =>
                    handleAccountSelect(value, fileIndex, lineItemIndex)
                  }
                  getOptionLabel={(option) => option?.Name}
                />
              </TableCell>
              <TableCell>{lineItem.description}</TableCell>
              <TableCell className="text-right">
                ${parseFloat(lineItem.totalAmount)?.toFixed(2)}
              </TableCell>
              <TableCell>
                <Checkbox
                  defaultChecked
                  onCheckedChange={(value: boolean) =>
                    handleBillableChange(
                      Boolean(value),
                      fileIndex,
                      lineItemIndex,
                    )
                  }
                />
              </TableCell>
              <TableCell>
                <ComboBox
                  options={customers}
                  valueToMatch={file.data.customerAddress}
                  callBackFunction={(value) =>
                    handleCustomerSelect(value, fileIndex, lineItemIndex)
                  }
                  getOptionLabel={(option) => option?.DisplayName}
                />
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={3}>
              <div className="flex flex-row">
                <div className="flex w-3/4 flex-col">
                  <div className="py-0 text-right font-medium">Sub-Total:</div>
                  <div className="py-0 text-right font-medium">Tax:</div>
                  <div className="py-0 text-right font-medium">Net Total:</div>
                </div>
                <div className="flex w-1/4 min-w-[100px] flex-col text-right">
                  <div className="py-0">
                    ${file.data.totalAmount.toFixed(2)}
                  </div>
                  <div className="py-0">
                    {Number(file.data.totalTax)?.toFixed(2)}
                  </div>
                  <div className="py-0">${file.data.totalNet.toFixed(2)}</div>
                </div>
              </div>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={5}>
              <div className="flex w-full flex-row justify-between">
                <Button
                  onClick={() => {
                    setActiveIndex(fileIndex);
                  }}
                  variant={'outline'}
                  disabled={activeIndex === fileIndex}
                >
                  <EyeOpenIcon className="h-4 w-4" /> View Invoice
                </Button>
                <div className="flex flex-row gap-2">
                  <Button
                    variant={'ghost'}
                    onClick={() =>
                      setUploadedFileIndexes([
                        ...uploadedFileIndexes,
                        fileIndex,
                      ])
                    }
                  >
                    <BookmarkIcon /> Save as Draft
                  </Button>
                  <Button
                    onClick={() => uploadToQuickBooks(fileIndex)}
                    disabled={
                      isLoading ||
                      uploadedFileIndexes.includes(fileIndex) ||
                      file.status !== InvoiceStatus.APPROVED
                    }
                    variant={'secondary'}
                  >
                    <IfElseRender
                      condition={isLoading}
                      ifTrue={
                        <>
                          <Loader2Icon className="h-4 w-4 animate-spin" />{' '}
                          Submitting...
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
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default InvoiceDataTable;
