import React, { ChangeEvent, useRef, useState } from 'react';

import { UploadIcon } from '@radix-ui/react-icons';

import WorkmanLogo from '@/components/molecules/WorkmanLogo';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

import { useReceipt } from '@/lib/hooks/supabase/useReceipts';

import { useAppContext } from '@/app/(dashboards)/context';
import { createClient } from '@/lib/utils/supabase/client';
import { Receipt } from '@/models/Receipt';

const supabase = createClient();

const UploadReceiptButton = () => {
  const { uploadToReceiptBucket } = useReceipt();
  const { user } = useAppContext();
  const [isUploading, setIsUploading] = useState<[boolean, number]>([false, 0]);
  const fileInputRef = useRef<null | HTMLInputElement>(null);

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList) return;

    const files = Array.from(fileList);

    setIsUploading([true, files.length]);
    for (const file of files) {
      const { path } = await uploadToReceiptBucket(file);
      const {
        data: { publicUrl },
      } = supabase.storage.from('receipts').getPublicUrl(path);
      const newReceipt = await Receipt.create(publicUrl);
      const scanResponse = await Receipt.scan(publicUrl);
      const updatedReceipt = await Receipt.updateData(newReceipt, scanResponse);
      setIsUploading((prev) => [true, prev[1] - 1]);
    }
    setIsUploading([false, 0]);
    window.location.reload();
  };

  return (
    <Button onClick={() => fileInputRef.current?.click()}>
      <UploadIcon />
      Upload Receipt
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleUpload}
      />
      <AlertDialog open={isUploading[0]}>
        <AlertDialogContent className="justify-center">
          <AlertDialogHeader className="items-center">
            <WorkmanLogo className="w-32 animate-pulse" />
            <AlertDialogTitle>Uploading your Data Now!</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription className="text-center">
            It's important that you don't close this window while we're
            uploading your data. We have {isUploading[1]} files left to process.
          </AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>
    </Button>
  );
};

export default UploadReceiptButton;
