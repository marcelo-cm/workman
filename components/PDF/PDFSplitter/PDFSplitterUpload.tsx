import React, { useRef, useState } from 'react';

import DragToUploadArea from '@/components/general/DragToUploadArea';
import { DialogContent, DialogTitle } from '@/components/ui/dialog';

import { usePDFSplitter } from './PDFSplitter';

const PDFSplitterUpload = () => {
  const { filesToUpload, setFilesToUpload } = usePDFSplitter();

  return (
    <>
      <div className="flex h-full flex-col gap-4  p-4">
        <DialogTitle>Upload Documents</DialogTitle>
        <DragToUploadArea setFiles={setFilesToUpload} files={filesToUpload} />
      </div>
    </>
  );
};

export default PDFSplitterUpload;
