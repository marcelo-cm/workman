import React, { useEffect, useRef, useState } from 'react';

import { BookmarkIcon, CheckIcon, ResetIcon } from '@radix-ui/react-icons';
import { ArrowRightIcon, HammerIcon } from 'lucide-react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import IfElseRender from '@/components/ui/if-else-renderer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useVendor } from '@/lib/hooks/quickbooks/useVendor';
import { useApprovals } from '@/lib/hooks/supabase/useApprovals';

import { useAppContext } from '@/app/(dashboards)/context';
import Account from '@/app/(dashboards)/settings/page';
import { Bill } from '@/app/api/v1/quickbooks/company/bill/interfaces';
import { ApprovalStatus, ReceiptStatus } from '@/constants/enums';
import { ReceiptData, ReceiptDataSchema } from '@/interfaces/common.interfaces';
import { Receipt } from '@/models/Receipt';

import { useReceiptExtractionReview } from '../ReceiptExtractionReview';
import ReceiptDataForm from './edit/ReceiptDataForm';

const { getDefaultCategoryByVendorName, saveDefaultCategory } = useVendor();
const { updateApprovalByApprovableAndApproverId, getApprovalsByApprovableId } =
  useApprovals();

const ExtractionTabs = ({
  handleSetActiveIndex,
}: {
  handleSetActiveIndex: (index: -1 | 1) => void;
}) => {
  const { user } = useAppContext();
  const { accounts, customers, vendors, files, activeIndex } =
    useReceiptExtractionReview();
  const [approvedFiles, setApprovedFiles] = useState<Receipt[]>([]);
  const [originalFileData, setOriginalFileData] = useState<ReceiptData>(
    files[activeIndex].data,
  );
  const form = useForm<ReceiptData>({
    resolver: zodResolver(ReceiptDataSchema),
    defaultValues: originalFileData,
  });
  const receipt = files[activeIndex];
  const hasDirtyFields = !!Object.keys(form.formState.dirtyFields).length;

  useEffect(() => {
    mapDataToForm(files[activeIndex].data);
    setOriginalFileData(files[activeIndex].data);
  }, [activeIndex]);

  const mapDataToForm = async (data: ReceiptData) => {
    form.reset(data);

    const existingFormValues = form.getValues();
    files[activeIndex].data = existingFormValues;
  };

  const handleUpdateReceiptData = async (receipt: Receipt) => {
    const data: ReceiptData = form.getValues();
    files[activeIndex].data = data;
    await Receipt.updateData(receipt, data);
    mapDataToForm(data);
  };

  const handleApproveReceipt = async (receipt: Receipt) => {
    updateApprovalByApprovableAndApproverId(
      receipt.id,
      user.id,
      ApprovalStatus.APPROVED,
    );

    const approvals = await getApprovalsByApprovableId(receipt.id);

    const isAllApproved = approvals.every(
      (approval) =>
        approval.status === ApprovalStatus.APPROVED ||
        approval.principal.id === user.id,
    );

    if (isAllApproved) {
      console.log('All approved');
      receipt.status = ReceiptStatus.APPROVED;
      setApprovedFiles((prevApprovedFiles) => [...prevApprovedFiles, receipt]);
    }
  };

  const discardChanges = () => {
    form.reset(originalFileData);
    files[activeIndex].data = originalFileData;
  };

  const uploadToQuickBooks = async () => {
    const matchingVendor = vendors.find(
      (vendor) => vendor.DisplayName === files[activeIndex].data.supplierName,
    );
    const matchingCategory = accounts.find(
      (account) => account.Name === files[activeIndex].data.category,
    );
    const matchingCustomer = customers.find(
      (customer) =>
        customer.DisplayName === files[activeIndex].data.customerName,
    );

    const bill: Bill = {
      Line: [
        {
          DetailType: 'AccountBasedExpenseLineDetail',
          Description: files[activeIndex].data.description,
          AccountBasedExpenseLineDetail: {
            AccountRef: {
              value: matchingCategory!.Id,
            },
            BillableStatus: 'Billable',
            CustomerRef: {
              value: matchingCustomer!.Id,
            },
          },
          Amount: parseFloat(files[activeIndex].data.totalNet),
        },
      ],
      VendorRef: {
        value: matchingVendor!.Id,
      },
      TotalAmt: parseFloat(files[activeIndex].data.totalNet),
      TxnDate: files[activeIndex].data.date,
    };

    await files[activeIndex].uploadToQuickBooks(bill);

    if (activeIndex < files.length - 1) {
      handleSetActiveIndex(1);
    } else {
      window.location.reload();
    }
  };

  return (
    <Tabs defaultValue="1" className="relative flex h-full w-full flex-col">
      <TabsList className="sticky top-0 flex h-fit w-full rounded-none bg-white">
        <TabsTrigger
          value="1"
          className="flex h-10 w-1/2 grow justify-start border-b data-[state=active]:border-wm-orange data-[state=active]:text-wm-orange"
        >
          1. Review & Submit
        </TabsTrigger>
        {/* <TabsTrigger
          value="2"
          className="flex h-10 w-1/2 grow justify-start border-b data-[state=active]:border-wm-orange data-[state=active]:text-wm-orange"
          disabled={hasDirtyFields}
          ref={uploadToQuickBooksTabRef}
        >
          2. Review & Upload to Quickbooks {hasDirtyFields && '(Save Changes)'}
        </TabsTrigger> */}
      </TabsList>
      <div className="no-scrollbar h-full overflow-scroll">
        <TabsContent
          value="1"
          className="flex h-full w-full flex-col justify-between"
        >
          <ReceiptDataForm form={form} />
          <div className="sticky bottom-0 flex h-14  min-h-14 w-full items-center gap-2 border-t bg-white pl-2 pr-8">
            <IfElseRender
              condition={hasDirtyFields}
              ifTrue={
                <Button
                  onClick={() => handleUpdateReceiptData(files[activeIndex])}
                  disabled={Object.keys(form.formState.errors).length !== 0}
                >
                  <BookmarkIcon /> Save
                </Button>
              }
              ifFalse={
                <Button
                  onClick={() => {
                    handleApproveReceipt(files[activeIndex]);
                    handleSetActiveIndex(1);
                  }}
                  disabled={Object.keys(form.formState.errors).length !== 0}
                >
                  <CheckIcon /> Approve
                </Button>
              }
            />
            <IfElseRender
              condition={hasDirtyFields}
              ifTrue={
                <Button onClick={() => discardChanges()} variant={'outline'}>
                  <ResetIcon /> Discard Changes
                </Button>
              }
            />
            <Button
              disabled={hasDirtyFields || !receipt.isApproved}
              variant={'outline'}
              className="ml-auto"
              onClick={() => uploadToQuickBooks()}
            >
              Submit to QuickBooks <HammerIcon className="h-4 w-4" />
            </Button>
          </div>
        </TabsContent>
        {/* <TabsContent value="2"><UploadToQuickBooks /></TabsContent> */}
      </div>
    </Tabs>
  );
};

export default ExtractionTabs;
