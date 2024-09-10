import React, { useEffect, useRef, useState } from 'react';

import {
  ArrowRightIcon,
  BookmarkIcon,
  CheckIcon,
  ResetIcon,
} from '@radix-ui/react-icons';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import IfElseRender from '@/components/ui/if-else-renderer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useVendor } from '@/lib/hooks/quickbooks/useVendor';
import { useApprovals } from '@/lib/hooks/supabase/useApprovals';

import { useAppContext } from '@/app/(dashboards)/context';
import { ApprovalStatus, InvoiceStatus } from '@/constants/enums';
import { InvoiceData } from '@/interfaces/common.interfaces';
import Invoice from '@/models/Invoice';

import { useInvoiceExtractionReview } from '../InvoiceExtractionReview';
import { invoiceDataFormSchema } from '../constants';
import InvoiceDataForm from './edit/InvoiceDataForm';
import UploadToQuickBooks from './upload/UploadToQuickBooks';

const { getDefaultCategoryByVendorName, saveDefaultCategory } = useVendor();
const { updateApprovalByApprovableAndApproverId, getApprovalsByApprovableId } =
  useApprovals();

const ExtractionTabs = ({
  handleSetActiveIndex,
}: {
  handleSetActiveIndex: (index: 1 | -1) => void;
}) => {
  const { user } = useAppContext();
  const { files, activeIndex } = useInvoiceExtractionReview();
  const [isSaveDefaultCategoryDialogOpen, setIsSaveDefaultCategoryDialogOpen] =
    useState(false);
  const [approvedFiles, setApprovedFiles] = useState<Invoice[]>([]);
  const [originalFileData, setOriginalFileData] = useState<InvoiceData>(
    files[activeIndex].data,
  );
  const uploadToQuickBooksTabRef = useRef<HTMLButtonElement>(null);
  const form = useForm<z.infer<typeof invoiceDataFormSchema>>({
    resolver: zodResolver(invoiceDataFormSchema),
    defaultValues: {
      date: files[activeIndex]?.data?.date || '',
      dueDate: files[activeIndex]?.data?.dueDate || '',
      invoiceNumber: files[activeIndex]?.data?.invoiceNumber || '',
      supplierName: files[activeIndex]?.data?.supplierName || '',
      supplierAddress: files[activeIndex]?.data?.supplierAddress || '',
      supplierEmail: files[activeIndex]?.data?.supplierEmail || '',
      supplierPhoneNumber: files[activeIndex]?.data?.supplierPhoneNumber || '',
      customerAddress: files[activeIndex]?.data?.customerAddress || '',
      customerName: files[activeIndex]?.data?.customerName || '',
      shippingAddress: files[activeIndex]?.data?.shippingAddress || '',
      totalNet: files[activeIndex]?.data?.totalNet || 0,
      totalAmount: files[activeIndex]?.data?.totalAmount || 0,
      totalTax: parseFloat(files[activeIndex]?.data?.totalTax).toFixed(2) || '',
      lineItems: files[activeIndex]?.data?.lineItems || [],
      notes: files[activeIndex]?.data?.notes || '',
    },
  });

  /**
   * We have to use this as the isDirty state because on mount, the form is always dirty
   * This is as a result of how our ComboBox sets the default value
   */
  const hasDirtyFields = !!Object.keys(form.formState.dirtyFields).length;

  const watchLineItems = useWatch({
    control: form.control,
    name: 'lineItems',
  });

  const watchTotalTax = useWatch({
    control: form.control,
    name: 'totalTax',
  });

  const watchVendorName = useWatch({
    control: form.control,
    name: 'supplierName',
  });

  useEffect(() => {
    mapDataToForm(files[activeIndex].data);
    setOriginalFileData(files[activeIndex].data);
  }, [activeIndex]);

  useEffect(() => {
    const totalAmount = watchLineItems.reduce(
      (acc, item) => acc + Number(item.totalAmount),
      0,
    );

    const totalNet = totalAmount + (Number(form.getValues('totalTax')) || 0);

    form.setValue('totalAmount', totalAmount, {
      shouldValidate: true,
    });
    form.setValue('totalNet', totalNet);
  }, [watchLineItems, watchTotalTax]);

  const mapDataToForm = async (data: InvoiceData) => {
    form.reset({
      date: data?.date || '',
      dueDate: data?.dueDate || '',
      invoiceNumber: data?.invoiceNumber || '',
      supplierName: data?.supplierName || '',
      supplierAddress: data?.supplierAddress || '',
      supplierEmail: data?.supplierEmail || '',
      supplierPhoneNumber: data?.supplierPhoneNumber || '',
      customerAddress: data?.customerAddress || '',
      customerName: data?.customerName || '',
      shippingAddress: data?.shippingAddress || '',
      totalNet: data?.totalNet || 0,
      totalAmount: data?.totalAmount || 0,
      totalTax: data?.totalTax || '0.00',
      lineItems: data?.lineItems || [],
      notes: data?.notes || '',
    });

    const existingFormValues = form.getValues();
    files[activeIndex].data = existingFormValues;
  };

  const handleUpdateInvoiceData = async (file: Invoice) => {
    checkDefaultCategory();
    if (!form.formState.isDirty) return;

    const data: InvoiceData = form.getValues();
    files[activeIndex].data = data;
    await Invoice.update(file.fileUrl, data);
    mapDataToForm(data);
  };

  const handleApproveInvoice = async (file: Invoice) => {
    updateApprovalByApprovableAndApproverId(
      file.id,
      user.id,
      ApprovalStatus.APPROVED,
    );

    const approvals = await getApprovalsByApprovableId(file.id);

    const isAllApproved = approvals.every(
      (approval) =>
        approval.status === ApprovalStatus.APPROVED ||
        approval.principal.id === user.id,
    );

    if (isAllApproved) {
      file.status = InvoiceStatus.APPROVED;
    }

    setApprovedFiles((prevApprovedFiles) => {
      const isAlreadyApproved = prevApprovedFiles.some(
        (approvedFile) => approvedFile.fileUrl === file.fileUrl,
      );

      if (!isAlreadyApproved) {
        const updatedApprovedFiles = [...prevApprovedFiles, file];
        if (
          updatedApprovedFiles.length === files.length &&
          uploadToQuickBooksTabRef.current
        ) {
          uploadToQuickBooksTabRef.current.focus();
        }
        return updatedApprovedFiles;
      } else {
        if (
          prevApprovedFiles.length === files.length &&
          uploadToQuickBooksTabRef.current
        ) {
          uploadToQuickBooksTabRef.current.focus();
        }
        return prevApprovedFiles;
      }
    });
  };

  const checkDefaultCategory = async () => {
    const vendorName = watchVendorName;
    const productCodes = watchLineItems.map((item) => item.productCode);

    const uniqueProductCodes = Array.from(new Set(productCodes));

    if (uniqueProductCodes.length > 1) return;

    const defaultCategory = await getDefaultCategoryByVendorName(vendorName);
    if (
      defaultCategory === null ||
      defaultCategory.category !== productCodes[0]
    ) {
      setIsSaveDefaultCategoryDialogOpen(true);
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
        <TabsContent
          value="1"
          className="flex h-full w-full flex-col justify-between"
        >
          <InvoiceDataForm form={form} />
          <div className="sticky bottom-0 flex h-14 min-h-14 w-full items-center gap-2 border-t bg-white pl-2 pr-8">
            <IfElseRender
              condition={hasDirtyFields}
              ifTrue={
                <Button
                  onClick={() => handleUpdateInvoiceData(files[activeIndex])}
                  disabled={Object.keys(form.formState.errors).length !== 0}
                >
                  <BookmarkIcon /> Save
                </Button>
              }
              ifFalse={
                <Button
                  onClick={() => {
                    handleApproveInvoice(files[activeIndex]);
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
        <TabsContent value="2">
          <UploadToQuickBooks />
        </TabsContent>
        <Dialog open={isSaveDefaultCategoryDialogOpen}>
          <DialogContent>
            <DialogTitle>Save Default Category</DialogTitle>
            <DialogDescription>
              Would you like to set the default category for{' '}
              <strong>{watchVendorName}</strong>
              to <strong>{watchLineItems[0].productCode}</strong>? This will
              overwrite the existing default category.
            </DialogDescription>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant={'secondary'}
                  type="button"
                  onClick={() => setIsSaveDefaultCategoryDialogOpen(false)}
                >
                  No
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  type="button"
                  onClick={() => {
                    saveDefaultCategory(
                      watchVendorName,
                      watchLineItems[0]?.productCode as string,
                    );
                    setIsSaveDefaultCategoryDialogOpen(false);
                  }}
                >
                  Set Default Category
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Tabs>
  );
};

export default ExtractionTabs;
