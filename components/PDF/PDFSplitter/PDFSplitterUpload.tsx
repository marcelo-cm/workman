import React, { useRef, useState } from 'react';

import { DialogContent, DialogTitle } from '@/components/ui/dialog';

import { usePDFSplitter } from './PDFSplitter';

const PDFSplitterUpload = () => {
  const { filesToUpload, setFilesToUpload } = usePDFSplitter();
  const fileInputRef = useRef<null | HTMLInputElement>(null);

  const [isDragActive, setDragActive] = useState(false);

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

    setFilesToUpload((prevFiles) => [...prevFiles, ...files]);
  };

  const handleDragEnter = (event: React.DragEvent) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setDragActive(false);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragActive(false);
    const files = Array.from(event.dataTransfer.files) as File[];

    setFilesToUpload(files);
  };
  return (
    <>
      <div className="flex h-full flex-col gap-4  p-4">
        <DialogTitle>Upload Documents</DialogTitle>
        <button
          className={`flex h-full w-full items-center justify-center rounded-lg border border-dashed border-wm-white-500 bg-wm-white-50 text-wm-white-700 hover:border-wm-orange-500 hover:bg-wm-orange-50 hover:text-wm-orange-700 ${isDragActive ? 'bg-wm-orange-50 text-wm-orange-700 border-wm-orange-500' : ''}`}
          onClick={handleButtonClick}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          Drag Files or Click to Upload
        </button>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        multiple
        accept="application/pdf"
        onChange={addToUploadQueue}
        style={{ display: 'none' }}
      />
    </>
  );
};

export default PDFSplitterUpload;
