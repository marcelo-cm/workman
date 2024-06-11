import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  CaretRightIcon,
  ScissorsIcon,
  UploadIcon,
} from '@radix-ui/react-icons';
import React, { useRef, useState } from 'react';
import { Button } from '../ui/button';

const UploadFileButton = () => {
  const fileInputRef = useRef<null | HTMLInputElement>(null);
  const [filesUploading, setFilesUploading] = useState<File[]>([]);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const addToUploadQueue = (event: any) => {
    const filesList = event.target.files;
    if (!filesList) {
      return;
    }

    const files = Array.from(filesList) as File[];

    setFilesUploading((prevFiles) => [...prevFiles, ...files]);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <UploadIcon /> Upload Document
        </Button>
      </DialogTrigger>
      <DialogContent className="flex h-[600px] min-w-[800px] flex-col p-4">
        <DialogTitle>
          {filesUploading.length ? 'Select PDFs to Split' : 'Upload Documents'}
        </DialogTitle>
        {filesUploading.length ? (
          <>
            <div className="h-full rounded-lg border p-4">
              {filesUploading.map((file) => (
                <div className="flex flex-row items-center gap-2">
                  <Checkbox />
                  {file.name.slice(0, 40)}
                  {file.name.length > 40 ? '(...).pdf' : ''}
                </div>
              ))}
            </div>
            <div className="flex flex-row justify-end gap-2">
              <Button variant={'secondary'}>
                Skip <CaretRightIcon />
              </Button>
              <Button>
                <ScissorsIcon />
                Split PDFs
              </Button>
            </div>
          </>
        ) : (
          <button
            className="flex h-full items-center justify-center rounded-lg border border-dashed border-wm-white-500 bg-wm-white-50"
            onClick={handleButtonClick}
          >
            Drag Files or Click to Upload
          </button>
        )}
        <input
          type="file"
          ref={fileInputRef}
          multiple
          accept="application/pdf"
          onChange={addToUploadQueue}
          style={{ display: 'none' }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UploadFileButton;
