import React, { useEffect, useRef, useState } from 'react';

import {
  ArrowRightIcon,
  BookmarkIcon,
  CheckIcon,
  ResetIcon,
} from '@radix-ui/react-icons';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import IfElseRender from '@/components/ui/if-else-renderer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useVendor } from '@/lib/hooks/quickbooks/useVendor';
import { useApprovals } from '@/lib/hooks/supabase/useApprovals';

import { useAppContext } from '@/app/(dashboards)/context';
import { ApprovalStatus } from '@/constants/enums';
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
  const { files, activeIndex } = useReceiptExtractionReview();
  const [approvedFiles, setApprovedFiles] = useState<Receipt[]>([]);
  const [originalFileData, setOriginalFileData] = useState<ReceiptData>(
    files[activeIndex].data,
  );
  const uploadToQuickBooksTabRef = useRef<HTMLButtonElement>(null);
  const form = useForm<ReceiptData>({
    resolver: zodResolver(ReceiptDataSchema),
    defaultValues: originalFileData,
  });
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

  const handleUpdateReceiptData = async (receipt: Receipt) => {};

  const handleApproveReceipt = async (receipt: Receipt) => {
    updateApprovalByApprovableAndApproverId(
      receipt.id,
      user.id,
      ApprovalStatus.APPROVED,
    );

    const approvals = await getApprovalsByApprovableId(receipt.id);

    const isAllApproved = approvals.every(
      (approval) => approval.status === ApprovalStatus.APPROVED,
    );

    if (isAllApproved) {
      setApprovedFiles((prev) => [...prev, receipt]);
      uploadToQuickBooksTabRef.current?.focus();
    }
  };

  const discardChanges = () => {
    form.reset(originalFileData);
    files[activeIndex].data = originalFileData;
  };

  return (
    <Tabs defaultValue="1" className="relative flex h-full w-full flex-col">
      <TabsList className="sticky top-0 flex h-fit w-full rounded-none bg-white">
        <TabsTrigger
          value="1"
          className="flex h-10 w-1/2 grow justify-start border-b data-[state=active]:border-wm-orange data-[state=active]:text-wm-orange"
        >
          1. Edit Details
        </TabsTrigger>
        <TabsTrigger
          value="2"
          className="flex h-10 w-1/2 grow justify-start border-b data-[state=active]:border-wm-orange data-[state=active]:text-wm-orange"
          disabled={hasDirtyFields}
          ref={uploadToQuickBooksTabRef}
        >
          2. Review & Upload to Quickbooks {hasDirtyFields && '(Save Changes)'}
        </TabsTrigger>
      </TabsList>
      <div className="no-scrollbar h-full overflow-scroll">
        <TabsContent value="1" className="w-full">
          <ReceiptDataForm form={form} />
          <div className="sticky bottom-0 flex h-14 min-h-14 w-full items-center gap-2 border-t bg-white pl-2 pr-8">
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
            <TabsList className="ml-auto">
              <TabsTrigger asChild value="2">
                <Button disabled={form.formState.isDirty} variant={'outline'}>
                  Continue <ArrowRightIcon />
                </Button>
              </TabsTrigger>
            </TabsList>
          </div>
        </TabsContent>
        <TabsContent value="2">{/* <UploadToQuickBooks /> */}</TabsContent>
      </div>
    </Tabs>
  );
};

export default ExtractionTabs;
