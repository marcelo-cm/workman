import React, { SetStateAction, useEffect, useState } from 'react';

import { ArrowLeftIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import { HammerIcon, Loader2Icon } from 'lucide-react';

import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Checkbox } from '../../ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table';
import IfElseRender from '@/components/ui/if-else-renderer';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useAccount } from '@/lib/hooks/quickbooks/useAccount';
import { useCustomer } from '@/lib/hooks/quickbooks/useCustomer';
import { useVendor } from '@/lib/hooks/quickbooks/useVendor';

import Invoice from '@/classes/Invoice';
import { LineItem } from '@/interfaces/common.interfaces';
import {
  Account,
  Customer,
  Invoice_Quickbooks,
  Vendor,
} from '@/interfaces/quickbooks.interfaces';
import { createClient } from '@/utils/supabase/client';

import { ComboBox } from '../Combobox';

const supabase = createClient();

const UploadToQuickBooks = ({
  files,
  activeIndex,
  setActiveIndex,
}: {
  files: Invoice[];
  activeIndex: number;
  setActiveIndex: React.Dispatch<SetStateAction<number>>;
}) => {
  const { getVendorList } = useVendor();
  const { getCustomerList } = useCustomer();
  const { getAccountList } = useAccount();
  const [uploadedFileIndexes, setUploadedFileIndexes] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transformedFiles, setTransformedFiles] = useState<
    Invoice_Quickbooks[]
  >([]);

  const initialLoading = !(
    vendors.length &&
    customers.length &&
    accounts.length &&
    transformedFiles.length
  );

  useEffect(() => {
    setActiveIndex(0);
  }, []);

  useEffect(() => {
    if (!files) return;
    fetchVendors();
    fetchCustomers();
    transformData();
    fetchAccounts();
  }, [files]);

  useEffect(() => {
    if (uploadedFileIndexes.length === files.length) {
      window.location.reload();
    }
  }, [uploadedFileIndexes]);

  async function uploadToQuickBooks(fileIndex: number) {
    setIsLoading(true);
    await Invoice.uploadToQuickbooks(transformedFiles[fileIndex]);
    setUploadedFileIndexes([...uploadedFileIndexes, fileIndex]);
    setIsLoading(false);
  }

  const fetchVendors = async () => {
    const columns: (keyof Vendor)[] = ['DisplayName', 'Id'];
    await getVendorList(columns, null, setVendors);
  };

  const fetchCustomers = async () => {
    const columns: (keyof Customer)[] = ['DisplayName', 'Id'];
    await getCustomerList(columns, null, setCustomers);
  };

  const fetchAccounts = async () => {
    const columns: (keyof Account)[] = ['Name', 'Id'];
    const where = "Classification = 'Expense'";
    await getAccountList(columns, where, setAccounts);
  };

  const transformData = () => {
    const transformed: Invoice_Quickbooks[] = files.map((file) => ({
      ...file,
      data: {
        ...file.data,
        vendorId: file.data.supplierName, // Temporary mapping; to be updated on selection
        lineItems: file.data.lineItems.map((lineItem) => ({
          ...lineItem,
          customerId: file.data.customerAddress, // Temporary mapping; to be updated on selection
          billable: true,
          accountId: '63',
        })),
      },
    }));
    setTransformedFiles(transformed);
  };

  const handleVendorSelect = (
    value: { sparse: boolean; Id: string; DisplayName: string },
    fileIndex: number,
  ) => {
    const updatedFiles = [...transformedFiles];
    updatedFiles[fileIndex].data.vendorId = value.Id;
    setTransformedFiles(updatedFiles);
  };

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

  return (
    <>
      <div className="flex h-full flex-col gap-4 p-4 ">
        <IfElseRender
          ternary={initialLoading}
          ifTrue={
            <div className="flex h-96 w-full animate-pulse items-center justify-center rounded-md border bg-wm-white-50">
              Loading... <Loader2Icon className="ml-2 h-4 w-4 animate-spin" />
            </div>
          }
          ifFalse={
            <>
              {files.map((file, fileIndex) => (
                <div>
                  <IfElseRender
                    ternary={activeIndex == fileIndex}
                    ifTrue={
                      <div className="text-xs px-2 py-1 text-white font-medium bg-wm-orange-500 rounded-t-md">
                        Currently Viewing This File
                      </div>
                    }
                  />

                  <div
                    className={`space-y-3 rounded-md border  ${activeIndex == fileIndex ? 'border-l-2 border-l-wm-orange-500 rounded-t-none border-t-0' : null}`}
                    key={fileIndex + file.id}
                  >
                    <div
                      className={`flex w-full items-center justify-between border-b p-2 text-sm font-medium `}
                    >
                      <div className="flex flex-col gap-1">
                        <ComboBox
                          options={vendors}
                          valueToMatch={file.data.supplierName}
                          callBackFunction={(value) =>
                            handleVendorSelect(value, fileIndex)
                          }
                          getOptionLabel={(option) => option?.DisplayName}
                        />{' '}
                        <p className="ml-2 mt-1 text-xs leading-none text-wm-white-500">
                          {file.data.supplierName}
                        </p>
                        <p className="ml-2 text-xs leading-none text-wm-white-500">
                          {file.data.customerAddress}
                        </p>
                      </div>
                      <div className="flex flex-col items-end font-normal">
                        <Badge className="text-wm-black-500 mb-1 font-medium">
                          No. {file.data.invoiceNumber}
                        </Badge>
                        <div>
                          <p className="inline font-medium">Txn Date: </p>
                          {file.data.date}
                        </div>
                        <div>
                          <p className="inline font-medium">Due Date: </p>
                          {file.data.dueDate}
                        </div>
                      </div>
                    </div>
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
                          {file.data.lineItems.map(
                            (lineItem, lineItemIndex) => (
                              <TableRow
                                key={
                                  lineItemIndex + file.id + lineItem.productCode
                                }
                              >
                                <TableCell>
                                  <ComboBox
                                    options={accounts}
                                    valueToMatch={
                                      lineItem.productCode || 'General'
                                    }
                                    callBackFunction={(value) =>
                                      handleAccountSelect(
                                        value,
                                        fileIndex,
                                        lineItemIndex,
                                      )
                                    }
                                    getOptionLabel={(option) => option?.Name}
                                  />
                                </TableCell>
                                <TableCell>{lineItem.description}</TableCell>
                                <TableCell className="text-right">
                                  $
                                  {parseFloat(lineItem.totalAmount)?.toFixed(2)}
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
                                      handleCustomerSelect(
                                        value,
                                        fileIndex,
                                        lineItemIndex,
                                      )
                                    }
                                    getOptionLabel={(option) =>
                                      option?.DisplayName
                                    }
                                  />
                                </TableCell>
                              </TableRow>
                            ),
                          )}
                          <TableRow>
                            <TableCell colSpan={3}>
                              <div className="flex flex-row">
                                <div className="flex w-3/4 flex-col">
                                  <div className="py-0 text-right font-medium">
                                    Sub-Total:
                                  </div>
                                  <div className="py-0 text-right font-medium">
                                    Tax:
                                  </div>
                                  <div className="py-0 text-right font-medium">
                                    Net Total:
                                  </div>
                                </div>
                                <div className="flex w-1/4 min-w-[100px] flex-col text-right">
                                  <div className="py-0">
                                    ${file.data.totalAmount.toFixed(2)}
                                  </div>
                                  <div className="py-0">
                                    {Number(file.data.totalTax)?.toFixed(2)}
                                  </div>
                                  <div className="py-0">
                                    ${file.data.totalNet.toFixed(2)}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell colSpan={2}>
                              <div className="flex w-full flex-row gap-2">
                                <Button
                                  onClick={() => uploadToQuickBooks(fileIndex)}
                                  disabled={
                                    isLoading ||
                                    uploadedFileIndexes.includes(fileIndex)
                                  }
                                  variant={'secondary'}
                                >
                                  <IfElseRender
                                    ternary={isLoading}
                                    ifTrue={
                                      <>
                                        <Loader2Icon className="h-4 w-4 animate-spin" />{' '}
                                        Submitting...
                                      </>
                                    }
                                    ifFalse={
                                      <>
                                        <HammerIcon className="h-4 w-4" />{' '}
                                        Approve & Submit
                                      </>
                                    }
                                  />
                                </Button>
                                <Button
                                  onClick={() => {
                                    setActiveIndex(fileIndex);
                                  }}
                                  variant={'outline'}
                                  disabled={activeIndex === fileIndex}
                                >
                                  <EyeOpenIcon className="h-4 w-4" /> View
                                  Invoice
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              ))}
            </>
          }
        />
      </div>
      <div className="sticky bottom-0 flex h-14 min-h-14 w-full items-center justify-end gap-2 border-t bg-white pl-2 pr-8 ">
        <TabsList>
          <TabsTrigger value="1" asChild>
            <Button variant={'secondary'}>
              <ArrowLeftIcon /> Continue Editing
            </Button>
          </TabsTrigger>
        </TabsList>
        <Button onClick={() => window.location.reload()}>
          <HammerIcon className="h-4 w-4" /> Done Uploading
        </Button>
      </div>
    </>
  );
};

export default UploadToQuickBooks;
