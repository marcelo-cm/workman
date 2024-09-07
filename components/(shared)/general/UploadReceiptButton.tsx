import React, { ChangeEvent, useRef, useState } from 'react';

import { UploadIcon } from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';

import { Receipt } from '@/models/Receipt';

const UploadReceiptButton = () => {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<null | HTMLInputElement>(null);

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList) return;

    const filesUploaded = Array.from(fileList) as File[];

    const response = await Receipt.scan(filesUploaded[0].name);
    console.log(response);
  };

  return (
    <Button onClick={() => fileInputRef.current?.click()}>
      <UploadIcon />
      Upload Receipt {files.length > 0 && `(${files.length})`}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleUpload}
      />
    </Button>
  );
};

export default UploadReceiptButton;
